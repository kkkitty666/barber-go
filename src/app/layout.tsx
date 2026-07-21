import type { Metadata, Viewport } from "next";
import { Cinzel, Cinzel_Decorative, Montserrat, UnifrakturMaguntia } from "next/font/google";
import "./globals.css";
import { LocalBusinessJsonLd } from "@/components/LocalBusinessJsonLd";
import { SiteBackground } from "@/components/SiteBackground";
import { YandexMetrika } from "@/components/YandexMetrika";
import { assets, siteConfig } from "@/config/site";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700", "900"],
});

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel-decorative",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const unifraktur = UnifrakturMaguntia({
  variable: "--font-unifraktur",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pc-barbershop.ru"),
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
  themeColor: "#000000",
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
      className={`${montserrat.variable} ${cinzel.variable} ${cinzelDecorative.variable} ${unifraktur.variable} h-full antialiased`}
    >
      <body className="relative min-h-full text-foreground">
        <YandexMetrika />
        <LocalBusinessJsonLd />
        <SiteBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
