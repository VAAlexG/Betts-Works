import Link from "next/link";
import { BrandMark } from "./BrandMark";
import { navigation, siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid shell">
        <div><BrandMark /><p className="muted">Independent Australian dealer of American trucks and selected vehicles.</p></div>
        <div><h2>Explore</h2>{navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</div>
        <div><h2>Contact</h2><span>{siteConfig.phoneDisplay}</span><span>{siteConfig.emailDisplay}</span><span>{siteConfig.location}</span></div>
        <div><h2>Important</h2><p>Vehicles are imported, converted and held by SCD Direct. Betts Works is the selling dealer.</p><Link href="/privacy">Privacy policy</Link><Link href="/terms">Website terms</Link><Link href="/admin" rel="nofollow">Administration</Link></div>
      </div>
      <div className="footer-bottom shell"><span>© {new Date().getFullYear()} Betts Works. Business details pending approval.</span><span>Queensland, Australia</span></div>
    </footer>
  );
}
