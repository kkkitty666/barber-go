"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import type { ChromaGridProps } from "./ChromaGrid.types";
import "./ChromaGrid.css";

export function ChromaGrid({
  items,
  className = "",
  radius = 300,
  columns = 3,
  rows = 2,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
  expandable = false,
  bookLabel = "Записаться",
}: ChromaGridProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const setX = useRef<((value: number) => void) | null>(null);
  const setY = useRef<((value: number) => void) | null>(null);
  const pos = useRef({ x: 0, y: 0 });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    setX.current = gsap.quickSetter(el, "--x", "px") as (value: number) => void;
    setY.current = gsap.quickSetter(el, "--y", "px") as (value: number) => void;
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const root = rootRef.current;
    if (!root) return;

    const rect = root.getBoundingClientRect();
    moveTo(event.clientX - rect.left, event.clientY - rect.top);
    if (fadeRef.current) {
      gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
    }
  };

  const handleLeave = () => {
    if (!fadeRef.current) return;
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true,
    });
  };

  const getItemId = (item: (typeof items)[number], index: number) => item.id ?? `${item.title}-${index}`;

  const handleCardClick = (item: (typeof items)[number], index: number) => {
    if (expandable) {
      const id = getItemId(item, index);
      setExpandedId((current) => (current === id ? null : id));
      return;
    }

    if (item.url) {
      window.open(item.url, "_blank", "noopener,noreferrer");
    }
  };

  const handleCardMove = (event: React.MouseEvent<HTMLElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleCardKeyDown = (
    event: React.KeyboardEvent<HTMLElement>,
    item: (typeof items)[number],
    index: number,
  ) => {
    if (!expandable) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick(item, index);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={
        {
          "--r": `${radius}px`,
          "--cols": columns,
          "--rows": rows,
        } as React.CSSProperties
      }
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {items.map((item, index) => {
        const itemId = getItemId(item, index);
        const expanded = expandable && expandedId === itemId;

        return (
          <article
            key={itemId}
            className={`chroma-card${expanded ? " chroma-card--expanded" : ""}`}
            onMouseMove={handleCardMove}
            onClick={() => handleCardClick(item, index)}
            onKeyDown={(event) => handleCardKeyDown(event, item, index)}
            role={expandable ? "button" : undefined}
            tabIndex={expandable ? 0 : undefined}
            aria-expanded={expandable ? expanded : undefined}
            style={
              {
                "--card-border": item.borderColor || "transparent",
                "--card-gradient": item.gradient,
                cursor: expandable || item.url ? "pointer" : "default",
              } as React.CSSProperties
            }
          >
            <div className="chroma-img-wrapper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.title} loading="lazy" />
            </div>
            <footer className="chroma-info">
              <h3 className="name">{item.title}</h3>
              {!expandable && item.handle ? <span className="handle">{item.handle}</span> : null}
              <p className="role">{item.subtitle}</p>

              {expandable ? (
                <>
                  {!expanded && <span className="chroma-hint">Подробнее</span>}
                  <div className="chroma-details">
                    <div className="chroma-details-inner">
                      <div className="chroma-details-content">
                        {item.bio ? <p className="chroma-bio">{item.bio}</p> : null}
                        {item.specialties?.length ? (
                          <div className="chroma-tags">
                            <p className="chroma-tags__label">Специализация</p>
                            <ul className="chroma-tags__list">
                              {item.specialties.map((tag) => (
                                <li key={tag}>{tag}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="chroma-book btn-secondary text-sm"
                            onClick={(event) => event.stopPropagation()}
                          >
                            {bookLabel}
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {item.bio ? <p className="chroma-bio">{item.bio}</p> : null}
                  {item.location ? <span className="location">{item.location}</span> : null}
                </>
              )}
            </footer>
          </article>
        );
      })}
      <div className="chroma-overlay" aria-hidden />
      <div ref={fadeRef} className="chroma-fade" aria-hidden />
    </div>
  );
}

export default ChromaGrid;
