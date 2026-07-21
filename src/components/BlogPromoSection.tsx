"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { blogPosts } from "@/config/blog";
import { siteConfig } from "@/config/site";
import GlassSurface from "./GlassSurface";
import "./BlogPromoSection.css";

const AUTOPLAY_MS = 6000;

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={
        direction === "left" ? "blog-promo-carousel__chevron--left" : "blog-promo-carousel__chevron--right"
      }
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

function BlogPromoCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [autoplaySeed, setAutoplaySeed] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const total = blogPosts.length;

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % total) + total) % total);
      setAutoplaySeed((value) => value + 1);
    },
    [total],
  );

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused || total <= 1) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % total);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [paused, total, autoplaySeed]);

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
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
    <div
      className="blog-promo-carousel"
      aria-roledescription="carousel"
      aria-label="Статьи блога PC Барбершоп"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="blog-promo-carousel__viewport">
        {blogPosts.map((post, slideIndex) => {
          const isActive = slideIndex === index;

          return (
            <article
              key={post.slug}
              className={`blog-promo-carousel__slide${isActive ? " is-active" : ""}`}
              aria-hidden={!isActive}
            >
              <Link href={`/blog/${post.slug}`} className="blog-promo-carousel__slide-link">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="blog-promo-carousel__image object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={slideIndex === 0}
                />
                <div className="blog-promo-carousel__overlay" aria-hidden />
                <div className="blog-promo-carousel__caption">
                  <time className="blog-promo-carousel__date">{post.date}</time>
                  <h3 className="blog-promo-carousel__title">{post.title}</h3>
                  <p className="blog-promo-carousel__excerpt">{post.excerpt}</p>
                </div>
              </Link>
            </article>
          );
        })}
      </div>

      {total > 1 ? (
        <>
          <button
            type="button"
            className="blog-promo-carousel__nav blog-promo-carousel__nav--prev"
            aria-label="Предыдущая статья"
            onClick={goPrev}
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            type="button"
            className="blog-promo-carousel__nav blog-promo-carousel__nav--next"
            aria-label="Следующая статья"
            onClick={goNext}
          >
            <ChevronIcon direction="right" />
          </button>

          <div className="blog-promo-carousel__dots" aria-hidden>
            {blogPosts.map((post, dotIndex) => (
              <button
                key={post.slug}
                type="button"
                className={`blog-promo-carousel__dot${dotIndex === index ? " is-active" : ""}`}
                aria-label={`Статья ${dotIndex + 1}`}
                onClick={() => goTo(dotIndex)}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

export function BlogPromoSection() {
  const { blogPromo } = siteConfig;
  const featuredPosts = blogPosts.slice(0, 3);

  return (
    <section className="blog-promo noise-overlay" aria-labelledby="blog-promo-title">
      <div className="blog-promo-inner mx-auto max-w-7xl">
        <div className="blog-promo-grid">
          <div className="blog-promo-content">
            <p className="blog-promo-label">{blogPromo.label}</p>
            <h2 id="blog-promo-title" className="blog-promo-headline">
              {blogPromo.headline}
              <br />
              {blogPromo.headlineLine2}
            </h2>
            <p className="blog-promo-description">{blogPromo.description}</p>

            <ul className="blog-promo-posts">
              {featuredPosts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="blog-promo-post-link">
                    <span className="blog-promo-post-date">{post.date}</span>
                    <span className="blog-promo-post-title">{post.title}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <Link href="/blog" className="blog-promo-cta-link">
              <GlassSurface
                width="100%"
                height="100%"
                borderRadius={20}
                displace={0.35}
                distortionScale={-160}
                redOffset={0}
                greenOffset={8}
                blueOffset={16}
                brightness={42}
                opacity={0.88}
                mixBlendMode="screen"
                backgroundOpacity={0.12}
                saturation={1.25}
                blur={13}
                className="blog-promo-cta-glass"
              >
                <span className="blog-promo-cta-label">{blogPromo.cta}</span>
              </GlassSurface>
            </Link>
          </div>

          <div className="blog-promo-visual">
            <BlogPromoCarousel />
          </div>
        </div>
      </div>
    </section>
  );
}
