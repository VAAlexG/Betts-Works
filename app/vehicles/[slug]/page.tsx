import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PublicShell } from "@/app/components/PublicShell";
import { StatusBadge } from "@/app/components/StatusBadge";
import { VehicleMedia } from "@/app/components/VehicleMedia";
import { VehicleCard } from "@/app/components/VehicleCard";
import { EnquiryForm } from "@/app/components/EnquiryForm";
import { getPublicVehicle, listRelatedVehicles } from "@/lib/data";
import { formatKm } from "@/lib/validation";
import { getScdSourceUrl } from "@/db/scd-inventory";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

function absoluteUrl(path: string | undefined) {
  if (!path) return `${siteConfig.url}/og.png`;
  if (/^https:\/\//i.test(path)) return path;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

function availability(status: string) {
  if (status === "in_stock") return "https://schema.org/InStock";
  if (status === "sold") return "https://schema.org/SoldOut";
  return "https://schema.org/LimitedAvailability";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { vehicle } = await getPublicVehicle(slug);
  if (!vehicle) return { title: "Vehicle not found", robots: { index: false, follow: false } };
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.variant}`.trim();
  const image = `${siteConfig.url}/og.png`;
  return {
    title,
    description: vehicle.shortDescription,
    alternates: { canonical: `/vehicles/${vehicle.slug}` },
    openGraph: {
      type: "website",
      url: `${siteConfig.url}/vehicles/${vehicle.slug}`,
      title,
      description: vehicle.shortDescription,
      images: [{ url: image, alt: vehicle.images[0]?.altText || title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: vehicle.shortDescription,
      images: [image],
    },
  };
}

export default async function VehiclePage({ params }: Props) {
  const { slug } = await params;
  const result = await getPublicVehicle(slug);
  if (result.redirectSlug) redirect(`/vehicles/${result.redirectSlug}`);
  if (!result.vehicle) notFound();

  const v = result.vehicle;
  const related = await listRelatedVehicles(v);
  const sourceUrl = getScdSourceUrl(v.id);
  const label = `${v.year} ${v.make} ${v.model} ${v.variant}`.trim();
  const pageUrl = `${siteConfig.url}/vehicles/${v.slug}`;
  const specs = [
    ["Stock number", v.stockNumber],
    ["Odometer", formatKm(v.odometerKm)],
    ["Body", v.bodyType],
    ["Fuel", v.fuelType],
    ["Engine", v.engine],
    ["Power", v.power],
    ["Torque", v.torque],
    ["Transmission", v.transmission],
    ["Drivetrain", v.drivetrain],
    ["Exterior", v.exteriorColour],
    ["Interior", v.interiorColour],
    ["Seats", v.seatingCapacity?.toString()],
    ["Towing capacity", v.towingCapacity],
    ["Registration", v.registrationStatus],
    ["Compliance", v.complianceStatus],
    ["Conversion provider", v.conversionProvider],
    ["Location", v.location],
    ["VIN", v.publicVin ? v.vin : (v.vin ? `••••••${v.vin.slice(-6)}` : "Not published")],
  ];
  const schema = {
    "@context": "https://schema.org",
    "@type": ["Car", "Vehicle"],
    "@id": `${pageUrl}#vehicle`,
    name: label,
    description: v.shortDescription,
    url: pageUrl,
    image: v.images.map((image) => absoluteUrl(image.storageKey)),
    sku: v.stockNumber,
    vehicleIdentificationNumber: v.publicVin ? v.vin : undefined,
    mileageFromOdometer: v.odometerKm === null ? undefined : {
      "@type": "QuantitativeValue",
      value: v.odometerKm,
      unitCode: "KMT",
    },
    brand: { "@type": "Brand", name: v.make },
    model: v.model,
    vehicleModelDate: String(v.year),
    vehicleConfiguration: v.variant || undefined,
    vehicleTransmission: v.transmission || undefined,
    fuelType: v.fuelType || undefined,
    color: v.exteriorColour || undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "AUD",
      price: v.priceCents === null ? undefined : v.priceCents / 100,
      availability: availability(v.availabilityStatus),
      url: pageUrl,
      seller: { "@type": "AutoDealer", "@id": `${siteConfig.url}/#dealer`, name: siteConfig.name },
    },
  };

  return (
    <PublicShell>
      <section className="vehicle-detail shell">
        <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/stock">Stock</Link><span>/</span><span>{v.year} {v.make} {v.model}</span></nav>
        <div className="vehicle-layout">
          <div className="vehicle-gallery">
            <div className="vehicle-gallery-main"><VehicleMedia vehicle={v} image={v.images[0]} priority /></div>
            {v.images.length > 1 && <div className="vehicle-gallery-thumbs">{v.images.slice(1).map((image) => <div key={image.id}><VehicleMedia vehicle={v} image={image} /></div>)}</div>}
          </div>
          <aside className="vehicle-summary">
            <StatusBadge status={v.availabilityStatus} />
            <h1>{v.year} {v.make} {v.model}</h1>
            <p className="variant">{v.variant}</p>
            <p>{v.headline}</p>
            <p className="source-role">SCD Direct imports, converts and holds this exact vehicle. Betts Works is the dealer.</p>
            <div className="detail-price"><strong>{v.priceDisplay}</strong><span>{v.priceQualifier}</span></div>
            <p className="cost-guidance">Government charges, registration, insurance, delivery and other on-road costs are confirmed in a written quote. Finance options or third-party introductions can be discussed on enquiry and remain subject to provider assessment.</p>
            <div className="detail-actions"><a className="button" href="#enquire">Enquire about this vehicle →</a><Link className="button button-secondary" href="/contact">Contact Betts Works</Link></div>
          </aside>
        </div>
        <section className="spec-section">
          <div className="content-grid">
            <div className="prose">
              <p className="eyebrow">SCD Direct vehicle overview</p>
              <h2>Details worth knowing.</h2>
              <p className="vehicle-description">{v.fullDescription}</p>
              {v.features.length > 0 && <><h3>Features from the source listing</h3><ul className="feature-list">{v.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></>}
              {sourceUrl && <a className="text-link" href={sourceUrl} target="_blank" rel="noopener noreferrer">View the original SCD Direct vehicle record ↗</a>}
            </div>
            <dl className="spec-table">{specs.filter(([, value]) => value).map(([name, value]) => <div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}</dl>
          </div>
        </section>
        <p className="disclaimer">Betts Works is the dealer. SCD Direct imports, converts and holds the vehicle and supplies the source photography and specifications. Confirm current availability, final specification, compliance status, pricing, warranty terms and applicable government or on-road charges with Betts Works before purchase. Nothing on this website limits rights under the Australian Consumer Law.</p>
        <section id="enquire" className="spec-section">
          <div className="contact-layout"><div><p className="eyebrow">Vehicle enquiry</p><h2 className="enquiry-heading">Let’s talk about this vehicle.</h2><p className="muted">Your enquiry goes to Betts Works as the selling dealer.</p></div><EnquiryForm vehicleId={v.id} vehicleLabel={label} sourcePage={`/vehicles/${v.slug}`} /></div>
        </section>
        {related.length > 0 && <section className="spec-section"><div className="section-heading"><h2>Related available vehicles</h2><Link className="text-link" href="/stock">All stock →</Link></div><div className="vehicle-grid">{related.map((item) => <VehicleCard key={item.id} vehicle={item} />)}</div></section>}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      </section>
    </PublicShell>
  );
}
