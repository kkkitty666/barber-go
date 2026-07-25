import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import { CookieConsent } from "@/components/CookieConsent";
import { LocalBusinessJsonLd } from "@/components/LocalBusinessJsonLd";
import { SiteBackground } from "@/components/SiteBackground";
import { YandexMetrika } from "@/components/YandexMetrika";
import { assets, siteConfig } from "@/config/site";
import { getSiteUrl } from "@/lib/site-url";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    locale: "ru_RU",
    type: "website",
    images: [assets.logoGold],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#000000" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      data-bg-mode="grainient"
      data-scroll-behavior="smooth"
      className={`${montserrat.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="relative min-h-full text-foreground">
        <YandexMetrika />
        <CookieConsent />
        <LocalBusinessJsonLd />
        <SiteBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
