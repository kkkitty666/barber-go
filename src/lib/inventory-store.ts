import { promises as fs } from "fs";
import path from "path";
import { assertPersistentStore, getSupabase, isSupabaseConfigured } from "./supabase";

const DATA_DIR = path.join(process.cwd(), "data");
const INVENTORY_FILE = path.join(DATA_DIR, "inventory.json");

export interface InventoryRecord {
  quantity: number | null;
  updatedAt: string;
}

export type InventoryMap = Record<string, InventoryRecord>;

let inventoryWriteChain = Promise.resolve();

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile<T>(filePath: string, data: T) {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

async function withInventoryLock<T>(task: () => Promise<T>): Promise<T> {
  const previous = inventoryWriteChain;
  let release = () => {};
  inventoryWriteChain = new Promise<void>((resolve) => {
    release = resolve;
  });

  await previous;

  try {
    return await task();
  } finally {
    release();
  }
}

function normalizeQuantity(quantity: number | null): number | null {
  if (quantity === null) return null;
  return Math.max(0, Math.floor(quantity));
}

function rowToRecord(qty: number | null, updatedAt: string): InventoryRecord {
  return { quantity: qty, updatedAt };
}

async function getInventoryMapFromJson(): Promise<InventoryMap> {
  return readJsonFile<InventoryMap>(INVENTORY_FILE, {});
}

async function getInventoryMapFromSupabase(): Promise<InventoryMap> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured");

  const { data, error } = await supabase.from("inventory").select("product_id, qty, updated_at");
  if (error) throw new Error(`inventory read failed: ${error.message}`);

  const map: InventoryMap = {};
  for (const row of data ?? []) {
    map[row.product_id as string] = rowToRecord(
      row.qty as number | null,
      (row.updated_at as string) ?? new Date().toISOString(),
    );
  }
  return map;
}

export async function getInventoryMap(): Promise<InventoryMap> {
  assertPersistentStore();
  if (isSupabaseConfigured()) return getInventoryMapFromSupabase();
  return getInventoryMapFromJson();
}

export async function getInventoryRecord(slug: string): Promise<InventoryRecord | undefined> {
  assertPersistentStore();

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase
      .from("inventory")
      .select("qty, updated_at")
      .eq("product_id", slug)
      .maybeSingle();
    if (error) throw new Error(`inventory record read failed: ${error.message}`);
    if (!data) return undefined;
    return rowToRecord(data.qty as number | null, (data.updated_at as string) ?? new Date().toISOString());
  }

  const inventory = await getInventoryMapFromJson();
  return inventory[slug];
}

async function upsertInventoryRows(map: InventoryMap) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured");

  const rows = Object.entries(map).map(([productId, record]) => ({
    product_id: productId,
    qty: record.quantity,
    updated_at: record.updatedAt,
  }));

  if (rows.length === 0) return;

  const { error } = await supabase.from("inventory").upsert(rows, { onConflict: "product_id" });
  if (error) throw new Error(`inventory upsert failed: ${error.message}`);
}

export async function setInventoryQuantity(slug: string, quantity: number | null): Promise<InventoryRecord> {
  assertPersistentStore();

  return withInventoryLock(async () => {
    const nextRecord: InventoryRecord = {
      quantity: normalizeQuantity(quantity),
      updatedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (!supabase) throw new Error("Supabase is not configured");
      const { error } = await supabase.from("inventory").upsert(
        {
          product_id: slug,
          qty: nextRecord.quantity,
          updated_at: nextRecord.updatedAt,
        },
        { onConflict: "product_id" },
      );
      if (error) throw new Error(`inventory set failed: ${error.message}`);
      return nextRecord;
    }

    const inventory = await getInventoryMapFromJson();
    inventory[slug] = nextRecord;
    await writeJsonFile(INVENTORY_FILE, inventory);
    return nextRecord;
  });
}

export async function updateInventoryMap<T>(
  updater: (inventory: InventoryMap) => Promise<{ inventory: InventoryMap; result: T }> | { inventory: InventoryMap; result: T },
): Promise<T> {
  assertPersistentStore();

  return withInventoryLock(async () => {
    const current = await getInventoryMap();
    const { inventory, result } = await updater({ ...current });

    if (isSupabaseConfigured()) {
      await upsertInventoryRows(inventory);
    } else {
      await writeJsonFile(INVENTORY_FILE, inventory);
    }

    return result;
  });
}
