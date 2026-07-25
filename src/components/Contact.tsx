import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { buildYandexMapExternalUrl } from "@/lib/maps";
import { CanvasFrame } from "./DecorativeElements";
import { MessengerIcon } from "./MessengerIcon";
import { OrnamentDivider } from "./OrnamentDivider";
import { YandexMapEmbed } from "./YandexMapEmbed";

function ContactRow({
  icon,
  label,
  value,
  href,
  showDivider = true,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
  showDivider?: boolean;
}) {
  const inner = (
    <>
      <div className="icon-badge">{icon}</div>
      <div>
        <p className="font-display mb-1 text-[13px] tracking-[0.22em] text-gold uppercase">
          {label}
        </p>
        <p className="text-base text-foreground">{value}</p>
      </div>
    </>
  );

  return (
    <>
      {href ? (
        <a href={href} className="contact-row block transition-opacity hover:opacity-80">
          {inner}
        </a>
      ) : (
        <div className="contact-row">{inner}</div>
      )}
      {showDivider && <OrnamentDivider className="my-0" />}
    </>
  );
}

export function Contact() {
  const mapsLink = buildYandexMapExternalUrl();

  return (
    <section className="section-padding">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="font-display mb-4 text-4xl tracking-[0.28em] text-gold md:text-5xl">
            КОНТАКТЫ
          </h2>
          <OrnamentDivider />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <CanvasFrame className="px-6 py-2 md:px-10">
            <ContactRow
              label={siteConfig.addressLabel}
              value={siteConfig.fullAddress}
              href={mapsLink}
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />
            <ContactRow
              label="ВРЕМЯ РАБОТЫ"
              value={siteConfig.hoursLabel}
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <ContactRow
              label="ТЕЛЕФОН"
              value={siteConfig.phone}
              href={`tel:+${siteConfig.phoneRaw}`}
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              }
            />
            <div className="py-4">
              <p className="font-display mb-3 text-[13px] tracking-[0.22em] text-gold uppercase">
                Мессенджеры
              </p>
              <div className="flex gap-3">
                {siteConfig.messengers.map((m) => (
                  <a
                    key={m.name}
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-badge h-11 w-11"
                    title={"hint" in m && m.hint ? m.hint : m.name}
                    aria-label={"hint" in m && m.hint ? m.hint : m.name}
                  >
                    <MessengerIcon name={m.name} />
                  </a>
                ))}
              </div>
            </div>
          </CanvasFrame>

          <div className="canvas-frame contact-map-frame relative h-[360px] overflow-hidden lg:h-[420px]">
            <YandexMapEmbed />
          </div>
        </div>
      </div>
    </section>
  );
}
