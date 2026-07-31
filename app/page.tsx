import Link from "next/link";
import { PublicShell } from "./components/PublicShell";
import { PriceFootnote } from "./components/PriceFootnote";
import { VehicleCard } from "./components/VehicleCard";
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
        <div className="shell hero-content">
          <p className="eyebrow">Independent Australian vehicle dealer</p>
          <h1>American trucks.<span>Australian roads.</span></h1>
          <p className="brand-script">Built to be driven.</p>
          <p className="hero-lede">Explore selected American vehicles for sale, or ask Betts Works to source the exact make, model and specification you want.</p>
          <div className="hero-actions"><Link href="/stock" className="button">View current stock <span aria-hidden="true">→</span></Link><Link href="/contact" className="button button-secondary">Make an enquiry <span aria-hidden="true">→</span></Link></div>
          <div className="hero-proof"><span>Right-hand-drive converted</span><span>ADR compliant</span><span>Sourced to your spec</span></div>
        </div>
      </section>

      <section className="section shell" aria-labelledby="featured-heading">
        <div className="section-heading"><div><p className="eyebrow">Featured inventory</p><h2 id="featured-heading">Vehicles available now.</h2></div><Link className="text-link" href="/stock">View all stock →</Link></div>
        {featured.length ? <><div className="vehicle-grid">{featured.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}</div><PriceFootnote /></> : <div className="empty-state"><p className="eyebrow">Inventory update</p><h2>Genuine stock is being prepared.</h2><p className="muted">No public vehicles are currently listed. Contact Betts Works to discuss what you are looking for.</p><Link href="/contact" className="button">Start an enquiry →</Link></div>}
      </section>

      <section className="section section-dark"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Why Betts Works</p><h2>Built around the buyer.</h2></div><p>Direct service, specialist support and clear information from the first search to the handover.</p></div><div className="benefit-grid">
        {[["01","Sourced to your spec","Tell us the make, model and options you want; we search overseas for a suitable vehicle."],["02","Professionally converted","SCD American Vehicles (SCD), our specialist right-hand-drive conversion partner, handles conversion and applicable Australian compliance."],["03","One point of contact","Deal directly with Tyson from your first enquiry through to delivery coordination."],["04","Clear, honest listings","Every vehicle identifies its specifications, availability and selling dealer."]].map(([number,title,copy])=><div className="benefit" key={number}><span className="benefit-number">{number}</span><h3>{title}</h3><p>{copy}</p></div>)}
      </div></div></section>

      <section className="section shell" aria-labelledby="process-heading">
        <div className="section-heading"><div><p className="eyebrow">Your specialist pathway</p><h2 id="process-heading">From first choice to Australian roads.</h2></div><p>SCD American Vehicles (SCD) is our specialist right-hand-drive conversion and compliance partner.</p></div>
        <ol className="process-grid">
          <li><span>01</span><div><h3>You choose</h3><p>Browse current stock or ask us to start a vehicle sourcing search.</p></div></li>
          <li><span>02</span><div><h3>We source &amp; sell</h3><p>Betts Works handles the search, quote and vehicle sale as your dealer.</p></div></li>
          <li><span>03</span><div><h3>SCD converts &amp; complies</h3><p>Right-hand-drive conversion and applicable ADR compliance are completed where required.</p></div></li>
          <li><span>04</span><div><h3>You drive</h3><p>Delivery, registration pathway and final handover details are confirmed with you.</p></div></li>
        </ol>
        <Link className="text-link process-link" href="/scd-direct">Full details on the specialist pathway →</Link>
      </section>
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
      <section className="section shell" aria-labelledby="stories-heading">
        <div className="section-heading"><div><p className="eyebrow">Customer stories</p><h2 id="stories-heading">Social proof, without the sales pitch.</h2></div><p>Verified customer feedback and delivery photos will be added here as Betts Works completes its first handovers.</p></div>
        <div className="social-proof-grid">
          {/* TODO: Replace these transparent placeholders with verified customer quotes after consent. */}
          <article className="testimonial-placeholder"><span>Customer review</span><blockquote>Verified customer feedback coming soon.</blockquote><p>We will only publish genuine feedback with customer permission.</p></article>
          <article className="testimonial-placeholder"><span>Customer review</span><blockquote>Your experience matters.</blockquote><p>Future reviews will cover communication, sourcing, conversion coordination and delivery.</p></article>
          {/* TODO: Replace with real Betts Works delivery photography when available. */}
          <aside className="delivery-slot"><span>Recently delivered</span><h3>Delivery gallery coming soon.</h3><p>Real customer delivery photos will appear here once available and approved for publication.</p></aside>
        </div>
      </section>
      <section className="cta-band"><div className="shell"><h2>Tell us what you want to drive.</h2><Link className="button" href="/contact">Start an enquiry <span aria-hidden="true">→</span></Link></div></section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dealerSchema).replace(/</g, "\\u003c") }} />
    </PublicShell>
  );
}
