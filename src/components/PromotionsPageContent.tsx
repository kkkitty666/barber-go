import Image from "next/image";
import Link from "next/link";
import { activePromotions } from "@/config/promotions";
import { siteConfig } from "@/config/site";
import "./PromotionsPageContent.css";

function PromotionCta({ promo }: { promo: (typeof activePromotions)[number] }) {
  if (promo.cta.external) {
    return (
      <a
        href={promo.cta.href}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary promo-card__cta"
      >
        {promo.cta.label}
      </a>
    );
  }

  return (
    <Link href={promo.cta.href} className="btn-primary promo-card__cta">
      {promo.cta.label}
    </Link>
  );
}

export function PromotionsPageContent() {
  return (
    <div className="promotions-page">
      <p className="promotions-page__intro">
        Действующие предложения PC Барбершоп. Условия акций уточняйте при записи — мы работаем с{" "}
        {siteConfig.hours} по адресу {siteConfig.fullAddress}.
      </p>

      <ul className="promotions-page__list">
        {activePromotions.map((promo) => (
          <li key={promo.id} className="promo-card">
            <div className="promo-card__visual">
              <Image
                src={promo.image}
                alt={promo.imageAlt}
                fill
                className="promo-card__image object-cover"
                sizes="(max-width: 768px) 100vw, 420px"
              />
              <div className="promo-card__visual-overlay" aria-hidden />
              <span className="promo-card__badge">{promo.badge}</span>
            </div>

            <div className="promo-card__body">
              <h2 className="promo-card__title">
                {promo.title}
                {promo.titleAccent ? (
                  <>
                    <br />
                    <span className="promo-card__title-accent">{promo.titleAccent}</span>
                  </>
                ) : null}
              </h2>
              <p className="promo-card__description">{promo.description}</p>

              <ul className="promo-card__terms">
                {promo.terms.map((term) => (
                  <li key={term}>{term}</li>
                ))}
              </ul>

              <PromotionCta promo={promo} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
