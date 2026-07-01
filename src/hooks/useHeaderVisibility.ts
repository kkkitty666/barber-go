"use client";

import { useEffect, useState } from "react";

const SCROLL_THRESHOLD = 10;

export function useHeaderVisibility() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const update = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      if (currentScrollY < 80) {
        setVisible(true);
      } else if (delta > SCROLL_THRESHOLD) {
        setVisible(false);
      } else if (delta < -SCROLL_THRESHOLD) {
        setVisible(true);
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return visible;
}
