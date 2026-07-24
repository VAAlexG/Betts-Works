import { index, integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const vehicles = sqliteTable("vehicles", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull(),
  stockNumber: text("stock_number").notNull(),
  year: integer("year").notNull(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  variant: text("variant").notNull().default(""),
  headline: text("headline").notNull(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description").notNull(),
  priceCents: integer("price_cents"),
  priceDisplay: text("price_display").notNull().default("POA"),
  priceQualifier: text("price_qualifier").notNull().default("Price on application"),
  availabilityStatus: text("availability_status").notNull().default("draft"),
  odometerKm: integer("odometer_km"),
  bodyType: text("body_type"),
  fuelType: text("fuel_type"),
  engine: text("engine"),
  power: text("power"),
  torque: text("torque"),
  transmission: text("transmission"),
  drivetrain: text("drivetrain"),
  exteriorColour: text("exterior_colour"),
  interiorColour: text("interior_colour"),
  seatingCapacity: integer("seating_capacity"),
  towingCapacity: text("towing_capacity"),
  vin: text("vin"),
  publicVin: integer("public_vin", { mode: "boolean" }).notNull().default(false),
  registrationStatus: text("registration_status"),
  complianceStatus: text("compliance_status"),
  conversionProvider: text("conversion_provider").notNull().default("SCD Direct"),
  location: text("location"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  published: integer("published", { mode: "boolean" }).notNull().default(false),
  publishedAt: text("published_at"),
  isSample: integer("is_sample", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  archivedAt: text("archived_at"),
}, (table) => [
  uniqueIndex("vehicles_slug_unique").on(table.slug),
  uniqueIndex("vehicles_stock_number_unique").on(table.stockNumber),
  index("vehicles_public_idx").on(table.published, table.archivedAt, table.availabilityStatus),
]);

export const vehicleImages = sqliteTable("vehicle_images", {
  id: text("id").primaryKey(),
  vehicleId: text("vehicle_id").notNull().references(() => vehicles.id, { onDelete: "cascade" }),
  storageKey: text("storage_key").notNull(),
  altText: text("alt_text").notNull(),
  width: integer("width"),
  height: integer("height"),
  displayOrder: integer("display_order").notNull().default(0),
  isPrimary: integer("is_primary", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull(),
}, (table) => [index("vehicle_images_vehicle_idx").on(table.vehicleId, table.displayOrder)]);

export const features = sqliteTable("features", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull().default("General"),
}, (table) => [uniqueIndex("features_name_unique").on(table.name)]);

export const vehicleFeatures = sqliteTable("vehicle_features", {
  vehicleId: text("vehicle_id").notNull().references(() => vehicles.id, { onDelete: "cascade" }),
  featureId: text("feature_id").notNull().references(() => features.id, { onDelete: "cascade" }),
}, (table) => [primaryKey({ columns: [table.vehicleId, table.featureId] })]);

export const enquiries = sqliteTable("enquiries", {
  id: text("id").primaryKey(),
  vehicleId: text("vehicle_id").references(() => vehicles.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  stateOrPostcode: text("state_or_postcode").notNull(),
  preferredContactMethod: text("preferred_contact_method").notNull(),
  message: text("message").notNull(),
  marketingConsent: integer("marketing_consent", { mode: "boolean" }).notNull().default(false),
  status: text("status").notNull().default("new"),
  sourcePage: text("source_page").notNull(),
  notificationStatus: text("notification_status").notNull().default("pending"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => [index("enquiries_status_idx").on(table.status, table.createdAt)]);

export const adminUsers = sqliteTable("admin_users", {
  id: text("id").primaryKey(),
  externalAuthId: text("external_auth_id"),
  email: text("email").notNull(),
  role: text("role").notNull().default("editor"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => [uniqueIndex("admin_users_email_unique").on(table.email)]);

export const enquiryNotes = sqliteTable("enquiry_notes", {
  id: text("id").primaryKey(),
  enquiryId: text("enquiry_id").notNull().references(() => enquiries.id, { onDelete: "cascade" }),
  authorId: text("author_id").notNull().references(() => adminUsers.id),
  note: text("note").notNull(),
  createdAt: text("created_at").notNull(),
});

export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey(),
  actorId: text("actor_id").references(() => adminUsers.id),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  metadata: text("metadata").notNull().default("{}"),
  createdAt: text("created_at").notNull(),
}, (table) => [index("audit_entity_idx").on(table.entityType, table.entityId)]);

export const slugRedirects = sqliteTable("vehicle_slug_redirects", {
  oldSlug: text("old_slug").primaryKey(),
  vehicleId: text("vehicle_id").notNull().references(() => vehicles.id, { onDelete: "cascade" }),
  createdAt: text("created_at").notNull(),
});

export const rateLimits = sqliteTable("rate_limits", {
  key: text("key").primaryKey(),
  windowStartedAt: integer("window_started_at").notNull(),
  count: integer("count").notNull().default(0),
});

export type Vehicle = typeof vehicles.$inferSelect;
export type Enquiry = typeof enquiries.$inferSelect;
