import type { MetadataRoute } from "next";
import { listPublicVehicles } from "@/lib/data";
import { siteConfig } from "@/lib/site-config";
export const dynamic="force-dynamic";
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const staticPaths=["","/stock","/about","/scd-direct","/faq","/contact","/privacy","/terms"];const vehicles=await listPublicVehicles({includeSold:true});return[...staticPaths.map(path=>({url:`${siteConfig.url}${path}`,lastModified:new Date(),changeFrequency:path==="/stock"?"daily" as const:"monthly" as const,priority:path===""?1:path==="/stock"?.9:.6})),...vehicles.map(v=>({url:`${siteConfig.url}/vehicles/${v.slug}`,lastModified:new Date(v.updatedAt),changeFrequency:"weekly" as const,priority:.8}))];}
