"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import "./FirstVisitPromo.css";

const STORAGE_KEY = "pc-barbershop-promo-dismissed";

export function FirstVisitPromo() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const timer = window.setTimeout(() => setOpen(true), 400);
    return () => window.clearTimeout(timer);
  }, []);

  const close = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  if (!open) return null;

  const { firstVisitPromo } = siteConfig;

  return (
    <div className="first-visit-promo" role="dialog" aria-modal="true" aria-labelledby="promo-title">
      <button type="button" className="first-visit-promo__backdrop" onClick={close} aria-label="Закрыть" />
      <div className="first-visit-promo__panel">
        <button type="button" className="first-visit-promo__close" onClick={close} aria-label="Закрыть">
          ×
        </button>

        <p className="first-visit-promo__label">PC Барбершоп · акция</p>
        <h2 id="promo-title" className="first-visit-promo__title">
          При первом посещении
          <span>скидка {firstVisitPromo.discountPercent}%</span>
        </h2>
        <p className="first-visit-promo__text">
          Запишитесь онлайн и получите скидку на первый визит в наш барбершоп.
        </p>

        <ul className="first-visit-promo__terms">
          {firstVisitPromo.terms.map((term) => (
            <li key={term}>{term}</li>
          ))}
        </ul>

        <div className="first-visit-promo__actions">
          <a
            href={siteConfig.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary first-visit-promo__cta"
            onClick={close}
          >
            Записаться со скидкой
          </a>
          <Link href="/uslugi" className="btn-secondary first-visit-promo__secondary" onClick={close}>
            Наши услуги
          </Link>
        </div>
      </div>
    </div>
  );
}
