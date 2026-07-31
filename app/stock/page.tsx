import type { Metadata } from "next";
import { PublicShell } from "@/app/components/PublicShell";
import { PageHero } from "@/app/components/PageHero";
import { listPublicVehicles } from "@/lib/data";
import { StockBrowser } from "./StockBrowser";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Current stock",
  description: "Browse currently advertised American trucks and selected vehicles from Betts Works.",
  alternates: { canonical: "/stock" },
};

export default async function StockPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const initialPage = Math.min(100, Math.max(1, Number.parseInt(page || "1", 10) || 1));
  const vehicles = await listPublicVehicles();
  return (
    <PublicShell>
      <PageHero eyebrow="American vehicle inventory" title="Current stock" intro="Browse vehicles currently advertised through Betts Works. Each listing identifies the vehicle, specifications, availability and selling dealer. Availability remains subject to confirmation." />
      <section className="section shell"><StockBrowser vehicles={vehicles} initialPage={initialPage} /></section>
    </PublicShell>
  );
}
