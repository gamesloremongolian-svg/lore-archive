package mn.loreverse.app.data

import io.github.jan.supabase.postgrest.from
import io.github.jan.supabase.postgrest.query.Columns
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonElement

@Serializable
data class PublishedFranchise(
    val id: String,
    val name: String,
    val category: String,
    val description: String = "",
    @SerialName("cover_image_url") val coverImageUrl: String? = null
)

@Serializable
data class PublishedWork(
    val id: String,
    @SerialName("canonical_title") val canonicalTitle: String,
    @SerialName("work_type") val workType: String
)

@Serializable
data class PublishedWorkTranslation(
    val title: String,
    val synopsis: String = "",
    @SerialName("canon_status") val canonStatus: String = "unknown",
    @SerialName("spoiler_level") val spoilerLevel: String = "none",
    val content: JsonElement? = null,
    val sources: JsonElement? = null
)

data class FranchiseDetail(
    val franchise: PublishedFranchise,
    val works: List<Pair<PublishedWork, PublishedWorkTranslation>>
)

class ArchiveRepository {
    suspend fun getPublishedFranchises(category: String? = null): Result<List<PublishedFranchise>> = runCatching {
        SupabaseClient.instance
            .from("archive_franchises")
            .select(Columns.list("id", "name", "category", "description", "cover_image_url")) {
                filter {
                    eq("status", "published")
                    if (!category.isNullOrBlank()) eq("category", category)
                }
            }
            .decodeList<PublishedFranchise>()
    }

    suspend fun getPublishedFranchiseDetail(name: String): Result<FranchiseDetail?> = runCatching {
        val client = SupabaseClient.instance
        val franchise = client.from("archive_franchises")
            .select(Columns.list("id", "name", "category", "description", "cover_image_url")) {
                filter { eq("name", name); eq("status", "published") }
            }
            .decodeList<PublishedFranchise>()
            .firstOrNull()

        if (franchise == null) return@runCatching null

        val works = client.from("archive_works")
            .select(Columns.list("id", "canonical_title", "work_type")) {
                filter { eq("franchise_id", franchise.id); eq("status", "published") }
            }
            .decodeList<PublishedWork>()

        val translatedWorks = works.mapNotNull { work ->
            val translation = client.from("archive_work_translations")
                .select(Columns.list("title", "synopsis", "canon_status", "spoiler_level", "content", "sources")) {
                    filter {
                        eq("work_id", work.id)
                        eq("language_code", "mn")
                        eq("editorial_status", "published")
                    }
                }
                .decodeList<PublishedWorkTranslation>()
                .firstOrNull()
            translation?.let { work to it }
        }
        FranchiseDetail(franchise, translatedWorks)
    }
}
