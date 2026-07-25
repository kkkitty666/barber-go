import type { MetadataRoute } from "next";
import { blogPosts } from "@/config/blog";
import { productCatalog } from "@/config/products";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/uslugi",
    "/kosmetika",
    "/raboty",
    "/otzyvy",
    "/barbery",
    "/blog",
    "/akcii",
    "/kontakty",
    "/politika-konfidencialnosti",
    "/oferta",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency:
      path === "" || path === "/kosmetika" || path === "/akcii" || path === "/otzyvy"
        ? "weekly"
        : "monthly",
    priority:
      path === ""
        ? 1
        : path === "/uslugi" || path === "/kosmetika" || path === "/otzyvy"
          ? 0.9
          : 0.7,
  }));

  const products: MetadataRoute.Sitemap = productCatalog.map((product) => ({
    url: `${baseUrl}/kosmetika/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const posts: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...products, ...posts];
}
