import { siteConfig } from "@/config/site";
import { formatPrice } from "@/config/products";
import type { Order, OrderItem } from "./orders";

const TELEGRAM_API = "https://api.telegram.org";

function getBotToken() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  return token;
}

function getStaffChatId() {
  const chatId = process.env.TELEGRAM_STAFF_CHAT_ID;
  if (!chatId) throw new Error("TELEGRAM_STAFF_CHAT_ID is not configured");
  return chatId;
}

async function telegramRequest<T>(method: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${TELEGRAM_API}/bot${getBotToken()}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await response.json()) as { ok: boolean; result?: T; description?: string };
  if (!data.ok) throw new Error(data.description ?? `Telegram API error: ${method}`);
  return data.result as T;
}

export function formatOrderItemsList(items: OrderItem[]): string {
  return items
    .map((item) => `— ${item.name} ×${item.quantity} — ${formatPrice(item.price * item.quantity)}`)
    .join("\n");
}

export function formatStaffOrderMessage(order: Order): string {
  return [
    `🛒 Заказ #${order.id} · самовывоз`,
    `${order.customerName} · ${order.phone}`,
    order.comment ? `Комментарий: ${order.comment}` : null,
    "",
    formatOrderItemsList(order.items),
    "",
    `Итого: ${formatPrice(order.total)}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function notifyStaffNewOrder(order: Order) {
  const message = await telegramRequest<{ message_id: number }>("sendMessage", {
    chat_id: getStaffChatId(),
    text: formatStaffOrderMessage(order),
    reply_markup: {
      inline_keyboard: [[{ text: "✅ Заказ собран", callback_data: `order_ready:${order.id}` }]],
    },
  });
  return message.message_id;
}

export async function notifyCustomerOrderAccepted(order: Order) {
  if (!order.telegramChatId) return;
  await telegramRequest("sendMessage", {
    chat_id: order.telegramChatId,
    text: [
      `Заказ #${order.id} принят в PC Барбершоп.`,
      "Соберём товары и сообщим, когда можно забирать.",
      `Адрес: ${siteConfig.fullAddress}`,
    ].join("\n"),
  });
}

export async function notifyCustomerOrderReady(order: Order) {
  if (!order.telegramChatId) return;
  await telegramRequest("sendMessage", {
    chat_id: order.telegramChatId,
    text: [
      `✅ Заказ #${order.id} собран!`,
      `Забрать можно по адресу: ${siteConfig.fullAddress}`,
      `Часы работы: ${siteConfig.hours}`,
    ].join("\n"),
  });
}

export async function answerCallbackQuery(callbackQueryId: string, text: string) {
  await telegramRequest("answerCallbackQuery", {
    callback_query_id: callbackQueryId,
    text,
    show_alert: false,
  });
}

export async function editStaffOrderMessage(order: Order) {
  if (!order.staffMessageId) return;
  await telegramRequest("editMessageText", {
    chat_id: getStaffChatId(),
    message_id: order.staffMessageId,
    text: `${formatStaffOrderMessage(order)}\n\n✅ Собрано`,
    reply_markup: { inline_keyboard: [] },
  });
}

export async function sendWelcomeBindingMessage(chatId: string) {
  await telegramRequest("sendMessage", {
    chat_id: chatId,
    text: [
      "✅ Уведомления PC Барбершоп подключены.",
      "",
      "Вернитесь на сайт и нажмите «Подтвердить заказ».",
      "Мы сообщим, когда заказ будет собран.",
    ].join("\n"),
  });
}

export function isStaffChat(chatId: string | number) {
  return String(chatId) === String(getStaffChatId());
}

export async function setTelegramWebhook(appUrl: string, secret: string) {
  return telegramRequest("setWebhook", {
    url: `${appUrl}/api/telegram/webhook?secret=${secret}`,
    allowed_updates: ["message", "callback_query"],
  });
}
