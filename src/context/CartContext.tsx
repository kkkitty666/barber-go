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

interface CartContextValue {
  items: CartLine[];
  itemCount: number;
  total: number;
  hydrated: boolean;
  addItem: (slug: string, quantity?: number) => void;
  removeItem: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
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

  const addItem = useCallback((slug: string, quantity = 1) => {
    const product = getProductBySlug(slug);
    if (!product || !product.inStock) return;

    setItems((prev) => {
      const existing = prev.find((line) => line.slug === slug);
      if (existing) {
        return prev.map((line) =>
          line.slug === slug ? { ...line, quantity: line.quantity + quantity } : line,
        );
      }
      return [
        ...prev,
        {
          slug: product.slug,
          name: product.name,
          brand: product.brand,
          price: product.price,
          image: product.image,
          quantity,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((line) => line.slug !== slug));
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((line) => line.slug !== slug));
      return;
    }
    setItems((prev) => prev.map((line) => (line.slug === slug ? { ...line, quantity } : line)));
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
