export type OrderStatus = "new" | "assembling" | "ready" | "picked_up";

export interface OrderItem {
  slug: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  bindToken: string;
  items: OrderItem[];
  total: number;
  customerName: string;
  phone: string;
  comment?: string;
  telegramChatId?: string;
  status: OrderStatus;
  staffMessageId?: number;
  createdAt: string;
  readyAt?: string;
}

export interface CreateOrderPayload {
  bindToken: string;
  customerName: string;
  phone: string;
  comment?: string;
  items: { slug: string; quantity: number }[];
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("8")) return `7${digits.slice(1)}`;
  if (digits.length === 10) return `7${digits}`;
  return digits;
}

export function isValidPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  return normalized.length === 11 && normalized.startsWith("7");
}

export function isValidCreateOrderPayload(payload: unknown): payload is CreateOrderPayload {
  if (!payload || typeof payload !== "object") return false;
  const p = payload as CreateOrderPayload;
  return (
    typeof p.bindToken === "string" &&
    p.bindToken.length >= 8 &&
    typeof p.customerName === "string" &&
    p.customerName.trim().length >= 2 &&
    typeof p.phone === "string" &&
    isValidPhone(p.phone) &&
    Array.isArray(p.items) &&
    p.items.length > 0 &&
    p.items.every(
      (item) =>
        typeof item.slug === "string" &&
        typeof item.quantity === "number" &&
        item.quantity > 0 &&
        item.quantity <= 20,
    )
  );
}
