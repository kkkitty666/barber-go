import { siteConfig } from "@/config/site";

export function MobileCta() {
  return (
    <div className="fixed right-0 bottom-0 left-0 z-40 grid grid-cols-2 gap-2 border-t border-border bg-background/95 p-3 backdrop-blur-md md:hidden">
      <a href={`tel:+${siteConfig.phoneRaw}`} className="btn-secondary py-2.5 text-xs">
        Позвонить
      </a>
      <a
        href={siteConfig.dikidiUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary py-2.5 text-xs"
      >
        Записаться
      </a>
    </div>
  );
}
