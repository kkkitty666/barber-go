"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { assets } from "@/config/site";
import "./LanyardWidget.css";

const Lanyard = dynamic(() => import("./lanyard/Lanyard"), {
  ssr: false,
  loading: () => null,
});

export function LanyardWidget() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (alive) setReady(true);
      });
    });
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <aside className="lanyard-dock" aria-label="Бейдж PC Барбершоп">
      {ready ? (
        <Lanyard
          position={[-0.95, 0, 31]}
          fov={20}
          gravity={[0, -40, 0]}
          backImage={assets.lanyardBack}
          imageFit="cover"
          lanyardImage={assets.lanyardBand}
          lanyardWidth={1}
        />
      ) : null}
    </aside>
  );
}
