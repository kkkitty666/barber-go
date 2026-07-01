"use client";

import { useEffect, useState } from "react";
import {
  BACKGROUND_STORAGE_KEY,
  GRAINIENT_PRESET,
  type BackgroundMode,
} from "@/config/background";
import { BackgroundGrid } from "./BackgroundGrid";
import Grainient from "./Grainient";
import "./BackgroundSwitcher.css";

function readStoredMode(): BackgroundMode {
  if (typeof window === "undefined") return "grid";
  const stored = window.localStorage.getItem(BACKGROUND_STORAGE_KEY);
  return stored === "grainient" ? "grainient" : "grid";
}

export function SiteBackground() {
  const [mode, setMode] = useState<BackgroundMode>("grid");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.bgMode = "grid";
    setMode(readStoredMode());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.bgMode = mode;
    return () => {
      delete document.documentElement.dataset.bgMode;
    };
  }, [mode, ready]);

  const selectMode = (next: BackgroundMode) => {
    setMode(next);
    window.localStorage.setItem(BACKGROUND_STORAGE_KEY, next);
  };

  return (
    <>
      {ready && mode === "grid" && <BackgroundGrid />}
      {ready && mode === "grainient" && (
        <>
          <div className="grainient-background" aria-hidden>
            <Grainient {...GRAINIENT_PRESET} />
          </div>
          <div className="grainient-overlay" aria-hidden />
        </>
      )}
      <BackgroundSwitcher mode={mode} onChange={selectMode} ready={ready} />
    </>
  );
}

type BackgroundSwitcherProps = {
  mode: BackgroundMode;
  onChange: (mode: BackgroundMode) => void;
  ready: boolean;
};

function BackgroundSwitcher({ mode, onChange, ready }: BackgroundSwitcherProps) {
  if (!ready) return null;

  return (
    <div className="bg-switcher" role="group" aria-label="Переключатель фона">
      <span className="bg-switcher__label">Фон</span>
      <button
        type="button"
        className={`bg-switcher__btn ${mode === "grid" ? "bg-switcher__btn--active" : ""}`}
        onClick={() => onChange("grid")}
        aria-pressed={mode === "grid"}
      >
        Сетка
      </button>
      <button
        type="button"
        className={`bg-switcher__btn ${mode === "grainient" ? "bg-switcher__btn--active" : ""}`}
        onClick={() => onChange("grainient")}
        aria-pressed={mode === "grainient"}
      >
        Градиент
      </button>
    </div>
  );
}
