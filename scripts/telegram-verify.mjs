#!/usr/bin/env node
/**
 * Проверка Telegram-бота без интерактива.
 * npm run telegram:verify
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
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_STAFF_CHAT_ID, TELEGRAM_WEBHOOK_SECRET, NEXT_PUBLIC_APP_URL } =
    env;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_STAFF_CHAT_ID) {
    throw new Error("Заполни .env.local (npm run telegram:setup)");
  }

  const me = await tg(TELEGRAM_BOT_TOKEN, "getMe");
  console.log(`✓ Бот: @${me.username}`);

  await tg(TELEGRAM_BOT_TOKEN, "sendMessage", {
    chat_id: TELEGRAM_STAFF_CHAT_ID,
    text: "✅ Тест: бот PC Барбершоп работает. Заказы будут приходить сюда.",
  });
  console.log("✓ Тестовое сообщение отправлено в группу сотрудников");

  const info = await tg(TELEGRAM_BOT_TOKEN, "getWebhookInfo");
  if (info.url) {
    console.log(`• Webhook: ${info.url}`);
    if (info.last_error_message) {
      console.warn(`⚠ Webhook ошибка: ${info.last_error_message}`);
    } else {
      console.log("✓ Webhook активен");
    }
  } else if (NEXT_PUBLIC_APP_URL && TELEGRAM_WEBHOOK_SECRET) {
    console.log("⚠ Webhook не установлен — нужен задеплоенный HTTPS-сайт");
    console.log(`  После деплоя: npm run telegram:webhook`);
  }
}

main().catch((error) => {
  console.error("✗", error.message);
  process.exit(1);
});
