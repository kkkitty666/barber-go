import type { Metadata } from "next";
import { PageSection } from "@/components/PageSection";
import { SiteShell } from "@/components/SiteShell";
import { WorksGalleryGrid } from "@/components/WorksGalleryGrid";
import { pageSeo } from "@/config/site";

export const metadata: Metadata = {
  title: pageSeo.raboty.title,
  description: pageSeo.raboty.description,
};

export default function WorksPage() {
  return (
    <SiteShell>
      <PageSection title="НАШИ РАБОТЫ" subtitle="КАЧЕСТВО В ДЕТАЛЯХ">
        <WorksGalleryGrid />
      </PageSection>
    </SiteShell>
  );
}
