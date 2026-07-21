"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { siteConfig } from "@/config/site";
import "./WorksGalleryGrid.css";

const LIGHTBOX_DURATION = 520;
const LIGHTBOX_EASING = "cubic-bezier(0.33, 1, 0.68, 1)";
const FRAME_TRANSITION = `top ${LIGHTBOX_DURATION}ms ${LIGHTBOX_EASING}, left ${LIGHTBOX_DURATION}ms ${LIGHTBOX_EASING}, width ${LIGHTBOX_DURATION}ms ${LIGHTBOX_EASING}, height ${LIGHTBOX_DURATION}ms ${LIGHTBOX_EASING}, border-radius ${LIGHTBOX_DURATION}ms ${LIGHTBOX_EASING}, box-shadow ${LIGHTBOX_DURATION}ms ${LIGHTBOX_EASING}, transform ${LIGHTBOX_DURATION}ms ${LIGHTBOX_EASING}`;

type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type LightboxPhase = "entering" | "preparing" | "open" | "closing";

type LightboxState = {
  index: number;
  fromRect: Rect;
  toRect: Rect;
  phase: LightboxPhase;
};

function toRect(rect: DOMRect): Rect {
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

function getViewportSize() {
  const viewport = window.visualViewport;

  return {
    width: viewport?.width ?? window.innerWidth,
    height: viewport?.height ?? window.innerHeight,
    offsetTop: viewport?.offsetTop ?? 0,
    offsetLeft: viewport?.offsetLeft ?? 0,
  };
}

function getExpandedRect(aspectRatio = 4 / 5): Rect {
  const { width: viewportWidth, height: viewportHeight, offsetTop, offsetLeft } =
    getViewportSize();
  const maxWidth = Math.min(viewportWidth * 0.92, 544);
  const maxHeight = viewportHeight * 0.88;
  let width = maxWidth;
  let height = width / aspectRatio;

  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }

  return {
    top: offsetTop + (viewportHeight - height) / 2,
    left: offsetLeft + (viewportWidth - width) / 2,
    width,
    height,
  };
}

function getFrameStyle(lightbox: LightboxState): CSSProperties {
  const isExpanded = lightbox.phase === "open";
  const rect = isExpanded ? lightbox.toRect : lightbox.fromRect;
  const enableTransition =
    lightbox.phase === "preparing" || lightbox.phase === "open" || lightbox.phase === "closing";

  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    borderRadius: isExpanded ? "var(--radius-xl)" : "var(--radius-lg)",
    transform: "translate3d(0, 0, 0)",
    transition: enableTransition ? FRAME_TRANSITION : "none",
  };
}

export function WorksGalleryGrid() {
  const items = siteConfig.worksGallery;
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const [backdropVisible, setBackdropVisible] = useState(false);

  const activeItem = lightbox !== null ? items[lightbox.index] : null;

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openLightbox = useCallback(
    (index: number, button: HTMLButtonElement) => {
      clearCloseTimer();
      setBackdropVisible(false);

      const fromRect = toRect(button.getBoundingClientRect());
      const toRectValue = getExpandedRect();
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion) {
        setLightbox({
          index,
          fromRect,
          toRect: toRectValue,
          phase: "open",
        });
        setBackdropVisible(true);
        return;
      }

      setLightbox({
        index,
        fromRect,
        toRect: toRectValue,
        phase: "entering",
      });
    },
    [clearCloseTimer],
  );

  const closeLightbox = useCallback(() => {
    setBackdropVisible(false);

    setLightbox((current) => {
      if (!current || current.phase === "closing") return current;

      const source = itemRefs.current[current.index];
      const fromRect = source ? toRect(source.getBoundingClientRect()) : current.fromRect;

      return {
        ...current,
        fromRect,
        phase: "closing",
      };
    });

    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setLightbox(null);
      closeTimerRef.current = null;
    }, LIGHTBOX_DURATION);
  }, [clearCloseTimer]);

  useLayoutEffect(() => {
    if (!lightbox || lightbox.phase !== "entering") return;

    frameRef.current?.getBoundingClientRect();

    const prepareFrame = window.requestAnimationFrame(() => {
      setLightbox((current) =>
        current?.phase === "entering" ? { ...current, phase: "preparing" } : current,
      );
    });

    return () => {
      window.cancelAnimationFrame(prepareFrame);
    };
  }, [lightbox?.index, lightbox?.phase]);

  useLayoutEffect(() => {
    if (!lightbox || lightbox.phase !== "preparing") return;

    frameRef.current?.getBoundingClientRect();

    const expandFrame = window.requestAnimationFrame(() => {
      setLightbox((current) =>
        current?.phase === "preparing"
          ? { ...current, phase: "open", toRect: getExpandedRect() }
          : current,
      );
    });

    return () => {
      window.cancelAnimationFrame(expandFrame);
    };
  }, [lightbox?.index, lightbox?.phase]);

  useLayoutEffect(() => {
    if (!lightbox) {
      setBackdropVisible(false);
      return;
    }

    setBackdropVisible(false);

    let showFrame = 0;
    const hideFrame = window.requestAnimationFrame(() => {
      showFrame = window.requestAnimationFrame(() => {
        setBackdropVisible(true);
      });
    });

    return () => {
      window.cancelAnimationFrame(hideFrame);
      window.cancelAnimationFrame(showFrame);
    };
  }, [lightbox?.index]);

  useEffect(() => {
    if (lightbox === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
    };

    const viewport = window.visualViewport;
    const recenterLightbox = () => {
      setLightbox((current) =>
        current?.phase === "open" ? { ...current, toRect: getExpandedRect() } : current,
      );
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", recenterLightbox);
    viewport?.addEventListener("resize", recenterLightbox);
    viewport?.addEventListener("scroll", recenterLightbox);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", recenterLightbox);
      viewport?.removeEventListener("resize", recenterLightbox);
      viewport?.removeEventListener("scroll", recenterLightbox);
    };
  }, [lightbox, closeLightbox]);

  useEffect(() => clearCloseTimer, [clearCloseTimer]);

  const lightboxNode =
    activeItem && lightbox ? (
      <div
        className={`works-lightbox${backdropVisible ? " works-lightbox--active" : ""}${lightbox.phase === "open" ? " works-lightbox--settled" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={activeItem.alt}
        onClick={closeLightbox}
      >
        <div className="works-lightbox__backdrop" aria-hidden>
          <div className="works-lightbox__backdrop-blur" />
          <div className="works-lightbox__backdrop-dim" />
        </div>
        <div
          ref={frameRef}
          className="works-lightbox__frame"
          style={getFrameStyle(lightbox)}
          onClick={(event) => event.stopPropagation()}
        >
          <Image
            src={activeItem.src}
            alt={activeItem.alt}
            fill
            className="works-lightbox__image object-cover"
            sizes="(max-width: 768px) 92vw, 544px"
            priority
          />
          <button
            type="button"
            className="works-lightbox__close"
            onClick={closeLightbox}
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>
      </div>
    ) : null;

  return (
    <>
      <div className="works-gallery-grid">
        {items.map((item, index) => {
          const isSourceHidden =
            lightbox?.index === index && lightbox.phase !== "closing";

          return (
            <button
              key={item.src}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              type="button"
              className={`works-gallery-item${isSourceHidden ? " works-gallery-item--source-hidden" : ""}`}
              onClick={(event) => openLightbox(index, event.currentTarget)}
              aria-label={item.alt || "Открыть фото работы"}
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={640}
                height={800}
                className="works-gallery-item__image"
                sizes="(max-width: 640px) 42vw, (max-width: 1024px) 28vw, 220px"
              />
            </button>
          );
        })}
      </div>

      {typeof document !== "undefined" && lightboxNode
        ? createPortal(lightboxNode, document.body)
        : null}
    </>
  );
}
