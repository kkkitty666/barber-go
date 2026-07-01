"use client";

import type { ReactNode } from "react";
import "./PhotoWallpaperBlend.css";

export type PhotoWallpaperBlendEdge = "bottom" | "left";

type PhotoWallpaperBlendProps = {
  children: ReactNode;
  edges?: PhotoWallpaperBlendEdge[];
  className?: string;
};

export function PhotoWallpaperBlend({
  children,
  edges = ["bottom"],
  className = "",
}: PhotoWallpaperBlendProps) {
  const fadeBottom = edges.includes("bottom");
  const fadeLeft = edges.includes("left");

  const mediaClass = [
    "photo-wallpaper-blend__media",
    fadeBottom && "photo-wallpaper-blend__media--fade-bottom",
    fadeLeft && "photo-wallpaper-blend__media--fade-left",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`photo-wallpaper-blend ${className}`.trim()}>
      <div className={mediaClass}>{children}</div>

      {fadeBottom && (
        <>
          <div className="photo-wallpaper-blend__melt photo-wallpaper-blend__melt--bottom" aria-hidden />
          <div className="photo-wallpaper-blend__feather photo-wallpaper-blend__feather--bottom" aria-hidden />
        </>
      )}

      {fadeLeft && (
        <>
          <div className="photo-wallpaper-blend__melt photo-wallpaper-blend__melt--left" aria-hidden />
          <div className="photo-wallpaper-blend__feather photo-wallpaper-blend__feather--left" aria-hidden />
        </>
      )}
    </div>
  );
}
