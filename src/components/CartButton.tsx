"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { OrderHistoryButton } from "./OrderHistoryButton";

export function CartButton() {
  const { itemCount } = useCart();
  const pathname = usePathname();
  const active = pathname.startsWith("/kosmetika/korzina") || pathname.startsWith("/kosmetika/oformlenie");

  return (
    <Link
      href="/kosmetika/korzina"
      className={`shop-action-button${active ? " shop-action-button--active" : ""}`}
      aria-label={`Корзина и оформление заказа, товаров: ${itemCount}`}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-5 w-5">
        <path
          d="M6 6h15l-1.5 9h-12L6 6Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M6 6 5 3H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9.5" cy="19.5" r="1.25" fill="currentColor" />
        <circle cx="16.5" cy="19.5" r="1.25" fill="currentColor" />
      </svg>
      <span>Корзина</span>
      {itemCount > 0 && <span className="shop-action-button__badge">{itemCount}</span>}
    </Link>
  );
}

export function ShopHeaderActions() {
  return (
    <div className="shop-header-actions">
      <OrderHistoryButton />
      <CartButton />
    </div>
  );
}
