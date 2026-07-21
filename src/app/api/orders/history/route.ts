import { NextResponse } from "next/server";
import { getOrdersByLookups } from "@/lib/order-store";
import { normalizePhone, type Order, type OrderStatus } from "@/lib/orders";
import { clientIpFromRequest, rateLimit } from "@/lib/rate-limit";
import { PersistentStoreUnavailableError } from "@/lib/supabase";

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

const HISTORY_LOOKUP_CAP = 10;
const HISTORY_RESULT_CAP = 10;

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

interface HistoryLookup {
  orderId?: string;
  phone?: string;
  accessToken?: string;
}

/**
 * Order history requires proof of ownership per order:
 * - orderId + accessToken (preferred), or
 * - orderId + phone (normalized, recovery)
 * Phone-only bulk lookup is not allowed.
 */
export async function POST(request: Request) {
  try {
    const ip = clientIpFromRequest(request);
    const body = (await request.json()) as {
      lookups?: HistoryLookup[];
      orderId?: string;
      phone?: string;
      accessToken?: string;
    };

    const lookups: { orderId: string; phone?: string; accessToken?: string }[] = [];

    if (Array.isArray(body.lookups)) {
      for (const entry of body.lookups) {
        if (!entry || typeof entry.orderId !== "string" || !entry.orderId.trim()) continue;
        const phone =
          typeof entry.phone === "string" && entry.phone.trim()
            ? normalizePhone(entry.phone)
            : undefined;
        const accessToken =
          typeof entry.accessToken === "string" && entry.accessToken.trim()
            ? entry.accessToken.trim()
            : undefined;
        if (!phone && !accessToken) continue;
        lookups.push({ orderId: entry.orderId.trim(), phone, accessToken });
      }
    }

    if (typeof body.orderId === "string" && body.orderId.trim()) {
      const phone =
        typeof body.phone === "string" && body.phone.trim()
          ? normalizePhone(body.phone)
          : undefined;
      const accessToken =
        typeof body.accessToken === "string" && body.accessToken.trim()
          ? body.accessToken.trim()
          : undefined;
      if (phone || accessToken) {
        lookups.push({ orderId: body.orderId.trim(), phone, accessToken });
      }
    }

    if (lookups.length === 0) {
      return NextResponse.json(
        { error: "Укажите номер заказа и телефон (или токен доступа)" },
        { status: 400 },
      );
    }

    const capped = lookups.slice(0, HISTORY_LOOKUP_CAP);
    const usesPhoneRecovery = capped.some((l) => l.phone && !l.accessToken);
    const limited = rateLimit(usesPhoneRecovery ? `orders:history:phone:${ip}` : `orders:history:${ip}`, {
      limit: usesPhoneRecovery ? 10 : 20,
      windowMs: 60_000,
    });
    if (!limited.ok) {
      return NextResponse.json(
        { error: "Слишком много запросов. Попробуйте через минуту." },
        { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
      );
    }

    const orders = await getOrdersByLookups(capped);

    if (orders.length === 0) {
      const missLimited = rateLimit(`orders:history:miss:${ip}`, { limit: 8, windowMs: 60_000 });
      if (!missLimited.ok) {
        return NextResponse.json(
          { error: "Слишком много запросов. Попробуйте через минуту." },
          { status: 429, headers: { "Retry-After": String(missLimited.retryAfterSec) } },
        );
      }
    }

    return NextResponse.json({
      orders: orders.slice(0, HISTORY_RESULT_CAP).map(toPublicOrder),
    });
  } catch (error) {
    if (error instanceof PersistentStoreUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    return NextResponse.json({ error: "Не удалось загрузить заказы" }, { status: 500 });
  }
}
