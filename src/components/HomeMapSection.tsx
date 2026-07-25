"use client";

import { siteConfig } from "@/config/site";
import { CornerFlourish } from "./DecorativeElements";
import { MessengerIcon } from "./MessengerIcon";
import { YandexMapEmbed } from "./YandexMapEmbed";

export function HomeMapSection() {
  return (
    <section id="contacts" className="section-padding relative z-10 md:pb-20">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="home-map-frame relative">
          <div className="grid min-h-[420px] md:grid-cols-2 md:min-h-[480px]">
            <div className="home-map-panel order-2 flex flex-col justify-center px-8 py-12 md:order-1 md:px-12 lg:px-14">
              <CornerFlourish position="top-left" className="top-3 left-3 z-10" />
              <CornerFlourish position="bottom-left" className="bottom-3 left-3 z-10" />

              <h2 className="font-display mb-8 text-2xl tracking-[0.2em] text-white uppercase md:text-3xl">
                Контакты
              </h2>

              <a
                href={`tel:+${siteConfig.phoneRaw}`}
                className="mb-6 font-display text-2xl tracking-wide text-white transition-opacity hover:opacity-80 md:text-3xl"
              >
                {siteConfig.phone}
              </a>

              <p className="mb-4 max-w-md text-sm leading-relaxed text-white/90 md:text-base">
                <span className="text-gold">{siteConfig.fullAddress}</span>
              </p>

              <p className="mb-2 text-sm uppercase tracking-wider text-white/80">
                {siteConfig.hoursLabel}
              </p>

              <p className="font-display mb-8 text-sm tracking-[0.25em] text-white/70 uppercase">
                {siteConfig.name}
              </p>

              <div className="flex gap-4">
                {siteConfig.messengers.map((m) => (
                  <a
                    key={m.name}
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-badge icon-badge--inverse h-11 w-11"
                    title={"hint" in m && m.hint ? m.hint : m.name}
                    aria-label={"hint" in m && m.hint ? m.hint : m.name}
                  >
                    <MessengerIcon name={m.name} />
                  </a>
                ))}
              </div>
            </div>

            <div className="home-map-mapwrap order-1 md:order-2">
              <YandexMapEmbed />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
