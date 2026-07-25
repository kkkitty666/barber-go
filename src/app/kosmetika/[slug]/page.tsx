import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/ProductDetail";
import { PageSection } from "@/components/PageSection";
import { SiteShell } from "@/components/SiteShell";
import { getAllProductSlugs, getProductBySlug } from "@/config/products";
import { pageSeo } from "@/config/site";
import { getProductWithInventoryBySlug } from "@/lib/inventory";

/** Inventory-backed PDP; short ISR instead of force-dynamic. */
export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: pageSeo.kosmetika.title };

  return {
    title: `${product.name} — ${pageSeo.kosmetika.title}`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductWithInventoryBySlug(slug);
  if (!product) notFound();

  return (
    <SiteShell>
      <PageSection title="КОСМЕТИКА" subtitle={product.brand.toUpperCase()}>
        <ProductDetail product={product} />
      </PageSection>
    </SiteShell>
  );
}
