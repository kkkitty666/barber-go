import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import "./HomeHero.css";

export function HomeHero() {
  return (
    <section className="hero-home">
      <div className="hero-home__layout">
        <div className="hero-home__content">
          <p className="hero-home__eyebrow">{siteConfig.hoursLabel}</p>
          <h1 className="hero-home__title">{siteConfig.heroSlogan}</h1>
          <p className="hero-home__lead">
            {siteConfig.fullAddress} · мужские стрижки и борода · косметика с самовывозом
          </p>
          <div className="hero-home__actions">
            <a
              href={siteConfig.bookingUrl}
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

        <div className="hero-home__poster">
          <div className="hero-home__poster-frame">
            <Image
              src="/assets/hero-poster-rs.jpg"
              alt="Постер PC Барбершоп — Rebrand yourself"
              fill
              priority
              className="hero-home__poster-image"
              sizes="(max-width: 767px) 94vw, 55vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
