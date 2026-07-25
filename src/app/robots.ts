import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();

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
