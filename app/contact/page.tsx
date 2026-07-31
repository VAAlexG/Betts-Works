import type { Metadata } from "next";
import { EnquiryForm } from "@/app/components/EnquiryForm";
import { PageHero } from "@/app/components/PageHero";
import { PublicShell } from "@/app/components/PublicShell";
import { siteConfig } from "@/lib/site-config";

export const metadata:Metadata={title:"Contact",description:"Contact Betts Works about current American truck and vehicle stock.",alternates:{canonical:"/contact"}};
export default function ContactPage(){return <PublicShell><PageHero eyebrow="Start a conversation" title="Contact Betts Works" intro="Ask about an advertised vehicle or tell us the make, model, year, specification, colour and features you want us to source."/><section className="section shell"><div className="contact-layout"><div><p className="eyebrow">Sales enquiries</p><h2 className="enquiry-heading">Let’s talk vehicles.</h2><div className="contact-facts"><div className="contact-fact"><small>Phone</small><strong><a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a></strong></div><div className="contact-fact"><small>Email</small><strong><a href={siteConfig.emailHref}>{siteConfig.emailDisplay}</a></strong></div><div className="contact-fact"><small>Location</small><strong>{siteConfig.location}</strong></div><div className="contact-fact"><small>Hours</small><strong>{siteConfig.hours}</strong></div></div><p className="muted">Betts Works manages your sales or sourcing enquiry and remains your primary point of contact. Vehicles requiring Australian conversion are entrusted to SCD.</p></div><EnquiryForm /></div></section></PublicShell>}
