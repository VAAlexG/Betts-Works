import type { Metadata } from "next";
import { PageHero } from "@/app/components/PageHero";
import { PublicShell } from "@/app/components/PublicShell";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Betts Works collects, uses, stores and discloses personal information.",
  alternates: { canonical: "/privacy" },
};

function PolicySection({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section className="policy-section">
      <div className="policy-number">{number}</div>
      <div className="prose">
        <h2>{title}</h2>
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Effective 28 July 2026"
        title="Privacy policy"
        intro="Betts Works respects your privacy and is committed to handling personal information responsibly, securely and transparently."
      />

      <article className="section shell policy">
        <div className="policy-meta">
          <div><span>Effective date</span><strong>Tuesday 28 July 2026</strong></div>
          <div><span>Last updated</span><strong>Tuesday 28 July 2026</strong></div>
        </div>

        <PolicySection number="01" title="About this policy">
          <p>This Privacy Policy explains how <span className="policy-placeholder">[insert full legal entity name]</span>, trading as Betts Works (“Betts Works”, “we”, “us” or “our”), collects, holds, uses and discloses personal information when you:</p>
          <ul>
            <li>visit bettsworks.com.au;</li>
            <li>submit an enquiry or request information about a vehicle;</li>
            <li>communicate with us by telephone, email, social media or in person;</li>
            <li>request a vehicle quotation;</li>
            <li>purchase or enquire about an imported American vehicle;</li>
            <li>subscribe to marketing communications; or</li>
            <li>otherwise interact with our dealership.</li>
          </ul>
          <p>We handle personal information in accordance with applicable Australian privacy laws, including the Privacy Act 1988 (Cth) and the Australian Privacy Principles where they apply to our business.</p>
        </PolicySection>

        <PolicySection number="02" title="Information we may collect">
          <p>The personal information we collect depends on how you interact with Betts Works. It may include:</p>
          <ul>
            <li>your full name;</li>
            <li>telephone number and email address;</li>
            <li>residential, delivery or business address;</li>
            <li>state, suburb and postcode;</li>
            <li>preferred contact method;</li>
            <li>details contained in your enquiry or correspondence;</li>
            <li>vehicle preferences, specifications and intended vehicle use;</li>
            <li>information about a vehicle you wish to purchase, import or trade;</li>
            <li>transaction, deposit, invoice and payment information;</li>
            <li>identification and documentation reasonably required for a vehicle transaction, registration, licensing, importation or compliance process;</li>
            <li>finance or insurance enquiry information where you ask us to introduce you to a third-party provider;</li>
            <li>marketing preferences and communication history;</li>
            <li>website usage information, such as your IP address, browser type, device information and pages visited; and</li>
            <li>any other information you voluntarily provide to us.</li>
          </ul>
          <p>Please do not provide sensitive personal information unless we specifically request it and it is reasonably necessary for the relevant service or transaction.</p>
        </PolicySection>

        <PolicySection number="03" title="How we collect information">
          <p>We may collect personal information:</p>
          <ul>
            <li>directly from you through our website, telephone calls, emails, social media, dealership communications or in-person discussions;</li>
            <li>when you submit an enquiry, request a quotation or enter into a vehicle transaction;</li>
            <li>from authorised representatives acting on your behalf;</li>
            <li>from service providers involved in sourcing, transporting, converting, complying, registering or delivering a vehicle;</li>
            <li>from finance, insurance or payment providers where you have authorised the exchange of information;</li>
            <li>from publicly available sources where appropriate; and</li>
            <li>automatically through cookies, website logs and similar technologies.</li>
          </ul>
          <p>Where practical, you may contact us without identifying yourself. However, we may be unable to provide certain information, quotations or dealership services without the details required to identify you and understand your request.</p>
        </PolicySection>

        <PolicySection number="04" title="Why we collect and use information">
          <p>Betts Works may collect, hold and use personal information to:</p>
          <ul>
            <li>respond to enquiries and communicate with prospective and existing customers;</li>
            <li>identify suitable vehicles and provide availability, pricing or quotation information;</li>
            <li>source and purchase vehicles from overseas;</li>
            <li>manage vehicle sales, deposits, payments and related documentation;</li>
            <li>coordinate vehicle transport, importation, conversion, compliance, registration and delivery;</li>
            <li>work with SCD American Vehicles and other authorised service providers involved in preparing a vehicle for the Australian market;</li>
            <li>verify identity and satisfy legal, regulatory, licensing and record-keeping obligations;</li>
            <li>arrange introductions to finance, insurance, transport or other providers when requested;</li>
            <li>provide customer service and post-sale assistance;</li>
            <li>manage warranties, complaints, disputes or legal claims;</li>
            <li>maintain accurate business, accounting and transaction records;</li>
            <li>improve our website, advertising, services and customer experience;</li>
            <li>protect our website and business against fraud, misuse, spam and security threats; and</li>
            <li>send marketing communications where we have the required consent or are otherwise permitted by law.</li>
          </ul>
          <p>We will not use personal information for an unrelated purpose unless you consent or the use is otherwise permitted or required by law.</p>
        </PolicySection>

        <PolicySection number="05" title="Disclosure of information">
          <p>We may disclose personal information where reasonably necessary to:</p>
          <ul>
            <li>SCD American Vehicles and other vehicle conversion or compliance specialists;</li>
            <li>overseas vehicle suppliers, auction houses or sourcing agents;</li>
            <li>shipping, freight, customs, quarantine, storage and logistics providers;</li>
            <li>vehicle registration, inspection and government authorities;</li>
            <li>finance brokers, lenders or insurers where you request an introduction or application;</li>
            <li>payment processors, accountants, lawyers and professional advisers;</li>
            <li>website hosting, email, customer-management, data-storage and information-technology providers;</li>
            <li>contractors assisting us with dealership operations or customer service;</li>
            <li>law-enforcement bodies, regulators or government authorities when required or authorised by law; and</li>
            <li>a purchaser or adviser involved in a proposed sale, restructure or transfer of our business, subject to appropriate confidentiality arrangements.</li>
          </ul>
          <p>Betts Works does not sell or rent customer contact information to unrelated third parties for their own marketing purposes.</p>
          <p>Where another business provides a service directly to you, its own privacy policy and terms may also apply.</p>
        </PolicySection>

        <PolicySection number="06" title="Overseas disclosure">
          <p>Because Betts Works sources vehicles internationally and may use technology providers operating outside Australia, personal information may sometimes be disclosed to or processed in another country.</p>
          <p>The countries involved may include <span className="policy-placeholder">[insert applicable countries—for example, the United States and countries in which your hosting or email providers operate]</span>.</p>
          <p>We will only disclose information overseas when reasonably necessary for the requested service, where you have authorised us to do so, or where otherwise permitted by law. Where applicable, we take reasonable steps to ensure overseas recipients handle personal information appropriately.</p>
        </PolicySection>

        <PolicySection number="07" title="Website cookies and analytics">
          <p>Our website may use cookies and similar technologies to:</p>
          <ul>
            <li>operate essential website functions;</li>
            <li>remember user preferences;</li>
            <li>understand website traffic and performance;</li>
            <li>detect misuse or security threats; and</li>
            <li>measure the effectiveness of advertising.</li>
          </ul>
          <p>Cookies may collect technical information such as your IP address, browser, device, approximate location, referral source and pages viewed.</p>
          <p>You can usually manage or disable cookies through your browser settings. Disabling some cookies may affect how the website functions.</p>
          <p>Website services currently used: <span className="policy-placeholder">[Insert analytics, advertising, hosting, form and cookie providers—for example, Google Analytics or Meta Pixel—or state that none are currently used.]</span></p>
        </PolicySection>

        <PolicySection number="08" title="Direct marketing">
          <p>Betts Works may send you information about available vehicles, dealership updates, offers or related services when you have consented or where otherwise permitted by law.</p>
          <p>Marketing consent is separate from submitting a general vehicle enquiry. Making an enquiry will not automatically subscribe you to marketing communications.</p>
          <p>You may unsubscribe at any time by:</p>
          <ul>
            <li>using the unsubscribe facility included in the message;</li>
            <li>replying with “unsubscribe” or “stop”, where applicable; or</li>
            <li>contacting us using the details below.</li>
          </ul>
          <p>We will process valid unsubscribe requests as required by applicable Australian law. You may still receive essential, non-marketing communications relating to an active enquiry, purchase or transaction.</p>
        </PolicySection>

        <PolicySection number="09" title="Security and retention">
          <p>We take reasonable administrative, physical and technical steps to protect personal information against misuse, interference, loss and unauthorised access, modification or disclosure.</p>
          <p>These measures may include:</p>
          <ul>
            <li>restricting access to authorised personnel;</li>
            <li>password-protected business systems;</li>
            <li>reputable website, email and data-storage providers;</li>
            <li>appropriate access controls and security practices;</li>
            <li>staff and contractor confidentiality requirements; and</li>
            <li>reviewing information that is no longer required.</li>
          </ul>
          <p>No internet transmission or electronic storage method is completely secure. While we take reasonable precautions, we cannot guarantee absolute security.</p>
          <p>We retain personal information only for as long as reasonably required for the purpose for which it was collected, to manage our business relationship with you, and to satisfy applicable legal, taxation, accounting, licensing, warranty and dispute-resolution requirements. When information is no longer required, we will take reasonable steps to destroy it securely or de-identify it.</p>
        </PolicySection>

        <PolicySection number="10" title="Accessing or correcting your information">
          <p>You may contact us to request access to personal information we hold about you or ask us to correct information that is inaccurate, out of date, incomplete, irrelevant or misleading.</p>
          <p>To protect your privacy, we may ask you to verify your identity before processing a request. In some circumstances, access may be limited or refused where permitted by law. If this occurs, we will generally explain the reason for our decision.</p>
          <p>No fee will be charged for making a request. We may charge a reasonable administrative fee for providing access where permitted by law, but we will inform you before doing so.</p>
        </PolicySection>

        <PolicySection number="11" title="Privacy complaints">
          <p>If you have a question or concern about how Betts Works has handled your personal information, please contact us using the details below.</p>
          <p>Please include enough information for us to understand and investigate your concern. We will acknowledge your complaint and aim to provide a response within a reasonable period.</p>
          <p>If you are not satisfied with our response and the Privacy Act applies, you may be entitled to contact the Office of the Australian Information Commissioner through <a href="https://www.oaic.gov.au/" target="_blank" rel="noopener noreferrer">oaic.gov.au</a>.</p>
        </PolicySection>

        <PolicySection number="12" title="Third-party websites">
          <p>Our website may contain links to third-party websites, including vehicle, finance, insurance, conversion or social-media services.</p>
          <p>Betts Works is not responsible for the privacy practices or content of external websites. We recommend reviewing the privacy policy of any third party before providing personal information.</p>
        </PolicySection>

        <PolicySection number="13" title="Changes to this policy">
          <p>We may update this Privacy Policy when our business practices, website systems, service providers or legal obligations change.</p>
          <p>The current version will be published on our website with its effective date and most recent update date.</p>
        </PolicySection>

        <PolicySection number="14" title="Contact Betts Works">
          <p>For privacy enquiries, access or correction requests, or complaints, please contact:</p>
          <address className="policy-contact">
            <strong>Betts Works</strong>
            <span>Legal entity: <span className="policy-placeholder">[Insert full legal entity name]</span></span>
            <span>ABN: <span className="policy-placeholder">[Insert ABN]</span></span>
            <span>110 Dales Road, Kobble Creek QLD 4520</span>
            <a href="mailto:tyson@bettsworks.com.au">tyson@bettsworks.com.au</a>
            <a href="tel:+61451461705">0451 461 705</a>
            <a href="https://bettsworks.com.au">bettsworks.com.au</a>
          </address>
        </PolicySection>
      </article>
    </PublicShell>
  );
}
