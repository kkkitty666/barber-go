import type { Metadata } from "next";
import { ProductCatalog } from "@/components/ProductCatalog";
import { PageSection } from "@/components/PageSection";
import { SiteShell } from "@/components/SiteShell";
import { getProductsWithInventory } from "@/lib/inventory";
import { pageSeo } from "@/config/site";

/** Inventory-backed catalog; short ISR instead of force-dynamic. */
export const revalidate = 60;

export const metadata: Metadata = {
  title: pageSeo.kosmetika.title,
  description: pageSeo.kosmetika.description,
};

export default async function CosmeticsPage() {
  const products = await getProductsWithInventory();

  return (
    <SiteShell>
      <PageSection title="КАТАЛОГ ТОВАРОВ" subtitle="WHITE COSMETICS · DETOX">
        <ProductCatalog products={products} />
      </PageSection>
    </SiteShell>
  );
}
