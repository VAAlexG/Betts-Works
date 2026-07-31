import { env } from "cloudflare:workers";

function value(name: string) {
  const binding = (env as unknown as Record<string, unknown>)[name];
  return typeof binding === "string" ? binding : process.env[name];
}

async function send(to: string, subject: string, text: string) {
  const key = value("EMAIL_API_KEY");
  const from = value("EMAIL_FROM");
  if (!key || !from) return "not_configured" as const;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, text }),
  });
  if (!response.ok) throw new Error(`Email provider returned ${response.status}`);
  return "sent" as const;
}

function safeHeader(value: string, max = 160) {
  return value.replace(/[\r\n\u0000-\u001f\u007f]+/g, " ").trim().slice(0, max);
}

function safeText(value: string, max = 4000) {
  return value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim().slice(0, max);
}

export async function notifyEnquiry(enquiry: { id: string; name: string; email: string; phone: string; vehicleLabel?: string }) {
  const sales = value("SALES_NOTIFICATION_EMAIL");
  if (!sales) return "not_configured" as const;
  const name = safeText(enquiry.name, 100);
  const email = safeText(enquiry.email, 254);
  const phone = safeText(enquiry.phone, 30);
  const vehicle = safeText(enquiry.vehicleLabel || "General enquiry", 160);
  const reference = safeText(enquiry.id, 80);
  await send(sales, safeHeader(`New Betts Works enquiry — ${vehicle}`), `A new enquiry has been stored securely.\n\nReference: ${reference}\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nVehicle: ${vehicle}\n\nReview the full message in the protected administration area.`);
  try {
    await send(email, "We received your Betts Works enquiry", `Hi ${name},\n\nThanks for contacting Betts Works. Your enquiry has been received and saved. A member of the sales team will respond using your preferred contact method.\n\nReference: ${reference}\n\nBetts Works`);
  } catch {
    // The sales copy was already sent; acknowledgement failure is non-fatal.
  }
  return "sent" as const;
}

export async function verifyTurnstile(token: string | undefined, ip: string) {
  const secret = value("TURNSTILE_SECRET_KEY");
  if (!secret) return true;
  if (!token) return false;
  const form = new URLSearchParams({ secret, response: token, remoteip: ip });
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
  const result = await response.json() as { success?: boolean };
  return Boolean(result.success);
}
