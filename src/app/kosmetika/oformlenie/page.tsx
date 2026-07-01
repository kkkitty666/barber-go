import type { Metadata } from "next";
import { CheckoutPageContent } from "@/components/CartPages";
import { PageSection } from "@/components/PageSection";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Оформление заказа — PC Барбершоп",
  description: "Оформление заказа косметики с самовывозом и уведомлением в Telegram.",
};

export default function CheckoutPage() {
  return (
    <SiteShell>
      <PageSection title="ОФОРМЛЕНИЕ" subtitle="ЗАКАЗ КОСМЕТИКИ">
        <CheckoutPageContent />
      </PageSection>
    </SiteShell>
  );
}
