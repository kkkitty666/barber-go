"use client";

import Link from "next/link";
import { formatPrice, productCatalog } from "@/config/products";
import { AddToCartControls } from "./AddToCartControls";
import { CornerFlourish } from "./DecorativeElements";
import { ProductRating } from "./ProductRating";
import "./ProductCatalog.css";

export function ProductCatalog() {
  return (
    <div className="product-catalog">
      <aside className="product-catalog-aside">
        <h2 className="product-catalog-aside__title">Косметика · стайлинг</h2>
        <p className="product-catalog-aside__text">
          Премиальные средства для укладки и ухода — то, чем пользуются наши барберы каждый день.
          Добавьте в корзину и заберите заказ в барбершопе.
        </p>
        <div className="product-catalog-aside__tip">
          <p className="product-catalog-aside__tip-title">Как подобрать средство?</p>
          <p className="product-catalog-aside__text">
            Для матовой текстуры — глина или паста. Для гладкого образа — помада. Для объёма —
            солевой спрей перед укладкой. Не уверены? Спросите мастера на стрижке.
          </p>
        </div>
      </aside>

      <div className="product-catalog-grid">
        {productCatalog.map((product) => (
          <article key={product.slug} className="product-card">
            <CornerFlourish position="top-left" className="top-1 left-1 z-10 !h-7 !w-7 opacity-60" />
            <CornerFlourish position="top-right" className="top-1 right-1 z-10 !h-7 !w-7 opacity-60" />
            <CornerFlourish position="bottom-left" className="bottom-1 left-1 z-10 !h-7 !w-7 opacity-60" />
            <CornerFlourish position="bottom-right" className="right-1 bottom-1 z-10 !h-7 !w-7 opacity-60" />

            <div className="product-card__inner">
              <div className="product-card__body">
                <Link href={`/kosmetika/${product.slug}`} className="product-card__info">
                  <span className="product-card__brand">{product.brand}</span>
                  <h3 className="product-card__name">{product.name}</h3>
                  <p className="product-card__subtitle">{product.subtitle}</p>
                  <div className="product-card__ratings">
                    <ProductRating label="Блеск" value={product.shine} />
                    <ProductRating label="Фиксация" value={product.hold} />
                  </div>
                </Link>

                <div className="product-card__footer">
                  <Link href={`/kosmetika/${product.slug}`} className="product-card__footer-link">
                    <p className="product-card__price">{formatPrice(product.price)}</p>
                    <span className="product-card__cta">Подробнее</span>
                  </Link>
                  <div className="product-card__actions">
                    <AddToCartControls slug={product.slug} compact />
                  </div>
                </div>
              </div>

              <Link href={`/kosmetika/${product.slug}`} className="product-card__visual" aria-label={product.name}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  className="product-card__image"
                  style={{ objectPosition: product.imageFocus ?? "center center" }}
                />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
