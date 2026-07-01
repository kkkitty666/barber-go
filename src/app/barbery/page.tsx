import type { Metadata } from "next";
import { Barbers } from "@/components/Barbers";
import { PageSection } from "@/components/PageSection";
import { SiteShell } from "@/components/SiteShell";
import { pageSeo, siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: pageSeo.barbery.title,
  description: pageSeo.barbery.description,
};

export default function BarbersPage() {
  return (
    <SiteShell>
      <PageSection title="БАРБЕРЫ" subtitle={siteConfig.motto}>
        <Barbers />
      </PageSection>
    </SiteShell>
  );
}
