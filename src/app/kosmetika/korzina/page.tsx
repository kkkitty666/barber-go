import type { Metadata } from "next";
import { CartPageContent } from "@/components/CartPages";
import { PageSection } from "@/components/PageSection";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Корзина — PC Барбершоп",
  description: "Корзина заказа косметики с самовывозом из PC Барбершоп.",
};

export default function CartPage() {
  return (
    <SiteShell>
      <PageSection title="КОРЗИНА" subtitle="САМОВЫВОЗ ИЗ БАРБЕРШОПА">
        <CartPageContent />
      </PageSection>
    </SiteShell>
  );
}
