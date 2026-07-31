import Link from "next/link";
import Image from "next/image";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="brand" aria-label="Betts Works home">
      <span className={compact ? "brand-approved-frame is-compact" : "brand-approved-frame"} aria-hidden="true">
        <Image unoptimized className="brand-approved-logo" src="/brand/betts-works-logo.png" width={1280} height={1280} alt="" priority />
      </span>
      <span className="brand-descriptor">American vehicle imports</span>
    </Link>
  );
}
