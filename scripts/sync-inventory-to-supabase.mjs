#!/usr/bin/env node
/**
 * Upsert data/inventory.json → Supabase inventory table.
 * Keeps current quantities as-is (does not invent stock). qty 0 = OOS.
 *
 *   node scripts/sync-inventory-to-supabase.mjs
 * Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ENV_PATH = join(root, ".env.local");
const INVENTORY_PATH = join(root, "data/inventory.json");

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

  const inventory = readJson(INVENTORY_PATH, {});
  const entries = Object.entries(inventory);
  if (!entries.length) {
    console.error(`No rows in ${INVENTORY_PATH}`);
    process.exit(1);
  }

  const rows = entries.map(([productId, record]) => ({
    product_id: productId,
    qty: typeof record.quantity === "number" ? record.quantity : 0,
    updated_at: record.updatedAt || new Date().toISOString(),
  }));

  const oos = rows.filter((r) => r.qty === 0).map((r) => r.product_id);
  const inStock = rows.filter((r) => r.qty > 0);

  console.log(`Upserting ${rows.length} inventory rows…`);
  console.log(`  in stock: ${inStock.length}`);
  console.log(`  OOS (qty 0): ${oos.length}`);
  if (oos.length) {
    for (const id of oos) console.log(`    · OOS  ${id}`);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase.from("inventory").upsert(rows, { onConflict: "product_id" });
  if (error) {
    console.error(error.message);
    if (/Could not find the table|PGRST205/i.test(error.message)) {
      console.error("Run: node scripts/apply-supabase-schema.mjs");
    }
    process.exit(1);
  }

  console.log("Inventory sync finished.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
