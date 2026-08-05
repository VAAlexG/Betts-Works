export const siteConfig = {
  name: "Betts Works",
  title: "Betts Works | American vehicle dealer in Australia",
  description: "Browse American vehicles for sale through Betts Works or ask us to source the make, model and specification you want.",
  url: "https://bettsworks.com.au",
  phoneDisplay: "0451 461 705",
  phoneHref: "tel:+61451461705",
  emailDisplay: "tyson@bettsworks.com.au",
  emailHref: "mailto:tyson@bettsworks.com.au",
  location: "Brendale QLD 4500",
  hours: "By appointment — contact us to arrange a viewing",
  legalEntity: "Tyson Jade Betts trading as Betts Works",
  abn: "37 195 578 714",
  relationship: "Betts Works advertises selected vehicles supplied by SCD American Vehicles (SCD), our specialist right-hand-drive conversion partner, may purchase and hold vehicles as dealership inventory, and can source a specific vehicle overseas for a customer. Vehicles requiring Australian conversion are entrusted to SCD for professional right-hand-drive conversion and applicable Australian compliance work.",
  scdUrl: "https://scddirect.com.au/",
} as const;

export const navigation = [
  { href: "/stock", label: "Current Stock" },
  { href: "/about", label: "About" },
  { href: "/scd-direct", label: "Specialist Conversion" },
  { href: "/faq", label: "FAQ" },
] as const;

export const statuses = {
  in_stock: "In stock",
  available_soon: "Available soon",
  under_offer: "Under offer",
  sold: "Sold",
  draft: "Draft",
} as const;
