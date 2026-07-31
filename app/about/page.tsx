import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/app/components/PageHero";
import { PublicShell } from "@/app/components/PublicShell";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description: "Meet Tyson Betts and learn how Betts Works combines dealership service with hands-on American vehicle conversion-industry experience.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="About Betts Works"
        title="Experience behind the business."
        intro="Betts Works is an independent Australian vehicle dealer specialising in sourcing American vehicles from overseas and bringing them to the Australian market."
      />

      <section className="section shell">
        <div className="content-grid">
          <div className="prose prose-large">
            <p className="eyebrow">Built on hands-on experience</p>
            <h2>Knowledge from sourcing through to delivery.</h2>
            <p>With five years of hands-on experience in the American vehicle conversion industry, director Tyson Betts understands the process behind every vehicle—from overseas sourcing and selection through to conversion and final delivery.</p>
            <p>Vehicles sourced by Betts Works are entrusted to SCD American Vehicles for professional Australian conversion. Tyson also works directly within SCD’s conversion operation, manufacturing and completing dashboard components used throughout the conversion process.</p>
            <p>This combination of dealership service and genuine conversion-industry experience gives customers one knowledgeable point of contact throughout their vehicle journey.</p>
          </div>
          <div className="relationship-mark relationship-mark-logo about-logo">
            <Image unoptimized src="/brand/betts-works-logo.png" width={1280} height={1280} alt="Betts Works car dealer logo" />
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="shell content-grid">
          <div className="prose">
            <p className="eyebrow">Our role</p>
            <h2>The dealer you deal with.</h2>
            <p>Betts Works manages the sourcing, advertising and sale of American vehicles for Australian customers. We provide clear vehicle information, honest availability updates and direct, personal communication from your initial enquiry through to delivery.</p>
            <p>Once a vehicle is purchased overseas, it is supplied to SCD American Vehicles to complete the required Australian conversion work. SCD brings extensive specialist experience to the conversion process, while Betts Works remains your dealer and primary point of contact.</p>
            <p>Because director Tyson Betts also works hands-on within SCD’s conversion operation, Betts Works offers something different from an ordinary dealership: real knowledge of the vehicles, the conversion process and the workmanship involved.</p>
            <Link className="button" href="/stock">Browse current stock →</Link>
          </div>
          <aside className="callout">
            <span className="approval-label">Direct, knowledgeable service</span>
            <h2>One point of contact.</h2>
            <p className="muted">From an advertised vehicle to a specific overseas search, Tyson remains your primary contact while specialist providers complete the work required to prepare the vehicle for Australia.</p>
          </aside>
        </div>
      </section>

      <section className="section shell">
        <div className="director-panel">
          <div>
            <p className="eyebrow">About the director</p>
            <h2>Experience behind the business.</h2>
          </div>
          <div className="prose">
            <p>Betts Works was founded and is directed by Tyson Betts, a qualified engineering tradesman with five years of experience working in the American vehicle conversion industry.</p>
            <p>Tyson works directly with SCD American Vehicles, specialising in the manufacture and completion of dashboard components for converted American vehicles. His role has given him firsthand experience with the workmanship, attention to detail and technical processes required to prepare these vehicles for Australian roads.</p>
            <p>Betts Works was created to combine this technical knowledge with a straightforward and personal vehicle-buying experience. Tyson understands that purchasing an imported American vehicle is a major decision, so his focus is on clear communication, honest information and helping each customer find the right vehicle for their needs.</p>
            <p>When you deal with Betts Works, you are dealing directly with someone who understands how these vehicles are sourced, converted and prepared—not simply someone selling them.</p>
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="shell">
          <div className="section-heading"><div><p className="eyebrow">Business details</p><h2>Clear, accountable dealership information.</h2></div><p>Contact Tyson to arrange an appointment or request a written vehicle quote.</p></div>
          <dl className="compliance-panel">
            <div><dt>Legal entity</dt><dd>{siteConfig.legalEntity}</dd></div>
            <div><dt>ABN</dt><dd>{siteConfig.abn}</dd></div>
            <div><dt>QLD motor dealer licence</dt><dd>{siteConfig.motorDealerLicence}</dd></div>
            <div><dt>Trading hours</dt><dd>{siteConfig.hours}</dd></div>
          </dl>
        </div>
      </section>
    </PublicShell>
  );
}
