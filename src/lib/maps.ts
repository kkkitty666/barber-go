import { siteConfig } from "@/config/site";

/** Yandex Maps widget — lon,lat order in `ll` and `pt`. */
export function buildYandexMapWidgetUrl() {
  const { lon, lat } = siteConfig.mapCoords;
  const ll = `${lon},${lat}`;
  const params = new URLSearchParams({
    ll,
    z: String(siteConfig.mapZoom),
    pt: `${ll},pm2rdm`,
    l: "map",
  });
  return `https://yandex.ru/map-widget/v1/?${params.toString()}`;
}

export function buildYandexMapExternalUrl() {
  return `https://yandex.ru/maps/?${new URLSearchParams({
    ll: `${siteConfig.mapCoords.lon},${siteConfig.mapCoords.lat}`,
    z: String(siteConfig.mapZoom),
    text: siteConfig.mapsQuery,
  }).toString()}`;
}
