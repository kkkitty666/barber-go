"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { OrnamentDivider } from "./OrnamentDivider";

const DomeGallery = dynamic(() => import("./DomeGallery"), { ssr: false });

export function WorksSection() {
  return (
    <section className="section-padding noise-overlay bg-background-secondary/30 pt-8">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-6 text-center">
          <h2 className="font-display mb-4 text-3xl tracking-[0.3em] text-gold md:text-4xl">
            НАШИ РАБОТЫ
          </h2>
          <OrnamentDivider label="КАЧЕСТВО В ДЕТАЛЯХ" />
          <p className="mx-auto mt-6 max-w-xl text-sm text-foreground-muted">
            Листайте галерею — перетаскивайте мышью или пальцем, нажмите на фото для увеличения
          </p>
        </div>

        <div className="works-gallery-shell relative mx-auto h-[52vh] min-h-[320px] max-h-[560px] w-full overflow-hidden md:h-[70vh] md:min-h-[480px] md:max-h-[720px]">
          <DomeGallery
            images={[...siteConfig.worksGallery]}
            fit={0.75}
            minRadius={600}
            maxVerticalRotationDeg={14}
            segments={34}
            dragDampening={2.6}
            grayscale={false}
            overlayBlurColor="#0d0d0d"
            imageBorderRadius="20px"
            openedImageBorderRadius="24px"
          />
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/raboty" className="btn-secondary text-xs">
            Все фото работ
          </Link>
        </div>
      </div>
    </section>
  );
}
