import type { Metadata } from "next";
import { Services } from "@/components/Services";
import { SiteShell } from "@/components/SiteShell";
import { OrnamentDivider } from "@/components/OrnamentDivider";
import { pageSeo } from "@/config/site";

export const metadata: Metadata = {
  title: pageSeo.uslugi.title,
  description: pageSeo.uslugi.description,
};

export default function ServicesPage() {
  return (
    <SiteShell>
      <section className="section-padding noise-overlay min-h-[calc(100vh-var(--header-offset))]">
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h1 className="font-display mb-4 text-3xl tracking-[0.3em] text-gold md:text-4xl">
              УСЛУГИ
            </h1>
            <OrnamentDivider label="ПРАЙС-ЛИСТ" />
          </div>
          <Services />
        </div>
      </section>
    </SiteShell>
  );
}
