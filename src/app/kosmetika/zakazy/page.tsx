import type { Metadata } from "next";
import { OrderHistoryContent } from "@/components/OrderHistory";
import { PageSection } from "@/components/PageSection";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "История заказов — PC Барбершоп",
  description: "Отслеживание статусов заказов косметики PC Барбершоп.",
};

export default function OrderHistoryPage() {
  return (
    <SiteShell>
      <PageSection title="КОСМЕТИКА" subtitle="ИСТОРИЯ ЗАКАЗОВ">
        <OrderHistoryContent />
      </PageSection>
    </SiteShell>
  );
}
