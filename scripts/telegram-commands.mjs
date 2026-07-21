#!/usr/bin/env node
/**
 * Регистрация подсказок команд в Telegram.
 * npm run telegram:commands
 */
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const ENV_PATH = join(dirname(fileURLToPath(import.meta.url)), "..", ".env.local");

const CUSTOMER_COMMANDS = [
  { command: "start", description: "Подключить уведомления о заказах" },
  { command: "help", description: "Как пользоваться ботом" },
];

const STAFF_COMMANDS = [
  { command: "stock", description: "Выбрать товар и изменить остаток" },
  { command: "lowstock", description: "Товары с остатком 3 шт. и меньше" },
  { command: "cancel", description: "Отменить ввод количества" },
  { command: "help", description: "Показать все команды" },
];

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
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_STAFF_CHAT_ID } = env;

  if (!TELEGRAM_BOT_TOKEN) {
    throw new Error("Нужен TELEGRAM_BOT_TOKEN в .env.local");
  }

  await tg(TELEGRAM_BOT_TOKEN, "setMyCommands", {
    commands: CUSTOMER_COMMANDS,
  });

  console.log("✓ Команды для клиентов:");
  for (const command of CUSTOMER_COMMANDS) {
    console.log(`  /${command.command} — ${command.description}`);
  }

  if (TELEGRAM_STAFF_CHAT_ID) {
    await tg(TELEGRAM_BOT_TOKEN, "setMyCommands", {
      commands: STAFF_COMMANDS,
      scope: {
        type: "chat",
        chat_id: Number(TELEGRAM_STAFF_CHAT_ID),
      },
    });

    console.log("\n✓ Команды для staff-чата:");
    for (const command of STAFF_COMMANDS) {
      console.log(`  /${command.command} — ${command.description}`);
    }
  } else {
    console.warn("\n⚠ TELEGRAM_STAFF_CHAT_ID не задан — staff-команды не установлены");
  }
}

main().catch((error) => {
  console.error("✗", error.message);
  process.exit(1);
});
