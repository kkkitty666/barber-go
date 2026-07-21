#!/usr/bin/env node
/**
 * Регистрация webhook после деплоя.
 * npm run telegram:webhook
 */
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const ENV_PATH = join(dirname(fileURLToPath(import.meta.url)), "..", ".env.local");

function loadEnvFile(path) {
  if (!existsSync(path)) return {};
  const env = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

async function tg(token, method, body = {}) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!data.ok) throw new Error(data.description ?? `Telegram API: ${method}`);
  return data.result;
}

async function main() {
  const env = loadEnvFile(ENV_PATH);
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET, NEXT_PUBLIC_APP_URL, TELEGRAM_STAFF_CHAT_ID } = env;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_WEBHOOK_SECRET || !NEXT_PUBLIC_APP_URL) {
    throw new Error("Нужны TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET, NEXT_PUBLIC_APP_URL в .env.local");
  }

  const webhookUrl = `${NEXT_PUBLIC_APP_URL.replace(/\/$/, "")}/api/telegram/webhook`;
  await tg(TELEGRAM_BOT_TOKEN, "setWebhook", {
    url: webhookUrl,
    secret_token: TELEGRAM_WEBHOOK_SECRET,
    allowed_updates: ["message", "callback_query"],
  });

  const info = await tg(TELEGRAM_BOT_TOKEN, "getWebhookInfo");
  console.log(`✓ Webhook: ${info.url}`);
  console.log("✓ secret_token задан (проверка через заголовок X-Telegram-Bot-Api-Secret-Token)");
  if (info.last_error_message) {
    console.warn(`⚠ ${info.last_error_message}`);
  }

  await tg(TELEGRAM_BOT_TOKEN, "setMyCommands", {
    commands: [
      { command: "start", description: "Подключить уведомления о заказах" },
      { command: "help", description: "Как пользоваться ботом" },
    ],
  });

  if (TELEGRAM_STAFF_CHAT_ID) {
    await tg(TELEGRAM_BOT_TOKEN, "setMyCommands", {
      commands: [
        { command: "stock", description: "Выбрать товар и изменить остаток" },
        { command: "lowstock", description: "Товары с остатком 3 шт. и меньше" },
        { command: "cancel", description: "Отменить ввод количества" },
        { command: "help", description: "Показать все команды" },
      ],
      scope: { type: "chat", chat_id: Number(TELEGRAM_STAFF_CHAT_ID) },
    });
    console.log("✓ Подсказки команд обновлены");
  }
}

main().catch((error) => {
  console.error("✗", error.message);
  process.exit(1);
});
