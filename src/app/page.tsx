import { SiteShell } from "@/components/SiteShell";
import { About } from "@/components/About";
import { BlogPromoSection } from "@/components/BlogPromoSection";
import { HomeHero } from "@/components/HomeHero";
import { HomeMapSection } from "@/components/HomeMapSection";
import { PromoCarousel } from "@/components/PromoCarousel";
import { ReviewsSection } from "@/components/ReviewsSection";
import { WorksSection } from "@/components/WorksSection";

/** Allow CDN/ISR caching; reviews sync invalidates via revalidatePath/Tag. */
export const revalidate = 21600;

export default function HomePage() {
  return (
    <SiteShell mainClassName="home-main">
      <PromoCarousel />
      <HomeHero />
      <About />
      <WorksSection />
      <ReviewsSection />
      <BlogPromoSection />
      <HomeMapSection />
    </SiteShell>
  );
}
