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

export async function notifyEnquiry(enquiry: { id: string; name: string; email: string; phone: string; vehicleLabel?: string }) {
  const sales = value("SALES_NOTIFICATION_EMAIL");
  if (!sales) return "not_configured" as const;
  await send(sales, `New Betts Works enquiry — ${enquiry.vehicleLabel || "general"}`, `A new enquiry has been stored securely.\n\nReference: ${enquiry.id}\nName: ${enquiry.name}\nEmail: ${enquiry.email}\nPhone: ${enquiry.phone}\nVehicle: ${enquiry.vehicleLabel || "General enquiry"}\n\nReview the full message in the protected administration area.`);
  try {
    await send(enquiry.email, "We received your Betts Works enquiry", `Hi ${enquiry.name},\n\nThanks for contacting Betts Works. Your enquiry has been received and saved. A member of the sales team will respond using your preferred contact method.\n\nReference: ${enquiry.id}\n\nBetts Works`);
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
