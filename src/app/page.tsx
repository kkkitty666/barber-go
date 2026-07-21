import { SiteShell } from "@/components/SiteShell";
import { About } from "@/components/About";
import { BlogPromoSection } from "@/components/BlogPromoSection";
import { HomeHero } from "@/components/HomeHero";
import { HomeMapSection } from "@/components/HomeMapSection";
import { PromoCarousel } from "@/components/PromoCarousel";
import { WorksSection } from "@/components/WorksSection";

export default function HomePage() {
  return (
    <SiteShell mainClassName="home-main">
      <PromoCarousel />
      <HomeHero />
      <About />
      <WorksSection />
      <BlogPromoSection />
      <HomeMapSection />
    </SiteShell>
  );
}
