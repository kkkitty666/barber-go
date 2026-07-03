import { SiteShell } from "@/components/SiteShell";
import { About } from "@/components/About";
import { BlogPromoSection } from "@/components/BlogPromoSection";
import { HomeHero } from "@/components/HomeHero";
import { HomeMapSection } from "@/components/HomeMapSection";
import { WorksSection } from "@/components/WorksSection";

export default function HomePage() {
  return (
    <SiteShell>
      <HomeHero />
      <About />
      <WorksSection />
      <BlogPromoSection />
      <HomeMapSection />
    </SiteShell>
  );
}
