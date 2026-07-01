#!/usr/bin/env node
/**
 * Локальная обработка нажатий Telegram (кнопка «Заказ собран», /start).
 * Запускай параллельно с npm run dev: npm run telegram:poll
 */
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const ENV_PATH = join(dirname(fileURLToPath(import.meta.url)), "..", ".env.local");
const POLL_INTERVAL_MS = 1500;
const LOCAL_APP_URL = process.env.LOCAL_APP_URL ?? "http://localhost:3000";

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

async function forwardUpdate(update, secret) {
  const url = `${LOCAL_APP_URL}/api/telegram/webhook?secret=${encodeURIComponent(secret)}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(update),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Webhook ${response.status}: ${text}`);
  }
}

async function main() {
  const env = loadEnvFile(ENV_PATH);
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET } = env;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_WEBHOOK_SECRET) {
    throw new Error("Нужны TELEGRAM_BOT_TOKEN и TELEGRAM_WEBHOOK_SECRET в .env.local");
  }

  const me = await tg(TELEGRAM_BOT_TOKEN, "getMe");
  console.log(`\n🤖 Telegram poll: @${me.username}`);
  console.log(`   → ${LOCAL_APP_URL}/api/telegram/webhook`);
  console.log("   Ctrl+C чтобы остановить\n");

  await tg(TELEGRAM_BOT_TOKEN, "deleteWebhook", { drop_pending_updates: false });

  let offset = 0;
  let running = true;

  process.on("SIGINT", () => {
    running = false;
    console.log("\nОстановлено.");
    process.exit(0);
  });

  while (running) {
    try {
      const updates = await tg(TELEGRAM_BOT_TOKEN, "getUpdates", {
        offset,
        timeout: 30,
        allowed_updates: ["message", "callback_query"],
      });

      for (const update of updates) {
        offset = update.update_id + 1;
        const kind = update.callback_query ? "callback" : update.message ? "message" : "update";
        console.log(`← ${kind} #${update.update_id}`);
        await forwardUpdate(update, TELEGRAM_WEBHOOK_SECRET);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes("ECONNREFUSED") || message.includes("fetch failed")) {
        console.warn(`⚠ Сервер недоступен (${LOCAL_APP_URL}). Запусти: npm run dev`);
      } else {
        console.error("✗", message);
      }
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    }
  }
}

main().catch((error) => {
  console.error("✗", error.message);
  process.exit(1);
});
