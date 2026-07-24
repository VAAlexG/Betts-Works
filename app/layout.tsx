import type { Metadata, Viewport } from "next";
import "@fontsource/anton/400.css";
import "@fontsource/barlow/400.css";
import "@fontsource/barlow/500.css";
import "@fontsource/barlow/600.css";
import "@fontsource/barlow-condensed/500.css";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource/yellowtail/400.css";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.title, template: "%s | Betts Works" },
  description: siteConfig.description,
  applicationName: "Betts Works",
  category: "automotive",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "en_AU", siteName: "Betts Works", title: siteConfig.title, description: siteConfig.description, images: [{ url: "/og.png", width: 1707, height: 907, alt: "Betts Works — American trucks. Australian roads." }] },
  twitter: { card: "summary_large_image", title: siteConfig.title, description: siteConfig.description, images: ["/og.png"] },
};

export const viewport: Viewport = { themeColor: "#0A0A0C", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-AU"><body>{children}</body></html>;
}
