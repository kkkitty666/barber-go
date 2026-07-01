interface ProductRatingProps {
  label: string;
  value: 1 | 2 | 3;
  className?: string;
}

export function ProductRating({ label, value, className = "" }: ProductRatingProps) {
  return (
    <div className={`product-rating ${className}`}>
      <span className="product-rating__label">{label}</span>
      <span className="product-rating__gems" aria-label={`${label}: ${value} из 3`}>
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={`product-rating__gem ${i <= value ? "product-rating__gem--on" : ""}`}
            aria-hidden
          />
        ))}
      </span>
    </div>
  );
}
