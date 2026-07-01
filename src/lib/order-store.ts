import { promises as fs } from "fs";
import path from "path";
import type { Order } from "./orders";

const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const BINDINGS_FILE = path.join(DATA_DIR, "telegram-bindings.json");

type BindingsMap = Record<string, { chatId: string; updatedAt: string }>;

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

export async function getAllOrders(): Promise<Order[]> {
  return readJsonFile<Order[]>(ORDERS_FILE, []);
}

export async function saveOrder(order: Order) {
  const orders = await getAllOrders();
  orders.unshift(order);
  await writeJsonFile(ORDERS_FILE, orders);
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const orders = await getAllOrders();
  return orders.find((o) => o.id === id);
}

export async function updateOrder(id: string, patch: Partial<Order>): Promise<Order | undefined> {
  const orders = await getAllOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return undefined;
  orders[index] = { ...orders[index], ...patch };
  await writeJsonFile(ORDERS_FILE, orders);
  return orders[index];
}

export async function saveTelegramBinding(bindToken: string, chatId: string) {
  const bindings = await readJsonFile<BindingsMap>(BINDINGS_FILE, {});
  bindings[bindToken] = { chatId, updatedAt: new Date().toISOString() };
  await writeJsonFile(BINDINGS_FILE, bindings);
}

export async function getTelegramBinding(bindToken: string): Promise<string | undefined> {
  const bindings = await readJsonFile<BindingsMap>(BINDINGS_FILE, {});
  return bindings[bindToken]?.chatId;
}

export function generateOrderId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
}

export function generateBindToken(): string {
  return Math.random().toString(36).slice(2, 12);
}
