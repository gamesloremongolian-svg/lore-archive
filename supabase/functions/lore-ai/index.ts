import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("Origin") || "";
  const allowedOrigins = new Set([
"https://loreverse-ctrl.github.io",
    "https://lore-archive.pages.dev",
    "https://gamesloremongolian-svg.github.io",
    "https://localhost",
    "capacitor://localhost",
    "https://e-archive.pages.dev",
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
const instructions = "Та бол LOREVERSE-ийн Монгол хэл дээрх Lore судлаач AI туслах. Монгол хэлээр мэргэжлийн, ойлгомжтой хариул. Өгөгдсөн LOREVERSE нийтлэлүүдийг эх сурвалжийн суурь гэж ашигла. Баримт, тайлбар, онол/таамгийг ялга. Таамгийг батлагдсан канон мэт бүү бич. Өгөгдсөн санд нотолгоо байхгүй бол LOREVERSE-ийн санд баталгаатай мэдээлэл олдсонгүй гэж хэл. Ерөнхий мэдлэг ашиглавал LOREVERSE сангаас баталгаажаагүй гэж тэмдэглэ. Нууц түлхүүр болон бусдын мэдээллийг бүү илчил.";

Deno.serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);
  function json(status: number, payload: Record<string, unknown>) {
    return new Response(JSON.stringify(payload), { status, headers: corsHeaders });
  }
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "POST шаардлагатай." });
  try {
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token || token === authHeader) return json(401, { error: "Нэвтэрч байж LORE AI ашиглана уу." });
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    if (!supabaseUrl || !supabaseAnonKey) return json(500, { error: "Supabase function тохиргоо дутуу байна." });
    if (!openAiKey) return json(500, { error: "OPENAI_API_KEY secret олдсонгүй. Supabase Secrets тохиргоог шалгана уу." });

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: "Bearer " + token } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user || userData.user.is_anonymous) {
      return json(401, { error: "LORE AI ашиглахын тулд имэйлээр бүртгүүлж нэвтэрнэ үү." });
    }
    const body = await req.json();
    const question = typeof body.question === "string" ? body.question.trim() : "";
    if (question.length < 2 || question.length > 1800) return json(400, { error: "Асуулт 2–1800 тэмдэгт байх ёстой." });

    const { data: quota, error: quotaError } = await supabase.rpc("consume_lore_ai_quota");
    if (quotaError) return json(500, { error: "Өдрийн хэрэглээний хязгаарыг шалгаж чадсангүй." });
    if (!quota?.allowed) return json(429, { error: "Өдрийн 10 асуултын хязгаарт хүрлээ. Маргааш дахин оролдоорой.", limit: 10 });

    const { data: posts, error: postsError } = await supabase.from("content_posts")
      .select("id,title,summary,body,content_type,language_code,game_title,character_name,source_urls,published_at")
      .eq("status", "published").order("published_at", { ascending: false }).limit(100);
    if (postsError) return json(500, { error: "LOREVERSE мэдээллийн санг уншиж чадсангүй." });

    const terms = question.toLocaleLowerCase().split(/[^\p{L}\p{N}]+/u).filter((x: string) => x.length > 2);
    const ranked = (posts || []).map((p: any) => {
      const raw = typeof p.body === "object" ? (p.body?.text || JSON.stringify(p.body)) : String(p.body || "");
      const hay = [p.title, p.summary, p.game_title, p.character_name, p.content_type, raw].join(" ").toLocaleLowerCase();
      return { p, score: terms.reduce((n: number, term: string) => n + (hay.includes(term) ? 1 : 0), 0) };
    }).sort((a: any, b: any) => b.score - a.score);
    const relevant = ranked.filter((x: any) => x.score > 0).slice(0, 7);
    const selected = relevant.length ? relevant : ranked.slice(0, 3);
    const context = selected.map(({ p }: any, i: number) => {
      const raw = typeof p.body === "object" ? (p.body?.text || JSON.stringify(p.body)) : String(p.body || "");
      return "[МЭДЭЭЛЭЛ " + (i + 1) + "]\nID: " + p.id + "\nГарчиг: " + p.title +
        "\nТоглоом: " + (p.game_title || "Тодорхойгүй") + "\nТөрөл: " + p.content_type +
        "\nДүр/сэдэв: " + (p.character_name || "Тодорхойгүй") + "\nТовч: " + (p.summary || "") +
        "\nАгуулга: " + raw.slice(0, 4000) + "\nЭх сурвалж URL: " + JSON.stringify(Array.isArray(p.source_urls) ? p.source_urls : []);
    }).join("\n\n");
    const prompt = "Хэрэглэгчийн асуулт:\n" + question +
      "\n\nLOREVERSE мэдээллийн сангаас олдсон материал (зөвхөн эдгээрийг сангаас баталгаажсан эх сурвалж гэж үз):\n" +
      (context || "Одоогоор нийтлэгдсэн материал алга.") +
      "\n\nХариултын төгсгөлд LOREVERSE сангаас ашигласан эх сурвалж гэсэн хэсэг гаргаж, ашигласан нийтлэлийн гарчиг болон URL-ийг жагсаа. Холбогдох материал олдоогүй бол шууд хэл.";

    const aiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": "Bearer " + openAiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gpt-4.1-mini", instructions, input: prompt, max_output_tokens: 1000, store: false }),
    });
    const aiData = await aiResponse.json();
    if (!aiResponse.ok) {
      console.error("OpenAI API error", aiResponse.status, aiData?.error?.type || aiData?.error?.code || "unknown");
      return json(aiResponse.status === 429 ? 429 : 502, {
        error: aiResponse.status === 429 ? "AI үйлчилгээний түр хязгаарт хүрлээ. Дараа дахин оролдоно уу." : "AI үйлчилгээ одоогоор хариу өгч чадсангүй.",
      });
    }
    const answer = (aiData.output || []).filter((item: any) => item.type === "message")
      .flatMap((item: any) => item.content || []).filter((item: any) => item.type === "output_text")
      .map((item: any) => item.text).join("\n").trim();
    if (!answer) return json(502, { error: "AI хоосон хариу буцаалаа. Дахин оролдоно уу." });
    return json(200, { answer, remaining: quota.remaining, sources: selected.map(({ p }: any) => ({ id: p.id, title: p.title, game: p.game_title, urls: p.source_urls || [] })) });
  } catch (error) {
    console.error("lore-ai error", error);
    return json(500, { error: "Серверт алдаа гарлаа. Дараа дахин оролдоно уу." });
  }
});