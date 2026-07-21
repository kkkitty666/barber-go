"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import "./AddToCartControls.css";

interface AddToCartControlsProps {
  slug: string;
  compact?: boolean;
  variant?: "default" | "card";
  inStock?: boolean;
  maxQuantity?: number | null;
  availabilityLabel?: string;
}

function clampQuantity(value: number, maxQuantity: number | null) {
  const limit = maxQuantity ?? 20;
  return Math.max(1, Math.min(limit, value));
}

export function AddToCartControls({
  slug,
  compact = false,
  variant = "default",
  inStock = true,
  maxQuantity = null,
  availabilityLabel,
}: AddToCartControlsProps) {
  const { items, addItem, setQuantity } = useCart();
  const cartLine = items.find((item) => item.slug === slug);
  const inCartQty = cartLine?.quantity ?? 0;
  const [draftQty, setDraftQty] = useState(String(Math.max(inCartQty, 1)));

  const isOutOfStock = !inStock || maxQuantity === 0;
  const qtyLimit = maxQuantity ?? 20;
  const canIncrease = maxQuantity === null ? inCartQty < qtyLimit : inCartQty < maxQuantity;

  useEffect(() => {
    if (inCartQty > 0) {
      setDraftQty(String(inCartQty));
    }
  }, [inCartQty]);

  const applyCartQuantity = (nextRaw: number) => {
    if (isOutOfStock || !Number.isFinite(nextRaw)) return;

    if (nextRaw <= 0) {
      setQuantity(slug, 0, { inStock, maxQuantity });
      setDraftQty("1");
      return;
    }

    const nextQuantity = clampQuantity(nextRaw, maxQuantity);
    setQuantity(slug, nextQuantity, { inStock, maxQuantity });
    setDraftQty(String(nextQuantity));
  };

  const decrease = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (isOutOfStock || inCartQty <= 0) return;
    applyCartQuantity(inCartQty - 1);
  };

  const increase = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (isOutOfStock || inCartQty <= 0 || !canIncrease) return;
    applyCartQuantity(inCartQty + 1);
  };

  const handleDraftChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    setDraftQty(event.target.value.replace(/[^\d]/g, ""));
  };

  const commitDraft = () => {
    if (inCartQty <= 0) return;
    if (draftQty.trim() === "") {
      setDraftQty(String(inCartQty));
      return;
    }
    applyCartQuantity(Number(draftQty));
  };

  const handleDraftKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
    if (event.key === "Enter") {
      event.preventDefault();
      commitDraft();
      event.currentTarget.blur();
    }
  };

  const handleAdd = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (isOutOfStock) return;
    addItem(slug, 1, { inStock, maxQuantity });
  };

  const wrapperClass = [
    "add-to-cart",
    compact ? "add-to-cart--compact" : "",
    inCartQty > 0 ? "add-to-cart--in-cart" : "",
    variant === "card" ? "add-to-cart--card" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (isOutOfStock) {
    return (
      <div className={wrapperClass} onClick={(event) => event.stopPropagation()}>
        <span
          className={`add-to-cart__in-cart-label${
            variant === "card"
              ? " add-to-cart__in-cart-label--card add-to-cart__in-cart-label--out"
              : " add-to-cart__in-cart-label--out"
          }`}
        >
          {availabilityLabel ?? "Нет в наличии"}
        </span>
      </div>
    );
  }

  if (inCartQty > 0) {
    return (
      <div className={wrapperClass} onClick={(event) => event.stopPropagation()}>
        <span
          className={`add-to-cart__in-cart-label${
            variant === "card" ? " add-to-cart__in-cart-label--card" : ""
          }`}
        >
          В корзине
        </span>
        <div className={`add-to-cart__qty${variant === "card" ? " add-to-cart__qty--card" : ""}`}>
          <button type="button" aria-label="Уменьшить количество" onClick={decrease}>
            −
          </button>
          <input
            className="add-to-cart__qty-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={draftQty}
            aria-label="Количество"
            onClick={(event) => event.stopPropagation()}
            onChange={handleDraftChange}
            onBlur={commitDraft}
            onKeyDown={handleDraftKeyDown}
          />
          <button
            type="button"
            aria-label="Увеличить количество"
            onClick={increase}
            disabled={!canIncrease}
          >
            +
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={wrapperClass} onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        className={`add-to-cart__btn${variant === "card" ? " add-to-cart__btn--card" : ""}`}
        onClick={handleAdd}
      >
        В корзину
      </button>
    </div>
  );
}
