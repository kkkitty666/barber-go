import { siteConfig } from "@/config/site";

export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: siteConfig.name,
    description: siteConfig.seo.description,
    url: process.env.NEXT_PUBLIC_APP_URL ?? "https://pc-barbershop.ru",
    telephone: `+${siteConfig.phoneRaw}`,
    image: siteConfig.worksGallery[0]?.src,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      addressLocality: siteConfig.city,
      addressCountry: "RU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.mapCoords.lat,
      longitude: siteConfig.mapCoords.lon,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "20:00",
    },
    sameAs: siteConfig.social.map((s) => s.url),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
