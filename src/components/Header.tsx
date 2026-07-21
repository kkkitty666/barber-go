"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { assets, siteConfig } from "@/config/site";
import { useHeaderVisibility } from "@/hooks/useHeaderVisibility";
import { ShopHeaderActions } from "./CartButton";
import "./Header.css";

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`nav-link font-display text-[10px] tracking-[0.22em] uppercase xl:text-[11px] ${
        active ? "text-gold" : "text-foreground-muted hover:text-gold"
      }`}
    >
      {label}
    </Link>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const headerVisible = useHeaderVisibility();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const closeMenu = () => setMenuOpen(false);

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
        <header className={`site-header${menuOpen ? " site-header--menu-open" : ""}`}>
          <div className="site-header__inner mx-auto grid max-w-[90rem] grid-cols-[1fr_auto_1fr] items-center px-3 md:px-6">
            <nav className="header-nav-left hidden items-center justify-end lg:flex">
              {siteConfig.navLeft.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  active={isActive(item.href)}
                />
              ))}
            </nav>

            <div className="header-logo-wrap flex justify-center">
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
                  width={120}
                  height={120}
                  className="site-header__logo object-contain"
                  priority
                  unoptimized
                />
              </Link>
            </div>

            <nav className="header-nav-right hidden items-center justify-start gap-4 lg:flex">
              <ShopHeaderActions />
              {siteConfig.navRight.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  active={isActive(item.href)}
                />
              ))}
            </nav>

            <div className="col-start-3 flex items-center justify-end gap-2 lg:hidden">
              <ShopHeaderActions />
              <button
                type="button"
                className="header-menu-button flex min-h-11 min-w-11 items-center justify-center rounded-full"
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

      {mobileMenu}
    </>
  );
}
