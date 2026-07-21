"use client";

import { useEffect, useState } from "react";
import { GRAINIENT_PRESET } from "@/config/background";
import Grainient from "./Grainient";
import "./Grainient.css";

function shouldDisableWebGL() {
  if (typeof window === "undefined") return true;
  if (!window.isSecureContext) return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  return false;
}

function isMobileViewport() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(max-width: 767px)").matches ||
    window.matchMedia("(hover: none) and (pointer: coarse)").matches
  );
}

export function SiteBackground() {
  const [useWebGL, setUseWebGL] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.bgMode = "grainient";
    setMobile(isMobileViewport());
    setUseWebGL(!shouldDisableWebGL());
  }, []);

  return (
    <>
      <div className="grainient-background" aria-hidden>
        <div className="grainient-background__fallback" />
        {useWebGL ? (
          <Grainient
            {...GRAINIENT_PRESET}
            timeSpeed={mobile ? GRAINIENT_PRESET.timeSpeed * 0.7 : GRAINIENT_PRESET.timeSpeed}
            maxDpr={mobile ? 1 : 2}
            persistent
            onInitError={() => setUseWebGL(false)}
          />
        ) : null}
      </div>
      <div className="grainient-overlay" aria-hidden />
    </>
  );
}
