"use client";

import { useEffect, useState } from "react";
import { GRAINIENT_PRESET } from "@/config/background";
import Grainient from "./Grainient";
import "./Grainient.css";

function shouldPreferCssBackground() {
  if (typeof window === "undefined") return false;

  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

  return isMobile || isTouchDevice || !window.isSecureContext;
}

export function SiteBackground() {
  const [useWebGL, setUseWebGL] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.bgMode = "grainient";
    setUseWebGL(!shouldPreferCssBackground());
  }, []);

  return (
    <>
      <div className="grainient-background" aria-hidden>
        <div className="grainient-background__fallback" />
        {useWebGL ? (
          <Grainient {...GRAINIENT_PRESET} persistent onInitError={() => setUseWebGL(false)} />
        ) : null}
      </div>
      <div className="grainient-overlay" aria-hidden />
    </>
  );
}
