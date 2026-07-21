"use client";

import { useEffect, useRef, useState } from "react";
import { buildYandexMapExternalUrl, buildYandexStaticMapUrl } from "@/lib/maps";
import "./YandexMapEmbed.css";

type YandexMapEmbedProps = {
  title?: string;
  className?: string;
};

export function YandexMapEmbed({
  title = "Карта — PC Барбершоп",
  className = "",
}: YandexMapEmbedProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mapSrc, setMapSrc] = useState(() => buildYandexStaticMapUrl(650, 450));
  const externalUrl = buildYandexMapExternalUrl();

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;

    const updateSize = () => {
      const rect = node.getBoundingClientRect();
      const width = Math.max(320, Math.round(rect.width * (window.devicePixelRatio > 1 ? 1.5 : 1)));
      const height = Math.max(240, Math.round(rect.height * (window.devicePixelRatio > 1 ? 1.5 : 1)));
      setMapSrc(buildYandexStaticMapUrl(width, height));
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className={`yandex-map-embed ${className}`.trim()}>
      <a
        href={externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="yandex-map-embed__link"
        aria-label={`${title}. Открыть в Яндекс.Картах`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mapSrc}
          alt={title}
          className="yandex-map-embed__image"
          loading="eager"
          decoding="async"
        />
      </a>
      <a
        href={externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="yandex-map-embed__open"
      >
        Открыть в Яндекс.Картах
      </a>
    </div>
  );
}
