"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { assets, siteConfig } from "@/config/site";
import { useHeaderVisibility } from "@/hooks/useHeaderVisibility";
import { ShopHeaderActions } from "./CartButton";
import { LanyardWidget } from "./LanyardWidget";
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
  const pathname = usePathname();
  const headerVisible = useHeaderVisibility();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <div
        className={`header-shell fixed top-0 right-0 left-0 z-50 transition-transform duration-300 ease-in-out ${
          headerVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <header className="site-header">
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
              width={96}
              height={96}
              className="site-header__logo object-contain"
              priority
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
          className="p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Меню"
        >
          <span className="flex flex-col gap-1.5">
            <span className={`block h-0.5 w-6 bg-gold transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-6 bg-gold transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-gold transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
        </div>
          </div>

          {menuOpen && (
            <nav className="site-header__mobile-nav px-4 py-3 lg:hidden">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link font-display block border-b border-border py-3 text-sm tracking-[0.2em] uppercase last:border-0 ${
                    isActive(item.href) ? "text-gold" : "text-foreground"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </header>

        {pathname === "/" && <LanyardWidget />}
      </div>
    </>
  );
}
