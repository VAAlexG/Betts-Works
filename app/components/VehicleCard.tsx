import Link from "next/link";
import type { Vehicle } from "@/db/schema";
import { StatusBadge } from "./StatusBadge";
import { VehicleMedia } from "./VehicleMedia";
import { formatKm } from "@/lib/validation";

type CardVehicle = Vehicle & { images?: Array<{ storageKey: string; altText: string; width: number | null; height: number | null }> };

export function VehicleCard({ vehicle }: { vehicle: CardVehicle }) {
  return (
    <article className="vehicle-card">
      <Link href={`/vehicles/${vehicle.slug}`} aria-label={`View ${vehicle.year} ${vehicle.make} ${vehicle.model}`} className="vehicle-media-link"><VehicleMedia vehicle={vehicle} image={vehicle.images?.[0]} /></Link>
      <div className="vehicle-card-body">
        <div className="card-kicker"><StatusBadge status={vehicle.availabilityStatus} /><span>{vehicle.stockNumber}</span></div>
        <h3><Link href={`/vehicles/${vehicle.slug}`}>{vehicle.year} {vehicle.make} {vehicle.model}</Link></h3>
        <p className="variant">{vehicle.variant}</p>
        {vehicle.isSample && <p className="sample-notice">Demonstration listing only — not genuine stock.</p>}
        <dl className="quick-specs"><div><dt>Odometer</dt><dd>{formatKm(vehicle.odometerKm)}</dd></div><div><dt>Drivetrain</dt><dd>{vehicle.drivetrain || "Confirm"}</dd></div></dl>
        <div className="card-price"><div><strong>{vehicle.priceDisplay}</strong><small>{vehicle.priceQualifier}</small></div><Link href={`/vehicles/${vehicle.slug}`} className="text-link">View vehicle <span aria-hidden="true">→</span></Link></div>
      </div>
    </article>
  );
}
