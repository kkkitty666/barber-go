import { NextResponse } from "next/server";
import { getOrderById, saveTelegramBinding, updateOrder } from "@/lib/order-store";
import {
  answerCallbackQuery,
  editStaffOrderMessage,
  isStaffChat,
  notifyCustomerOrderReady,
  sendWelcomeBindingMessage,
} from "@/lib/telegram";

interface TelegramUpdate {
  message?: {
    chat: { id: number };
    text?: string;
  };
  callback_query?: {
    id: string;
    data?: string;
    message?: { chat: { id: number } };
    from: { id: number };
  };
}

export async function POST(request: Request) {
  const secret = new URL(request.url).searchParams.get("secret");
  if (!secret || secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const update = (await request.json()) as TelegramUpdate;

  try {
    if (update.message?.text?.startsWith("/start")) {
      const chatId = String(update.message.chat.id);
      const parts = update.message.text.split(" ");
      const payload = parts[1];

      if (payload?.startsWith("bind_")) {
        const bindToken = payload.replace("bind_", "");
        await saveTelegramBinding(bindToken, chatId);
        await sendWelcomeBindingMessage(chatId);
      } else {
        await sendWelcomeBindingMessage(chatId);
      }
    }

    if (update.callback_query?.data?.startsWith("order_ready:")) {
      const callback = update.callback_query;
      const chatId = callback.message?.chat.id;
      if (!chatId || !isStaffChat(chatId)) {
        await answerCallbackQuery(callback.id, "Недостаточно прав");
        return NextResponse.json({ ok: true });
      }

      const orderId = callback.data?.replace("order_ready:", "");
      if (!orderId) {
        await answerCallbackQuery(callback.id, "Некорректные данные");
        return NextResponse.json({ ok: true });
      }
      const order = await getOrderById(orderId);
      if (!order) {
        await answerCallbackQuery(callback.id, "Заказ не найден");
        return NextResponse.json({ ok: true });
      }

      if (order.status === "ready") {
        await answerCallbackQuery(callback.id, "Заказ уже отмечен как собранный");
        return NextResponse.json({ ok: true });
      }

      const updated = await updateOrder(orderId, {
        status: "ready",
        readyAt: new Date().toISOString(),
      });

      if (updated) {
        await editStaffOrderMessage(updated);
        await notifyCustomerOrderReady(updated);
      }

      await answerCallbackQuery(callback.id, "Клиент уведомлён");
    }
  } catch (error) {
    console.error("Telegram webhook error:", error);
  }

  return NextResponse.json({ ok: true });
}
