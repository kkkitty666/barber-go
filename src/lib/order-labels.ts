import type { OrderStatus } from "@/lib/orders";

export const orderStatusLabels: Record<OrderStatus, string> = {
  new: "Новый",
  assembling: "Собирается",
  ready: "Готов к выдаче",
  picked_up: "Выдан",
};

export function formatOrderDate(iso: string): string {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
