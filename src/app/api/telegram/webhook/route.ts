import { NextResponse } from "next/server";
import {
  adjustTrackedInventoryQuantity,
  getProductWithInventoryBySlug,
  getLowStockProducts,
  setTrackedInventoryQuantity,
} from "@/lib/inventory";
import { getOrderById, isIssuedBindToken, saveTelegramBinding, updateOrder } from "@/lib/order-store";
import { productCatalog, productCategories, type ProductCategory } from "@/config/products";
import { BIND_TOKEN_PATTERN } from "@/lib/orders";
import { safeEqualSecret } from "@/lib/security";
import {
  clearPendingQtyEdit,
  getPendingQtyEdit,
  setPendingQtyEdit,
} from "@/lib/telegram-pending-qty";
import {
  answerCallbackQuery,
  buildNumberedProductKeyboard,
  editTelegramInlineKeyboard,
  editStaffOrderMessage,
  formatCategoryProductPickerMessage,
  formatInventoryCustomInputPrompt,
  formatInventoryLine,
  formatInventoryPrompt,
  isStaffChat,
  notifyCustomerOrderReady,
  sendTelegramInlineKeyboard,
  sendTelegramMessage,
  sendWelcomeBindingMessage,
} from "@/lib/telegram";
import { PersistentStoreUnavailableError } from "@/lib/supabase";

interface TelegramUpdate {
  message?: {
    chat: { id: number };
    text?: string;
  };
  callback_query?: {
    id: string;
    data?: string;
    message?: { message_id: number; chat: { id: number } };
    from: { id: number };
  };
}

const categoryLabelById = Object.fromEntries(
  productCategories.map((category) => [category.id, category.label]),
) as Record<ProductCategory, string>;

function getProductByIndex(index: number) {
  return productCatalog[index];
}

function buildKeyboardRows(items: { text: string; callback_data: string }[], rowSize = 2) {
  const rows: Array<Array<{ text: string; callback_data: string }>> = [];

  for (let index = 0; index < items.length; index += rowSize) {
    rows.push(items.slice(index, index + rowSize));
  }

  return rows;
}

function getProductsInCategory(categoryId: ProductCategory) {
  return productCatalog
    .map((product, index) => ({ product, index }))
    .filter(({ product }) => product.category === categoryId);
}

function buildCategoryKeyboard() {
  return buildKeyboardRows(
    productCategories.map((category) => ({
      text: category.label,
      callback_data: `stock_cat:${category.id}`,
    })),
  );
}

async function sendCategoryProductPicker(
  chatId: string,
  messageId: number,
  categoryId: ProductCategory,
) {
  const products = getProductsInCategory(categoryId);

  await editTelegramInlineKeyboard(
    chatId,
    messageId,
    formatCategoryProductPickerMessage(categoryLabelById[categoryId], products),
    buildNumberedProductKeyboard(products),
  );
}

function buildProductDetailsKeyboard(productIndex: number, categoryId: ProductCategory) {
  return [
    [
      { text: "➖", callback_data: `stock_dec:${productIndex}` },
      { text: "➕", callback_data: `stock_inc:${productIndex}` },
    ],
    [{ text: "✏️ Указать количество", callback_data: `stock_set:${productIndex}` }],
    [{ text: "0 — нет в наличии", callback_data: `stock_zero:${productIndex}` }],
    [
      {
        text: "⬅ К товарам категории",
        callback_data: `stock_cat:${categoryId}`,
      },
    ],
    [{ text: "⬅ К категориям", callback_data: "stock_back:categories" }],
  ];
}

function formatStaffHelp() {
  return [
    "Команды PC Барбершоп:",
    "",
    "/stock — выбрать категорию и товар, изменить остаток кнопками ➖ ➕",
    "/lowstock — показать товары, где осталось 3 шт. и меньше",
    "/cancel — отменить ввод количества",
    "/help — показать эту подсказку",
    "",
    "После /stock выберите товар и используйте кнопки на карточке.",
  ].join("\n");
}

async function sendStockCategoryPicker(chatId: string) {
  await clearPendingQtyEdit(chatId);
  await sendTelegramInlineKeyboard(
    chatId,
    "Выберите категорию, затем товар для управления остатком:",
    buildCategoryKeyboard(),
  );
}

async function showProductInventoryCard(
  chatId: string,
  messageId: number,
  productIndex: number,
) {
  const selected = getProductByIndex(productIndex);
  if (!selected) return null;

  const product = await getProductWithInventoryBySlug(selected.slug);
  if (!product) return null;

  await clearPendingQtyEdit(chatId);
  await editTelegramInlineKeyboard(
    chatId,
    messageId,
    formatInventoryPrompt(product),
    buildProductDetailsKeyboard(productIndex, product.category),
  );

  return product;
}

async function handlePendingQuantityInput(chatId: string, text: string) {
  const pending = await getPendingQtyEdit(chatId);
  if (!pending) return false;

  const quantity = Number(text.trim());
  if (!Number.isFinite(quantity) || quantity < 0 || !Number.isInteger(quantity)) {
    await sendTelegramMessage(chatId, "Отправьте целое число от 0 и выше. Например: 12");
    return true;
  }

  const { product } = await setTrackedInventoryQuantity(pending.slug, quantity);
  await clearPendingQtyEdit(chatId);

  if (pending.messageId) {
    await editTelegramInlineKeyboard(
      chatId,
      pending.messageId,
      formatInventoryPrompt(product),
      buildProductDetailsKeyboard(pending.productIndex, product.category),
    );
    await sendTelegramMessage(chatId, `Остаток обновлён: ${product.name} — ${quantity} шт.`);
  } else {
    await sendTelegramInlineKeyboard(
      chatId,
      formatInventoryPrompt(product),
      buildProductDetailsKeyboard(pending.productIndex, product.category),
    );
  }

  return true;
}

async function handleStockCallback(
  callbackId: string,
  chatId: string,
  messageId: number,
  data: string,
) {
  if (data === "stock_back:categories") {
    await clearPendingQtyEdit(chatId);
    await editTelegramInlineKeyboard(
      chatId,
      messageId,
      "Выберите категорию, затем товар для управления остатком:",
      buildCategoryKeyboard(),
    );
    await answerCallbackQuery(callbackId, "Показаны категории");
    return;
  }

  if (data.startsWith("stock_cat:")) {
    await clearPendingQtyEdit(chatId);
    const categoryId = data.replace("stock_cat:", "") as ProductCategory;
    if (!(categoryId in categoryLabelById)) {
      await answerCallbackQuery(callbackId, "Категория не найдена");
      return;
    }

    await sendCategoryProductPicker(chatId, messageId, categoryId);
    await answerCallbackQuery(callbackId, "Показаны товары");
    return;
  }

  if (data.startsWith("stock_item:")) {
    const productIndex = Number(data.replace("stock_item:", ""));
    const product = await showProductInventoryCard(chatId, messageId, productIndex);
    if (!product) {
      await answerCallbackQuery(callbackId, "Товар не найден");
      return;
    }

    await answerCallbackQuery(callbackId, "Товар открыт");
    return;
  }

  if (data.startsWith("stock_inc:") || data.startsWith("stock_dec:")) {
    const productIndex = Number(data.split(":")[1]);
    const selected = getProductByIndex(productIndex);
    if (!selected) {
      await answerCallbackQuery(callbackId, "Товар не найден");
      return;
    }

    const delta = data.startsWith("stock_inc:") ? 1 : -1;
    const { product } = await adjustTrackedInventoryQuantity(selected.slug, delta);
    await clearPendingQtyEdit(chatId);

    await editTelegramInlineKeyboard(
      chatId,
      messageId,
      formatInventoryPrompt(product),
      buildProductDetailsKeyboard(productIndex, product.category),
    );
    await answerCallbackQuery(
      callbackId,
      product.quantity === null ? "Остаток обновлён" : `Сейчас: ${product.quantity} шт.`,
    );
    return;
  }

  if (data.startsWith("stock_zero:")) {
    const productIndex = Number(data.replace("stock_zero:", ""));
    const selected = getProductByIndex(productIndex);
    if (!selected) {
      await answerCallbackQuery(callbackId, "Товар не найден");
      return;
    }

    const { product } = await setTrackedInventoryQuantity(selected.slug, 0);
    await clearPendingQtyEdit(chatId);

    await editTelegramInlineKeyboard(
      chatId,
      messageId,
      formatInventoryPrompt(product),
      buildProductDetailsKeyboard(productIndex, product.category),
    );
    await answerCallbackQuery(callbackId, "Товар отмечен как отсутствующий");
    return;
  }

  if (data.startsWith("stock_set:")) {
    const productIndex = Number(data.replace("stock_set:", ""));
    const selected = getProductByIndex(productIndex);
    if (!selected) {
      await answerCallbackQuery(callbackId, "Товар не найден");
      return;
    }

    const product = await getProductWithInventoryBySlug(selected.slug);
    if (!product) {
      await answerCallbackQuery(callbackId, "Товар не найден");
      return;
    }

    await setPendingQtyEdit(chatId, {
      slug: selected.slug,
      productIndex,
      messageId,
      updatedAt: new Date().toISOString(),
    });

    await editTelegramInlineKeyboard(
      chatId,
      messageId,
      formatInventoryCustomInputPrompt(product),
      buildProductDetailsKeyboard(productIndex, product.category),
    );
    await answerCallbackQuery(callbackId, "Отправьте число сообщением");
  }
}

async function handleStaffCommand(chatId: string, text: string) {
  const trimmed = text.trim();

  if (trimmed.startsWith("/")) {
    const [command] = trimmed.split(/\s+/);

    if (command === "/stock") {
      await sendStockCategoryPicker(chatId);
      return;
    }

    if (command === "/lowstock") {
      await clearPendingQtyEdit(chatId);
      const lowStockProducts = await getLowStockProducts();
      if (lowStockProducts.length === 0) {
        await sendTelegramMessage(chatId, "Товаров с остатком 3 шт. и меньше сейчас нет.");
        return;
      }

      await sendTelegramMessage(
        chatId,
        ["Малый остаток:", ...lowStockProducts.map((product) => formatInventoryLine(product))].join(
          "\n\n",
        ),
      );
      return;
    }

    if (command === "/cancel") {
      await clearPendingQtyEdit(chatId);
      await sendTelegramMessage(chatId, "Ввод количества отменён.");
      return;
    }

    if (command === "/help") {
      await sendTelegramMessage(chatId, formatStaffHelp());
      return;
    }
  }

  if (await handlePendingQuantityInput(chatId, trimmed)) {
    return;
  }

  await sendTelegramMessage(chatId, formatStaffHelp());
}

export async function POST(request: Request) {
  const headerSecret = request.headers.get("x-telegram-bot-api-secret-token");
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!expected || !safeEqualSecret(headerSecret, expected)) {
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
        if (!BIND_TOKEN_PATTERN.test(bindToken) || !(await isIssuedBindToken(bindToken))) {
          await sendTelegramMessage(
            chatId,
            "Ссылка устарела или недействительна. Откройте оформление заказа на сайте и нажмите «Подключить Telegram» снова.",
          );
        } else {
          await saveTelegramBinding(bindToken, chatId);
          await sendWelcomeBindingMessage(chatId);
        }
      } else {
        await sendWelcomeBindingMessage(chatId);
      }
    } else if (update.message?.text) {
      const chatId = String(update.message.chat.id);
      if (isStaffChat(chatId)) {
        await handleStaffCommand(chatId, update.message.text);
      }
    }

    if (update.callback_query?.data?.startsWith("stock_")) {
      const callback = update.callback_query;
      const callbackData = callback.data;
      const chatId = callback.message?.chat.id;
      const messageId = callback.message?.message_id;
      if (!callbackData || !chatId || !messageId || !isStaffChat(chatId)) {
        await answerCallbackQuery(callback.id, "Недостаточно прав");
        return NextResponse.json({ ok: true });
      }

      await handleStockCallback(callback.id, String(chatId), messageId, callbackData);
      return NextResponse.json({ ok: true });
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
    if (error instanceof PersistentStoreUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
  }

  return NextResponse.json({ ok: true });
}
