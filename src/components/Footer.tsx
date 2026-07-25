import Image from "next/image";
import { assets, siteConfig } from "@/config/site";
import { CookieSettingsButton } from "./CookieConsent";
import { LandscapeFooter } from "./DecorativeElements";
import { MessengerIcon } from "./MessengerIcon";
import { OrnamentDivider } from "./OrnamentDivider";

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-background-secondary/80 pb-[calc(var(--mobile-bar-height)+var(--safe-bottom)+1.5rem)] md:pb-8">
      <div className="section-padding !py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col items-center gap-6 md:flex-row md:justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={assets.logoGold}
                alt={siteConfig.name}
                width={64}
                height={64}
                className="h-14 w-14 object-contain"
              />
              <div>
                <p className="font-display text-base tracking-[0.18em] text-gold">{siteConfig.name}</p>
                <p className="tagline-text !tracking-[0.2em]">{siteConfig.motto}</p>
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="font-display mb-3 text-[13px] tracking-[0.22em] text-gold uppercase">
                Запись и соцсети
              </p>
              <div className="flex justify-center gap-3 md:justify-end">
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
          </div>

          <OrnamentDivider label={siteConfig.footerSlogan} className="mb-6" />

          <div className="flex flex-col items-center justify-between gap-4 text-sm text-foreground-muted md:flex-row">
            <p>© {new Date().getFullYear()} {siteConfig.name}. Все права защищены.</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <a href="/politika-konfidencialnosti" className="hover:text-gold">
                Политика конфиденциальности
              </a>
              <a href="/oferta" className="hover:text-gold">
                Оферта
              </a>
              <CookieSettingsButton className="hover:text-gold" />
              <p>{siteConfig.fullAddress} · {siteConfig.hours}</p>
            </div>
          </div>
        </div>
      </div>

      <LandscapeFooter className="absolute right-0 bottom-0 left-0 h-16 opacity-60" />
    </footer>
  );
}
