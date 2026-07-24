export const siteConfig = {
  name: "Betts Works",
  title: "Betts Works | American vehicle dealer in Australia",
  description: "Browse the exact American vehicles imported, converted and held by SCD Direct, offered for sale by Betts Works as the dealer.",
  url: process.env.PUBLIC_SITE_URL || "http://localhost:3000",
  phoneDisplay: "Phone pending approval",
  phoneHref: "",
  emailDisplay: "Sales email pending approval",
  emailHref: "",
  location: "Dealership location pending approval",
  hours: "Trading hours pending approval",
  relationship: "Every vehicle offered by Betts Works is imported, converted and held by SCD Direct. SCD Direct is responsible for the American vehicle importation, right-hand-drive conversion and Australian compliance pathway. Betts Works is the dealer responsible for advertising and selling the exact vehicles shown.",
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
