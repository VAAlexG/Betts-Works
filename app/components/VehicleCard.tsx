import Link from "next/link";
import type { Vehicle } from "@/db/schema";
import { StatusBadge } from "./StatusBadge";
import { VehicleMedia } from "./VehicleMedia";
import { formatKm } from "@/lib/validation";

type CardVehicle = Vehicle & { images?: Array<{ storageKey: string; altText: string; width: number | null; height: number | null }> };

export function VehicleCard({ vehicle }: { vehicle: CardVehicle }) {
  return (
    <Link href={`/vehicles/${vehicle.slug}`} aria-label={`View ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.variant}`} className="vehicle-card">
      <span className="vehicle-media-link"><VehicleMedia vehicle={vehicle} image={vehicle.images?.[0]} /></span>
      <div className="vehicle-card-body">
        <div className="card-kicker"><StatusBadge status={vehicle.availabilityStatus} /><span>{vehicle.stockNumber}</span></div>
        <h3>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
        <p className="variant">{vehicle.variant}</p>
        {vehicle.isSample && <p className="sample-notice">Demonstration listing only — not genuine stock.</p>}
        <dl className="quick-specs">
          <div><dt>Engine / fuel</dt><dd>{vehicle.engine || vehicle.fuelType || "Confirm"}</dd></div>
          <div><dt>Transmission</dt><dd>{vehicle.transmission || "Confirm"}</dd></div>
          <div><dt>Odometer</dt><dd>{formatKm(vehicle.odometerKm)}</dd></div>
          <div><dt>Drivetrain</dt><dd>{vehicle.drivetrain || "Confirm"}</dd></div>
          {vehicle.exteriorColour && <div><dt>Exterior</dt><dd>{vehicle.exteriorColour}</dd></div>}
        </dl>
        <div className="card-price"><div><strong>{vehicle.priceDisplay}</strong><small>Excl. govt charges &amp; on-road costs*</small></div><span className="text-link">View vehicle <span aria-hidden="true">→</span></span></div>
      </div>
    </Link>
  );
}
