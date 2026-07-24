import rawInventory from "./scd-inventory.json";

export const SCD_INVENTORY_CAPTURED_AT = "2026-07-24T00:00:00+10:00";
export const SCD_INVENTORY_URL = "https://scddirect.com.au/vehicle-inventory/";

type RawVehicle = (typeof rawInventory)[number];

const keyLabels = ["Year", "Body", "Colour", "Transmission", "Engine", "Kilometres", "Stock #", "Power", "Drive Type", "Fuel System", "VIN #", "Reg #"] as const;
const detailLabels = ["Model Year", "Vehicle Description", "Transmission", "Engine", "Doors", "Seats", "Exterior Colour", "Interior Colour", "Stock No."] as const;

function parseLabels(text: string, prefix: string, labels: readonly string[]) {
  const body = text.startsWith(prefix) ? text.slice(prefix.length) : text;
  const positions = labels.map((label) => ({ label, index: body.indexOf(label) })).filter((item) => item.index >= 0);
  return Object.fromEntries(positions.map((item, index) => {
    const next = positions[index + 1]?.index ?? body.length;
    return [item.label, body.slice(item.index + item.label.length, next).trim()];
  }));
}

function formatDealerComments(value: string) {
  return value
    .replace(/([.!?])(?=[A-Z])/g, "$1\n\n")
    .replace(/(Highlights:|Key Features:|AEV Upfit Package:|Why it stands out:|Why you’ll love it:)/g, "\n\n$1\n")
    .replace(/\s*\*\s*/g, "\n• ")
    .replace(/\s+-\s+(?=[A-Z0-9])/g, "\n• ")
    .replace(/\s*(Includes RHD Conversion and (?:Australian )?Compliance\.?)/gi, "\n\n$1")
    .replace(/\s*(Professionally prepared[^.]*\.)/gi, "\n\n$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function featureList(raw: RawVehicle) {
  const copy = raw.dealerComments;
  const features = ["6.7L Power Stroke turbo diesel", "Automatic transmission", "4x4 drivetrain", "Right-hand-drive conversion by SCD Direct", "Australian compliance included"];
  const conditional: Array<[RegExp, string]> = [
    [/AEV/i, "AEV off-road upfit"],
    [/Carli/i, "Carli suspension upgrade"],
    [/360 degree|360-degree/i, "360-degree camera"],
    [/Adaptive Cruise/i, "Adaptive cruise control"],
    [/Blind-Spot/i, "Blind-spot monitoring"],
    [/Bang & Olufsen|B&O|B O Unleashed/i, "B&O premium audio"],
    [/heated\/ventilated/i, "Heated and ventilated front seats"],
    [/moonroof|panoramic roof/i, "Panoramic roof"],
    [/Black Appearance Package/i, "Black Appearance Package"],
    [/Warn 16\.5/i, "Warn 16.5ti-s winch"],
    [/40-inch/i, "40-inch BFGoodrich tyres"],
    [/37-inch|37\" tyres/i, "37-inch tyres"],
    [/Super Single/i, "Super Single conversion"],
  ];
  for (const [pattern, label] of conditional) if (pattern.test(copy)) features.push(label);
  return features;
}

export const scdInventory = rawInventory.map((raw, index) => {
  const key = parseLabels(raw.keyFeaturesText, "Key Features and Details", keyLabels);
  const details = parseLabels(raw.carDetailsText, "Car Details", detailLabels);
  const title = raw.title.match(/^(\d{4})\s+(\S+)\s+(.+)$/);
  if (!title) throw new Error(`Invalid SCD vehicle title: ${raw.title}`);
  const year = Number(title[1]);
  const make = title[2];
  const model = title[3];
  const variant = raw.variant.replace(/\s*\(No Series\)\s*$/, "");
  const stockNumber = key["Stock #"] || details["Stock No."] || raw.stockId;
  const price = Number(raw.price.replace(/[^0-9]/g, ""));
  const exterior = details["Exterior Colour"] || key.Colour || "";
  const interior = details["Interior Colour"] || "";
  const odometer = Number((key.Kilometres || "").replace(/[^0-9]/g, "")) || null;
  const id = `scd-${raw.stockId}`;
  return {
    id,
    sourceId: raw.stockId,
    sourceUrl: raw.sourceHref,
    slug: `${year}-${make}-${model}-${variant}-${stockNumber}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    stockNumber,
    year,
    make,
    model,
    variant,
    headline: `${exterior} ${variant} sourced, converted and held by SCD Direct`,
    shortDescription: `This exact ${year} ${make} ${model} is imported, converted and held by SCD Direct and offered for sale by Betts Works.`,
    fullDescription: formatDealerComments(raw.dealerComments),
    priceCents: price * 100,
    priceDisplay: raw.price,
    priceQualifier: "Excluding government charges and on-road costs.",
    availabilityStatus: "in_stock" as const,
    odometerKm: odometer,
    bodyType: key.Body || "Ute",
    fuelType: "Diesel",
    engine: "6.7L V8 Power Stroke turbo diesel",
    power: key.Power ? `${key.Power} kW (SCD listing)` : null,
    torque: /1200lb-ft/i.test(raw.dealerComments) ? "1,200 lb-ft (SCD listing)" : null,
    transmission: key.Transmission || details.Transmission || "Automatic",
    drivetrain: key["Drive Type"] || "4X4",
    exteriorColour: exterior,
    interiorColour: interior,
    seatingCapacity: Number(details.Seats) || 5,
    towingCapacity: null,
    vin: key["VIN #"] || null,
    publicVin: Boolean(key["VIN #"]),
    registrationStatus: key["Reg #"] && key["Reg #"] !== "—" ? key["Reg #"] : null,
    complianceStatus: "RHD conversion and Australian compliance included, per SCD Direct listing.",
    conversionProvider: "SCD Direct",
    location: "Held by SCD Direct, North Eagle Farm, QLD",
    featured: ["3981809", "4013119", "4031936"].includes(raw.stockId),
    published: true,
    publishedAt: SCD_INVENTORY_CAPTURED_AT,
    isSample: false,
    createdAt: SCD_INVENTORY_CAPTURED_AT,
    updatedAt: SCD_INVENTORY_CAPTURED_AT,
    archivedAt: null,
    features: featureList(raw),
    images: raw.images.map((url, imageIndex) => ({
      id: `${id}-image-${imageIndex + 1}`,
      storageKey: url.replace("/medium/", "/large/"),
      altText: `${year} ${make} ${model} ${variant} stock ${stockNumber}, photo ${imageIndex + 1} of ${raw.images.length}`,
      width: 1600,
      height: 1067,
      displayOrder: imageIndex,
      isPrimary: imageIndex === 0,
    })),
    sortOrder: index,
  };
});

export function getScdSourceUrl(vehicleId: string) {
  return scdInventory.find((vehicle) => vehicle.id === vehicleId)?.sourceUrl;
}
