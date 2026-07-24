import { and, asc, desc, eq, inArray, isNull, ne } from "drizzle-orm";
import { getDb, getD1 } from "@/db";
import { ensureDatabase } from "@/db/ensure";
import { auditLogs, enquiries, enquiryNotes, features, slugRedirects, vehicleFeatures, vehicleImages, vehicles, type Enquiry, type Vehicle } from "@/db/schema";

export type VehicleWithMedia = Vehicle & { images: typeof vehicleImages.$inferSelect[]; features: string[] };

export async function listPublicVehicles(options?: { featured?: boolean; includeSold?: boolean }): Promise<VehicleWithMedia[]> {
  try {
    await ensureDatabase();
    const db = getDb();
    const statusCondition = options?.includeSold
      ? ne(vehicles.availabilityStatus, "draft")
      : inArray(vehicles.availabilityStatus, ["in_stock", "available_soon", "under_offer"]);
    const conditions = [eq(vehicles.published, true), isNull(vehicles.archivedAt), statusCondition];
    if (options?.featured) conditions.push(eq(vehicles.featured, true));
    const vehicleRows = await db.select().from(vehicles).where(and(...conditions)).orderBy(desc(vehicles.publishedAt), desc(vehicles.createdAt));
    if (!vehicleRows.length) return [] as VehicleWithMedia[];
    const imageRows = await db.select().from(vehicleImages).where(inArray(vehicleImages.vehicleId, vehicleRows.map((vehicle) => vehicle.id))).orderBy(desc(vehicleImages.isPrimary), asc(vehicleImages.displayOrder));
    return vehicleRows.map((vehicle) => ({ ...vehicle, images: imageRows.filter((image) => image.vehicleId === vehicle.id), features: [] }));
  } catch {
    return [];
  }
}

export async function getPublicVehicle(slug: string): Promise<{ vehicle: VehicleWithMedia | null; redirectSlug?: string }> {
  try {
    await ensureDatabase();
    const db = getDb();
    const vehicle = await db.query.vehicles.findFirst({
      where: and(eq(vehicles.slug, slug), eq(vehicles.published, true), isNull(vehicles.archivedAt), ne(vehicles.availabilityStatus, "draft")),
    });
    if (!vehicle) {
      const redirect = await db.query.slugRedirects.findFirst({ where: eq(slugRedirects.oldSlug, slug) });
      if (redirect) {
        const target = await db.query.vehicles.findFirst({ where: and(eq(vehicles.id, redirect.vehicleId), eq(vehicles.published, true)) });
        return { vehicle: null, redirectSlug: target?.slug };
      }
      return { vehicle: null };
    }
    const [images, featureRows] = await Promise.all([
      db.select().from(vehicleImages).where(eq(vehicleImages.vehicleId, vehicle.id)).orderBy(desc(vehicleImages.isPrimary), asc(vehicleImages.displayOrder)),
      db.select({ name: features.name }).from(vehicleFeatures).innerJoin(features, eq(vehicleFeatures.featureId, features.id)).where(eq(vehicleFeatures.vehicleId, vehicle.id)).orderBy(asc(features.category), asc(features.name)),
    ]);
    return { vehicle: { ...vehicle, images, features: featureRows.map((row) => row.name) } };
  } catch {
    return { vehicle: null };
  }
}

export async function listRelatedVehicles(vehicle: Vehicle, limit = 3) {
  const all = await listPublicVehicles();
  return all.filter((item) => item.id !== vehicle.id).sort((a, b) => Number(b.make === vehicle.make) - Number(a.make === vehicle.make)).slice(0, limit);
}

export async function saveEnquiry(input: Omit<typeof enquiries.$inferInsert, "id" | "createdAt" | "updatedAt" | "status" | "notificationStatus">) {
  await ensureDatabase();
  const db = getDb();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await db.insert(enquiries).values({ ...input, id, status: "new", notificationStatus: "pending", createdAt: now, updatedAt: now });
  return { id, createdAt: now };
}

export async function setEnquiryNotificationStatus(id: string, status: string) {
  await getDb().update(enquiries).set({ notificationStatus: status, updatedAt: new Date().toISOString() }).where(eq(enquiries.id, id));
}

export async function checkRateLimit(key: string, limit = 5, windowMs = 15 * 60_000) {
  await ensureDatabase();
  const d1 = getD1();
  const now = Date.now();
  const row = await d1.prepare("SELECT window_started_at, count FROM rate_limits WHERE key = ?").bind(key).first<{ window_started_at: number; count: number }>();
  if (!row || now - row.window_started_at > windowMs) {
    await d1.prepare("INSERT INTO rate_limits (key, window_started_at, count) VALUES (?, ?, 1) ON CONFLICT(key) DO UPDATE SET window_started_at = excluded.window_started_at, count = 1").bind(key, now).run();
    return true;
  }
  if (row.count >= limit) return false;
  await d1.prepare("UPDATE rate_limits SET count = count + 1 WHERE key = ?").bind(key).run();
  return true;
}

export async function getAdminDashboard() {
  await ensureDatabase();
  const db = getDb();
  const [vehicleRows, enquiryRows] = await Promise.all([
    db.select().from(vehicles).where(isNull(vehicles.archivedAt)).orderBy(desc(vehicles.updatedAt)),
    db.select().from(enquiries).orderBy(desc(enquiries.createdAt)).limit(50),
  ]);
  return {
    vehicles: vehicleRows,
    enquiries: enquiryRows,
    counts: {
      available: vehicleRows.filter((v) => v.published && ["in_stock", "available_soon", "under_offer"].includes(v.availabilityStatus)).length,
      drafts: vehicleRows.filter((v) => !v.published || v.availabilityStatus === "draft").length,
      sold: vehicleRows.filter((v) => v.availabilityStatus === "sold").length,
      newEnquiries: enquiryRows.filter((e) => e.status === "new").length,
    },
  };
}

export async function getAdminVehicle(id: string) {
  await ensureDatabase();
  const db = getDb();
  const vehicle = await db.query.vehicles.findFirst({ where: eq(vehicles.id, id) });
  if (!vehicle) return null;
  const images = await db.select().from(vehicleImages).where(eq(vehicleImages.vehicleId, id)).orderBy(desc(vehicleImages.isPrimary), asc(vehicleImages.displayOrder));
  return { ...vehicle, images };
}

export async function audit(actorId: string | null, action: string, entityType: string, entityId: string, metadata: Record<string, unknown> = {}) {
  await getDb().insert(auditLogs).values({ id: crypto.randomUUID(), actorId, action, entityType, entityId, metadata: JSON.stringify(metadata), createdAt: new Date().toISOString() });
}

export async function updateEnquiry(id: string, status: Enquiry["status"], note: string | undefined, authorId: string) {
  await ensureDatabase();
  const db = getDb();
  await db.update(enquiries).set({ status, updatedAt: new Date().toISOString() }).where(eq(enquiries.id, id));
  if (note?.trim()) await db.insert(enquiryNotes).values({ id: crypto.randomUUID(), enquiryId: id, authorId, note: note.trim(), createdAt: new Date().toISOString() });
  await audit(authorId, "enquiry.updated", "enquiry", id, { status, noteAdded: Boolean(note?.trim()) });
}

export async function publicVehicleExists(id: string) {
  await ensureDatabase();
  const row = await getDb().query.vehicles.findFirst({ where: and(eq(vehicles.id, id), eq(vehicles.published, true), isNull(vehicles.archivedAt)) });
  return Boolean(row);
}
