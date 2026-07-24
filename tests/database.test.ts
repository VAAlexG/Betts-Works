import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { DatabaseSync } from "node:sqlite";

function database() {
  const db = new DatabaseSync(":memory:");
  db.exec("PRAGMA foreign_keys = ON");
  const migration = readFileSync(new URL("../drizzle/0000_petite_eternals.sql", import.meta.url), "utf8").replaceAll("--> statement-breakpoint", "");
  db.exec(migration);
  return db;
}

test("migration creates the relational inventory model", () => {
  const db = database();
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all().map((row) => row.name);
  for (const table of ["vehicles","vehicle_images","features","vehicle_features","enquiries","enquiry_notes","admin_users","audit_logs","vehicle_slug_redirects","rate_limits"]) assert.ok(tables.includes(table));
});

test("migration publishes the exact captured SCD inventory", () => {
  const db = database();
  const vehicles = db.prepare("SELECT COUNT(*) AS count FROM vehicles WHERE id LIKE 'scd-%' AND published = 1 AND is_sample = 0").get() as { count: number };
  const images = db.prepare("SELECT COUNT(*) AS count FROM vehicle_images WHERE vehicle_id LIKE 'scd-%'").get() as { count: number };
  const sourceImage = db.prepare("SELECT storage_key FROM vehicle_images WHERE vehicle_id = 'scd-3981809' AND is_primary = 1").get() as { storage_key: string };
  assert.equal(vehicles.count, 15);
  assert.equal(images.count, 60);
  assert.match(sourceImage.storage_key, /^https:\/\/cdn\.images\.stock\.i-motor\.net\.au\/vehicles\/large\//);
});

test("public inventory predicate excludes drafts, sold and archived records", () => {
  const db = database();
  const insert = db.prepare("INSERT INTO vehicles (id,slug,stock_number,year,make,model,variant,headline,short_description,full_description,price_display,price_qualifier,availability_status,conversion_provider,featured,published,is_sample,created_at,updated_at,archived_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
  const row=(id:string,status:string,published:number,archived:string|null=null)=>[id,id,id,2025,"Sample","Truck","","Headline","Short","Full","POA","POA",status,"SCD Direct",0,published,1,"2026-01-01","2026-01-01",archived];
  insert.run(...row("available","in_stock",1)); insert.run(...row("draft","draft",0)); insert.run(...row("sold","sold",1)); insert.run(...row("archived","in_stock",1,"2026-01-02"));
  const result = db.prepare("SELECT id FROM vehicles WHERE id IN ('available','draft','sold','archived') AND published = 1 AND archived_at IS NULL AND availability_status IN ('in_stock','available_soon','under_offer')").all();
  assert.deepEqual(result.map((r)=>r.id), ["available"]);
});

test("an enquiry survives notification failure state", () => {
  const db = database();
  db.prepare("INSERT INTO enquiries (id,name,email,phone,state_or_postcode,preferred_contact_method,message,marketing_consent,status,source_page,notification_status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)").run("enq-1","Alex","alex@example.com","0400000000","QLD","phone","Please call",0,"new","/contact","pending","2026-01-01","2026-01-01");
  db.prepare("UPDATE enquiries SET notification_status = 'failed' WHERE id = ?").run("enq-1");
  const row = db.prepare("SELECT id, notification_status FROM enquiries WHERE id = ?").get("enq-1");
  assert.equal(row?.id, "enq-1");
  assert.equal(row?.notification_status, "failed");
});
