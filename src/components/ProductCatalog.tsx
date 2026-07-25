"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatPrice, type ProductCategory } from "@/config/products";
import type { ProductWithInventory } from "@/lib/inventory";
import { AddToCartControls } from "./AddToCartControls";
import { CornerFlourish } from "./DecorativeElements";
import { ProductCatalogNav } from "./ProductCatalogNav";
import { StickyCatalogAside } from "./StickyCatalogAside";
import "./ProductCatalog.css";

function StockBadge({
  label,
  inStock,
  isLowStock,
}: {
  label: string;
  inStock: boolean;
  isLowStock: boolean;
}) {
  return (
    <p
      className={`product-card__stock${inStock ? "" : " product-card__stock--out"}${
        isLowStock ? " product-card__stock--low" : ""
      }`}
    >
      <span className="product-card__stock-dot" aria-hidden />
      {label}
    </p>
  );
}

interface ProductCatalogProps {
  products: ProductWithInventory[];
}

export function ProductCatalog({ products }: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("detox");
  const filteredProducts = products.filter((product) => product.category === selectedCategory);

  return (
    <div className="product-catalog">
      <StickyCatalogAside>
        <ProductCatalogNav
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </StickyCatalogAside>

      <div className="product-catalog-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
          <article key={product.slug} className="product-card">
            <CornerFlourish position="top-left" className="top-1 left-1 z-10 !h-7 !w-7 opacity-60" />
            <CornerFlourish position="top-right" className="top-1 right-1 z-10 !h-7 !w-7 opacity-60" />
            <CornerFlourish position="bottom-left" className="bottom-1 left-1 z-10 !h-7 !w-7 opacity-60" />
            <CornerFlourish position="bottom-right" className="right-1 bottom-1 z-10 !h-7 !w-7 opacity-60" />

            <Link
              href={`/kosmetika/${product.slug}`}
              className="product-card__visual"
              aria-label={product.name}
            >
              <span className="product-card__image-wrap">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 42vw, (max-width: 1100px) 28vw, 280px"
                  className="product-card__image"
                  style={{ objectFit: "contain", backgroundColor: "#ffffff" }}
                />
              </span>
            </Link>

            <div className="product-card__body">
              <Link href={`/kosmetika/${product.slug}`} className="product-card__info">
                <span className="product-card__brand">{product.brand}</span>
                <h3 className="product-card__name">{product.name}</h3>
                <p className="product-card__volume">{product.volume}</p>
              </Link>

              <div className="product-card__footer">
                <Link href={`/kosmetika/${product.slug}`} className="product-card__footer-link">
                  <p className="product-card__price">{formatPrice(product.price)}</p>
                  <StockBadge
                    label={product.availabilityLabel}
                    inStock={product.inStock}
                    isLowStock={product.isLowStock}
                  />
                </Link>

                <div className="product-card__actions">
                  <AddToCartControls
                    slug={product.slug}
                    variant="card"
                    inStock={product.inStock}
                    maxQuantity={product.quantity}
                    availabilityLabel={product.availabilityLabel}
                  />
                </div>
              </div>
            </div>
          </article>
          ))
        ) : (
          <p className="product-catalog-empty">
            В этой категории пока нет товаров. Следите за обновлениями каталога.
          </p>
        )}
      </div>
    </div>
  );
}
