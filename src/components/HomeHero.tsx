import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { PhotoWallpaperBlend } from "./PhotoWallpaperBlend";
import "./HomeHero.css";

export function HomeHero() {
  return (
    <section className="hero-home section-photo-blend">
      <PhotoWallpaperBlend edges={["bottom"]} className="hero-home__flyer">
        <Image
          src="/assets/flyer-interior.png"
          alt=""
          fill
          priority
          className="hero-home__flyer-image object-cover"
          sizes="100vw"
        />
      </PhotoWallpaperBlend>

      <div className="hero-home__shade" aria-hidden />

      <div className="relative z-10 mx-auto flex min-h-[56vh] max-w-7xl flex-col justify-end px-4 pb-14 pt-28 md:min-h-[62vh] md:px-8 md:pb-16">
        <div className="hero-home__content max-w-xl">
          <p className="mb-4 text-[0.65rem] leading-normal tracking-[0.24em] text-gold/80 uppercase md:mb-5">
            {siteConfig.hoursLabel}
          </p>
          <h1 className="font-display text-2xl leading-[1.35] tracking-[0.12em] text-foreground uppercase md:text-4xl md:leading-[1.3]">
            {siteConfig.heroSlogan}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-foreground-muted md:text-base">
            {siteConfig.fullAddress} · мужские стрижки и борода · косметика с самовывозом
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={siteConfig.dikidiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-xs"
            >
              Онлайн запись
            </a>
            <Link href="/kosmetika" className="btn-secondary text-xs">
              Каталог косметики
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
