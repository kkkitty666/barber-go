"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  COOKIE_SETTINGS_EVENT,
  readCookieConsent,
  writeCookieConsent,
  type CookieConsentValue,
} from "@/lib/cookie-consent";
import "./CookieConsent.css";

const EXIT_MS = 380;

export function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const exitTimer = useRef<number | null>(null);

  const show = () => {
    if (exitTimer.current) {
      window.clearTimeout(exitTimer.current);
      exitTimer.current = null;
    }
    setMounted(true);
    setOpen(false);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setOpen(true));
    });
  };

  useEffect(() => {
    if (readCookieConsent() === null) {
      show();
    }

    const onOpenSettings = () => show();
    window.addEventListener(COOKIE_SETTINGS_EVENT, onOpenSettings);

    return () => {
      window.removeEventListener(COOKIE_SETTINGS_EVENT, onOpenSettings);
      if (exitTimer.current) window.clearTimeout(exitTimer.current);
    };
  }, []);

  const closeWithAnimation = (after?: () => void) => {
    setOpen(false);
    exitTimer.current = window.setTimeout(() => {
      setMounted(false);
      exitTimer.current = null;
      after?.();
    }, EXIT_MS);
  };

  const choose = (value: CookieConsentValue) => {
    const previous = readCookieConsent();
    writeCookieConsent(value);
    closeWithAnimation(() => {
      if (value === "declined" && previous === "accepted") {
        window.location.reload();
      }
    });
  };

  if (!mounted) return null;

  return (
    <div
      className={`cookie-consent${open ? " cookie-consent--open" : ""}`}
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
    >
      <div className="cookie-consent__panel">
        <p id="cookie-consent-title" className="cookie-consent__title">
          Cookies и аналитика
        </p>
        <p className="cookie-consent__text">
          Мы используем cookies и Яндекс.Метрику (включая вебвизор) для статистики и улучшения сайта.
          Это необязательно: без согласия аналитика не запускается. Подробнее — в{" "}
          <Link href="/politika-konfidencialnosti">политике конфиденциальности</Link>.
        </p>
        <div className="cookie-consent__actions">
          <button type="button" className="btn-primary cookie-consent__btn" onClick={() => choose("accepted")}>
            Принять
          </button>
          <button type="button" className="btn-secondary cookie-consent__btn" onClick={() => choose("declined")}>
            Отклонить
          </button>
        </div>
      </div>
    </div>
  );
}

export function CookieSettingsButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      className={`cookie-settings-btn ${className}`.trim()}
      onClick={() => {
        window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT));
      }}
    >
      Cookies
    </button>
  );
}
