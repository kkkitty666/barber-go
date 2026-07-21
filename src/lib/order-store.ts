import { promises as fs } from "fs";
import path from "path";
import { randomBytes } from "crypto";
import type { Order, OrderStatus } from "./orders";
import { safeEqualSecret } from "./security";
import { assertPersistentStore, getSupabase, isSupabaseConfigured } from "./supabase";

const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const BINDINGS_FILE = path.join(DATA_DIR, "telegram-bindings.json");

/** Marker chat id for bind tokens issued by GET /api/orders but not yet linked. */
const PENDING_BIND_CHAT_ID = "__pending__";

const HISTORY_LOOKUP_CAP = 10;

type BindingsMap = Record<string, { chatId: string; updatedAt: string }>;

interface OrderRow {
  id: string;
  created_at: string;
  bind_token: string;
  access_token: string;
  items: Order["items"];
  total: number;
  customer_name: string;
  phone: string;
  comment: string | null;
  telegram_chat_id: string | null;
  status: OrderStatus;
  staff_message_id: number | null;
  ready_at: string | null;
}

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

function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    bindToken: row.bind_token,
    accessToken: row.access_token,
    items: row.items,
    total: row.total,
    customerName: row.customer_name,
    phone: row.phone,
    comment: row.comment ?? undefined,
    telegramChatId: row.telegram_chat_id ?? undefined,
    status: row.status,
    staffMessageId: row.staff_message_id ?? undefined,
    createdAt: row.created_at,
    readyAt: row.ready_at ?? undefined,
  };
}

function orderToRow(order: Order): OrderRow {
  return {
    id: order.id,
    created_at: order.createdAt,
    bind_token: order.bindToken,
    access_token: order.accessToken,
    items: order.items,
    total: order.total,
    customer_name: order.customerName,
    phone: order.phone,
    comment: order.comment ?? null,
    telegram_chat_id: order.telegramChatId ?? null,
    status: order.status,
    staff_message_id: order.staffMessageId ?? null,
    ready_at: order.readyAt ?? null,
  };
}

function ensureAccessToken(order: Order): Order {
  if (order.accessToken) return order;
  return { ...order, accessToken: generateAccessToken() };
}

function isLinkedChatId(chatId: string | undefined): chatId is string {
  return Boolean(chatId) && chatId !== PENDING_BIND_CHAT_ID;
}

export async function getAllOrders(): Promise<Order[]> {
  assertPersistentStore();

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(`orders read failed: ${error.message}`);
    return (data as OrderRow[] | null)?.map(rowToOrder) ?? [];
  }

  const orders = await readJsonFile<Order[]>(ORDERS_FILE, []);
  return orders.map(ensureAccessToken);
}

export async function saveOrder(order: Order) {
  assertPersistentStore();
  const withToken = ensureAccessToken(order);

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase is not configured");
    const { error } = await supabase.from("orders").insert(orderToRow(withToken));
    if (error) throw new Error(`order save failed: ${error.message}`);
    return;
  }

  const orders = await readJsonFile<Order[]>(ORDERS_FILE, []);
  orders.unshift(withToken);
  await writeJsonFile(ORDERS_FILE, orders);
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  assertPersistentStore();

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(`order read failed: ${error.message}`);
    return data ? rowToOrder(data as OrderRow) : undefined;
  }

  const orders = await readJsonFile<Order[]>(ORDERS_FILE, []);
  const found = orders.find((o) => o.id === id);
  return found ? ensureAccessToken(found) : undefined;
}

export async function getOrdersByLookups(
  lookups: { orderId: string; phone?: string; accessToken?: string }[],
): Promise<Order[]> {
  assertPersistentStore();
  if (lookups.length === 0) return [];

  const results: Order[] = [];
  const seen = new Set<string>();

  for (const lookup of lookups.slice(0, HISTORY_LOOKUP_CAP)) {
    const order = await getOrderById(lookup.orderId);
    if (!order || seen.has(order.id)) continue;

    const phoneOk = lookup.phone ? order.phone === lookup.phone : false;
    const tokenOk = lookup.accessToken
      ? safeEqualSecret(lookup.accessToken, order.accessToken)
      : false;

    if (phoneOk || tokenOk) {
      seen.add(order.id);
      results.push(order);
    }
  }

  return results.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function updateOrder(id: string, patch: Partial<Order>): Promise<Order | undefined> {
  assertPersistentStore();

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase is not configured");

    const dbPatch: Partial<OrderRow> = {};
    if (patch.bindToken !== undefined) dbPatch.bind_token = patch.bindToken;
    if (patch.accessToken !== undefined) dbPatch.access_token = patch.accessToken;
    if (patch.items !== undefined) dbPatch.items = patch.items;
    if (patch.total !== undefined) dbPatch.total = patch.total;
    if (patch.customerName !== undefined) dbPatch.customer_name = patch.customerName;
    if (patch.phone !== undefined) dbPatch.phone = patch.phone;
    if (patch.comment !== undefined) dbPatch.comment = patch.comment ?? null;
    if (patch.telegramChatId !== undefined) dbPatch.telegram_chat_id = patch.telegramChatId ?? null;
    if (patch.status !== undefined) dbPatch.status = patch.status;
    if (patch.staffMessageId !== undefined) dbPatch.staff_message_id = patch.staffMessageId ?? null;
    if (patch.readyAt !== undefined) dbPatch.ready_at = patch.readyAt ?? null;
    if (patch.createdAt !== undefined) dbPatch.created_at = patch.createdAt;

    const { data, error } = await supabase
      .from("orders")
      .update(dbPatch)
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (error) throw new Error(`order update failed: ${error.message}`);
    return data ? rowToOrder(data as OrderRow) : undefined;
  }

  const orders = await readJsonFile<Order[]>(ORDERS_FILE, []);
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return undefined;
  orders[index] = ensureAccessToken({ ...orders[index], ...patch });
  await writeJsonFile(ORDERS_FILE, orders);
  return orders[index];
}

export async function saveTelegramBinding(bindToken: string, chatId: string) {
  assertPersistentStore();
  const updatedAt = new Date().toISOString();

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase is not configured");
    const { error } = await supabase.from("telegram_bindings").upsert(
      { bind_token: bindToken, chat_id: chatId, updated_at: updatedAt },
      { onConflict: "bind_token" },
    );
    if (error) throw new Error(`telegram binding save failed: ${error.message}`);
    return;
  }

  const bindings = await readJsonFile<BindingsMap>(BINDINGS_FILE, {});
  bindings[bindToken] = { chatId, updatedAt };
  await writeJsonFile(BINDINGS_FILE, bindings);
}

/** Issue a server-side bind token so clients cannot invent one. */
export async function issueBindToken(): Promise<string> {
  const token = generateBindToken();
  await saveTelegramBinding(token, PENDING_BIND_CHAT_ID);
  return token;
}

export async function isIssuedBindToken(bindToken: string): Promise<boolean> {
  assertPersistentStore();

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase
      .from("telegram_bindings")
      .select("bind_token")
      .eq("bind_token", bindToken)
      .maybeSingle();
    if (error) throw new Error(`telegram binding read failed: ${error.message}`);
    return Boolean(data);
  }

  const bindings = await readJsonFile<BindingsMap>(BINDINGS_FILE, {});
  return Boolean(bindings[bindToken]);
}

export async function getTelegramBinding(bindToken: string): Promise<string | undefined> {
  assertPersistentStore();

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase
      .from("telegram_bindings")
      .select("chat_id")
      .eq("bind_token", bindToken)
      .maybeSingle();
    if (error) throw new Error(`telegram binding read failed: ${error.message}`);
    const chatId = data?.chat_id as string | undefined;
    return isLinkedChatId(chatId) ? chatId : undefined;
  }

  const bindings = await readJsonFile<BindingsMap>(BINDINGS_FILE, {});
  const chatId = bindings[bindToken]?.chatId;
  return isLinkedChatId(chatId) ? chatId : undefined;
}

/** 16 hex chars — unguessable order id. */
export function generateOrderId(): string {
  return randomBytes(8).toString("hex").toUpperCase();
}

/** 32 hex chars — Telegram deep-link bind token. */
export function generateBindToken(): string {
  return randomBytes(16).toString("hex");
}

export function generateAccessToken(): string {
  return randomBytes(24).toString("hex");
}
