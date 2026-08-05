import Link from "next/link";
import { BrandMark } from "./BrandMark";
import { navigation, siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid shell">
        <div><BrandMark /><p className="muted">Independent Australian dealer of American trucks and selected vehicles.</p></div>
        <div><h2>Explore</h2>{navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</div>
        <div><h2>Contact</h2><Link href="/contact">Make an enquiry →</Link><a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a><a href={siteConfig.emailHref}>{siteConfig.emailDisplay}</a><span>{siteConfig.location}</span></div>
        <div><h2>Important</h2><p>Each listing identifies the relevant vehicle, availability and selling dealer. Confirm current details before purchase.</p><Link href="/privacy">Privacy policy</Link><Link href="/terms">Website terms</Link></div>
      </div>
      <div className="footer-compliance shell" aria-label="Business and compliance details">
        <span><b>ABN</b> {siteConfig.abn}</span>
        <span><b>Trading</b> {siteConfig.hours}</span>
      </div>
      <div className="analytics-notice shell"><span>This site uses essential security storage and privacy-focused, cookieless Cloudflare Web Analytics. No advertising or marketing cookies are used.</span><Link href="/privacy">Privacy details</Link></div>
      <div className="footer-bottom shell"><span>© {new Date().getFullYear()} Betts Works. All rights reserved.</span><span>Queensland, Australia</span></div>
    </footer>
  );
}
