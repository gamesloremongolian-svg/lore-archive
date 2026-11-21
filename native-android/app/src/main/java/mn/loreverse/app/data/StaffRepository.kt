package mn.loreverse.app.data

import io.github.jan.supabase.postgrest.from
import io.github.jan.supabase.postgrest.query.Columns

class StaffRepository {
    suspend fun isActiveOwner(): Boolean = runCatching {
        val userId = SupabaseClient.instance.auth.currentUserOrNull()?.id ?: return false
        val rows = SupabaseClient.instance.from("staff_members")
            .select(Columns.list("user_id")) {
                filter {
                    eq("user_id", userId)
                    eq("role", "owner")
                    eq("active", true)
                }
                limit(1)
            }
            .decodeList<Map<String, String>>()
        rows.isNotEmpty()
    }.getOrDefault(false)
}
