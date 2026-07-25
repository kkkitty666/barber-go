"use client";

import { useMemo } from "react";
import { siteConfig } from "@/config/site";
import { ChromaGrid } from "./ChromaGrid";
import type { ChromaGridItem } from "./ChromaGrid.types";
import "./ChromaGrid.css";

const BARBER_THEMES = [
  {
    borderColor: "#c0c0c0",
    gradient: "linear-gradient(145deg, #3a3a3a 0%, #121212 55%, #0d0d0d 100%)",
  },
  {
    borderColor: "#e8e8e8",
    gradient: "linear-gradient(180deg, #6b6b6b 0%, #141414 55%, #0d0d0d 100%)",
  },
  {
    borderColor: "#c0c0c0",
    gradient: "linear-gradient(210deg, #404040 0%, #101010 50%, #0d0d0d 100%)",
  },
] as const;

function barberToChromaItem(
  barber: (typeof siteConfig.barbers)[number],
  index: number,
): ChromaGridItem {
  const theme = BARBER_THEMES[index % BARBER_THEMES.length];

  return {
    id: barber.id,
    image: barber.photo ?? "/assets/logo-pc.png",
    title: barber.name,
    subtitle: `${barber.role} · ${barber.experience}`,
    bio: barber.bio,
    specialties: [...barber.specialties],
    borderColor: theme.borderColor,
    gradient: theme.gradient,
    url: siteConfig.bookingUrl,
  };
}

export function Barbers() {
  const items = useMemo(
    () => siteConfig.barbers.map(barberToChromaItem),
    [],
  );

  const columns = Math.min(3, Math.max(1, items.length));

  return (
    <div>
      <div className="barbers-chroma-wrap">
        <ChromaGrid
          items={items}
          radius={400}
          columns={columns}
          rows={Math.ceil(items.length / columns)}
          damping={1.05}
          fadeOut={2}
          ease="power3.out"
          expandable
          bookLabel="Перейти к записи"
        />
      </div>
      <p className="barbers-chroma-note">
        Нажмите на карточку мастера, чтобы открыть полную информацию и записаться онлайн.
      </p>
    </div>
  );
}
