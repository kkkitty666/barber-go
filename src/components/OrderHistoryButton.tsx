"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function OrderHistoryButton() {
  const pathname = usePathname();
  const active = pathname.startsWith("/kosmetika/zakazy");

  return (
    <Link
      href="/kosmetika/zakazy"
      className={`shop-action-button${active ? " shop-action-button--active" : ""}`}
      aria-label="Мои заказы"
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-5 w-5">
        <path
          d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span>Мои заказы</span>
    </Link>
  );
}
