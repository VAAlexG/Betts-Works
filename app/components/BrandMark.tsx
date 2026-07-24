import Link from "next/link";
import Image from "next/image";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="brand" aria-label="Betts Works home">
      <Image className="brand-emblem" src="/brand/bw-hex-dark.png" width={305} height={252} alt="" priority />
      {!compact && <span className="brand-wordmark"><strong>BETTS WORKS</strong><small>CAR DEALER</small></span>}
    </Link>
  );
}
