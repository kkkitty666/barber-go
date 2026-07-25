import { Stars } from "./ReviewStars";
import type { ReviewItem } from "@/lib/reviews-types";

export function ReviewsGrid({ items }: { items: ReviewItem[] }) {
  if (!items.length) {
    return (
      <p className="reviews-empty">
        Отзывы пока загружаются. Загляните чуть позже или посмотрите их на Яндекс.Картах.
      </p>
    );
  }

  return (
    <div className="reviews-grid">
      {items.map((item) => (
        <article key={item.id} className="reviews-card canvas-frame">
          <div className="reviews-card-top">
            <Stars rating={item.rating} />
            <time className="reviews-card-date" dateTime={item.dateIso || undefined}>
              {item.date}
            </time>
          </div>
          <blockquote className="reviews-card-text">«{item.text}»</blockquote>
          <p className="reviews-card-name">{item.name}</p>
        </article>
      ))}
    </div>
  );
}
