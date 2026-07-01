"use client";

import type { ReactNode } from "react";
import "./PriceListIcon.css";

export type PriceListIconType =
  | "haircut"
  | "clipper"
  | "child"
  | "combo-cut"
  | "gray-cover"
  | "beard"
  | "beard-mustache"
  | "shave-beard"
  | "shave-head"
  | "royal-shave"
  | "styling"
  | "wash"
  | "beard-dye"
  | "combo-full";

interface PriceListIconProps {
  type: PriceListIconType;
}

export function PriceListIcon({ type }: PriceListIconProps) {
  const icons: Record<PriceListIconType, ReactNode> = {
    haircut: (
      <svg viewBox="0 0 48 48" fill="none" className="price-list-icon-svg price-list-icon-svg--snip">
        <path d="M10 38L28 12l6 6L16 44l-6-6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M28 12l10-4 4 4-4 10" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M8 30l4 4M12 26l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="price-list-icon-spark" />
      </svg>
    ),
    clipper: (
      <svg viewBox="0 0 48 48" fill="none" className="price-list-icon-svg price-list-icon-svg--buzz">
        <rect x="14" y="10" width="20" height="28" rx="4" stroke="currentColor" strokeWidth="1.6" />
        <path d="M18 18h12M18 24h12M18 30h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M20 6h8v4h-8z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
    child: (
      <svg viewBox="0 0 48 48" fill="none" className="price-list-icon-svg price-list-icon-svg--bounce">
        <circle cx="24" cy="17" r="8" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 40c0-7 5-12 12-12s12 5 12 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M20 15h8M24 11v8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
    "combo-cut": (
      <svg viewBox="0 0 48 48" fill="none" className="price-list-icon-svg price-list-icon-svg--combo">
        <path d="M8 34l14-18 5 5-14 18-5-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M28 20c0 6 3 10 8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M32 14v6M29 17h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="price-list-icon-spark" />
      </svg>
    ),
    "gray-cover": (
      <svg viewBox="0 0 48 48" fill="none" className="price-list-icon-svg price-list-icon-svg--spray">
        <path d="M16 32c4-8 12-8 16 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="24" cy="18" r="7" stroke="currentColor" strokeWidth="1.6" />
        <path d="M30 10l4-2 2 4" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" className="price-list-icon-mist" />
        <circle cx="34" cy="8" r="1.5" fill="currentColor" className="price-list-icon-mist" />
      </svg>
    ),
    beard: (
      <svg viewBox="0 0 48 48" fill="none" className="price-list-icon-svg price-list-icon-svg--beard">
        <circle cx="24" cy="16" r="9" stroke="currentColor" strokeWidth="1.6" />
        <path d="M14 28c0 8 4 14 10 14s10-6 10-14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M18 30c1 4 3.5 6 6 6s5-2 6-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    "beard-mustache": (
      <svg viewBox="0 0 48 48" fill="none" className="price-list-icon-svg price-list-icon-svg--mustache">
        <circle cx="24" cy="15" r="8" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 24c3 4 8 5 12 5s9-1 12-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M16 36c2 5 5 8 8 8s6-3 8-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    "shave-beard": (
      <svg viewBox="0 0 48 48" fill="none" className="price-list-icon-svg price-list-icon-svg--glide">
        <path d="M8 32L26 14l8 8L16 40l-8-8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M14 34c4-2 8-2 12 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="price-list-icon-trail" />
      </svg>
    ),
    "shave-head": (
      <svg viewBox="0 0 48 48" fill="none" className="price-list-icon-svg price-list-icon-svg--glide">
        <circle cx="24" cy="20" r="11" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 32L28 14l6 6L16 38l-6-6z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M18 8h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    "royal-shave": (
      <svg viewBox="0 0 48 48" fill="none" className="price-list-icon-svg price-list-icon-svg--crown">
        <path d="M10 30l4-12 6 8 4-10 4 10 6-8 4 12H10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M12 36h24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M8 32L26 14l6 6" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" className="price-list-icon-spark" />
      </svg>
    ),
    styling: (
      <svg viewBox="0 0 48 48" fill="none" className="price-list-icon-svg price-list-icon-svg--tilt">
        <rect x="16" y="12" width="16" height="26" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M20 20h8M20 26h8M20 32h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M22 8h4v4h-4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
    wash: (
      <svg viewBox="0 0 48 48" fill="none" className="price-list-icon-svg price-list-icon-svg--drops">
        <path d="M24 8c6 10 10 14 10 20a10 10 0 11-20 0c0-6 4-10 10-20z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="14" cy="30" r="2" fill="currentColor" className="price-list-icon-drop" />
        <circle cx="34" cy="28" r="1.5" fill="currentColor" className="price-list-icon-drop price-list-icon-drop--delay" />
      </svg>
    ),
    "beard-dye": (
      <svg viewBox="0 0 48 48" fill="none" className="price-list-icon-svg price-list-icon-svg--pulse">
        <path d="M14 28c0 8 4 12 10 12s10-4 10-12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="24" cy="16" r="8" stroke="currentColor" strokeWidth="1.6" />
        <rect x="30" y="8" width="8" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" className="price-list-icon-tube" />
      </svg>
    ),
    "combo-full": (
      <svg viewBox="0 0 48 48" fill="none" className="price-list-icon-svg price-list-icon-svg--star">
        <path d="M24 6l4 10 11 1-8 7 2 11-9-5-9 5 2-11-8-7 11-1 4-10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="24" cy="24" r="4" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  };

  return (
    <span className={`price-list-icon price-list-icon--${type}`} aria-hidden>
      {icons[type]}
    </span>
  );
}
