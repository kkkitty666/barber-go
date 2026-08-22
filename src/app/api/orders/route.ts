import { NextResponse } from "next/server";
import {
  generateAccessToken,
  generateOrderId,
  getTelegramBinding,
  isIssuedBindToken,
  issueBindToken,
  saveOrder,
  updateOrder,
} from "@/lib/order-store";
import { InventoryError, reserveInventoryForOrder } from "@/lib/inventory";
import {
  isValidCreateOrderPayload,
  normalizePhone,
  sanitizeComment,
  mergeOrderItems,
  type Order,
  type OrderItem,
} from "@/lib/orders";
import { clientIpFromRequest, rateLimit } from "@/lib/rate-limit";
import { isAllowedRequestOrigin } from "@/lib/security";
import { PersistentStoreUnavailableError } from "@/lib/supabase";
import { notifyCustomerOrderAccepted, notifyStaffNewOrder } from "@/lib/telegram";

export async function POST(request: Request) {
  try {
    if (!isAllowedRequestOrigin(request)) {
      return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
    }

    const ip = clientIpFromRequest(request);
    const limited = rateLimit(`orders:create:${ip}`, { limit: 10, windowMs: 60_000 });
    if (!limited.ok) {
      return NextResponse.json(
        { error: "Слишком много запросов. Попробуйте через минуту." },
        { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
      );
    }

    const payload = await request.json();
    if (!isValidCreateOrderPayload(payload)) {
      return NextResponse.json({ error: "Некорректные данные заказа" }, { status: 400 });
    }

    if (!(await isIssuedBindToken(payload.bindToken))) {
      return NextResponse.json({ error: "Некорректный токен привязки" }, { status: 400 });
    }

    const orderItems: OrderItem[] = [];
    let total = 0;
    const items = mergeOrderItems(payload.items);

    if (items.some((item) => item.quantity > 20)) {
      return NextResponse.json({ error: "Слишком большое количество товара" }, { status: 400 });
    }

    const { products } = await reserveInventoryForOrder(items);

    for (const item of items) {
      const product = products.find((p) => p.slug === item.slug);
      if (!product) {
        return NextResponse.json({ error: `Товар недоступен: ${item.slug}` }, { status: 400 });
      }
      orderItems.push({
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        price: product.price,
        quantity: item.quantity,
      });
      total += product.price * item.quantity;
    }

    const telegramChatId = await getTelegramBinding(payload.bindToken);
    const order: Order = {
      id: generateOrderId(),
      bindToken: payload.bindToken,
      accessToken: generateAccessToken(),
      items: orderItems,
      total,
      customerName: payload.customerName.trim(),
      phone: normalizePhone(payload.phone),
      comment: sanitizeComment(payload.comment),
      telegramChatId,
      status: "new",
      createdAt: new Date().toISOString(),
    };

    await saveOrder(order);

    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_STAFF_CHAT_ID) {
      const staffMessageId = await notifyStaffNewOrder(order);
      await updateOrder(order.id, { staffMessageId });
      if (telegramChatId) await notifyCustomerOrderAccepted({ ...order, staffMessageId });
    }

    return NextResponse.json({
      orderId: order.id,
      accessToken: order.accessToken,
      telegramLinked: Boolean(telegramChatId),
    });
  } catch (error) {
    if (error instanceof InventoryError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof PersistentStoreUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("Order creation failed:", error);
    return NextResponse.json({ error: "Не удалось создать заказ" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const ip = clientIpFromRequest(request);
    const limited = rateLimit(`orders:bind:${ip}`, { limit: 30, windowMs: 60_000 });
    if (!limited.ok) {
      return NextResponse.json(
        { error: "Слишком много запросов. Попробуйте через минуту." },
        { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
      );
    }

    const bindToken = await issueBindToken();
    return NextResponse.json({ bindToken });
  } catch (error) {
    if (error instanceof PersistentStoreUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("Bind token issue failed:", error);
    return NextResponse.json({ error: "Не удалось выдать токен" }, { status: 500 });
  }
}
