"use client";

import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { assets, siteConfig } from "@/config/site";
import { CanvasFrame } from "./DecorativeElements";
import { OrnamentDivider } from "./OrnamentDivider";

export function Booking() {
  return (
    <section className="section-padding noise-overlay pt-8">
      <div className="relative z-10 mx-auto max-w-lg text-center">
        <h2 className="font-display mb-4 text-3xl tracking-[0.3em] text-gold md:text-4xl">
          ОНЛАЙН ЗАПИСЬ
        </h2>
        <OrnamentDivider className="mb-10" />

        <CanvasFrame className="px-6 py-10 md:px-10">
          <p className="mb-8 text-sm text-foreground-muted">
            Запишитесь через Dikidi — выберите удобное время и мастера
          </p>

          <div className="qr-frame mx-auto mb-6">
            <QRCodeSVG
              value={siteConfig.dikidiUrl}
              size={180}
              level="M"
              fgColor="#1a1a1a"
              bgColor="#e8e2d5"
              imageSettings={{
                src: assets.logoGold,
                height: 36,
                width: 36,
                excavate: true,
              }}
            />
          </div>

          <p className="tagline-text mb-6">
            <span className="text-gold/50">◆</span> Онлайн запись <span className="text-gold/50">◆</span>
          </p>

          <a
            href={siteConfig.dikidiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-xs"
          >
            Записаться на Dikidi
          </a>

          <div className="mt-8 flex justify-center opacity-30">
            <Image
              src={assets.logoShield}
              alt=""
              width={64}
              height={64}
              className="h-14 w-14 object-contain"
            />
          </div>
        </CanvasFrame>
      </div>
    </section>
  );
}
