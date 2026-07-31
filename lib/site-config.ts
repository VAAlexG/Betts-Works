export const siteConfig = {
  name: "Betts Works",
  title: "Betts Works | American vehicle dealer in Australia",
  description: "Browse American vehicles for sale through Betts Works or ask us to source the make, model and specification you want.",
  url: "https://bettsworks.com.au",
  phoneDisplay: "0451 461 705",
  phoneHref: "tel:+61451461705",
  emailDisplay: "tyson@bettsworks.com.au",
  emailHref: "mailto:tyson@bettsworks.com.au",
  location: "110 Dales Road, Kobble Creek QLD 4520",
  hours: "By appointment — contact to arrange",
  legalEntity: "Tyson Jade Betts trading as Betts Works",
  abn: "37 195 578 714",
  motorDealerLicence: "Pending confirmation",
  latitude: -27.2525064,
  longitude: 152.8149758,
  relationship: "Betts Works advertises selected vehicles supplied by SCD, may purchase and hold vehicles as dealership inventory, and can source a specific vehicle overseas for a customer. Vehicles requiring Australian conversion are entrusted to SCD for professional right-hand-drive conversion and applicable Australian compliance work.",
  scdUrl: "https://scddirect.com.au/",
} as const;

export const navigation = [
  { href: "/stock", label: "Current Stock" },
  { href: "/about", label: "About" },
  { href: "/scd-direct", label: "SCD Direct & Conversion" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export const statuses = {
  in_stock: "In stock",
  available_soon: "Available soon",
  under_offer: "Under offer",
  sold: "Sold",
  draft: "Draft",
} as const;
