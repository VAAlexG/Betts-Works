import Image from "next/image";
import type { Vehicle } from "@/db/schema";

export function VehicleMedia({ vehicle, image, priority = false }: { vehicle: Vehicle; image?: { storageKey: string; altText: string; width: number | null; height: number | null }; priority?: boolean }) {
  if (image) {
    const externalSCDImage = /^https:\/\/cdn\.images\.stock\.i-motor\.net\.au\/vehicles\/(?:large|medium)\//.test(image.storageKey);
    const src = externalSCDImage ? image.storageKey : `/api/images/${encodeURIComponent(image.storageKey)}`;
    return <Image className="vehicle-photo" src={src} alt={image.altText} width={image.width || 1200} height={image.height || 800} priority={priority} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} sizes="(max-width: 760px) 100vw, (max-width: 1180px) 50vw, 40vw" />;
  }
  return (
    <div className="vehicle-placeholder" role="img" aria-label={`Approved photography pending for ${vehicle.year} ${vehicle.make} ${vehicle.model}`}>
      <span className="vehicle-placeholder-line" aria-hidden="true" />
      <span className="vehicle-placeholder-copy"><b>{vehicle.make}</b><small>APPROVED PHOTOGRAPHY PENDING</small></span>
      {vehicle.isSample && <span className="sample-ribbon">FICTIONAL SAMPLE</span>}
    </div>
  );
}
