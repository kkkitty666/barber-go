"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { siteConfig } from "@/config/site";
import { PriceListIcon } from "./PriceListIcon";
import "./PriceList.css";

export function PriceList() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  let rowIndex = 0;

  return (
    <div
      ref={rootRef}
      className={`price-list ${visible ? "price-list--visible" : ""}`}
    >
      <header className="price-list-header">
        <div className="services-banner">
          <span>ПРАЙС-ЛИСТ</span>
        </div>
        <p className="price-list-intro">
          Запишитесь онлайн — мастер подберёт услугу под ваш образ.
        </p>
      </header>

      <div className="price-list-body">
        {siteConfig.priceList.map((section) => (
          <section key={section.category} className="price-list-section">
            <div className="price-list-section-head">
              <h2 className="price-list-category">{section.category}</h2>
              <p className="price-list-category-desc">{section.description}</p>
            </div>

            <ul className="price-list-rows">
              {section.items.map((item) => {
                const index = rowIndex++;
                return (
                  <li
                    key={item.name}
                    className={`price-list-row ${"featured" in item && item.featured ? "price-list-row--featured" : ""}`}
                    style={{ "--row-i": index } as CSSProperties}
                  >
                    <div className="price-list-row-glow" aria-hidden />
                    <div className="price-list-row-main">
                      {"icon" in item ? <PriceListIcon type={item.icon} /> : null}
                      <div className="price-list-row-info">
                        <span className="price-list-name">{item.name}</span>
                        {item.duration && (
                          <span className="price-list-duration">{item.duration}</span>
                        )}
                      </div>
                      <span className="price-list-price">{item.price}</span>
                    </div>
                    {"featured" in item && item.featured && (
                      <span className="price-list-badge">Хит</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <footer className="price-list-footer">
        <p className="price-list-note">
          Точная стоимость может зависеть от сложности и длины волос. Уточняйте у мастера при записи.
        </p>
        <Link
          href={siteConfig.dikidiUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary price-list-cta"
        >
          Записаться онлайн
        </Link>
      </footer>
    </div>
  );
}
