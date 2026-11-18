import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.119.0";

const allowedOrigins = new Set([
  "https://lore-archive.pages.dev",
  "https://loreverse-ctrl.github.io",
  "capacitor://localhost",
  "https://localhost",
  "https://e-archive.pages.dev",
]);

function cors(req: Request) {
  const origin = req.headers.get("Origin") || "";
  const headers = new Headers({
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-retry-count, traceparent, tracestate, baggage",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "application/json; charset=utf-8",
    "Vary": "Origin",
  });
  if (allowedOrigins.has(origin)) headers.set("Access-Control-Allow-Origin", origin);
  return headers;
}

function json(body: unknown, status: number, headers: Headers) {
  return new Response(JSON.stringify(body), { status, headers });
}

Deno.serve(async (req: Request) => {
  const headers = cors(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, headers);

  try {
    const url = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !anonKey || !serviceKey) throw new Error("Серверийн тохиргоо дутуу байна.");

    const authorization = req.headers.get("Authorization") || "";
    if (!authorization.startsWith("Bearer ")) {
      return json({ error: "Бүртгэлдээ нэвтэрнэ үү." }, 401, headers);
    }
    const token = authorization.slice(7);
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) return json({ error: "Нэвтрэлт хүчингүй байна." }, 401, headers);
    let claims: Record<string, unknown>;
    try {
      const encoded = tokenParts[1].replace(/-/g, "+").replace(/_/g, "/");
      claims = JSON.parse(atob(encoded.padEnd(Math.ceil(encoded.length / 4) * 4, "=")));
    } catch {
      return json({ error: "Нэвтрэлтийн мэдээлэл буруу байна." }, 401, headers);
    }
    const authTime = Number(claims.auth_time || 0);
    const now = Math.floor(Date.now() / 1000);
    if (!authTime || now - authTime > 600 || authTime > now + 60) {
      return json({ error: "Аюулгүй байдлын үүднээс имэйл, нууц үгээрээ дахин нэвтэрч баталгаажуулна уу." }, 401, headers);
    }
    const userClient = createClient(url, anonKey, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: authData, error: authError } = await userClient.auth.getUser(token);
    const user = authData?.user;
    if (authError || !user || user.is_anonymous) {
      return json({ error: "Нэвтрэлт хүчингүй байна. Дахин нэвтэрнэ үү." }, 401, headers);
    }

    const body = await req.json().catch(() => ({}));
    if (body?.confirm !== "DELETE_MY_LOREVERSE_ACCOUNT") {
      return json({ error: "Бүртгэл устгах баталгаажуулалт дутуу байна." }, 400, headers);
    }

    const admin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Remove files owned by this account before deleting its Auth identity.
    for (;;) {
      const { data: objects, error: listError } = await admin
        .schema("storage")
        .from("objects")
        .select("bucket_id,name")
        .eq("owner_id", user.id)
        .range(0, 499);
      if (listError) throw new Error("Хэрэглэгчийн файлуудыг шалгаж чадсангүй.");
      if (!objects?.length) break;

      const grouped = new Map<string, string[]>();
      for (const object of objects) {
        if (!object.bucket_id || !object.name) continue;
        const paths = grouped.get(object.bucket_id) || [];
        paths.push(object.name);
        grouped.set(object.bucket_id, paths);
      }
      for (const [bucket, paths] of grouped) {
        const { error } = await admin.storage.from(bucket).remove(paths);
        if (error) throw new Error("Хэрэглэгчийн хадгалсан файлуудыг устгаж чадсангүй. Дэмжлэгтэй холбогдоно уу.");
      }
      if (objects.length < 500) break;
    }

    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);
    if (deleteError) throw new Error("Бүртгэлийг устгаж чадсангүй. Дэмжлэгтэй холбогдоно уу.");

    return json({
      success: true,
      message: "Таны LOREVERSE бүртгэл болон түүнтэй холбогдсон хэрэглэгчийн мэдээллийг устгах хүсэлт амжилттай биеллээ.",
    }, 200, headers);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Серверийн алдаа." }, 500, headers);
  }
});
