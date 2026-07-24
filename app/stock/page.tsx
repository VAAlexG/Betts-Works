import type { Metadata } from "next";
import { PublicShell } from "@/app/components/PublicShell";
import { PageHero } from "@/app/components/PageHero";
import { listPublicVehicles } from "@/lib/data";
import { StockBrowser } from "./StockBrowser";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Current stock", description: "Browse currently advertised American trucks and selected vehicles from Betts Works.", alternates:{ canonical:"/stock" } };
export default async function StockPage() { const vehicles = await listPublicVehicles(); return <PublicShell><PageHero eyebrow="Exact SCD Direct inventory" title="Current stock" intro="Every vehicle shown is imported, converted and held by SCD Direct, then offered for sale by Betts Works as the dealer. Search the exact current inventory below." /><section className="section shell"><StockBrowser vehicles={vehicles} /></section></PublicShell>; }
