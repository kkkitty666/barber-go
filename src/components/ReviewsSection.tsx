import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getReviewsSnapshot } from "@/lib/reviews-store";
import { OrnamentDivider } from "./OrnamentDivider";
import { ReviewsGrid } from "./ReviewsGrid";
import { Stars } from "./ReviewStars";
import "./ReviewsSection.css";

const HOME_PREVIEW_COUNT = 3;

export async function ReviewsSection() {
  const { reviews } = siteConfig;
  const snapshot = await getReviewsSnapshot();
  const preview = snapshot.items.slice(0, HOME_PREVIEW_COUNT);

  return (
    <section
      id="reviews"
      className="reviews-section section-padding noise-overlay mobile-section-safe"
      aria-labelledby="reviews-title"
    >
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-10 text-center md:mb-12">
          <h2
            id="reviews-title"
            className="font-display mb-4 text-4xl tracking-[0.28em] text-gold md:text-5xl"
          >
            {reviews.title}
          </h2>
          <OrnamentDivider label={reviews.subtitle} />
          <div className="reviews-summary">
            <Stars rating={snapshot.rating} />
            <p className="reviews-summary-text">
              <span className="reviews-summary-score">{snapshot.rating.toFixed(1)}</span>
              {" · "}
              {snapshot.ratingCount} оценок · {reviews.ratingLabel}
            </p>
          </div>
        </div>

        <ReviewsGrid items={preview} />

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 md:mt-12">
          <Link href="/otzyvy" className="btn-secondary text-sm">
            Все отзывы на сайте
          </Link>
          <a
            href={reviews.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-sm"
          >
            {reviews.ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
