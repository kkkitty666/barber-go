export interface ChromaGridItem {
  id?: string;
  image: string;
  title: string;
  subtitle: string;
  handle?: string;
  location?: string;
  bio?: string;
  specialties?: string[];
  borderColor?: string;
  gradient?: string;
  url?: string;
}

export interface ChromaGridProps {
  items: ChromaGridItem[];
  className?: string;
  radius?: number;
  columns?: number;
  rows?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
  expandable?: boolean;
  bookLabel?: string;
}
