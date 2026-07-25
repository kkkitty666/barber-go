"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

const DESKTOP_MQ = "(min-width: 768px)";

type StickyCatalogAsideProps = {
  children: ReactNode;
};

function measureStickyTopPx(): number {
  const probe = document.createElement("div");
  probe.style.cssText =
    "position:fixed;top:calc(var(--header-offset) + var(--safe-top) + 0.5rem);left:0;width:0;height:0;visibility:hidden;pointer-events:none;";
  document.body.appendChild(probe);
  const top = probe.getBoundingClientRect().top;
  probe.remove();
  return top;
}

/**
 * Desktop affix:
 * - At rest: in normal flow, top aligned with product cards (not under the page title alone).
 * - On scroll: switches to position:fixed so it stays put beside the cards.
 * - Near end of catalog: releases so it doesn't float over the footer.
 * Mobile: CSS sticky on `.product-catalog-aside__pin`.
 */
export function StickyCatalogAside({ children }: StickyCatalogAsideProps) {
  const asideRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [fixedStyle, setFixedStyle] = useState<CSSProperties | undefined>(undefined);

  useEffect(() => {
    const aside = asideRef.current;
    const pin = pinRef.current;
    if (!aside || !pin) return;

    const media = window.matchMedia(DESKTOP_MQ);
    let raf = 0;

    const sync = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!media.matches) {
          aside.style.height = "";
          setFixedStyle(undefined);
          return;
        }

        const catalog = aside.closest(".product-catalog");
        if (!catalog) return;

        const stickyTop = measureStickyTopPx();
        const pinHeight = pin.offsetHeight;
        const catalogRect = catalog.getBoundingClientRect();
        const asideRect = aside.getBoundingClientRect();

        // Release when the catalog has scrolled away (don't float over footer).
        const catalogStillHere = catalogRect.bottom > stickyTop + pinHeight + 24;

        // Affix once the natural column top would go under the header.
        // While page title is visible, asideRect.top is below stickyTop → stay in flow
        // (parallel with cards). After scroll, fix in place.
        const shouldFix = asideRect.top <= stickyTop && catalogStillHere;

        if (shouldFix) {
          aside.style.height = `${pinHeight}px`;
          const next: CSSProperties = {
            position: "fixed",
            top: stickyTop,
            left: asideRect.left,
            width: asideRect.width,
            zIndex: 20,
            maxHeight: `calc(100dvh - ${stickyTop}px - 1rem)`,
            overflowX: "hidden",
            overflowY: "auto",
          };
          setFixedStyle((prev) => {
            if (
              prev &&
              prev.position === next.position &&
              prev.top === next.top &&
              prev.left === next.left &&
              prev.width === next.width
            ) {
              return prev;
            }
            return next;
          });
        } else {
          aside.style.height = "";
          setFixedStyle(undefined);
        }
      });
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    media.addEventListener("change", sync);

    const ro = new ResizeObserver(sync);
    ro.observe(aside);
    ro.observe(pin);
    const catalog = aside.closest(".product-catalog");
    if (catalog) ro.observe(catalog);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      media.removeEventListener("change", sync);
      ro.disconnect();
      aside.style.height = "";
    };
  }, []);

  return (
    <aside ref={asideRef} className="product-catalog-aside">
      <div ref={pinRef} className="product-catalog-aside__pin" style={fixedStyle}>
        {children}
      </div>
    </aside>
  );
}
