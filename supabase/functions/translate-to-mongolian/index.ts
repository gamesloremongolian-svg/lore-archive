const allowedOrigins = new Set([
  "https://loreverse-ctrl.github.io",
  "https://localhost",
  "capacitor://localhost",
  "https://e-archive.pages.dev",
  "https://lore-archive.pages.dev",
]);
const publishableKey = "sb_publishable_hZOakxcNBY47UDgsJ0E6Aw_wJgAdLw1";
const rate = new Map<string, { count: number; reset: number }>();

function headers(origin: string | null) {
  const h = new Headers({
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-retry-count, traceparent, tracestate, baggage",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "application/json; charset=utf-8",
    "Vary": "Origin",
  });
  if (origin && allowedOrigins.has(origin)) h.set("Access-Control-Allow-Origin", origin);
  return h;
}

Deno.serve(async (req: Request) => {
  const h = headers(req.headers.get("Origin"));
  const reply = (status: number, data: Record<string, unknown>) =>
    new Response(JSON.stringify(data), { status, headers: h });
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  if (req.method !== "POST") return reply(405, { error: "POST хүсэлт шаардлагатай." });
  if (!allowedOrigins.has(req.headers.get("Origin") || "")) return reply(403, { error: "Зөвшөөрөгдөөгүй эх сурвалж." });
  if (req.headers.get("apikey") !== publishableKey) return reply(401, { error: "API key буруу байна." });

  const ip = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const current = rate.get(ip);
  if (current && current.reset > now && current.count >= 20) {
    return reply(429, { error: "Орчуулгын хүсэлтийн түр хязгаарт хүрлээ. Нэг минутын дараа дахин оролдоно уу." });
  }
  if (!current || current.reset <= now) rate.set(ip, { count: 1, reset: now + 60_000 });
  else current.count++;

  try {
    const body = await req.json();
    const raw = Array.isArray(body.texts) ? body.texts : [body.text];
    const texts = raw.map((x: unknown) => typeof x === "string" ? x.trim() : "");
    if (!texts.length || texts.length > 12 || texts.some((x: string) => !x) || texts.reduce((n: number, x: string) => n + x.length, 0) > 6000) {
      return reply(400, { error: "Нэг хүсэлтэд 1–12 текст, нийтдээ 6000 тэмдэгтээс ихгүй байна." });
    }
    if (texts.every((x: string) => /[А-Яа-яЁёӨөҮү]/.test(x))) return reply(200, { translations: texts, cached: true });

    const key = Deno.env.get("OPENAI_API_KEY");
    if (!key) return reply(503, { error: "Орчуулгын AI түлхүүр тохируулаагүй байна." });
    const instructions = [
      "Та LOREVERSE сайтын мэргэжлийн англи-монгол орчуулагч.",
      "Өгсөн анимэ, манга, light novel-ийн танилцуулгуудыг утга, үйл явдлын дараалал, бүх баримтыг алдалгүй байгалийн, найруулгатай Монгол хэлээр орчуул.",
      "Нэр, зохиомол газар, чадвар, байгууллагын оноосон нэрийг шаардлагагүйгээр орчуулахгүй; танил нэршлийг хадгал.",
      "Эхэд байхгүй мэдээлэл, тайлбар, спойлер нэмж болохгүй. MAL Rewrite зэрэг эх сурвалжийн тэмдэглэгээг хэвээр үлдээ.",
      "Зөвхөн translations нэртэй массив агуулсан JSON object буцаа. Массив нь оролтын дараалалтай яг ижил урттай байна. Элемент бүр тухайн текстийн бүрэн орчуулга байна. Өөр ямар ч талбар бүү нэм."
    ].join(" ");
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": "Bearer " + key, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        instructions,
        input: JSON.stringify(texts),
        max_output_tokens: 5000,
        store: false,
        text: { format: { type: "json_object" } }
      })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error("translation provider error", response.status, result?.error?.code || "unknown");
      return reply(response.status === 429 ? 429 : 502, { error: "Монгол орчуулгын үйлчилгээ түр ажиллахгүй байна." });
    }
    const output = (result.output || []).filter((x: any) => x.type === "message")
      .flatMap((x: any) => x.content || []).filter((x: any) => x.type === "output_text")
      .map((x: any) => x.text).join("\n").trim();
    let translations: unknown;
    try {
      const parsed = JSON.parse(output);
      translations = Array.isArray(parsed) ? parsed : parsed.translations;
    } catch { translations = null; }
    if (!Array.isArray(translations) || translations.length !== texts.length || translations.some((x: unknown) => typeof x !== "string" || !x.trim())) {
      return reply(502, { error: "Орчуулгын үр дүнгийн бүтэц буруу байна." });
    }
    return reply(200, { translations });
  } catch (error) {
    console.error("translate-to-mongolian error", error);
    return reply(500, { error: "Орчуулгын серверт алдаа гарлаа." });
  }
});