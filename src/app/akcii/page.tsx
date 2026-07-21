import type { Metadata } from "next";
import { PageSection } from "@/components/PageSection";
import { PromotionsPageContent } from "@/components/PromotionsPageContent";
import { SiteShell } from "@/components/SiteShell";
import { pageSeo } from "@/config/site";

export const metadata: Metadata = {
  title: pageSeo.akcii.title,
  description: pageSeo.akcii.description,
};

export default function PromotionsPage() {
  return (
    <SiteShell>
      <PageSection title="АКЦИИ" subtitle="ДЕЙСТВУЮЩИЕ ПРЕДЛОЖЕНИЯ">
        <PromotionsPageContent />
      </PageSection>
    </SiteShell>
  );
}
