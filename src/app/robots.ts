import type { MetadataRoute } from "next";

const baseUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "https://pc-barbershop.ru").replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/kosmetika/korzina", "/kosmetika/oformlenie", "/kosmetika/zakazy"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
