import { NextResponse } from "next/server";
import { productCatalog } from "@/config/products";
import {
  generateBindToken,
  generateOrderId,
  getTelegramBinding,
  saveOrder,
  updateOrder,
} from "@/lib/order-store";
import { isValidCreateOrderPayload, normalizePhone, type Order, type OrderItem } from "@/lib/orders";
import { notifyCustomerOrderAccepted, notifyStaffNewOrder } from "@/lib/telegram";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    if (!isValidCreateOrderPayload(payload)) {
      return NextResponse.json({ error: "Некорректные данные заказа" }, { status: 400 });
    }

    const orderItems: OrderItem[] = [];
    let total = 0;

    for (const item of payload.items) {
      const product = productCatalog.find((p) => p.slug === item.slug);
      if (!product || !product.inStock) {
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
      items: orderItems,
      total,
      customerName: payload.customerName.trim(),
      phone: normalizePhone(payload.phone),
      comment: payload.comment?.trim() || undefined,
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
      telegramLinked: Boolean(telegramChatId),
    });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json({ error: "Не удалось создать заказ" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ bindToken: generateBindToken() });
}
