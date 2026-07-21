import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { assertPersistentStore, getSupabase, isSupabaseConfigured } from "./supabase";

const DATA_DIR = join(process.cwd(), "data");
const PENDING_FILE = join(DATA_DIR, "telegram-pending-qty.json");

export interface PendingQtyEdit {
  slug: string;
  productIndex: number;
  messageId?: number;
  updatedAt: string;
}

type PendingQtyMap = Record<string, PendingQtyEdit>;

const PENDING_TTL_MS = 60 * 60 * 1000;

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readPendingMap(): PendingQtyMap {
  ensureDataDir();
  if (!existsSync(PENDING_FILE)) return {};
  try {
    return JSON.parse(readFileSync(PENDING_FILE, "utf8")) as PendingQtyMap;
  } catch {
    return {};
  }
}

function writePendingMap(map: PendingQtyMap) {
  ensureDataDir();
  writeFileSync(PENDING_FILE, JSON.stringify(map, null, 2), "utf8");
}

function isExpired(updatedAt: string): boolean {
  const ts = Date.parse(updatedAt);
  if (Number.isNaN(ts)) return true;
  return Date.now() - ts > PENDING_TTL_MS;
}

export async function getPendingQtyEdit(chatId: string): Promise<PendingQtyEdit | undefined> {
  assertPersistentStore();

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase is not configured");

    const { data, error } = await supabase
      .from("telegram_pending_qty")
      .select("product_id, product_index, message_id, updated_at, expires_at")
      .eq("chat_id", chatId)
      .maybeSingle();
    if (error) throw new Error(`pending qty read failed: ${error.message}`);
    if (!data) return undefined;

    const expiresAt = data.expires_at ? Date.parse(data.expires_at as string) : NaN;
    if (!Number.isNaN(expiresAt) && expiresAt < Date.now()) {
      await clearPendingQtyEdit(chatId);
      return undefined;
    }

    return {
      slug: data.product_id as string,
      productIndex: data.product_index as number,
      messageId: (data.message_id as number | null) ?? undefined,
      updatedAt: (data.updated_at as string) ?? new Date().toISOString(),
    };
  }

  const edit = readPendingMap()[chatId];
  if (!edit) return undefined;
  if (isExpired(edit.updatedAt)) {
    clearPendingQtyEditSync(chatId);
    return undefined;
  }
  return edit;
}

export async function setPendingQtyEdit(chatId: string, edit: PendingQtyEdit) {
  assertPersistentStore();
  const updatedAt = edit.updatedAt || new Date().toISOString();

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase is not configured");
    const expiresAt = new Date(Date.now() + PENDING_TTL_MS).toISOString();
    const { error } = await supabase.from("telegram_pending_qty").upsert(
      {
        chat_id: chatId,
        product_id: edit.slug,
        product_index: edit.productIndex,
        message_id: edit.messageId ?? null,
        updated_at: updatedAt,
        expires_at: expiresAt,
      },
      { onConflict: "chat_id" },
    );
    if (error) throw new Error(`pending qty save failed: ${error.message}`);
    return;
  }

  const map = readPendingMap();
  map[chatId] = { ...edit, updatedAt };
  writePendingMap(map);
}

function clearPendingQtyEditSync(chatId: string) {
  const map = readPendingMap();
  delete map[chatId];
  writePendingMap(map);
}

export async function clearPendingQtyEdit(chatId: string) {
  assertPersistentStore();

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase is not configured");
    const { error } = await supabase.from("telegram_pending_qty").delete().eq("chat_id", chatId);
    if (error) throw new Error(`pending qty clear failed: ${error.message}`);
    return;
  }

  clearPendingQtyEditSync(chatId);
}
