import Link from "next/link";
import Image from "next/image";
import { PublicShell } from "./components/PublicShell";
import { VehicleCard } from "./components/VehicleCard";
import { VehicleMedia } from "./components/VehicleMedia";
import { listPublicVehicles } from "@/lib/data";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function Home() {
  const featured = (await listPublicVehicles({ featured: true })).slice(0, 3);
  const dealerSchema = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "@id": `${siteConfig.url}/#dealer`,
    name: siteConfig.name,
    legalName: siteConfig.legalEntity,
    url: siteConfig.url,
    image: `${siteConfig.url}/og.png`,
    telephone: "+61451461705",
    email: siteConfig.emailDisplay,
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "110 Dales Road",
      addressLocality: "Kobble Creek",
      addressRegion: "QLD",
      postalCode: "4520",
      addressCountry: "AU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.latitude,
      longitude: siteConfig.longitude,
    },
    openingHours: "By appointment",
    areaServed: { "@type": "Country", name: "Australia" },
    identifier: { "@type": "PropertyValue", name: "ABN", value: siteConfig.abn },
  };
  return (
    <PublicShell>
      <section className="hero">
        <span className="hero-road" aria-hidden="true" />
        {featured[0] && <div className="hero-stock-image" aria-hidden="true"><VehicleMedia vehicle={featured[0]} image={featured[0].images?.[0]} priority /></div>}
        <div className="shell hero-content">
          <p className="eyebrow">Independent Australian vehicle dealer</p>
          <h1>American trucks.<span>Australian roads.</span></h1>
          <p className="brand-script">Built to be driven.</p>
          <p className="hero-lede">Explore selected American vehicles for sale, or ask Betts Works to source the exact make, model and specification you want.</p>
          <div className="hero-actions"><Link href="/stock" className="button">View current stock <span aria-hidden="true">→</span></Link><Link href="/contact" className="button button-secondary">Talk to Betts Works</Link><Link href="/scd-direct" className="button button-ghost">How the specialist pathway works <span aria-hidden="true">↗</span></Link></div>
          <div className="hero-proof"><span>Selected SCD-supplied stock</span><span>Betts Works-owned inventory</span><span>Personalised vehicle sourcing</span></div>
        </div>
      </section>

      <section className="section shell" aria-labelledby="featured-heading">
        <div className="section-heading"><div><p className="eyebrow">Featured inventory</p><h2 id="featured-heading">Vehicles available now.</h2></div><Link className="text-link" href="/stock">View all stock →</Link></div>
        {featured.length ? <div className="vehicle-grid">{featured.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}</div> : <div className="empty-state"><p className="eyebrow">Inventory update</p><h2>Genuine stock is being prepared.</h2><p className="muted">No public vehicles are currently listed. Contact Betts Works to discuss what you are looking for.</p><Link href="/contact" className="button">Start an enquiry</Link></div>}
      </section>

      <section className="section section-dark"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Why Betts Works</p><h2>A focused dealership experience.</h2></div><p>Useful information, accurate availability and a clear line between the dealer and specialist conversion provider.</p></div><div className="benefit-grid">
        {[["01","Selected vehicles","Browse selected vehicles supplied by SCD and clearly identified in each listing."],["02","Dealer inventory","Betts Works may purchase and hold vehicles for direct dealership sale."],["03","Personal sourcing","Ask us to search overseas for your preferred make, model and specification."],["04","One point of contact","Deal directly with Tyson from your first enquiry through to delivery."],["05","Specialist conversion","Vehicles requiring Australian conversion are entrusted to SCD."]].map(([number,title,copy])=><div className="benefit" key={number}><span className="benefit-number">{number}</span><h3>{title}</h3><p>{copy}</p></div>)}
      </div></div></section>

      <section className="section shell"><div className="relationship"><div className="relationship-mark relationship-mark-logo"><Image unoptimized src="/brand/betts-works-logo.png" width={1280} height={1280} alt="Betts Works car dealer — importing cars into Australia" /></div><div><p className="eyebrow">Multiple ways to buy</p><h2>Betts Works sells, sources and delivers.</h2><p>{siteConfig.relationship}</p><p className="legal-line">Each vehicle listing identifies the relevant vehicle, specifications, availability and selling dealer. Availability is always subject to confirmation.</p><Link className="button button-secondary" href="/scd-direct">Explore your options <span aria-hidden="true">→</span></Link></div></div></section>
      <section className="section section-dark" aria-labelledby="trust-heading">
        <div className="shell">
          <div className="section-heading"><div><p className="eyebrow">A clear buying pathway</p><h2 id="trust-heading">Confidence at every step.</h2></div><p>Vehicle-specific details are confirmed in writing before purchase.</p></div>
          <div className="trust-grid">
            <article className="trust-card"><h3>Direct contact</h3><p>Deal directly with Tyson from initial enquiry through sourcing, quote and delivery coordination.</p></article>
            <article className="trust-card"><h3>Specialist conversion</h3><p>Vehicles requiring Australian conversion are entrusted to SCD for right-hand-drive conversion and applicable compliance work.</p></article>
            <article className="trust-card"><h3>Delivery coordination</h3><p>Collection and delivery options across Australia are discussed and itemised for the individual vehicle and destination.</p></article>
            <article className="trust-card"><h3>Written terms</h3><p>Price basis, on-road costs and vehicle-specific warranty information are provided in writing where applicable. Australian Consumer Law rights are unaffected.</p></article>
          </div>
          <p className="finance-guidance">Finance or third-party provider introductions and government, registration, insurance, delivery and other on-road costs are handled on enquiry and confirmed in the written quote.</p>
        </div>
      </section>
      <section className="cta-band"><div className="shell"><h2>Tell us what you want to drive.</h2><Link className="button" href="/contact">Start an enquiry <span aria-hidden="true">→</span></Link></div></section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dealerSchema).replace(/</g, "\\u003c") }} />
    </PublicShell>
  );
}
