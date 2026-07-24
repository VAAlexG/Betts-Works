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
          <p className="hero-lede">Shop the exact American trucks imported, converted and held by SCD Direct—with Betts Works as your selling dealer.</p>
          <div className="hero-actions"><Link href="/stock" className="button">View current stock <span aria-hidden="true">→</span></Link><Link href="/contact" className="button button-secondary">Talk to Betts Works</Link><Link href="/scd-direct" className="button button-ghost">How the specialist pathway works <span aria-hidden="true">↗</span></Link></div>
          <div className="hero-proof"><span>Exact SCD Direct stock</span><span>Betts Works dealer service</span><span>Source images & specifications</span></div>
        </div>
      </section>

      <section className="section shell" aria-labelledby="featured-heading">
        <div className="section-heading"><div><p className="eyebrow">Featured SCD inventory</p><h2 id="featured-heading">The exact trucks available now.</h2></div><Link className="text-link" href="/stock">View all stock →</Link></div>
        {featured.length ? <div className="vehicle-grid">{featured.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}</div> : <div className="empty-state"><p className="eyebrow">Inventory update</p><h2>Genuine stock is being prepared.</h2><p className="muted">No public vehicles are currently listed. Contact Betts Works to discuss what you are looking for.</p><Link href="/contact" className="button">Start an enquiry</Link></div>}
      </section>

      <section className="section section-dark"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Why Betts Works</p><h2>A focused dealership experience.</h2></div><p>Useful information, accurate availability and a clear line between the dealer and specialist conversion provider.</p></div><div className="benefit-grid">
        {[["01","Exact vehicles","Every listing corresponds to a current SCD Direct stock record."],["02","Source details","Prices, VINs, specifications and photography come from the matching vehicle."],["03","Dealer service","Deal directly with Betts Works about the advertised vehicle."],["04","Australian enquiries","A local dealer point of contact for Australian prospective buyers."],["05","Specialist pathway","SCD Direct imports, converts and physically holds the vehicles."]].map(([number,title,copy])=><div className="benefit" key={number}><span className="benefit-number">{number}</span><h3>{title}</h3><p>{copy}</p></div>)}
      </div></div></section>

      <section className="section shell"><div className="relationship"><div className="relationship-mark"><Image unoptimized src="/brand/betts-works-full-badge-dark.png" width={460} height={392} alt="Betts Works — Australian owned car dealer" /></div><div><p className="eyebrow">Two specialist roles</p><h2>Betts Works sells. SCD Direct supplies.</h2><p>{siteConfig.relationship}</p><p className="legal-line">Each Betts Works listing retains the matching SCD Direct stock number, source photography, vehicle details and price basis.</p><a className="button button-secondary" href="https://scddirect.com.au/vehicle-inventory/" target="_blank" rel="noopener noreferrer">View SCD inventory <span aria-hidden="true">↗</span></a></div></div></section>
      <section className="cta-band"><div className="shell"><h2>Tell us what you want to drive.</h2><Link className="button" href="/contact">Start an enquiry <span aria-hidden="true">→</span></Link></div></section>
    </PublicShell>
  );
}
