"use client";

import GlassSurface from "./GlassSurface";
import { siteConfig } from "@/config/site";
import "./FloatingBookButton.css";

export function FloatingBookButton() {
  return (
    <a
      href={siteConfig.dikidiUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="book-fab-link"
      aria-label="Онлайн запись"
    >
      <GlassSurface
        width="100%"
        height="100%"
        borderRadius={9999}
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
        className="book-fab-glass"
      >
        <span className="book-fab-label">Онлайн запись</span>
      </GlassSurface>
    </a>
  );
}
