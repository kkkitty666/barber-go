import { siteConfig } from "@/config/site";

/** Static map image — reliably renders in all browsers (unlike iframe widget). */
export function buildYandexStaticMapUrl(width = 650, height = 450) {
  const { lon, lat } = siteConfig.mapCoords;
  const w = Math.min(650, Math.max(200, Math.round(width)));
  const h = Math.min(450, Math.max(150, Math.round(height)));
  const params = new URLSearchParams({
    ll: `${lon},${lat}`,
    size: `${w},${h}`,
    z: String(siteConfig.mapZoom),
    l: "map",
    pt: `${lon},${lat},pm2rdm`,
    lang: "ru_RU",
  });
  return `https://static-maps.yandex.ru/1.x/?${params.toString()}`;
}

export function buildYandexMapExternalUrl() {
  return siteConfig.mapsUrl;
}
