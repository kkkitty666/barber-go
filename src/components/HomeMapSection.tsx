"use client";

import { siteConfig } from "@/config/site";
import { CornerFlourish } from "./DecorativeElements";
import { YandexMapEmbed } from "./YandexMapEmbed";

function MessengerIcon({ name }: { name: string }) {
  if (name === "WhatsApp") {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    );
  }
  if (name === "Telegram") {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    );
  }
  return <span className="font-display text-xs font-bold">M</span>;
}

export function HomeMapSection() {
  return (
    <section id="contacts" className="section-padding relative z-10 pb-[calc(var(--mobile-bar-height)+var(--safe-bottom)+2rem)] md:pb-20">
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
