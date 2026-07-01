import type { Metadata } from "next";
import { ProductCatalog } from "@/components/ProductCatalog";
import { PageSection } from "@/components/PageSection";
import { SiteShell } from "@/components/SiteShell";
import { pageSeo } from "@/config/site";

export const metadata: Metadata = {
  title: pageSeo.kosmetika.title,
  description: pageSeo.kosmetika.description,
};

export default function CosmeticsPage() {
  return (
    <SiteShell>
      <PageSection title="КАТАЛОГ ТОВАРОВ" subtitle="КОСМЕТИКА И СТАЙЛИНГ">
        <ProductCatalog />
      </PageSection>
    </SiteShell>
  );
}
