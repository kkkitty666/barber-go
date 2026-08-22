import type { ReactNode } from "react";

type StickyCatalogAsideProps = {
  children: ReactNode;
};

/** Keeps the category panel in view while the catalog is scrolled. */
export function StickyCatalogAside({ children }: StickyCatalogAsideProps) {
  return (
    <aside className="product-catalog-aside">
      <div className="product-catalog-aside__pin">{children}</div>
    </aside>
  );
}
