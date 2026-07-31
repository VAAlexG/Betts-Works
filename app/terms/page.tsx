import type { Metadata } from "next";
import { PageHero } from "@/app/components/PageHero";
import { PublicShell } from "@/app/components/PublicShell";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Website terms",
  description: "Terms for using the Betts Works website and enquiring about advertised American vehicles.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <PublicShell>
      <PageHero eyebrow="Last updated 31 July 2026" title="Website terms" intro="These terms explain how vehicle information and enquiries on the Betts Works website are handled." />
      <article className="section shell prose">
        <h2>About Betts Works</h2>
        <p>{siteConfig.legalEntity} (ABN {siteConfig.abn}) operates this website. Betts Works is based in Queensland and trades by appointment.</p>
        <h2>Vehicle information</h2>
        <p>Specifications, features, images, availability, conversion or compliance status and pricing are provided in good faith and should be confirmed with Betts Works before purchase. Source information may be corrected when updated information becomes available.</p>
        <h2>Pricing and on-road costs</h2>
        <p>Only a vehicle expressly described as drive-away is offered on that basis. Otherwise, government charges, registration, insurance, transport, delivery and other applicable on-road costs are excluded unless the written quote says otherwise. Prices are in Australian dollars.</p>
        <h2>No online sale or finance approval</h2>
        <p>Submitting an enquiry does not reserve a vehicle, form a contract, accept a deposit or approve finance. A sale is subject to written terms agreed by the parties. Any finance or third-party provider introduction is subject to the provider’s own application, assessment, fees and terms.</p>
        <h2>Third-party services and links</h2>
        <p>Links to SCD Direct and other providers are supplied for context. Betts Works and SCD Direct have distinct roles described on this website. Third-party websites, conversion, transport, finance, insurance and other services are governed by their own terms.</p>
        <h2>Warranty and consumer rights</h2>
        <p>Vehicle-specific warranty information is provided in writing where applicable. Nothing in these terms excludes, restricts or modifies rights that cannot lawfully be excluded, including rights under the Australian Consumer Law.</p>
        <h2>Website use</h2>
        <p>You must not misuse the website, attempt unauthorised access, submit unlawful or misleading material, interfere with its operation, or reproduce protected content without permission.</p>
        <h2>Contact</h2>
        <p>Questions about these terms can be sent to <a href={siteConfig.emailHref}>{siteConfig.emailDisplay}</a> or raised by calling <a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a>.</p>
      </article>
    </PublicShell>
  );
}
