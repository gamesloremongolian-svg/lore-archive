package mn.loreverse.app.data

import io.github.jan.supabase.auth.auth
import io.github.jan.supabase.postgrest.from
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import java.net.HttpURLConnection
import java.net.URL
import java.util.UUID

@Serializable
data class AppFeedback(
    val id: String,
    @SerialName("ticket_number") val ticketNumber: Long,
    @SerialName("user_id") val userId: String,
    val category: String,
    val title: String,
    val description: String,
    @SerialName("app_section") val section: String,
    val status: String,
    @SerialName("admin_reply") val adminReply: String? = null,
    @SerialName("created_at") val createdAt: String = ""
) {
    val statusLabel: String get() = when (status) {
        "pending" -> "Хүлээгдэж байна"
        "reviewing" -> "Шалгаж байна"
        "resolved" -> "Зассан"
        "rejected" -> "Татгалзсан"
        else -> status
    }
    val categoryLabel: String get() = if (category == "bug") "Алдаа" else "Санал"
}

@Serializable
private data class StaffRole(val role: String, val active: Boolean)

@Serializable
private data class FeedbackInsert(
    @SerialName("user_id") val userId: String,
    val category: String,
    val title: String,
    val description: String,
    @SerialName("app_section") val section: String,
    @SerialName("app_version") val appVersion: String,
    @SerialName("android_version") val androidVersion: String,
    @SerialName("device_model") val deviceModel: String,
    @SerialName("attachment_path") val attachmentPath: String? = null
)

class FeedbackRepository {
    private fun currentUserId(): String =
        SupabaseClient.instance.auth.currentSessionOrNull()?.user?.id
            ?: error("Хүсэлт илгээхийн тулд нэвтрэх шаардлагатай.")

    private fun accessToken(): String =
        SupabaseClient.instance.auth.currentSessionOrNull()?.accessToken
            ?: error("Нэвтрэх хугацаа дууссан байна. Дахин нэвтэрнэ үү.")

    suspend fun submit(
        category: String,
        title: String,
        description: String,
        section: String,
        appVersion: String,
        androidVersion: String,
        deviceModel: String,
        attachmentBytes: ByteArray?,
        attachmentMime: String?
    ): Result<AppFeedback> = runCatching {
        val userId = currentUserId()
        require(category in setOf("bug", "suggestion"))
        require(title.length in 3..120)
        require(description.length in 10..5000)
        var attachmentPath: String? = null
        if (attachmentBytes != null) {
            require(attachmentBytes.size <= 10 * 1024 * 1024) { "Хавсралт 10 MB-аас их байна." }
            val mime = attachmentMime ?: "application/octet-stream"
            val ext = when (mime) {
                "image/jpeg" -> "jpg"
                "image/png" -> "png"
                "image/webp" -> "webp"
                "video/mp4" -> "mp4"
                else -> error("Зөвхөн JPG, PNG, WEBP зураг эсвэл MP4 видео хавсаргана.")
            }
            val path = "$userId/${UUID.randomUUID()}.$ext"
            uploadPrivateMedia(path, attachmentBytes, mime)
            attachmentPath = path
        }
        SupabaseClient.instance.from("app_feedback").insert(
            FeedbackInsert(userId, category, title, description, section, appVersion, androidVersion, deviceModel, attachmentPath)
        )
        getMine().getOrThrow().firstOrNull { it.title == title && it.description == description }
            ?: error("Хүсэлт хадгалагдсан боловч дугаарыг уншиж чадсангүй. 'Миний хүсэлтүүд' хэсгээс шалгана уу.")
    }

    suspend fun isStaff(): Boolean = runCatching {
        val uid = currentUserId()
        val roles = SupabaseClient.instance.from("staff_members").select { filter { eq("user_id", uid); eq("active", true) } }.decodeList<StaffRole>()
        roles.any { it.active && it.role in setOf("owner", "admin", "support") }
    }.getOrDefault(false)

    suspend fun getMine(): Result<List<AppFeedback>> = runCatching {
        currentUserId()
        SupabaseClient.instance.from("app_feedback").select().decodeList<AppFeedback>()
            .sortedByDescending { it.createdAt }
    }

    suspend fun getAllForStaff(): Result<List<AppFeedback>> = runCatching {
        currentUserId()
        SupabaseClient.instance.from("app_feedback").select().decodeList<AppFeedback>()
            .sortedByDescending { it.createdAt }
    }

    suspend fun updateAsStaff(id: String, status: String, reply: String): Result<Unit> = runCatching {
        require(status in setOf("pending", "reviewing", "resolved", "rejected"))
        currentUserId()
        SupabaseClient.instance.from("app_feedback").update({
            set("status", status)
            set("admin_reply", reply.ifBlank { null })
            set("reviewed_by", currentUserId())
            set("reviewed_at", java.time.Instant.now().toString())
            set("updated_at", java.time.Instant.now().toString())
        }) {
            filter { eq("id", id) }
        }
    }

    private fun uploadPrivateMedia(path: String, bytes: ByteArray, mime: String) {
        val connection = (URL("${SupabaseClient.PROJECT_URL}/storage/v1/object/app-feedback-media/$path").openConnection() as HttpURLConnection)
        try {
            connection.requestMethod = "POST"
            connection.doOutput = true
            connection.connectTimeout = 20000
            connection.readTimeout = 30000
            connection.setRequestProperty("apikey", "sb_publishable_hZOakxcNBY47UDgsJ0E6Aw_wJgAdLw1")
            connection.setRequestProperty("Authorization", "Bearer ${accessToken()}")
            connection.setRequestProperty("Content-Type", mime)
            connection.setRequestProperty("x-upsert", "false")
            connection.outputStream.use { it.write(bytes) }
            val code = connection.responseCode
            if (code !in 200..299) {
                val detail = connection.errorStream?.bufferedReader()?.use { it.readText() }.orEmpty()
                error("Хавсралт байршуулахад алдаа гарлаа ($code): ${detail.take(250)}")
            }
        } finally {
            connection.disconnect()
        }
    }
}
