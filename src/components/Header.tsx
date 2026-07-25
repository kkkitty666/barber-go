"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { assets, siteConfig } from "@/config/site";
import { useHeaderVisibility } from "@/hooks/useHeaderVisibility";
import { ShopHeaderActions } from "./CartButton";
import "./Header.css";

const SHOP_DOCK_GAP = 10;
const HEADER_TRANSITION_MS = 320;

function NavLink({
  href,
  label,
  active,
  className = "",
}: {
  href: string;
  label: string;
  active: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`nav-link whitespace-nowrap font-body text-[12px] font-semibold tracking-[0.08em] uppercase xl:text-[13px] xl:tracking-[0.1em] ${
        active ? "text-gold" : "text-foreground-muted hover:text-gold"
      } ${className}`}
    >
      {label}
    </Link>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dockTop, setDockTop] = useState(72);
  const pathname = usePathname();
  const headerVisible = useHeaderVisibility();
  const headerBarRef = useRef<HTMLElement>(null);
  const raisedTopRef = useRef(12);

  const isActive = (href: string) => {
    if (href.includes("#")) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const closeMenu = () => setMenuOpen(false);

  useLayoutEffect(() => {
    const headerBar = headerBarRef.current;
    if (!headerBar) return;

    let raf = 0;
    let timeoutId = 0;

    const syncDock = () => {
      const rect = headerBar.getBoundingClientRect();
      if (rect.top > 0 || headerVisible) {
        raisedTopRef.current = Math.max(8, Math.round(rect.top));
      }
      const belowHeader = Math.round(rect.bottom + SHOP_DOCK_GAP);
      setDockTop(Math.max(belowHeader, raisedTopRef.current));
    };

    const trackTransition = () => {
      const started = performance.now();
      const tick = (now: number) => {
        syncDock();
        if (now - started < HEADER_TRANSITION_MS) {
          raf = requestAnimationFrame(tick);
        }
      };
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(syncDock, HEADER_TRANSITION_MS + 40);
    };

    syncDock();
    trackTransition();

    const onResize = () => syncDock();
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timeoutId);
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, [headerVisible]);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const mobileMenu =
    mounted && menuOpen
      ? createPortal(
          <div className="mobile-nav-layer" role="presentation">
            <button
              type="button"
              className="mobile-nav-layer__backdrop"
              aria-label="Закрыть меню"
              onClick={closeMenu}
            />
            <nav id="mobile-nav" className="mobile-nav-panel" aria-label="Мобильное меню">
              <p className="mobile-nav-panel__label">PC Барбершоп</p>
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`mobile-nav-panel__link${isActive(item.href) ? " mobile-nav-panel__link--active" : ""}`}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div
        className={`header-shell fixed top-0 right-0 left-0 z-50 transition-transform duration-300 ease-in-out ${
          headerVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <header
          ref={headerBarRef}
          className={`site-header${menuOpen ? " site-header--menu-open" : ""}`}
        >
          <div className="site-header__inner mx-auto flex max-w-[90rem] items-center px-3 md:px-5 xl:px-7">
            <nav className="header-nav-left hidden min-w-0 flex-1 items-center justify-end gap-2 pr-4 xl:gap-3.5 xl:pr-6 lg:flex">
              {siteConfig.navLeft.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  active={isActive(item.href)}
                />
              ))}
            </nav>

            <div className="header-logo-wrap flex shrink-0 justify-start lg:justify-center">
              <Link
                href="/"
                className={`header-logo nav-link flex flex-col items-center justify-center py-1 ${
                  pathname === "/" ? "header-logo--active" : ""
                }`}
                aria-label={`${siteConfig.name} — на главную`}
              >
                <Image
                  src={assets.logoGold}
                  alt={siteConfig.name}
                  width={112}
                  height={112}
                  priority
                  className="site-header__logo object-contain"
                />
              </Link>
            </div>

            <div className="header-right ml-auto flex min-w-0 flex-1 items-center gap-3 lg:ml-0">
              <nav className="header-nav-right hidden min-w-0 flex-1 items-center justify-start gap-2 pl-4 xl:gap-3.5 xl:pl-6 lg:flex">
                {siteConfig.navRight.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    active={isActive(item.href)}
                  />
                ))}
              </nav>
              <button
                type="button"
                className="header-menu-button ml-auto flex min-h-11 min-w-11 items-center justify-center rounded-full lg:hidden"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
              >
                <span className="flex flex-col gap-1.5">
                  <span
                    className={`block h-0.5 w-6 bg-gold transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
                  />
                  <span
                    className={`block h-0.5 w-6 bg-gold transition-opacity ${menuOpen ? "opacity-0" : ""}`}
                  />
                  <span
                    className={`block h-0.5 w-6 bg-gold transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
                  />
                </span>
              </button>
            </div>
          </div>
        </header>
      </div>

      <div
        className="header-shop-dock"
        style={{ top: dockTop }}
        aria-label="Заказы и корзина"
      >
        <ShopHeaderActions />
      </div>

      {mobileMenu}
    </>
  );
}
