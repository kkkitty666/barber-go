import { buildYandexMapExternalUrl, buildYandexMapWidgetUrl } from "@/lib/maps";
import "./YandexMapEmbed.css";

type YandexMapEmbedProps = {
  title?: string;
  className?: string;
};

export function YandexMapEmbed({
  title = "Карта — PC Барбершоп",
  className = "",
}: YandexMapEmbedProps) {
  const src = buildYandexMapWidgetUrl();
  const externalUrl = buildYandexMapExternalUrl();

  return (
    <div className={`yandex-map-embed ${className}`.trim()}>
      <iframe
        src={src}
        title={title}
        className="yandex-map-embed__frame"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
      <a
        href={externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="yandex-map-embed__open"
      >
        Открыть в Яндекс.Картах
      </a>
    </div>
  );
}
