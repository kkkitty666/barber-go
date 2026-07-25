"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import "./PromoCarousel.css";

const { slides, autoplayMs } = siteConfig.promoCarousel;

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={direction === "left" ? "promo-carousel__chevron--left" : "promo-carousel__chevron--right"}
    >
      <path
        d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PromoCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [transitionEnabled, setTransitionEnabled] = useState(false);
  const [paused, setPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [autoplaySeed, setAutoplaySeed] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const indexRef = useRef(index);
  const total = slides.length;
  const slide = slides[index];

  indexRef.current = index;

  const goTo = useCallback(
    (next: number, dir?: 1 | -1) => {
      const normalized = ((next % total) + total) % total;
      if (normalized === indexRef.current) return;

      const inferredDir: 1 | -1 =
        dir ??
        (normalized > indexRef.current || (indexRef.current === total - 1 && normalized === 0)
          ? 1
          : -1);

      setTransitionEnabled(true);
      setDirection(inferredDir);
      setIndex(normalized);
      setAutoplaySeed((value) => value + 1);
    },
    [total],
  );

  const goNext = useCallback(() => goTo(indexRef.current + 1, 1), [goTo]);
  const goPrev = useCallback(() => goTo(indexRef.current - 1, -1), [goTo]);

  useEffect(() => {
    const syncVisibility = () => {
      setTabHidden(document.visibilityState === "hidden");
    };
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  useEffect(() => {
    if (paused || tabHidden || total <= 1) return;

    const timer = window.setInterval(() => {
      setTransitionEnabled(true);
      setDirection(1);
      setIndex((current) => (current + 1) % total);
    }, autoplayMs);

    return () => window.clearInterval(timer);
  }, [paused, tabHidden, total, autoplaySeed, autoplayMs]);

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    const startX = touchStartX.current;
    const endX = event.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (startX == null || endX == null) return;

    const delta = endX - startX;
    if (Math.abs(delta) < 40) return;
    if (delta > 0) goPrev();
    else goNext();
  };

  return (
    <section
      className="promo-carousel"
      aria-roledescription="carousel"
      aria-label="Акции PC Барбершоп"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="promo-carousel__inner mx-auto max-w-7xl">
        <div className="promo-carousel__panel">
          <div className="promo-carousel__slide-bg" aria-hidden />

          {total > 1 ? (
            <>
              <button
                type="button"
                className="promo-carousel__nav promo-carousel__nav--prev"
                aria-label="Предыдущая акция"
                onClick={goPrev}
              >
                <ChevronIcon direction="left" />
              </button>
              <button
                type="button"
                className="promo-carousel__nav promo-carousel__nav--next"
                aria-label="Следующая акция"
                onClick={goNext}
              >
                <ChevronIcon direction="right" />
              </button>
            </>
          ) : null}

          <div
            key={slide.id}
            className={
              transitionEnabled
                ? `promo-carousel__stage promo-carousel__stage--${direction === 1 ? "next" : "prev"}`
                : "promo-carousel__stage"
            }
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="promo-carousel__grid">
              <div className="promo-carousel__content">
                <span className="promo-carousel__badge">{slide.badge}</span>
                <h2 className="promo-carousel__headline">
                  {slide.headline}
                  <span className="promo-carousel__headline-accent">{slide.headlineAccent}</span>
                </h2>
                <p className="promo-carousel__description">{slide.description}</p>
                {slide.cta.external ? (
                  <a
                    href={slide.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="promo-carousel__cta"
                  >
                    {slide.cta.label}
                  </a>
                ) : (
                  <Link href={slide.cta.href} className="promo-carousel__cta">
                    {slide.cta.label}
                  </Link>
                )}
              </div>

              <div className="promo-carousel__visual-row">
                <div
                  className={`promo-carousel__visual${"variant" in slide && slide.variant === "product" ? " promo-carousel__visual--product" : ""}`}
                >
                  <div className="promo-carousel__visual-frame" aria-hidden />
                  <Image
                    src={slide.image}
                    alt={slide.imageAlt}
                    fill
                    className="promo-carousel__image object-cover"
                    sizes="(max-width: 768px) 55vw, 420px"
                    priority={index === 0}
                  />
                </div>
              </div>
            </div>
          </div>

          {total > 1 ? (
            <div className="promo-carousel__dots">
              {slides.map((dotSlide, dotIndex) => (
                <button
                  key={dotSlide.id}
                  type="button"
                  className={`promo-carousel__dot${dotIndex === index ? " is-active" : ""}`}
                  aria-label={`Акция ${dotIndex + 1}`}
                  aria-current={dotIndex === index ? "true" : undefined}
                  onClick={() => goTo(dotIndex)}
                />
              ))}
            </div>
          ) : null}
        </div>

        <div className="promo-carousel__scroll-hint" aria-hidden>
          <span className="promo-carousel__scroll-label">Листайте вниз</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="promo-carousel__scroll-icon">
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
