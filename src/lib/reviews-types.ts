export type ReviewSource = "yandex" | "manual";

export interface ReviewItem {
  id: string;
  name: string;
  rating: number;
  date: string;
  dateIso?: string | null;
  text: string;
  source?: ReviewSource;
}

export interface ReviewsSnapshot {
  rating: number;
  ratingCount: number;
  syncedAt: string | null;
  items: ReviewItem[];
}
