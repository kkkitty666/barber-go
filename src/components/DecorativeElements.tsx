import type { ReactNode } from "react";

interface CornerFlourishProps {
  className?: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export function CornerFlourish({ className = "", position }: CornerFlourishProps) {
  const rotation = {
    "top-left": "",
    "top-right": "rotate-90",
    "bottom-right": "rotate-180",
    "bottom-left": "-rotate-90",
  }[position];

  return (
    <svg
      className={`pointer-events-none absolute h-16 w-16 text-gold/50 md:h-20 md:w-20 ${rotation} ${className}`}
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 4h20M4 4v20"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M4 4c8 4 12 8 16 16M4 4c4 8 8 12 16 16"
        stroke="currentColor"
        strokeWidth="0.75"
        opacity="0.7"
      />
      <path
        d="M8 8h8v8H8z"
        stroke="currentColor"
        strokeWidth="0.75"
        fill="none"
      />
      <path
        d="M10 10l4 4M14 10l-4 4"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.6"
      />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" opacity="0.5" />
      <path
        d="M20 4c4 2 6 4 8 8M4 20c2 4 4 6 8 8"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.4"
      />
    </svg>
  );
}

interface CanvasFrameProps {
  children: ReactNode;
  className?: string;
  showCorners?: boolean;
}

export function CanvasFrame({ children, className = "", showCorners = true }: CanvasFrameProps) {
  return (
    <div className={`canvas-frame relative ${className}`}>
      {showCorners && (
        <>
          <CornerFlourish position="top-left" className="top-2 left-2 md:top-3 md:left-3" />
          <CornerFlourish position="top-right" className="top-2 right-2 md:top-3 md:right-3" />
          <CornerFlourish position="bottom-left" className="bottom-2 left-2 md:bottom-3 md:left-3" />
          <CornerFlourish position="bottom-right" className="right-2 bottom-2 md:right-3 md:bottom-3" />
        </>
      )}
      {children}
    </div>
  );
}

export function LandscapeFooter({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`w-full text-gold/20 ${className}`}
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M0 120 L0 80 L40 60 L80 75 L120 55 L160 70 L200 50 L240 65 L280 45 L320 60 L360 40 L400 55 L440 35 L480 50 L520 30 L560 45 L600 25 L640 40 L680 30 L720 45 L760 35 L800 50 L840 40 L880 55 L920 45 L960 60 L1000 50 L1040 65 L1080 55 L1120 70 L1160 60 L1200 75 L1200 120 Z"
        fill="currentColor"
      />
      <path
        d="M0 120 L200 90 L400 100 L600 75 L800 95 L1000 80 L1200 100 L1200 120 Z"
        fill="currentColor"
        opacity="0.5"
      />
      <path
        d="M300 70 L320 30 L340 70 Z M700 65 L730 20 L760 65 Z M950 75 L975 35 L1000 75 Z"
        fill="currentColor"
        opacity="0.35"
      />
    </svg>
  );
}
