import { z } from "zod";

const trimmed = (max: number) => z.string().trim().min(1).max(max);

export const enquirySchema = z.object({
  vehicleId: z.string().trim().max(80).optional().nullable(),
  name: trimmed(100),
  email: z.email().max(254),
  phone: z.string().trim().min(8).max(30).regex(/^[+()\-\s\d]+$/, "Enter a valid phone number"),
  stateOrPostcode: trimmed(20),
  preferredContactMethod: z.enum(["phone", "email"]),
  message: trimmed(2000),
  consent: z.literal(true, { error: "Please acknowledge the privacy notice" }),
  marketingConsent: z.boolean().default(false),
  sourcePage: z.string().trim().max(300).default("/contact"),
  company: z.string().max(0, "Submission rejected").default(""),
  turnstileToken: z.string().max(3000).optional(),
});

export const vehicleSchema = z.object({
  year: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 2),
  make: trimmed(60), model: trimmed(80), variant: z.string().trim().max(100).default(""),
  stockNumber: trimmed(50), slug: z.string().trim().min(3).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  headline: trimmed(140), shortDescription: trimmed(240), fullDescription: trimmed(5000),
  priceCents: z.coerce.number().int().nonnegative().nullable().optional(), priceDisplay: trimmed(50), priceQualifier: trimmed(100),
  availabilityStatus: z.enum(["in_stock", "available_soon", "under_offer", "sold", "draft"]),
  bodyType: z.string().trim().max(60).optional().default(""), fuelType: z.string().trim().max(60).optional().default(""),
  transmission: z.string().trim().max(80).optional().default(""), drivetrain: z.string().trim().max(50).optional().default(""),
  featured: z.boolean().default(false), published: z.boolean().default(false),
});

export const enquiryStatusSchema = z.enum(["new", "contacted", "qualified", "appointment_arranged", "closed_won", "closed_lost", "spam"]);

export function formatAud(cents: number | null) {
  if (cents === null) return "POA";
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(cents / 100);
}

export function formatKm(km: number | null) {
  return km === null ? "Confirm with dealer" : `${new Intl.NumberFormat("en-AU").format(km)} km`;
}

export function normaliseSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
