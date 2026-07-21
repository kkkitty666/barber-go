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
  /** Opaque token for order history lookup (not the bind token). */
  accessToken: string;
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

export const MAX_COMMENT_LENGTH = 500;

/** Server-issued bind tokens are 32 lowercase hex chars. */
export const BIND_TOKEN_PATTERN = /^[a-f0-9]{32}$/;

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

/** Reject control chars (allow tab/newline/carriage return). */
export function isValidComment(comment: unknown): boolean {
  if (comment === undefined || comment === null) return true;
  if (typeof comment !== "string") return false;
  if (comment.length > MAX_COMMENT_LENGTH) return false;
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(comment)) return false;
  return true;
}

export function sanitizeComment(comment: string | undefined): string | undefined {
  if (!comment) return undefined;
  const trimmed = comment.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, MAX_COMMENT_LENGTH);
}

export function isValidCreateOrderPayload(payload: unknown): payload is CreateOrderPayload {
  if (!payload || typeof payload !== "object") return false;
  const p = payload as CreateOrderPayload;
  if ("comment" in p && p.comment !== undefined && !isValidComment(p.comment)) {
    return false;
  }
  return (
    typeof p.bindToken === "string" &&
    BIND_TOKEN_PATTERN.test(p.bindToken) &&
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
