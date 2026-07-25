export function Stars({ rating }: { rating: number }) {
  const filled = Math.round(rating);
  return (
    <div className="reviews-stars" aria-label={`Оценка ${rating} из 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < filled ? "reviews-star reviews-star--on" : "reviews-star"}>
          ★
        </span>
      ))}
    </div>
  );
}
