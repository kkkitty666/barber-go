import { NextResponse } from "next/server";
import { getAllOrders } from "@/lib/order-store";
import { normalizePhone, type Order, type OrderStatus } from "@/lib/orders";

export interface PublicOrder {
  id: string;
  items: Order["items"];
  total: number;
  customerName: string;
  status: OrderStatus;
  createdAt: string;
  readyAt?: string;
  comment?: string;
}

function toPublicOrder(order: Order): PublicOrder {
  return {
    id: order.id,
    items: order.items,
    total: order.total,
    customerName: order.customerName,
    status: order.status,
    createdAt: order.createdAt,
    readyAt: order.readyAt,
    comment: order.comment,
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { phone?: string; orderIds?: string[] };
    const orders = await getAllOrders();
    const result = new Map<string, PublicOrder>();

    if (Array.isArray(body.orderIds)) {
      for (const id of body.orderIds) {
        const order = orders.find((entry) => entry.id === id);
        if (order) result.set(order.id, toPublicOrder(order));
      }
    }

    if (body.phone && typeof body.phone === "string") {
      const normalized = normalizePhone(body.phone);
      for (const order of orders) {
        if (order.phone === normalized) {
          result.set(order.id, toPublicOrder(order));
        }
      }
    }

    const list = Array.from(result.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return NextResponse.json({ orders: list.slice(0, 30) });
  } catch {
    return NextResponse.json({ error: "Не удалось загрузить заказы" }, { status: 500 });
  }
}
