import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminPrincipal } from "@/lib/auth";
import { AdminShell } from "../../AdminShell";
import { VehicleEditor } from "../../VehicleEditor";
export const dynamic="force-dynamic";export const metadata:Metadata={title:"New vehicle",robots:{index:false,follow:false}};
export default async function NewVehiclePage(){const admin=await getAdminPrincipal();if(!admin)notFound();return <AdminShell email={admin.email}><div className="admin-title"><div><p className="eyebrow">Inventory management</p><h1>Create draft vehicle</h1></div></div><VehicleEditor/></AdminShell>}
