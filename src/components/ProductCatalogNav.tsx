"use client";

import { useState } from "react";
import { productCategories, type ProductCategory } from "@/config/products";

type ProductCatalogNavProps = {
  selected: ProductCategory;
  onSelect: (category: ProductCategory) => void;
};

export function ProductCatalogNav({ selected, onSelect }: ProductCatalogNavProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <nav className="product-catalog-nav" aria-label="Каталог товаров">
      <button
        type="button"
        className="product-catalog-nav__toggle"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="product-catalog-nav-panel"
      >
        <span>Категории</span>
        <svg
          className={`product-catalog-nav__chevron${isOpen ? " product-catalog-nav__chevron--open" : ""}`}
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          aria-hidden
        >
          <path
            d="M1 1.5L6 6.5L11 1.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        id="product-catalog-nav-panel"
        className={`product-catalog-nav__panel${isOpen ? " product-catalog-nav__panel--open" : ""}`}
        inert={!isOpen ? true : undefined}
      >
        <div className="product-catalog-nav__panel-inner">
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
                    tabIndex={isOpen ? undefined : -1}
                  >
                    {category.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
