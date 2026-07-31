import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminPrincipal } from "@/lib/auth";
import { getAdminVehicle } from "@/lib/data";
import { AdminShell } from "../../AdminShell";
import { VehicleEditor } from "../../VehicleEditor";
import { ImageManager } from "../../ImageManager";
export const dynamic="force-dynamic";export const metadata:Metadata={title:"Edit vehicle",robots:{index:false,follow:false}};
export default async function EditVehiclePage({params}:{params:Promise<{id:string}>}){const admin=await getAdminPrincipal();if(!admin)notFound();const {id}=await params;const vehicle=await getAdminVehicle(id);if(!vehicle)notFound();return <AdminShell email={admin.email}><div className="admin-title"><div><p className="eyebrow">Inventory management</p><h1>Edit {vehicle.stockNumber}</h1></div>{vehicle.published&&<a className="button button-secondary" target="_blank" href={`/vehicles/${vehicle.slug}`}>View public page →</a>}</div><VehicleEditor vehicle={vehicle}/><ImageManager vehicleId={vehicle.id} initialImages={vehicle.images}/></AdminShell>}
