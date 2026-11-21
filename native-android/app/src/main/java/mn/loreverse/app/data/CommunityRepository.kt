package mn.loreverse.app.data

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import io.github.jan.supabase.postgrest.from
import io.github.jan.supabase.postgrest.query.Columns

@Serializable
data class CommunityPost(
    val id: String,
    @SerialName("author_id") val authorId: String,
    @SerialName("game_slug") val gameSlug: String = "general",
    val category: String = "discussion",
    val body: String,
    @SerialName("spoiler_level") val spoilerLevel: String = "none",
    @SerialName("created_at") val createdAt: String = ""
)

class CommunityRepository {
    suspend fun getLatestPosts(): Result<List<CommunityPost>> = runCatching {
        SupabaseClient.instance.from("community_posts")
            .select(Columns.list("id", "author_id", "game_slug", "category", "body", "spoiler_level", "created_at")) {
                filter { eq("status", "published") }
                limit(10)
            }
            .decodeList<CommunityPost>()
    }
}
