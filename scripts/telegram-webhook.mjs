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
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET, NEXT_PUBLIC_APP_URL } = env;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_WEBHOOK_SECRET || !NEXT_PUBLIC_APP_URL) {
    throw new Error("Нужны TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET, NEXT_PUBLIC_APP_URL в .env.local");
  }

  const webhookUrl = `${NEXT_PUBLIC_APP_URL.replace(/\/$/, "")}/api/telegram/webhook?secret=${TELEGRAM_WEBHOOK_SECRET}`;
  await tg(TELEGRAM_BOT_TOKEN, "setWebhook", {
    url: webhookUrl,
    allowed_updates: ["message", "callback_query"],
  });

  const info = await tg(TELEGRAM_BOT_TOKEN, "getWebhookInfo");
  console.log(`✓ Webhook: ${info.url}`);
  if (info.last_error_message) {
    console.warn(`⚠ ${info.last_error_message}`);
  }
}

main().catch((error) => {
  console.error("✗", error.message);
  process.exit(1);
});
