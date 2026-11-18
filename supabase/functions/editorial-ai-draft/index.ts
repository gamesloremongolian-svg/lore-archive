import { createClient } from "https://esm.sh/@supabase/supabase-js@2.119.0";

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("Origin") || "";
  const allowedOrigins = new Set([
"https://loreverse-ctrl.github.io",
    "https://gamesloremongolian-svg.github.io",
    "https://localhost",
    "capacitor://localhost",
    "https://e-archive.pages.dev",
    "https://lore-archive.pages.dev",
  ]);
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

Deno.serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);
  function reply(status: number, payload: Record<string, unknown>) {
    return new Response(JSON.stringify(payload), { status, headers: corsHeaders });
  }
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return reply(405, { error: "POST хүсэлт шаардлагатай." });

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token || token === authHeader) return reply(401, { error: "Нэвтэрнэ үү." });

    const url = Deno.env.get("SUPABASE_URL");
    const anon = Deno.env.get("SUPABASE_ANON_KEY");
    const openaiRaw = Deno.env.get("OPENAI_API_KEY") || "";
    const openai = openaiRaw.trim();

    if (!url || !anon) return reply(500, { error: "Supabase тохиргоо дутуу байна." });
    if (!openai) return reply(500, { error: "OPENAI_API_KEY secret тохируулаагүй байна." });
    if (!/^[\x21-\x7E]+$/.test(openai)) return reply(500, { error: "OPENAI_API_KEY secret буруу форматтай байна. Supabase дээр дахин тохируулна уу." });

    const sb = createClient(url, anon, {
      global: { headers: { Authorization: "Bearer " + token } },
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data: auth, error: authErr } = await sb.auth.getUser(token);
    if (authErr || !auth.user || auth.user.is_anonymous) return reply(401, { error: "Бүртгэлтэй хэрэглэгчээр нэвтэрнэ үү." });

    const { data: staff, error: staffErr } = await sb.from("staff_members")
      .select("role,active").eq("user_id", auth.user.id).maybeSingle();

    if (staffErr || !staff?.active || !["owner", "admin", "editor"].includes(staff.role)) {
      return reply(403, { error: "AI редактор зөвхөн идэвхтэй редакцын багт нээлттэй." });
    }

    const body = await req.json();
    const topic = typeof body.topic === "string" ? body.topic.trim() : "";
    const universe = typeof body.universe === "string" ? body.universe.trim().slice(0, 100) : "";
    const type = typeof body.content_type === "string" ? body.content_type : "lore";
    const notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 3000) : "";
    const sources = Array.isArray(body.sources)
      ? body.sources.filter((x: unknown) => typeof x === "string" && x.trim().startsWith("https://")).slice(0, 12).map((x: string) => x.trim())
      : [];

    if (topic.length < 3 || topic.length > 180) return reply(400, { error: "Сэдэв 3–180 тэмдэгт байх ёстой." });
    if (!["game", "anime", "manga", "lore", "news", "guide"].includes(type)) return reply(400, { error: "Нийтлэлийн төрөл буруу байна." });

    const instructions = [
      "Та LOREVERSE-ийн мэргэжлийн редакцын туслах. Монгол хэлээр чанартай, баримт ба тайлбар, таамгийг ялгасан ноорог бич.",
      "ЗӨВХӨН хэрэглэгчийн өгсөн эх сурвалжийг баталгаатай эх сурвалж гэж тэмдэглэ. Өөрөө URL, ишлэл, эх сурвалж зохиож болохгүй.",
      "Эх сурвалжгүй бол баталгаажуулах шаардлагатай хэсгийг тодорхой тэмдэглэж canon_status=unknown болго. Онолыг canon гэж бүү нэрлэ.",
      "Зохиогчийн эрхтэй текстийг уртаар хуулбарлахгүй, өөрийн үгээр тайлбарла.",
      "Return valid json only. Гаралт зөвхөн JSON object: title, slug, summary, body, canon_status (canon|non_canon|theory|unknown), editorial_warnings array.",
      "Нийтлэлд танилцуулга, үндсэн хэсэг, баримт/тайлбарын ялгаа, эх сурвалжийн хязгаарлалт, дүгнэлт орсон байна."
    ].join(" ");

    const input = [
      "Output format must be valid JSON (json object).",
      "Сэдэв: " + topic,
      "Ертөнц/бүтээл: " + (universe || "Тодорхойлоогүй"),
      "Төрөл: " + type,
      "Редакторын чиглэл: " + (notes || "Нэмэлт чиглэлгүй"),
      "Өгсөн эх сурвалжууд: " + (sources.length ? sources.join("\n") : "Эх сурвалж өгөөгүй. Баримтыг баталгаагүй гэж тэмдэглэ.")
    ].join("\n\n");

    const ai = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": "Bearer " + openai, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        instructions,
        input,
        max_output_tokens: 2400,
        store: false,
        text: { format: { type: "json_object" } }
      })
    });

    const result = await ai.json().catch(() => ({}));
    if (!ai.ok) {
      const providerError = result?.error || {};
      const diagnostic = {
        provider_status: ai.status,
        provider_type: String(providerError.type || "unknown").slice(0, 100),
        provider_code: String(providerError.code || "unknown").slice(0, 120),
        provider_param: providerError.param == null ? null : String(providerError.param).slice(0, 120),
        provider_message: String(providerError.message || "OpenAI тодорхой алдааны тайлбар буцаасангүй.").slice(0, 500)
      };
      console.error("editorial AI provider diagnostic", JSON.stringify(diagnostic));
      return reply(ai.status === 429 ? 429 : 502, {
        error: "OpenAI API хүсэлт амжилтгүй.",
        ...diagnostic
      });
    }

    const output = (result.output || [])
      .filter((x: any) => x.type === "message")
      .flatMap((x: any) => x.content || [])
      .filter((x: any) => x.type === "output_text")
      .map((x: any) => x.text).join("\n");

    let draft: any;
    try { draft = JSON.parse(output); }
    catch { return reply(502, { error: "AI бүтэцтэй ноорог буцаасангүй. Дахин оролдоно уу." }); }

    const title = String(draft.title || topic).trim().slice(0, 180);
    const slug = String(draft.slug || topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")).toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 160);
    const summary = String(draft.summary || "").trim().slice(0, 900);
    const article = String(draft.body || "").trim().slice(0, 18000);
    const canon = ["canon", "non_canon", "theory", "unknown"].includes(draft.canon_status) ? draft.canon_status : "unknown";

    if (!title || !slug || article.length < 100) return reply(502, { error: "AI ноорог дутуу байна. Дахин үүсгэнэ үү." });

    return reply(200, {
      draft: {
        title, slug, summary, body: article, canon_status: canon,
        editorial_warnings: Array.isArray(draft.editorial_warnings) ? draft.editorial_warnings.slice(0, 8) : []
      },
      source_urls: sources,
      created_by: auth.user.id,
      role: staff.role
    });
  } catch (error) {
    console.error("editorial-ai-draft error", error);
    return reply(500, { error: "Серверийн алдаа гарлаа." });
  }
});