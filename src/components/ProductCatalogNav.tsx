"use client";

import { productCategories, type ProductCategory } from "@/config/products";

type ProductCatalogNavProps = {
  selected: ProductCategory;
  onSelect: (category: ProductCategory) => void;
};

export function ProductCatalogNav({ selected, onSelect }: ProductCatalogNavProps) {
  return (
    <nav className="product-catalog-nav" aria-label="Каталог товаров">
      <p className="product-catalog-nav__title">Категории</p>
      <ul className="product-catalog-nav__list">
        {productCategories.map((category) => {
          const isActive = category.id === selected;

          return (
            <li key={category.id}>
              <button
                type="button"
                className={`product-catalog-nav__item${isActive ? " product-catalog-nav__item--active" : ""}`}
                onClick={() => onSelect(category.id)}
                aria-current={isActive ? "true" : undefined}
              >
                {category.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
