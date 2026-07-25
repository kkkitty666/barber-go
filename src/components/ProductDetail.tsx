import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/config/products";
import type { ProductWithInventory } from "@/lib/inventory";
import { AddToCartControls } from "./AddToCartControls";
import "./ProductDetail.css";

interface ProductDetailProps {
  product: ProductWithInventory;
}

export function ProductDetail({ product }: ProductDetailProps) {
  return (
    <article className="product-detail">
      <div className="product-detail__grid">
        <div>
          <div className="product-detail__visual">
            <div className="product-detail__image-wrap">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 90vw, 480px"
                className="product-detail__image"
                style={{ objectFit: "contain", backgroundColor: "#ffffff" }}
              />
            </div>
          </div>
          <div className="product-detail__meta">
            <p className="product-detail__meta-item">
              <strong>Объём</strong>
              {product.volume}
            </p>
            {product.sku ? (
              <p className="product-detail__meta-item">
                <strong>Артикул</strong>
                {product.sku}
              </p>
            ) : null}
          </div>
        </div>

        <div className="product-detail__content">
          <span className="product-detail__brand">{product.brand}</span>
          <h1 className="product-detail__title">{product.name}</h1>
          <p className="product-detail__price">{formatPrice(product.price)}</p>

          <p
            className={`product-detail__stock${
              product.inStock ? "" : " product-detail__stock--out"
            }${product.isLowStock ? " product-detail__stock--low" : ""}`}
          >
            {product.availabilityLabel}
            {product.inStock ? " · самовывоз" : ""}
          </p>

          <div className="product-detail__actions">
            <AddToCartControls
              slug={product.slug}
              inStock={product.inStock}
              maxQuantity={product.quantity}
              availabilityLabel={product.availabilityLabel}
            />
          </div>

          <p className="product-detail__description">{product.description}</p>

          <div>
            <h2 className="product-detail__section-title">Применение</h2>
            <ol className="product-detail__instructions">
              {product.instructions.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          {product.composition ? (
            <div>
              <h2 className="product-detail__section-title">Состав</h2>
              <p className="product-detail__composition">{product.composition}</p>
            </div>
          ) : null}

          {product.note ? <p className="product-detail__note">{product.note}</p> : null}

          <Link href="/kosmetika" className="product-detail__back">
            Вернуться в каталог
          </Link>
        </div>
      </div>
    </article>
  );
}
