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
      const { data: plan, error: planError } = await admin.from("membership_plans")
        .select("plan_code,name,duration_days,price_amount,currency,enabled")
        .eq("plan_code", planCode).eq("enabled", true).maybeSingle();
      if (planError || !plan || !plan.price_amount || plan.currency !== "MNT") {
        return reply(400, { error: "Сонгосон Premium багц идэвхгүй эсвэл үнийн тохиргоо буруу байна." });
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
        }).select("id").single();
      if (paymentError || !payment) {
        await admin.from("memberships").delete().eq("id", membership.id).eq("user_id", user.id);
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
          console.error("QPay invoice creation failed", invoiceResponse.status, invoice.error || invoice.message || "no invoice id");
          await admin.from("payment_records").update({ status: "failed" }).eq("id", payment.id);
          await admin.from("memberships").update({ status: "cancelled" }).eq("id", membership.id);
          return reply(502, { error: "QPay нэхэмжлэл үүсгэсэнгүй. Invoice Code болон Merchant API эрхийг шалгана уу." });
        }
        const { error: saveError } = await admin.from("payment_records")
          .update({ provider_invoice_id: String(invoice.invoice_id) }).eq("id", payment.id);
        if (saveError) {
          console.error("Could not save QPay invoice id", saveError);
          return reply(500, { error: "QPay нэхэмжлэл үүссэн боловч системд бүртгэж чадсангүй. Админтай холбогдоно уу." });
        }
        return reply(200, {
          ok: true, payment_id: payment.id, invoice_id: invoice.invoice_id,
          amount: Number(plan.price_amount), currency: "MNT", plan_name: plan.name,
          qr_image: invoice.qr_image || null, qr_text: invoice.qr_text || null,
          qpay_short_url: invoice.qPay_shortUrl || invoice.qpay_short_url || null,
          urls: Array.isArray(invoice.urls) ? invoice.urls : [],
        });
      } catch (error) {
        console.error("QPay invoice flow error", error);
        await admin.from("payment_records").update({ status: "failed" }).eq("id", payment.id);
        await admin.from("memberships").update({ status: "cancelled" }).eq("id", membership.id);
        return reply(502, { error: error instanceof Error ? error.message : "QPay холболтын алдаа." });
      }
    }

    if (action === "check_payment") {
      const paymentId = typeof body.payment_id === "string" ? body.payment_id : "";
      if (!/^[0-9a-f-]{36}$/i.test(paymentId)) return reply(400, { error: "payment_id буруу байна." });
      const { data: payment, error: paymentReadError } = await admin.from("payment_records")
        .select("id,user_id,purpose,related_id,amount,currency,provider,provider_invoice_id,status")
        .eq("id", paymentId).eq("user_id", user.id).eq("provider", "qpay")
        .eq("purpose", "membership").maybeSingle();
      if (paymentReadError || !payment || !payment.provider_invoice_id) {
        return reply(404, { error: "Төлбөрийн нэхэмжлэл олдсонгүй." });
      }
      if (payment.status === "paid") return reply(200, { ok: true, paid: true, already_confirmed: true });

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
        Math.round(Number(r.payment_amount)) === Math.round(Number(payment.amount))
      );
      if (!paidRows.length || Number(check.paid_amount || 0) < Number(payment.amount)) {
        return reply(200, { ok: true, paid: false, status: "pending" });
      }

      const { data: membership, error: membershipReadError } = await admin.from("memberships")
        .select("id,user_id,plan_code,status,starts_at,ends_at")
        .eq("id", payment.related_id).eq("user_id", user.id).maybeSingle();
      if (membershipReadError || !membership) return reply(500, { error: "Premium захиалгын мэдээлэл олдсонгүй." });

      const paidAt = new Date().toISOString();
      if (membership.status !== "active") {
        const { data: plan } = await admin.from("membership_plans")
          .select("duration_days").eq("plan_code", membership.plan_code).maybeSingle();
        if (!plan?.duration_days) return reply(500, { error: "Premium багцын хугацаа олдсонгүй." });
        const { data: activeRows } = await admin.from("memberships")
          .select("ends_at").eq("user_id", user.id).eq("status", "active");
        const now = Date.now();
        const futureEnd = (activeRows || []).map((x: any) => x.ends_at ? Date.parse(x.ends_at) : 0)
          .filter((n: number) => n > now).sort((a: number, b: number) => b - a)[0];
        const startMs = futureEnd || now;
        const startsAt = new Date(startMs).toISOString();
        const endsAt = new Date(startMs + Number(plan.duration_days) * 86400000).toISOString();
        const { error: activateError } = await admin.from("memberships")
          .update({ status: "active", starts_at: startsAt, ends_at: endsAt })
          .eq("id", membership.id).eq("user_id", user.id).neq("status", "active");
        if (activateError) {
          console.error("Membership activation failed", activateError);
          return reply(500, { error: "Төлбөр баталгаажсан. Гэвч Premium эрх идэвхжүүлэхэд алдаа гарлаа. Админтай холбогдоно уу." });
        }
      }

      const { error: paidUpdateError } = await admin.from("payment_records")
        .update({ status: "paid", paid_at: paidAt }).eq("id", payment.id).eq("user_id", user.id);
      if (paidUpdateError) {
        console.error("Payment paid status update failed", paidUpdateError);
        return reply(500, { error: "Төлбөр баталгаажсан ч бүртгэлийг шинэчилж чадсангүй." });
      }
      return reply(200, { ok: true, paid: true, status: "paid" });
    }

    return reply(400, { error: "action нь create_invoice эсвэл check_payment байна." });
  } catch (error) {
    console.error("qpay-payment unexpected error", error);
    return reply(500, { error: "Серверийн алдаа гарлаа. Дахин оролдоно уу." });
  }
});
