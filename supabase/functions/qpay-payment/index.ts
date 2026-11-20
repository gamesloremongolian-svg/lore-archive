import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("Origin") || "";
  const allowedOrigins = new Set([
"https://loreverse-ctrl.github.io",
    "https://gamesloremongolian-svg.github.io",
    "https://lore-archive.pages.dev",
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
function readKey(name: string): string {
  const direct = Deno.env.get(name);
  if (direct) return direct;
  return "";
}
function supabaseKeys() {
  let publishable = readKey("SUPABASE_ANON_KEY");
  let secret = readKey("SUPABASE_SERVICE_ROLE_KEY");
  try {
    const p = Deno.env.get("SUPABASE_PUBLISHABLE_KEYS");
    if (!publishable && p) publishable = JSON.parse(p).default || "";
  } catch { /* ignore malformed optional key map */ }
  try {
    const s = Deno.env.get("SUPABASE_SECRET_KEYS");
    if (!secret && s) secret = JSON.parse(s).default || "";
  } catch { /* ignore malformed optional key map */ }
  return { publishable, secret };
}

async function qpayToken(baseUrl: string, clientId: string, clientSecret: string) {
  const credentials = btoa(clientId + ":" + clientSecret);
  const response = await fetch(baseUrl + "/v2/auth/token", {
    method: "POST",
    headers: { "Authorization": "Basic " + credentials, "Content-Type": "application/json" },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) {
    console.error("QPay token request failed", response.status, data.error || data.message || "no token");
    throw new Error("QPay нэвтрэлт амжилтгүй. Merchant эрх болон Client ID/Secret тохиргоог шалгана уу.");
  }
  return String(data.access_token);
}

Deno.serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);
  function reply(status: number, body: Record<string, unknown>) {
    return new Response(JSON.stringify(body), { status, headers: corsHeaders });
  }
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return reply(405, { error: "POST хүсэлт шаардлагатай." });

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const userToken = authHeader.match(/^Bearer\s+(.+)$/i)?.[1];
    if (!userToken) return reply(401, { error: "Нэвтэрч байж төлбөр хийх боломжтой." });

    const supabaseUrl = readKey("SUPABASE_URL");
    const { publishable, secret } = supabaseKeys();
    if (!supabaseUrl || !publishable || !secret) {
      console.error("Supabase runtime keys missing");
      return reply(500, { error: "Supabase Function-ийн серверийн тохиргоо дутуу байна." });
    }

    const userClient = createClient(supabaseUrl, publishable, {
      global: { headers: { Authorization: "Bearer " + userToken } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: userData, error: userError } = await userClient.auth.getUser(userToken);
    const user = userData?.user;
    if (userError || !user || user.is_anonymous) {
      return reply(401, { error: "Premium авахын тулд имэйлээр бүртгүүлж нэвтэрнэ үү." });
    }

    const body = await req.json().catch(() => ({}));
    const action = body.action;
    const admin = createClient(supabaseUrl, secret, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const baseUrl = (readKey("QPAY_BASE_URL") || "https://merchant-sandbox.qpay.mn").replace(/\/$/, "");
    if (!["https://merchant-sandbox.qpay.mn", "https://merchant.qpay.mn"].includes(baseUrl)) {
      return reply(500, { error: "QPAY_BASE_URL зөвшөөрөгдөөгүй. Sandbox эсвэл Production URL тохируулна уу." });
    }
    const clientId = readKey("QPAY_CLIENT_ID");
    const clientSecret = readKey("QPAY_CLIENT_SECRET");
    const invoiceCode = readKey("QPAY_INVOICE_CODE");
    if (action === "health") {
      return reply(200, {
        ok: true,
        qpay_base_url: baseUrl,
        qpay_secrets_configured: Boolean(clientId && clientSecret && invoiceCode),
        environment: baseUrl.includes("sandbox") ? "sandbox" : "production",
      });
    }

    if (!clientId || !clientSecret || !invoiceCode) {
      console.error("QPay required secrets missing", {
        clientId: !!clientId, clientSecret: !!clientSecret, invoiceCode: !!invoiceCode,
      });
      return reply(503, { error: "QPay-ийн Client ID, Client Secret эсвэл Invoice Code тохируулаагүй байна." });
    }

    if (action === "create_invoice") {
      const planCode = body.plan_code;
      if (planCode !== "monthly" && planCode !== "yearly") {
        return reply(400, { error: "plan_code нь monthly эсвэл yearly байна." });
      }
      // The client must reuse this UUID for every retry of the same checkout attempt.
      const idempotencyKey = typeof body.idempotency_key === "string" ? body.idempotency_key.trim() : "";
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idempotencyKey)) {
        return reply(400, { error: "idempotency_key UUID шаардлагатай. Нэг төлбөрийн оролдлогын retry бүрт ижил утгыг ашиглана уу." });
      }
      const { data: plan, error: planError } = await admin.from("membership_plans")
        .select("plan_code,name,duration_days,price_amount,currency,enabled")
        .eq("plan_code", planCode).eq("enabled", true).maybeSingle();
      if (planError || !plan || !plan.price_amount || plan.currency !== "MNT") {
        return reply(400, { error: "Сонгосон Premium багц идэвхгүй эсвэл үнийн тохиргоо буруу байна." });
      }

      // Reuse a previously created invoice for duplicate submissions.
      const { data: existing, error: existingReadError } = await admin.from("payment_records")
        .select("id,related_id,invoice_creation_status,invoice_response")
        .eq("user_id", user.id).eq("purpose", "membership").eq("provider", "qpay")
        .eq("idempotency_key", idempotencyKey).maybeSingle();
      if (existingReadError) {
        console.error("Idempotency lookup failed", existingReadError);
        return reply(503, { error: "Өмнөх төлбөрийн оролдлогыг шалгаж чадсангүй. Давхар нэхэмжлэл үүсгэхгүйн тулд түр зогсоолоо." });
      }
      if (existing) {
        const { data: existingMembership, error: existingMembershipError } = await admin.from("memberships")
          .select("plan_code").eq("id", existing.related_id).eq("user_id", user.id).maybeSingle();
        if (existingMembershipError || !existingMembership || existingMembership.plan_code !== planCode) {
          return reply(409, { error: "Энэ idempotency key өөр Premium багцын оролдлогод ашиглагдсан байна. Тухайн оролдлогыг үргэлжлүүлэх эсвэл шинэ төлбөр эхлүүлнэ үү." });
        }
        if (existing.invoice_creation_status === "created" && existing.invoice_response) {
          return reply(200, { ...existing.invoice_response, already_created: true });
        }
        if (existing.invoice_creation_status === "failed") {
          return reply(409, { error: "Энэ төлбөрийн оролдлого амжилтгүй болсон. Шинэ оролдлого эхлүүлнэ үү.", payment_id: existing.id });
        }
        return reply(409, { error: "Энэ төлбөрийн хүсэлт боловсруулагдаж байгаа эсвэл QPay-ийн хариу тодорхойгүй байна. Давхар нэхэмжлэл үүсгэхгүй.", payment_id: existing.id, retry_safe: false });
      }

      const { data: membership, error: membershipError } = await admin.from("memberships")
        .insert({ user_id: user.id, plan_code: plan.plan_code, status: "pending" })
        .select("id").single();
      if (membershipError || !membership) {
        console.error("Pending membership insert failed", membershipError);
        return reply(500, { error: "Төлбөрийн захиалга үүсгэж чадсангүй." });
      }

      const { data: payment, error: paymentError } = await admin.from("payment_records")
        .insert({
          user_id: user.id, purpose: "membership", related_id: membership.id,
          amount: Number(plan.price_amount), currency: "MNT", provider: "qpay", status: "pending",
          idempotency_key: idempotencyKey, invoice_creation_status: "creating",
        }).select("id").single();
      if (paymentError || !payment) {
        await admin.from("memberships").delete().eq("id", membership.id).eq("user_id", user.id);
        const { data: raced } = await admin.from("payment_records")
          .select("id,invoice_creation_status,invoice_response")
          .eq("user_id", user.id).eq("purpose", "membership").eq("provider", "qpay")
          .eq("idempotency_key", idempotencyKey).maybeSingle();
        if (raced?.invoice_creation_status === "created" && raced.invoice_response) {
          return reply(200, { ...raced.invoice_response, already_created: true });
        }
        if (raced) return reply(409, { error: "Төлбөрийн хүсэлт аль хэдийн бүртгэгдсэн. Давхар нэхэмжлэл үүсгэхгүй.", payment_id: raced.id, retry_safe: false });
        console.error("Payment record insert failed", paymentError);
        return reply(500, { error: "Төлбөрийн бүртгэл үүсгэж чадсангүй." });
      }

      try {
        const token = await qpayToken(baseUrl, clientId, clientSecret);
        const invoiceResponse = await fetch(baseUrl + "/v2/invoice", {
          method: "POST",
          headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json" },
          body: JSON.stringify({
            invoice_code: invoiceCode,
            sender_invoice_no: payment.id,
            invoice_receiver_code: "terminal",
            invoice_description: "LOREVERSE Premium - " + plan.name,
            amount: Number(plan.price_amount),
          }),
        });
        const invoice = await invoiceResponse.json().catch(() => ({}));
        if (!invoiceResponse.ok || !invoice.invoice_id) {
          // A non-success or malformed response does not prove that QPay rejected
          // the request; the provider may have created an invoice before the response failed.
          console.error("QPay invoice outcome ambiguous", invoiceResponse.status, invoice.error || invoice.message || "no invoice id");
          await admin.from("payment_records")
            .update({ invoice_creation_status: "unknown" }).eq("id", payment.id);
          return reply(502, {
            error: "QPay нэхэмжлэлийн хариу тодорхойгүй байна. Давхар нэхэмжлэлээс сэргийлж дахин үүсгэхгүй; админаар шалгуулна уу.",
            payment_id: payment.id,
            retry_safe: false,
          });
        }
        const responsePayload = {
          ok: true, payment_id: payment.id, invoice_id: invoice.invoice_id,
          amount: Number(plan.price_amount), currency: "MNT", plan_name: plan.name,
          qr_image: invoice.qr_image || null, qr_text: invoice.qr_text || null,
          qpay_short_url: invoice.qPay_shortUrl || invoice.qpay_short_url || null,
          urls: Array.isArray(invoice.urls) ? invoice.urls : [],
        };
        const { error: saveError } = await admin.from("payment_records")
          .update({ provider_invoice_id: String(invoice.invoice_id), invoice_creation_status: "created", invoice_response: responsePayload })
          .eq("id", payment.id);
        if (saveError) {
          console.error("Could not save QPay invoice id", saveError);
          return reply(500, { error: "QPay нэхэмжлэл үүссэн боловч системд бүртгэж чадсангүй. Админтай холбогдоно уу." });
        }
        return reply(200, responsePayload);
      } catch (error) {
        // A network timeout can happen after QPay accepted the invoice request.
        // Keep the attempt unknown and block automatic re-creation with this key.
        console.error("QPay invoice flow outcome unknown", error);
        await admin.from("payment_records")
          .update({ invoice_creation_status: "unknown" }).eq("id", payment.id);
        return reply(502, {
          error: "QPay хүсэлтийн хариу тодорхойгүй байна. Давхар нэхэмжлэл үүсгэхгүйн тулд дахин invoice үүсгэхгүй; төлөвийг админаар шалгуулна уу.",
          payment_id: payment.id,
          retry_safe: false,
        });
      }
    }

    if (action === "check_payment") {
      const paymentId = typeof body.payment_id === "string" ? body.payment_id : "";
      if (!/^[0-9a-f-]{36}$/i.test(paymentId)) return reply(400, { error: "payment_id буруу байна." });
      const { data: payment, error: paymentReadError } = await admin.from("payment_records")
        .select("id,user_id,purpose,related_id,amount,currency,provider,provider_invoice_id,qpay_payment_id,ebarimt_status,ebarimt_response,status")
        .eq("id", paymentId).eq("user_id", user.id).eq("provider", "qpay")
        .eq("purpose", "membership").maybeSingle();
      if (paymentReadError || !payment || !payment.provider_invoice_id) {
        return reply(404, { error: "Төлбөрийн нэхэмжлэл олдсонгүй." });
      }
      if (payment.status === "paid") return reply(200, {
        ok: true, paid: true, already_confirmed: true,
        ebarimt_status: payment.ebarimt_status,
        ebarimt: payment.ebarimt_response || null,
      });
      if (payment.status !== "pending" || payment.currency !== "MNT" ||
          !Number.isFinite(Number(payment.amount)) || Number(payment.amount) <= 0) {
        return reply(409, { error: "Энэ төлбөрийн бүртгэл баталгаажуулах боломжгүй төлөвтэй байна." });
      }

      const token = await qpayToken(baseUrl, clientId, clientSecret);
      const checkResponse = await fetch(baseUrl + "/v2/payment/check", {
        method: "POST",
        headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json" },
        body: JSON.stringify({
          object_type: "INVOICE",
          object_id: payment.provider_invoice_id,
          offset: { page_number: 1, page_limit: 100 },
        }),
      });
      const check = await checkResponse.json().catch(() => ({}));
      if (!checkResponse.ok) {
        console.error("QPay payment check failed", checkResponse.status, check.error || check.message || "unknown");
        return reply(502, { error: "QPay төлбөрийн төлөв шалгаж чадсангүй." });
      }
      const rows = Array.isArray(check.rows) ? check.rows : [];
      const paidRows = rows.filter((r: any) =>
        String(r.payment_status || "").toUpperCase() === "PAID" &&
        String(r.payment_currency || "").toUpperCase() === "MNT" &&
        Number.isFinite(Number(r.payment_amount)) &&
        Number(r.payment_amount) > 0
      );
      const verifiedPaidAmount = paidRows.reduce((sum: number, row: any) => sum + Number(row.payment_amount), 0);
      if (!paidRows.length || verifiedPaidAmount < Number(payment.amount)) {
        return reply(200, { ok: true, paid: false, status: "pending" });
      }
      // QPay eBarimt is issued per completed payment. Store a payment ID only
      // when one QPay payment exactly covers this invoice; partial/multiple
      // payments still settle the membership but require manual receipt handling.
      const fullPaymentRows = paidRows.filter((r: any) =>
        Math.round(Number(r.payment_amount)) === Math.round(Number(payment.amount)) &&
        typeof r.payment_id === "string" && r.payment_id.length > 0
      );
      const qpayPaymentId = fullPaymentRows.length === 1 ? String(fullPaymentRows[0].payment_id) : null;

      const { data: membership, error: membershipReadError } = await admin.from("memberships")
        .select("id,user_id,plan_code,status,starts_at,ends_at")
        .eq("id", payment.related_id).eq("user_id", user.id).maybeSingle();
      if (membershipReadError || !membership) return reply(500, { error: "Premium захиалгын мэдээлэл олдсонгүй." });

      const { data: plan, error: planReadError } = await admin.from("membership_plans")
        .select("duration_days").eq("plan_code", membership.plan_code).maybeSingle();
      if (planReadError || !plan?.duration_days || Number(plan.duration_days) <= 0) {
        return reply(500, { error: "Premium багцын хугацаа олдсонгүй." });
      }

      // Settlement is one database transaction. The RPC serializes all membership
      // extensions for this user and marks payment paid in the same commit.
      const { data: settlement, error: settlementError } = await admin.rpc("settle_qpay_membership_payment", {
        p_payment_id: payment.id,
        p_user_id: user.id,
        p_duration_days: Number(plan.duration_days),
        p_qpay_payment_id: qpayPaymentId,
        p_paid_at: new Date().toISOString(),
      });
      if (settlementError || !settlement?.ok) {
        console.error("Atomic QPay settlement failed", settlementError || settlement);
        return reply(500, {
          error: "Төлбөр баталгаажсан боловч Premium эрхийг атомик идэвхжүүлж чадсангүй. Админтай холбогдоно уу.",
        });
      }
      return reply(200, {
        ok: true, paid: true, status: "paid",
        already_settled: Boolean(settlement.already_settled),
        ebarimt_available: Boolean(qpayPaymentId),
      });
    }

    if (action === "create_ebarimt") {
      const paymentId = typeof body.payment_id === "string" ? body.payment_id : "";
      if (!/^[0-9a-f-]{36}$/i.test(paymentId)) return reply(400, { error: "payment_id буруу байна." });
      const receiverType = typeof body.ebarimt_receiver_type === "string" ? body.ebarimt_receiver_type : "";
      const receiver = typeof body.ebarimt_receiver === "string" ? body.ebarimt_receiver.trim() : "";
      if (receiverType !== "CITIZEN" && receiverType !== "COMPANY") {
        return reply(400, { error: "Баримтын төрөл CITIZEN эсвэл COMPANY байна." });
      }
      if (receiverType === "COMPANY" && (!receiver || receiver.length > 20)) {
        return reply(400, { error: "Байгууллагын регистрийн дугаарыг зөв оруулна уу." });
      }
      if (receiverType === "CITIZEN" && receiver && !/^\\d{8,20}$/.test(receiver)) {
        return reply(400, { error: "Иргэний EBarimt-д бүртгэлтэй утасны дугаарыг 8-20 оронтой оруулна уу." });
      }

      const { data: payment, error: paymentError } = await admin.from("payment_records")
        .select("id,user_id,purpose,provider,status,qpay_payment_id,ebarimt_status,ebarimt_receiver_type,ebarimt_receiver,ebarimt_response")
        .eq("id", paymentId).eq("user_id", user.id).eq("provider", "qpay")
        .eq("purpose", "membership").maybeSingle();
      if (paymentError || !payment || payment.status !== "paid" || !payment.qpay_payment_id) {
        return reply(409, { error: "Баталгаажсан QPay гүйлгээний дугаар олдсонгүй. Нэг бүтэн гүйлгээгээр төлөгдсөн эсэхийг админаар шалгуулна уу." });
      }
      if (payment.ebarimt_status === "created" && payment.ebarimt_response) {
        return reply(200, { ok: true, already_created: true, ebarimt: payment.ebarimt_response });
      }
      if (payment.ebarimt_status === "creating" || payment.ebarimt_status === "unknown") {
        return reply(409, { error: "И-баримтын хүсэлтийн төлөв тодорхойгүй эсвэл боловсруулагдаж байна. Давхар баримт үүсгэхгүйн тулд түр зогсоолоо." });
      }

      const { data: claimed, error: claimError } = await admin.from("payment_records")
        .update({
          ebarimt_status: "creating",
          ebarimt_receiver_type: receiverType,
          ebarimt_receiver: receiver || null,
        })
        .eq("id", payment.id).in("ebarimt_status", ["not_requested", "failed"])
        .select("id").maybeSingle();
      if (claimError || !claimed) {
        return reply(409, { error: "И-баримтын хүсэлт аль хэдийн эхэлсэн байна. Давхар хүсэлт илгээхгүй." });
      }

      try {
        const token = await qpayToken(baseUrl, clientId, clientSecret);
        const ebarimtResponse = await fetch(baseUrl + "/v2/ebarimt_v3/create", {
          method: "POST",
          headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json" },
          body: JSON.stringify({
            payment_id: payment.qpay_payment_id,
            ebarimt_receiver_type: receiverType,
            ebarimt_receiver: receiver,
          }),
        });
        const ebarimt = await ebarimtResponse.json().catch(() => ({}));
        // QPay EBarimt v3 returns barimt_status=REGISTERED on successful receipt creation.
        if (!ebarimtResponse.ok || ebarimt.status !== true || String(ebarimt.barimt_status || "").toUpperCase() !== "REGISTERED") {
          const uncertain = ebarimtResponse.status >= 500 || ebarimtResponse.status === 408 || ebarimtResponse.status === 429;
          await admin.from("payment_records")
            .update({ ebarimt_status: uncertain ? "unknown" : "failed" }).eq("id", payment.id);
          console.error("QPay eBarimt request did not complete", ebarimtResponse.status, ebarimt.error || ebarimt.message || "receipt not created");
          return reply(502, {
            error: uncertain
              ? "QPay и-баримтын хариу тодорхойгүй байна. Давхар баримт үүсгэхгүйн тулд админаар шалгуулна уу."
              : "QPay и-баримт үүсгэсэнгүй. Merchant-ийн eBarimt эрх болон тохиргоог шалгана уу.",
          });
        }
        const { error: saveReceiptError } = await admin.from("payment_records")
          .update({ ebarimt_status: "created", ebarimt_response: ebarimt })
          .eq("id", payment.id);
        if (saveReceiptError) {
          console.error("QPay eBarimt created but receipt could not be saved", saveReceiptError);
          await admin.from("payment_records").update({ ebarimt_status: "unknown" }).eq("id", payment.id);
          return reply(500, { error: "И-баримт QPay дээр үүссэн боловч системд хадгалж чадсангүй. Админаар шалгуулна уу." });
        }
        return reply(200, { ok: true, ebarimt });
      } catch (error) {
        await admin.from("payment_records").update({ ebarimt_status: "unknown" }).eq("id", payment.id);
        console.error("QPay eBarimt outcome unknown", error);
        return reply(502, { error: "И-баримтын хариу тодорхойгүй байна. Давхар баримт үүсгэхгүйн тулд админаар шалгуулна уу." });
      }
    }

    return reply(400, { error: "action нь create_invoice, check_payment эсвэл create_ebarimt байна." });
  } catch (error) {
    console.error("qpay-payment unexpected error", error);
    return reply(500, { error: "Серверийн алдаа гарлаа. Дахин оролдоно уу." });
  }
});
