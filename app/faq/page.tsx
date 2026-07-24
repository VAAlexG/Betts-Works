import type { Metadata } from "next";
import { PageHero } from "@/app/components/PageHero";
import { PublicShell } from "@/app/components/PublicShell";

export const metadata:Metadata={title:"Frequently asked questions",description:"Answers about Betts Works stock, SCD Direct conversion, availability, pricing and enquiries.",alternates:{canonical:"/faq"}};
const faqs=[
  ["Is Betts Works the importer or conversion provider?","No. Betts Works is the dealer. Every listed vehicle is imported, converted and held by SCD Direct."],
  ["Does Betts Works perform right-hand-drive conversions?","No. Right-hand-drive conversion work is provided through SCD Direct. The conversion provider and status should be recorded on each vehicle listing."],
  ["Does every vehicle meet Australian compliance requirements?","A vehicle’s compliance status is shown only when verified in its inventory record. Ask Betts Works to confirm the current status before purchase."],
  ["Are these the same vehicles shown by SCD Direct?","Yes. Betts Works lists the exact SCD Direct inventory vehicles, using the matching stock number, images, price basis and vehicle details. SCD Direct physically holds the vehicles."],
  ["Are all advertised vehicles available?","The site mirrors SCD Direct’s current stock catalogue, but availability can change. Confirm the current status with Betts Works before making a purchase decision."],
  ["What does POA mean?","Price on application. Contact Betts Works for current pricing and the applicable price basis."],
  ["Are prices drive-away?","Only a listing explicitly approved and stored as drive-away should use that wording. Otherwise the price qualifier explains the basis, such as excluding on-road costs or POA."],
  ["What warranty applies?","Warranty information has not yet been approved. Ask Betts Works for vehicle-specific written details. Nothing on this website limits rights under the Australian Consumer Law."],
  ["How do I enquire?","Open a vehicle and use its linked form, or use the general contact page. Valid enquiries are stored securely before email notification is attempted."],
];
export default function FAQPage(){return <PublicShell><PageHero eyebrow="Useful answers" title="Frequently asked questions" intro="Clear answers based on the current approved operating model. Vehicle-specific details should always be confirmed before purchase."/><section className="section shell"><div className="faq-list">{faqs.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></section></PublicShell>}
