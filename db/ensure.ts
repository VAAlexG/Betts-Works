import { getD1 } from "./index";
import { scdInventory } from "./scd-inventory";

const statements = [
  `CREATE TABLE IF NOT EXISTS vehicles (id TEXT PRIMARY KEY NOT NULL, slug TEXT NOT NULL UNIQUE, stock_number TEXT NOT NULL UNIQUE, year INTEGER NOT NULL, make TEXT NOT NULL, model TEXT NOT NULL, variant TEXT NOT NULL DEFAULT '', headline TEXT NOT NULL, short_description TEXT NOT NULL, full_description TEXT NOT NULL, price_cents INTEGER, price_display TEXT NOT NULL DEFAULT 'POA', price_qualifier TEXT NOT NULL DEFAULT 'Price on application', availability_status TEXT NOT NULL DEFAULT 'draft', odometer_km INTEGER, body_type TEXT, fuel_type TEXT, engine TEXT, power TEXT, torque TEXT, transmission TEXT, drivetrain TEXT, exterior_colour TEXT, interior_colour TEXT, seating_capacity INTEGER, towing_capacity TEXT, vin TEXT, public_vin INTEGER NOT NULL DEFAULT 0, registration_status TEXT, compliance_status TEXT, conversion_provider TEXT NOT NULL DEFAULT 'SCD Direct', location TEXT, featured INTEGER NOT NULL DEFAULT 0, published INTEGER NOT NULL DEFAULT 0, published_at TEXT, is_sample INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, archived_at TEXT)`,
  `CREATE INDEX IF NOT EXISTS vehicles_public_idx ON vehicles (published, archived_at, availability_status)`,
  `CREATE TABLE IF NOT EXISTS vehicle_images (id TEXT PRIMARY KEY NOT NULL, vehicle_id TEXT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE, storage_key TEXT NOT NULL, alt_text TEXT NOT NULL, width INTEGER, height INTEGER, display_order INTEGER NOT NULL DEFAULT 0, is_primary INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS vehicle_images_vehicle_idx ON vehicle_images (vehicle_id, display_order)`,
  `CREATE TABLE IF NOT EXISTS features (id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL UNIQUE, category TEXT NOT NULL DEFAULT 'General')`,
  `CREATE TABLE IF NOT EXISTS vehicle_features (vehicle_id TEXT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE, feature_id TEXT NOT NULL REFERENCES features(id) ON DELETE CASCADE, PRIMARY KEY (vehicle_id, feature_id))`,
  `CREATE TABLE IF NOT EXISTS enquiries (id TEXT PRIMARY KEY NOT NULL, vehicle_id TEXT REFERENCES vehicles(id) ON DELETE SET NULL, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL, state_or_postcode TEXT NOT NULL, preferred_contact_method TEXT NOT NULL, message TEXT NOT NULL, marketing_consent INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'new', source_page TEXT NOT NULL, notification_status TEXT NOT NULL DEFAULT 'pending', created_at TEXT NOT NULL, updated_at TEXT NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS enquiries_status_idx ON enquiries (status, created_at)`,
  `CREATE TABLE IF NOT EXISTS admin_users (id TEXT PRIMARY KEY NOT NULL, external_auth_id TEXT, email TEXT NOT NULL UNIQUE, role TEXT NOT NULL DEFAULT 'editor', active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS enquiry_notes (id TEXT PRIMARY KEY NOT NULL, enquiry_id TEXT NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE, author_id TEXT NOT NULL REFERENCES admin_users(id), note TEXT NOT NULL, created_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS audit_logs (id TEXT PRIMARY KEY NOT NULL, actor_id TEXT REFERENCES admin_users(id), action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT NOT NULL, metadata TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS audit_entity_idx ON audit_logs (entity_type, entity_id)`,
  `CREATE TABLE IF NOT EXISTS vehicle_slug_redirects (old_slug TEXT PRIMARY KEY NOT NULL, vehicle_id TEXT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE, created_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY NOT NULL, window_started_at INTEGER NOT NULL, count INTEGER NOT NULL DEFAULT 0)`,
];

let ready: Promise<void> | null = null;

export function ensureDatabase() {
  ready ??= (async () => {
    const d1 = getD1();
    await d1.batch(statements.map((statement) => d1.prepare(statement)));
    if (process.env.NODE_ENV !== "production") await syncScdInventory(d1);
  })();
  return ready;
}

async function runInBatches(d1: D1Database, pending: D1PreparedStatement[], size = 50) {
  for (let index = 0; index < pending.length; index += size) await d1.batch(pending.slice(index, index + size));
}

async function syncScdInventory(d1: D1Database) {
  const now = new Date().toISOString();
  await d1.batch([
    d1.prepare("UPDATE vehicles SET published = 0, archived_at = ? WHERE is_sample = 1 AND archived_at IS NULL").bind(now),
    d1.prepare("UPDATE vehicles SET published = 0, archived_at = ? WHERE id LIKE 'scd-%'").bind(now),
  ]);

  const vehicleSql = `INSERT INTO vehicles (id, slug, stock_number, year, make, model, variant, headline, short_description, full_description, price_cents, price_display, price_qualifier, availability_status, odometer_km, body_type, fuel_type, engine, power, torque, transmission, drivetrain, exterior_colour, interior_colour, seating_capacity, towing_capacity, vin, public_vin, registration_status, compliance_status, conversion_provider, location, featured, published, published_at, is_sample, created_at, updated_at, archived_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET slug = excluded.slug, stock_number = excluded.stock_number, year = excluded.year, make = excluded.make, model = excluded.model, variant = excluded.variant, headline = excluded.headline, short_description = excluded.short_description, full_description = excluded.full_description, price_cents = excluded.price_cents, price_display = excluded.price_display, price_qualifier = excluded.price_qualifier, availability_status = excluded.availability_status, odometer_km = excluded.odometer_km, body_type = excluded.body_type, fuel_type = excluded.fuel_type, engine = excluded.engine, power = excluded.power, torque = excluded.torque, transmission = excluded.transmission, drivetrain = excluded.drivetrain, exterior_colour = excluded.exterior_colour, interior_colour = excluded.interior_colour, seating_capacity = excluded.seating_capacity, towing_capacity = excluded.towing_capacity, vin = excluded.vin, public_vin = excluded.public_vin, registration_status = excluded.registration_status, compliance_status = excluded.compliance_status, conversion_provider = excluded.conversion_provider, location = excluded.location, featured = excluded.featured, published = excluded.published, published_at = excluded.published_at, is_sample = excluded.is_sample, updated_at = excluded.updated_at, archived_at = excluded.archived_at`;

  const vehicleStatements = scdInventory.map((vehicle) => d1.prepare(vehicleSql).bind(
    vehicle.id, vehicle.slug, vehicle.stockNumber, vehicle.year, vehicle.make, vehicle.model, vehicle.variant, vehicle.headline,
    vehicle.shortDescription, vehicle.fullDescription, vehicle.priceCents, vehicle.priceDisplay, vehicle.priceQualifier,
    vehicle.availabilityStatus, vehicle.odometerKm, vehicle.bodyType, vehicle.fuelType, vehicle.engine, vehicle.power,
    vehicle.torque, vehicle.transmission, vehicle.drivetrain, vehicle.exteriorColour, vehicle.interiorColour,
    vehicle.seatingCapacity, vehicle.towingCapacity, vehicle.vin, vehicle.publicVin ? 1 : 0, vehicle.registrationStatus,
    vehicle.complianceStatus, vehicle.conversionProvider, vehicle.location, vehicle.featured ? 1 : 0, 1,
    vehicle.publishedAt, 0, vehicle.createdAt, vehicle.updatedAt, null,
  ));
  await runInBatches(d1, vehicleStatements);

  const mediaStatements: D1PreparedStatement[] = [];
  const featureStatements: D1PreparedStatement[] = [];
  for (const vehicle of scdInventory) {
    mediaStatements.push(d1.prepare("DELETE FROM vehicle_images WHERE vehicle_id = ?").bind(vehicle.id));
    featureStatements.push(d1.prepare("DELETE FROM vehicle_features WHERE vehicle_id = ?").bind(vehicle.id));
    for (const image of vehicle.images) {
      mediaStatements.push(d1.prepare("INSERT INTO vehicle_images (id, vehicle_id, storage_key, alt_text, width, height, display_order, is_primary, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(image.id, vehicle.id, image.storageKey, image.altText, image.width, image.height, image.displayOrder, image.isPrimary ? 1 : 0, vehicle.createdAt));
    }
    for (const name of vehicle.features) {
      const featureId = `scd-feature-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
      featureStatements.push(d1.prepare("INSERT OR IGNORE INTO features (id, name, category) VALUES (?, ?, 'SCD listing')").bind(featureId, name));
      featureStatements.push(d1.prepare("INSERT OR IGNORE INTO vehicle_features (vehicle_id, feature_id) VALUES (?, ?)").bind(vehicle.id, featureId));
    }
  }
  await runInBatches(d1, mediaStatements);
  await runInBatches(d1, featureStatements);
}
