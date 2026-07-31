import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/app/components/PageHero";
import { PublicShell } from "@/app/components/PublicShell";

export const metadata: Metadata = {
  title: "Vehicle sales, sourcing and conversion",
  description: "Learn how Betts Works sells selected vehicles, holds dealership inventory, sources vehicles overseas and works with SCD on Australian conversion.",
  alternates: { canonical: "/scd-direct" },
};

const pathways = [
  {
    number: "01",
    title: "Selected SCD-supplied vehicles",
    copy: "Betts Works advertises and sells selected vehicles supplied by SCD. SCD may also advertise and sell its own stock directly, so availability is always subject to confirmation.",
  },
  {
    number: "02",
    title: "Betts Works inventory",
    copy: "Betts Works may purchase and hold vehicles as part of our own dealership inventory. Those vehicles are advertised and sold directly by us.",
  },
  {
    number: "03",
    title: "Personalised sourcing",
    copy: "Tell us the make, model, year, specification, colour and features you want. We will use our industry knowledge and supplier network to search overseas for a suitable vehicle.",
  },
];

export default function SCDPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Multiple ways to find your next vehicle"
        title="Betts Works sells. Sources. And delivers."
        intro="Betts Works offers customers access to a wider selection of American vehicles through three dedicated sales and sourcing options."
      />

      <section className="section shell">
        <div className="pathway-grid">
          {pathways.map((pathway) => (
            <article className="pathway-card" key={pathway.number}>
              <span>{pathway.number}</span>
              <h2>{pathway.title}</h2>
              <p>{pathway.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-dark">
        <div className="shell content-grid">
          <div className="prose">
            <p className="eyebrow">Specialist Australian conversion</p>
            <h2>A clear role for SCD.</h2>
            <p>Vehicles requiring Australian conversion will be entrusted to SCD, which is responsible for the professional right-hand-drive conversion and applicable Australian compliance work.</p>
            <p>Whether you choose a vehicle supplied by SCD, purchase from Betts Works’ own stock or ask us to locate a specific vehicle, we aim to provide clear communication and support throughout the process—from the initial search through to conversion and delivery.</p>
          </div>
          <aside className="callout">
            <span className="approval-label">Availability disclosure</span>
            <h2>Clear listing information.</h2>
            <p className="muted">Each vehicle listing identifies the relevant vehicle, specifications, availability and selling dealer. Vehicles advertised by SCD may also be available for purchase directly through SCD, so availability remains subject to confirmation.</p>
            <div className="button-stack">
              <Link className="button" href="/stock">View Betts Works stock →</Link>
              <a className="button button-secondary" href="https://scddirect.com.au/vehicle-inventory/" target="_blank" rel="noopener noreferrer">View SCD inventory ↗</a>
            </div>
          </aside>
        </div>
      </section>
    </PublicShell>
  );
}
