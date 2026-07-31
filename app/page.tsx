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
      <section className="cta-band"><div className="shell"><h2>Tell us what you want to drive.</h2><Link className="button" href="/contact">Start an enquiry <span aria-hidden="true">→</span></Link></div></section>
    </PublicShell>
  );
}
