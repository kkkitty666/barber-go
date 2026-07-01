const STORAGE_KEY = "pc-barbershop-order-history";

export interface SavedOrderRef {
  orderId: string;
  phone: string;
  savedAt: string;
}

export function getSavedOrderRefs(): SavedOrderRef[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedOrderRef[]) : [];
  } catch {
    return [];
  }
}

export function saveOrderRef(orderId: string, phone: string) {
  const existing = getSavedOrderRefs().filter((entry) => entry.orderId !== orderId);
  existing.unshift({
    orderId,
    phone,
    savedAt: new Date().toISOString(),
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 50)));
}

export function getLastUsedPhone(): string {
  const refs = getSavedOrderRefs();
  return refs[0]?.phone ?? "";
}
