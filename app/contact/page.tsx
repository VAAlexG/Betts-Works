import type { Metadata } from "next";
import { EnquiryForm } from "@/app/components/EnquiryForm";
import { PageHero } from "@/app/components/PageHero";
import { PublicShell } from "@/app/components/PublicShell";
import { siteConfig } from "@/lib/site-config";

export const metadata:Metadata={title:"Contact",description:"Contact Betts Works about current American truck and vehicle stock.",alternates:{canonical:"/contact"}};
export default function ContactPage(){return <PublicShell><PageHero eyebrow="Start a conversation" title="Contact Betts Works" intro="Ask Betts Works about any exact vehicle in the SCD Direct inventory. Include the stock number so the dealer can respond about the right truck."/><section className="section shell"><div className="contact-layout"><div><p className="eyebrow">Sales enquiries</p><h2 className="enquiry-heading">Let’s talk vehicles.</h2><div className="contact-facts"><div className="contact-fact"><small>Phone</small><strong>{siteConfig.phoneDisplay}</strong></div><div className="contact-fact"><small>Email</small><strong>{siteConfig.emailDisplay}</strong></div><div className="contact-fact"><small>Location</small><strong>{siteConfig.location}</strong></div><div className="contact-fact"><small>Hours</small><strong>{siteConfig.hours}</strong></div></div><p className="muted">Betts Works handles the sales enquiry. SCD Direct holds, imports and converts the vehicle.</p></div><EnquiryForm /></div></section></PublicShell>}
