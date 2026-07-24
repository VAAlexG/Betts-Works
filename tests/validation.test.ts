import assert from "node:assert/strict";
import test from "node:test";
import { enquirySchema, formatAud, normaliseSlug, vehicleSchema } from "../lib/validation";

test("accepts a minimal valid enquiry", () => {
  const result = enquirySchema.safeParse({ name:"Alex Buyer",email:"alex@example.com",phone:"+61 400 000 000",stateOrPostcode:"QLD",preferredContactMethod:"phone",message:"Please call about the vehicle.",consent:true,marketingConsent:false,sourcePage:"/contact",company:"" });
  assert.equal(result.success, true);
});

test("rejects honeypot and malformed contact details", () => {
  const result = enquirySchema.safeParse({ name:"Bot",email:"not-an-email",phone:"123",stateOrPostcode:"QLD",preferredContactMethod:"phone",message:"Spam",consent:true,company:"filled" });
  assert.equal(result.success, false);
});

test("keeps draft and availability values controlled", () => {
  const base = { year:2025,make:"Sample",model:"Truck",variant:"",stockNumber:"TEST-1",slug:"sample-truck",headline:"Sample headline",shortDescription:"Sample description",fullDescription:"Longer sample description",priceCents:null,priceDisplay:"POA",priceQualifier:"Price on application",availabilityStatus:"draft",featured:false,published:false };
  assert.equal(vehicleSchema.safeParse(base).success, true);
  assert.equal(vehicleSchema.safeParse({ ...base, availabilityStatus:"maybe" }).success, false);
});

test("formats Australian currency and safe slugs", () => {
  assert.equal(formatAud(18990000), "$189,900");
  assert.equal(normaliseSlug("2025 RAM 2500 — Laramie"), "2025-ram-2500-laramie");
});
