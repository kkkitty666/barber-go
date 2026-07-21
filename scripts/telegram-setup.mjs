#!/usr/bin/env node
/**
 * Мастер настройки Telegram-бота PC Барбершоп.
 * Запуск: npm run telegram:setup
 */
import { createInterface } from "readline/promises";
import { randomBytes } from "crypto";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { stdin as input, stdout as output } from "process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ENV_PATH = join(ROOT, ".env.local");

const rl = createInterface({ input, output });

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

function saveEnvFile(path, env) {
  const lines = [
    "# Сгенерировано scripts/telegram-setup.mjs",
    "",
    `NEXT_PUBLIC_APP_URL=${env.NEXT_PUBLIC_APP_URL}`,
    "",
    `TELEGRAM_BOT_TOKEN=${env.TELEGRAM_BOT_TOKEN}`,
    `TELEGRAM_STAFF_CHAT_ID=${env.TELEGRAM_STAFF_CHAT_ID}`,
    `TELEGRAM_WEBHOOK_SECRET=${env.TELEGRAM_WEBHOOK_SECRET}`,
    `TELEGRAM_ADMIN_SECRET=${env.TELEGRAM_ADMIN_SECRET}`,
    "",
  ];
  writeFileSync(path, lines.join("\n"), "utf8");
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

function uniqueChats(updates) {
  const map = new Map();
  for (const update of updates) {
    const chat =
      update.message?.chat ??
      update.callback_query?.message?.chat ??
      update.my_chat_member?.chat;
    if (!chat?.id) continue;
    map.set(chat.id, chat);
  }
  return [...map.values()];
}

async function question(label, defaultValue = "") {
  const suffix = defaultValue ? ` [${defaultValue}]` : "";
  const answer = (await rl.question(`${label}${suffix}: `)).trim();
  return answer || defaultValue;
}

async function main() {
  console.log("\n=== Настройка Telegram-бота PC Барбершоп ===\n");

  const existing = loadEnvFile(ENV_PATH);
  let token = existing.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.log("1. Открой @BotFather → /mybots → твой бот → API Token");
    token = await question("Вставь TELEGRAM_BOT_TOKEN");
  }

  const me = await tg(token, "getMe");
  console.log(`\n✓ Бот: @${me.username} (${me.first_name})\n`);

  let staffChatId = existing.TELEGRAM_STAFF_CHAT_ID;
  if (!staffChatId) {
    console.log("2. Chat ID группы сотрудников");
    console.log("   • Добавь бота в группу «PC Барбершоп — заказы»");
    console.log("   • Сделай бота администратором");
    console.log(`   • Напиши в группе: /start@${me.username}`);
    await question("   Нажми Enter, когда сделаешь это", "ok");

    const updates = await tg(token, "getUpdates", { limit: 30 });
    const chats = uniqueChats(updates);

    const groups = chats.filter((c) => c.type === "group" || c.type === "supergroup");
    if (groups.length === 1) {
      staffChatId = String(groups[0].id);
      console.log(`\n✓ Найдена группа: «${groups[0].title}» → ${staffChatId}`);
    } else if (groups.length > 1) {
      groups.forEach((g, i) => console.log(`   [${i + 1}] ${g.title} → ${g.id}`));
      const pick = Number(await question("Выбери номер группы"));
      staffChatId = String(groups[pick - 1]?.id ?? "");
    } else {
      console.log("\nГруппа не найдена в getUpdates.");
      chats.forEach((c) => console.log(`   ${c.type}: ${c.title ?? c.first_name} → ${c.id}`));
      staffChatId = await question("Введи TELEGRAM_STAFF_CHAT_ID вручную");
    }
  }

  const defaultUrl = existing.NEXT_PUBLIC_APP_URL || "https://pc-barbershop.ru";
  console.log("\n3. URL сайта для webhook (HTTPS). Если сайт ещё не задеплоен — введи: skip");
  const appUrlInput = await question("URL или skip", defaultUrl);
  const skipWebhook = appUrlInput.toLowerCase() === "skip";

  const appUrl = skipWebhook ? defaultUrl : appUrlInput;

  const webhookSecret =
    existing.TELEGRAM_WEBHOOK_SECRET || randomBytes(24).toString("hex");
  const adminSecret =
    existing.TELEGRAM_ADMIN_SECRET || randomBytes(24).toString("hex");

  const env = {
    NEXT_PUBLIC_APP_URL: appUrl.replace(/\/$/, ""),
    TELEGRAM_BOT_TOKEN: token,
    TELEGRAM_STAFF_CHAT_ID: staffChatId,
    TELEGRAM_WEBHOOK_SECRET: webhookSecret,
    TELEGRAM_ADMIN_SECRET: adminSecret,
  };

  saveEnvFile(ENV_PATH, env);
  console.log(`\n✓ Сохранено: .env.local`);

  try {
    await tg(token, "setMyCommands", {
      commands: [
        { command: "start", description: "Подключить уведомления о заказах" },
        { command: "help", description: "Как пользоваться ботом" },
      ],
    });
    await tg(token, "setMyCommands", {
      commands: [
        { command: "stock", description: "Выбрать товар и изменить остаток" },
        { command: "lowstock", description: "Товары с остатком 3 шт. и меньше" },
        { command: "cancel", description: "Отменить ввод количества" },
        { command: "help", description: "Показать все команды" },
      ],
      scope: { type: "chat", chat_id: Number(staffChatId) },
    });
    console.log("✓ Подсказки команд установлены");
  } catch {
    /* optional */
  }

  console.log("\n4. Тестовое сообщение в группу сотрудников...");
  await tg(token, "sendMessage", {
    chat_id: staffChatId,
    text: "✅ PC Барбершоп: бот подключён. Сюда будут приходить заказы косметики с кнопкой «Заказ собран».",
  });
  console.log("✓ Сообщение отправлено");

  if (!skipWebhook) {
    console.log("\n5. Регистрируем webhook...");
    const webhookUrl = `${env.NEXT_PUBLIC_APP_URL}/api/telegram/webhook`;
    try {
      await tg(token, "setWebhook", {
        url: webhookUrl,
        secret_token: webhookSecret,
        allowed_updates: ["message", "callback_query"],
      });
      console.log(`✓ Webhook: ${webhookUrl}`);
      console.log("✓ secret_token (заголовок X-Telegram-Bot-Api-Secret-Token)");
      const info = await tg(token, "getWebhookInfo");
      if (info.last_error_message) {
        console.warn(`\n⚠ Webhook: ${info.last_error_message}`);
        console.warn("   Домен недоступен. Задеплой сайт и выполни: npm run telegram:webhook");
      }
    } catch (error) {
      console.warn(`\n⚠ Webhook не установлен: ${error.message}`);
      console.warn("   Это нормально, если сайт ещё не на домене. После деплоя: npm run telegram:webhook");
      try {
        await tg(token, "deleteWebhook", { drop_pending_updates: false });
      } catch {
        /* ignore */
      }
    }
  } else {
    console.log("\n5. Webhook пропущен (сайт ещё не задеплоен)");
    console.log("   После деплоя выполни: npm run telegram:webhook");
  }

  console.log("\n=== Готово ===");
  console.log("Что уже работает без webhook:");
  console.log("  • Заказы в группу сотрудников (npm run dev + оформление на сайте)");
  console.log("\nЧто заработает после webhook (нужен HTTPS-домен):");
  console.log("  • Кнопка «Подключить Telegram» у клиента");
  console.log("  • Кнопка «Заказ собран» в группе");
  console.log(`\nБот: @${me.username}`);
  console.log("Проверка: npm run telegram:verify\n");
}

main()
  .catch((error) => {
    console.error("\n✗ Ошибка:", error.message);
    process.exit(1);
  })
  .finally(() => rl.close());
