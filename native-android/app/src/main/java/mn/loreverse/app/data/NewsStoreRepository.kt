package mn.loreverse.app.data

import io.github.jan.supabase.postgrest.from
import io.github.jan.supabase.postgrest.query.Columns
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonElement

@Serializable
data class PublishedNews(
    val id: String,
    val title: String,
    val summary: String? = null,
    val body: JsonElement? = null,
    @SerialName("cover_image_url") val coverImageUrl: String? = null,
    @SerialName("published_at") val publishedAt: String? = null
)

@Serializable
data class StoreProduct(
    val id: String,
    val title: String,
    val description: String? = null,
    @SerialName("product_type") val productType: String,
    @SerialName("listing_type") val listingType: String,
    @SerialName("price_mnt") val priceMnt: Long,
    @SerialName("stock_quantity") val stockQuantity: Int = 0
)

class NewsStoreRepository {
    suspend fun getPublishedNews(): Result<List<PublishedNews>> = runCatching {
        SupabaseClient.instance.from("content_posts")
            .select(Columns.list("id", "title", "summary", "body", "cover_image_url", "published_at")) {
                filter {
                    eq("content_type", "news")
                    eq("status", "published")
                    eq("language_code", "mn")
                }
                limit(30)
            }
            .decodeList<PublishedNews>()
    }

    suspend fun getPublishedProducts(): Result<List<StoreProduct>> = runCatching {
        SupabaseClient.instance.from("store_products")
            .select(Columns.list("id", "title", "description", "product_type", "listing_type", "price_mnt", "stock_quantity")) {
                filter { eq("status", "approved") }
                limit(50)
            }
            .decodeList<StoreProduct>()
    }
}
