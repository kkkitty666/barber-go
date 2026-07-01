"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import "./AddToCartControls.css";

interface AddToCartControlsProps {
  slug: string;
  compact?: boolean;
}

export function AddToCartControls({ slug, compact = false }: AddToCartControlsProps) {
  const { items, addItem, setQuantity } = useCart();
  const cartLine = items.find((item) => item.slug === slug);
  const inCartQty = cartLine?.quantity ?? 0;
  const [pendingQty, setPendingQty] = useState(1);

  const displayQty = inCartQty > 0 ? inCartQty : pendingQty;

  const decrease = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (inCartQty > 0) {
      setQuantity(slug, inCartQty - 1);
      return;
    }
    setPendingQty((value) => Math.max(1, value - 1));
  };

  const increase = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (inCartQty > 0) {
      setQuantity(slug, inCartQty + 1);
      return;
    }
    setPendingQty((value) => Math.min(20, value + 1));
  };

  const handleAdd = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    addItem(slug, pendingQty);
  };

  const wrapperClass = `add-to-cart${compact ? " add-to-cart--compact" : ""}${inCartQty > 0 ? " add-to-cart--in-cart" : ""}`;

  return (
    <div className={wrapperClass} onClick={(event) => event.stopPropagation()}>
      <div className="add-to-cart__qty">
        <button type="button" aria-label="Уменьшить количество" onClick={decrease}>
          −
        </button>
        <span>{displayQty}</span>
        <button type="button" aria-label="Увеличить количество" onClick={increase}>
          +
        </button>
      </div>

      {inCartQty > 0 ? (
        <span className="add-to-cart__in-cart-label">В корзине</span>
      ) : (
        <button type="button" className="add-to-cart__btn" onClick={handleAdd}>
          В корзину
        </button>
      )}
    </div>
  );
}
