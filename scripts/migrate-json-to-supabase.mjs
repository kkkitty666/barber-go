#!/usr/bin/env node
/**
 * One-shot migrate: data/*.json → Supabase tables.
 * Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in env or .env.local
 *
 *   node scripts/migrate-json-to-supabase.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ENV_PATH = join(root, ".env.local");

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

function readJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

async function main() {
  const fileEnv = loadEnvFile(ENV_PATH);
  const url = process.env.SUPABASE_URL || fileEnv.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || fileEnv.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const inventory = readJson(join(root, "data/inventory.json"), {});
  const inventoryRows = Object.entries(inventory).map(([productId, record]) => ({
    product_id: productId,
    qty: record.quantity,
    updated_at: record.updatedAt || new Date().toISOString(),
  }));
  if (inventoryRows.length) {
    const { error } = await supabase.from("inventory").upsert(inventoryRows, { onConflict: "product_id" });
    if (error) throw error;
    console.log(`inventory: ${inventoryRows.length} rows`);
  }

  const orders = readJson(join(root, "data/orders.json"), []);
  if (orders.length) {
    const rows = orders.map((order) => ({
      id: order.id,
      created_at: order.createdAt,
      bind_token: order.bindToken,
      access_token: order.accessToken || `${order.id}-migrated`,
      items: order.items,
      total: order.total,
      customer_name: order.customerName,
      phone: order.phone,
      comment: order.comment ?? null,
      telegram_chat_id: order.telegramChatId ?? null,
      status: order.status,
      staff_message_id: order.staffMessageId ?? null,
      ready_at: order.readyAt ?? null,
    }));
    const { error } = await supabase.from("orders").upsert(rows, { onConflict: "id" });
    if (error) throw error;
    console.log(`orders: ${rows.length} rows`);
  }

  const bindings = readJson(join(root, "data/telegram-bindings.json"), {});
  const bindingRows = Object.entries(bindings).map(([bindToken, value]) => ({
    bind_token: bindToken,
    chat_id: value.chatId,
    updated_at: value.updatedAt || new Date().toISOString(),
  }));
  if (bindingRows.length) {
    const { error } = await supabase.from("telegram_bindings").upsert(bindingRows, { onConflict: "bind_token" });
    if (error) throw error;
    console.log(`telegram_bindings: ${bindingRows.length} rows`);
  }

  const pending = readJson(join(root, "data/telegram-pending-qty.json"), {});
  const pendingRows = Object.entries(pending).map(([chatId, edit]) => ({
    chat_id: chatId,
    product_id: edit.slug,
    product_index: edit.productIndex,
    message_id: edit.messageId ?? null,
    updated_at: edit.updatedAt || new Date().toISOString(),
    expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  }));
  if (pendingRows.length) {
    const { error } = await supabase.from("telegram_pending_qty").upsert(pendingRows, { onConflict: "chat_id" });
    if (error) throw error;
    console.log(`telegram_pending_qty: ${pendingRows.length} rows`);
  }

  console.log("Migration finished.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
