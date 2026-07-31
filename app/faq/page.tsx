import type { Metadata } from "next";
import { PageHero } from "@/app/components/PageHero";
import { PublicShell } from "@/app/components/PublicShell";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description: "Answers about Betts Works vehicle sales, overseas sourcing, SCD conversion, availability, pricing and enquiries.",
  alternates: { canonical: "/faq" },
};

const faqs = [
  ["What vehicles does Betts Works sell?", "Betts Works advertises selected vehicles supplied by SCD and may also purchase and hold vehicles as dealership inventory. Each listing identifies the relevant vehicle, specifications, availability and selling dealer."],
  ["Can Betts Works source a specific vehicle for me?", "Yes. Tell us the make, model, year, specification, colour and features you want. Betts Works can use its industry knowledge and supplier network to search overseas for a suitable vehicle."],
  ["Who performs the Australian conversion?", "Vehicles requiring Australian conversion are entrusted to SCD, which is responsible for the professional right-hand-drive conversion and applicable Australian compliance work."],
  ["Does Betts Works perform conversion work?", "Betts Works is the dealer and your primary point of contact. Director Tyson Betts also works hands-on within SCD’s conversion operation, manufacturing and completing dashboard components used in the conversion process."],
  ["Are SCD-supplied vehicles also available through SCD?", "They may be. SCD continues to advertise and sell its own stock directly, so availability of an SCD-supplied vehicle remains subject to confirmation."],
  ["Does every vehicle meet Australian compliance requirements?", "A vehicle’s compliance status is shown only when verified in its inventory record. Ask Betts Works to confirm the current status and applicable conversion or compliance pathway before purchase."],
  ["What does POA mean?", "Price on application. Contact Betts Works for current pricing and the applicable price basis."],
  ["Are prices drive-away?", "Only a listing explicitly described as drive-away should use that wording. Otherwise, the price qualifier explains the basis, such as excluding on-road costs or POA. Government charges, registration, insurance, delivery and other applicable on-road costs are itemised or confirmed in the written quote."],
  ["Can Betts Works help with finance?", "Finance options or an introduction to a third-party provider can be discussed on enquiry. Any application, approval, fees and terms are subject to the provider’s assessment and are not guaranteed by Betts Works."],
  ["What warranty applies?", "Ask Betts Works for the written warranty details applicable to the specific vehicle. Nothing on this website limits rights under the Australian Consumer Law."],
  ["How do I enquire?", "Open a vehicle and use its linked form, or use the general contact page. Include the stock number for an advertised vehicle, or describe the vehicle you would like us to source."],
];

export default function FAQPage() {
  return (
    <PublicShell>
      <PageHero eyebrow="Useful answers" title="Frequently asked questions" intro="Clear answers about vehicle sales, sourcing and the specialist Australian conversion pathway." />
      <section className="section shell">
        <div className="faq-list">
          {faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
        </div>
      </section>
    </PublicShell>
  );
}
