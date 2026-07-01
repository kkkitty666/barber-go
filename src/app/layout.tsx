import type { Metadata } from "next";
import { Cinzel, Inter, UnifrakturMaguntia } from "next/font/google";
import "./globals.css";
import { SiteBackground } from "@/components/SiteBackground";
import { assets, siteConfig } from "@/config/site";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${cinzel.variable} ${inter.variable} ${unifraktur.variable} h-full antialiased`}
    >
      <body className="relative min-h-full text-foreground">
        <SiteBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
