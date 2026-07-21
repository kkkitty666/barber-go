import { siteConfig } from "@/config/site";
import { CanvasFrame } from "./DecorativeElements";
import { OrnamentDivider } from "./OrnamentDivider";

export function About() {
  return (
    <section id="about" className="section-padding noise-overlay mobile-section-safe">
      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h2 className="font-display mb-4 text-3xl tracking-[0.3em] text-gold md:text-4xl">
            {siteConfig.about.title}
          </h2>
          <OrnamentDivider label={siteConfig.motto} />
        </div>

        <CanvasFrame className="space-y-6 p-8 md:p-10">
          {siteConfig.about.paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 30)}
              className="text-base leading-relaxed text-foreground-muted md:text-lg"
            >
              {paragraph}
            </p>
          ))}
          <OrnamentDivider />
          <p className="tagline-text text-center">{siteConfig.footerSlogan}</p>
        </CanvasFrame>
      </div>
    </section>
  );
}
