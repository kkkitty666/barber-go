import { siteConfig } from "@/config/site";
import { getReviewsSnapshot } from "@/lib/reviews-store";
import { getSiteUrl } from "@/lib/site-url";

export async function LocalBusinessJsonLd() {
  const siteUrl = getSiteUrl();
  const imagePath = siteConfig.worksGallery[0]?.src;
  const image =
    imagePath && imagePath.startsWith("http")
      ? imagePath
      : imagePath
        ? `${siteUrl}${imagePath}`
        : undefined;

  let rating: number = siteConfig.reviews.rating;
  let ratingCount: number = siteConfig.reviews.ratingCount;
  let reviewItems: { name: string; text: string; rating: number }[] =
    siteConfig.reviews.items.map((item) => ({
      name: item.name,
      text: item.text,
      rating: item.rating,
    }));

  try {
    const snapshot = await getReviewsSnapshot();
    rating = snapshot.rating;
    ratingCount = snapshot.ratingCount;
    reviewItems = snapshot.items.slice(0, 10).map((item) => ({
      name: item.name,
      text: item.text,
      rating: item.rating,
    }));
  } catch {
    // Keep seed values if store is unavailable during build.
  }

  const data = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: siteConfig.name,
    description: siteConfig.seo.description,
    url: siteUrl,
    telephone: `+${siteConfig.phoneRaw}`,
    ...(image ? { image } : {}),
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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating,
      bestRating: 5,
      worstRating: 1,
      ratingCount,
      reviewCount: ratingCount,
    },
    review: reviewItems.map((item) => ({
      "@type": "Review",
      author: { "@type": "Person", name: item.name },
      reviewBody: item.text,
      reviewRating: {
        "@type": "Rating",
        ratingValue: item.rating,
        bestRating: 5,
        worstRating: 1,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
