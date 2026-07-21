"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProductBySlug } from "@/config/products";

export interface CartLine {
  slug: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartQuantityOptions {
  inStock?: boolean;
  maxQuantity?: number | null;
}

interface CartContextValue {
  items: CartLine[];
  itemCount: number;
  total: number;
  hydrated: boolean;
  addItem: (slug: string, quantity?: number, options?: CartQuantityOptions) => void;
  removeItem: (slug: string) => void;
  setQuantity: (slug: string, quantity: number, options?: CartQuantityOptions) => void;
  clearCart: () => void;
}

const STORAGE_KEY = "pc-barbershop-cart";

const CartContext = createContext<CartContextValue | null>(null);

function readStorage(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((slug: string, quantity = 1, options?: CartQuantityOptions) => {
    const product = getProductBySlug(slug);
    const maxQuantity = options?.maxQuantity ?? null;
    const canOrder = options?.inStock ?? product?.inStock ?? false;
    if (!product || !canOrder || maxQuantity === 0) return;

    setItems((prev) => {
      const existing = prev.find((line) => line.slug === slug);
      if (existing) {
        const nextQuantity =
          maxQuantity === null ? existing.quantity + quantity : Math.min(existing.quantity + quantity, maxQuantity);
        return prev.map((line) =>
          line.slug === slug ? { ...line, quantity: nextQuantity } : line,
        );
      }

      const nextQuantity = maxQuantity === null ? quantity : Math.min(quantity, maxQuantity);
      return [
        ...prev,
        {
          slug: product.slug,
          name: product.name,
          brand: product.brand,
          price: product.price,
          image: product.image,
          quantity: nextQuantity,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((line) => line.slug !== slug));
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number, options?: CartQuantityOptions) => {
    if (options?.inStock === false || options?.maxQuantity === 0) {
      setItems((prev) => prev.filter((line) => line.slug !== slug));
      return;
    }
    if (quantity <= 0) {
      setItems((prev) => prev.filter((line) => line.slug !== slug));
      return;
    }
    const nextQuantity =
      options?.maxQuantity === null || options?.maxQuantity === undefined
        ? quantity
        : Math.min(quantity, options.maxQuantity);
    setItems((prev) =>
      prev.map((line) => (line.slug === slug ? { ...line, quantity: nextQuantity } : line)),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(() => items.reduce((sum, line) => sum + line.quantity, 0), [items]);
  const total = useMemo(
    () => items.reduce((sum, line) => sum + line.price * line.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({ items, itemCount, total, hydrated, addItem, removeItem, setQuantity, clearCart }),
    [items, itemCount, total, hydrated, addItem, removeItem, setQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
