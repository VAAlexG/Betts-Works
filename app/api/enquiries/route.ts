import { NextResponse } from "next/server";
import { enquirySchema } from "@/lib/validation";
import { checkRateLimit, publicVehicleExists, saveEnquiry, setEnquiryNotificationStatus } from "@/lib/data";
import { notifyEnquiry, verifyTurnstile } from "@/lib/email";

const inFlight = new Map<string, Promise<NextResponse>>();

async function hash(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((n) => n.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: Request) {
  const idempotencyKey = request.headers.get("idempotency-key") || crypto.randomUUID();
  if (inFlight.has(idempotencyKey)) return inFlight.get(idempotencyKey)!;
  const job = handle(request).finally(() => setTimeout(() => inFlight.delete(idempotencyKey), 60_000));
  inFlight.set(idempotencyKey, job);
  return job;
}

async function handle(request: Request) {
  let json: unknown;
  try { json = await request.json(); } catch { return NextResponse.json({ ok:false,message:"Invalid request." },{status:400}); }
  const parsed = enquirySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ ok:false,message:"Please check the highlighted information.",errors:parsed.error.flatten().fieldErrors },{status:422});
  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  const key = await hash(`enquiry:${ip}`);
  if (!(await checkRateLimit(key))) return NextResponse.json({ ok:false,message:"Too many enquiries have been submitted. Please wait and try again." },{status:429});
  if (!(await verifyTurnstile(parsed.data.turnstileToken, ip))) return NextResponse.json({ ok:false,message:"Spam protection could not verify this submission." },{status:400});
  if (parsed.data.vehicleId && !(await publicVehicleExists(parsed.data.vehicleId))) return NextResponse.json({ok:false,message:"That vehicle is no longer available for public enquiry. Please refresh the page."},{status:409});
  const input = { vehicleId: parsed.data.vehicleId, name: parsed.data.name, email: parsed.data.email, phone: parsed.data.phone, stateOrPostcode: parsed.data.stateOrPostcode, preferredContactMethod: parsed.data.preferredContactMethod, message: parsed.data.message, marketingConsent: parsed.data.marketingConsent, sourcePage: parsed.data.sourcePage };
  const stored = await saveEnquiry(input);
  let notificationStatus = "not_configured";
  try { notificationStatus = await notifyEnquiry({ id:stored.id,name:input.name,email:input.email,phone:input.phone,vehicleLabel:input.vehicleId || undefined }); }
  catch { notificationStatus = "failed"; }
  await setEnquiryNotificationStatus(stored.id, notificationStatus);
  const message = notificationStatus === "failed" ? "Your enquiry has been saved. Email notification is delayed, but the sales team can review it in the administration area." : "Thanks — your enquiry has been received and saved.";
  return NextResponse.json({ ok:true,reference:stored.id.slice(0,8).toUpperCase(),message },{status:201});
}
