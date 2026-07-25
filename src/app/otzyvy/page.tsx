import type { Metadata } from "next";
import Link from "next/link";
import { PageSection } from "@/components/PageSection";
import { ReviewsGrid } from "@/components/ReviewsGrid";
import { Stars } from "@/components/ReviewStars";
import { SiteShell } from "@/components/SiteShell";
import { pageSeo, siteConfig } from "@/config/site";
import { getReviewsSnapshot } from "@/lib/reviews-store";
import "@/components/ReviewsSection.css";

/** ISR: refresh at least every 6h; sync route also revalidateTag/revalidatePath. */
export const revalidate = 21600;

export const metadata: Metadata = {
  title: pageSeo.otzyvy.title,
  description: pageSeo.otzyvy.description,
};

export default async function ReviewsPage() {
  const snapshot = await getReviewsSnapshot();
  const { reviews } = siteConfig;

  return (
    <SiteShell>
      <PageSection title="ОТЗЫВЫ" subtitle="ГОСТИ О PC БАРБЕРШОП">
        <div className="reviews-page">
          <div className="reviews-summary reviews-summary--page">
            <Stars rating={snapshot.rating} />
            <p className="reviews-summary-text">
              <span className="reviews-summary-score">{snapshot.rating.toFixed(1)}</span>
              {" · "}
              {snapshot.ratingCount} оценок · {reviews.ratingLabel}
            </p>
            {snapshot.syncedAt ? (
              <p className="reviews-synced">
                Обновлено:{" "}
                {new Date(snapshot.syncedAt).toLocaleString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            ) : null}
          </div>

          <ReviewsGrid items={snapshot.items} />

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 md:mt-12">
            <a
              href={reviews.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs"
            >
              Оставить отзыв на Яндекс.Картах
            </a>
            <Link href="/" className="btn-secondary text-xs">
              На главную
            </Link>
          </div>
        </div>
      </PageSection>
    </SiteShell>
  );
}
