import { NextResponse } from "next/server";
import { enquirySchema } from "@/lib/validation";
import { checkRateLimit, publicVehicleExists, saveEnquiry, setEnquiryNotificationStatus } from "@/lib/data";
import { notifyEnquiry, verifyTurnstile } from "@/lib/email";
import { verifyCsrf } from "@/lib/csrf";

const inFlight = new Map<string, Promise<NextResponse>>();
const MAX_BODY_BYTES = 16_384;

async function hash(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((n) => n.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > MAX_BODY_BYTES) return reply({ ok:false,message:"Invalid request." }, 413);
  if (!verifyCsrf(request)) return reply({ ok:false,message:"Your secure form session expired. Refresh the page and try again." }, 403);
  const suppliedKey = request.headers.get("idempotency-key") || "";
  const idempotencyKey = /^[a-zA-Z0-9-]{1,80}$/.test(suppliedKey) ? suppliedKey : crypto.randomUUID();
  if (inFlight.has(idempotencyKey)) return inFlight.get(idempotencyKey)!;
  const job = handle(request).finally(() => setTimeout(() => inFlight.delete(idempotencyKey), 60_000));
  inFlight.set(idempotencyKey, job);
  return job;
}

async function handle(request: Request) {
  let json: unknown;
  try { json = await request.json(); } catch { return reply({ ok:false,message:"Invalid request." }, 400); }
  const parsed = enquirySchema.safeParse(json);
  if (!parsed.success) return reply({ ok:false,message:"Please check the highlighted information.",errors:parsed.error.flatten().fieldErrors }, 422);
  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  try {
    const key = await hash(`enquiry:${ip}`);
    if (!(await checkRateLimit(key))) return reply({ ok:false,message:"Too many enquiries have been submitted. Please wait and try again." }, 429);
    if (!(await verifyTurnstile(parsed.data.turnstileToken, ip))) return reply({ ok:false,message:"Spam protection could not verify this submission." }, 400);
    if (parsed.data.vehicleId && !(await publicVehicleExists(parsed.data.vehicleId))) return reply({ok:false,message:"That vehicle is no longer available for public enquiry. Please refresh the page."}, 409);
    const input = { vehicleId: parsed.data.vehicleId, name: parsed.data.name, email: parsed.data.email, phone: parsed.data.phone, stateOrPostcode: parsed.data.stateOrPostcode, preferredContactMethod: parsed.data.preferredContactMethod, message: parsed.data.message, marketingConsent: parsed.data.marketingConsent, sourcePage: parsed.data.sourcePage };
    const stored = await saveEnquiry(input);
    let notificationStatus = "not_configured";
    try { notificationStatus = await notifyEnquiry({ id:stored.id,name:input.name,email:input.email,phone:input.phone,vehicleLabel:input.vehicleId || undefined }); }
    catch { notificationStatus = "failed"; }
    try { await setEnquiryNotificationStatus(stored.id, notificationStatus); } catch { /* Enquiry remains safely stored. */ }
    const message = notificationStatus === "failed" ? "Your enquiry has been saved. Email notification is delayed, but the sales team can review it securely." : "Thanks — your enquiry has been received and saved.";
    return reply({ ok:true,reference:stored.id.slice(0,8).toUpperCase(),message }, 201);
  } catch {
    return reply({ ok:false,message:"We could not process your enquiry just now. Please try again or call 0451 461 705." }, 500);
  }
}

function reply(body: unknown, status: number) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
