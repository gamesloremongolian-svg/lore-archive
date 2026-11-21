package mn.loreverse.app.data

import io.github.jan.supabase.auth.auth
import io.github.jan.supabase.postgrest.from
import io.github.jan.supabase.postgrest.query.Columns
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import java.time.Instant

@Serializable
data class ModerationProduct(
    val id: String,
    val title: String,
    val description: String? = null,
    @SerialName("product_type") val productType: String,
    @SerialName("listing_type") val listingType: String,
    @SerialName("price_mnt") val priceMnt: Long,
    val status: String
)

data class OwnerDashboardStats(
    val users: Int,
    val content: Int,
    val products: Int,
    val pendingProducts: Int,
    val orders: Int,
    val pendingFeedback: Int,
    val pendingPayments: Int,
    val publishedNews: Int
)

data class OwnerDashboardData(
    val stats: OwnerDashboardStats,
    val pendingProducts: List<ModerationProduct>
)

private data class OwnerStaffRole(val role: String, val active: Boolean)

class OwnerDashboardRepository {
    private fun currentUserId(): String =
        SupabaseClient.instance.auth.currentSessionOrNull()?.user?.id
            ?: error("Owner самбарт нэвтрэх шаардлагатай.")

    private suspend fun requireOwner(): String {
        val userId = currentUserId()
        val roles = SupabaseClient.instance.from("staff_members")
            .select(Columns.list("role", "active")) {
                filter { eq("user_id", userId); eq("active", true) }
                limit(2)
            }.decodeList<OwnerStaffRole>()
        check(roles.any { it.active && it.role == "owner" }) {
            "Энэ үйлдэл зөвхөн идэвхтэй Owner эрхтэй хэрэглэгчид боломжтой."
        }
        return userId
    }

    private suspend fun countRows(table: String, status: String? = null, contentType: String? = null): Int {
        val rows = SupabaseClient.instance.from(table).select(Columns.list("id")) {
            filter {
                if (status != null) eq("status", status)
                if (contentType != null) eq("content_type", contentType)
            }
            limit(1000)
        }.decodeList<Map<String, String>>()
        return rows.size
    }

    suspend fun loadDashboard(): Result<OwnerDashboardData> = runCatching {
        requireOwner()
        val users = countRows("profiles")
        val content = countRows("content_posts")
        val products = countRows("store_products")
        val pendingProducts = countRows("store_products", status = "pending")
        val orders = countRows("store_orders")
        val pendingFeedback = countRows("app_feedback", status = "pending")
        val pendingPayments = countRows("payment_records", status = "pending")
        val publishedNews = countRows("content_posts", status = "published", contentType = "news")
        val pending = SupabaseClient.instance.from("store_products")
            .select(Columns.list("id", "title", "description", "product_type", "listing_type", "price_mnt", "status")) {
                filter { eq("status", "pending") }
                limit(50)
            }.decodeList<ModerationProduct>()
        OwnerDashboardData(
            stats = OwnerDashboardStats(users, content, products, pendingProducts, orders, pendingFeedback, pendingPayments, publishedNews),
            pendingProducts = pending
        )
    }

    suspend fun reviewProduct(id: String, status: String, note: String?): Result<Unit> = runCatching {
        require(status in setOf("approved", "rejected"))
        val reviewerId = requireOwner()
        SupabaseClient.instance.from("store_products").update({
            set("status", status)
            set("moderation_note", note)
            set("reviewed_by", reviewerId)
            set("reviewed_at", Instant.now().toString())
            set("updated_at", Instant.now().toString())
        }) {
            filter { eq("id", id); eq("status", "pending") }
        }
    }
}
