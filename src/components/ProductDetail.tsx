import Link from "next/link";
import { formatPrice, type Product } from "@/config/products";
import { AddToCartControls } from "./AddToCartControls";
import { CornerFlourish } from "./DecorativeElements";
import { ProductRating } from "./ProductRating";
import "./ProductDetail.css";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  return (
    <article className="product-detail">
      <div className="product-detail__grid">
        <div>
          <div className="product-detail__visual">
            <CornerFlourish position="top-left" className="top-3 left-3 z-10 !h-12 !w-12" />
            <CornerFlourish position="top-right" className="top-3 right-3 z-10 !h-12 !w-12" />
            <CornerFlourish position="bottom-left" className="bottom-3 left-3 z-10 !h-12 !w-12" />
            <CornerFlourish position="bottom-right" className="right-3 bottom-3 z-10 !h-12 !w-12" />
            <div className="product-detail__image-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={product.name}
                className="product-detail__image"
                style={{ objectPosition: product.imageFocus ?? "center center" }}
              />
            </div>
          </div>
          <div className="product-detail__meta">
            <p className="product-detail__meta-item">
              <strong>Объём</strong>
              {product.volume}
            </p>
            {product.fragrance && (
              <p className="product-detail__meta-item">
                <strong>Аромат</strong>
                {product.fragrance}
              </p>
            )}
          </div>
        </div>

        <div className="product-detail__content">
          <span className="product-detail__brand">{product.brand}</span>
          <h1 className="product-detail__title">{product.name}</h1>
          <p className="product-detail__subtitle">{product.subtitle}</p>
          <p className="product-detail__price">{formatPrice(product.price)} · самовывоз</p>

          <div className="product-detail__actions">
            <AddToCartControls slug={product.slug} />
          </div>

          <div className="product-detail__ratings-row">
            <ProductRating label="Блеск" value={product.shine} />
            <ProductRating label="Фиксация" value={product.hold} />
          </div>

          <p className="product-detail__description">{product.description}</p>

          <div>
            <h2 className="product-detail__section-title">Инструкция</h2>
            <ol className="product-detail__instructions">
              {product.instructions.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          {product.composition && (
            <div>
              <h2 className="product-detail__section-title">Состав</h2>
              <p className="product-detail__composition">{product.composition}</p>
            </div>
          )}

          {product.note && <p className="product-detail__note">{product.note}</p>}

          <Link href="/kosmetika" className="product-detail__back">
            Вернуться в каталог
          </Link>
        </div>
      </div>
    </article>
  );
}
