import { productCatalog, getProductBySlug, type Product } from "@/config/products";
import {
  getInventoryMap,
  getInventoryRecord,
  setInventoryQuantity,
  updateInventoryMap,
  type InventoryMap,
  type InventoryRecord,
} from "./inventory-store";

export const LOW_STOCK_THRESHOLD = 3;

export interface ProductAvailability {
  quantity: number | null;
  inStock: boolean;
  isLowStock: boolean;
  availabilityLabel: string;
}

export interface ProductWithInventory extends Product, ProductAvailability {}

export interface InventoryCommandResult {
  product: ProductWithInventory;
  changed: boolean;
}

export class InventoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InventoryError";
  }
}

function deriveAvailability(product: Product, record?: InventoryRecord): ProductAvailability {
  const quantity = record?.quantity ?? null;

  if (!product.inStock) {
    return {
      quantity: 0,
      inStock: false,
      isLowStock: false,
      availabilityLabel: "Нет в наличии",
    };
  }

  if (quantity === null) {
    return {
      quantity: null,
      inStock: true,
      isLowStock: false,
      availabilityLabel: "В наличии",
    };
  }

  if (quantity <= 0) {
    return {
      quantity: 0,
      inStock: false,
      isLowStock: false,
      availabilityLabel: "Нет в наличии",
    };
  }

  if (quantity <= LOW_STOCK_THRESHOLD) {
    return {
      quantity,
      inStock: true,
      isLowStock: true,
      availabilityLabel: `Осталось ${quantity} шт.`,
    };
  }

  return {
    quantity,
    inStock: true,
    isLowStock: false,
    availabilityLabel: "В наличии",
  };
}

function withAvailability(product: Product, inventory: InventoryMap): ProductWithInventory {
  return {
    ...product,
    ...deriveAvailability(product, inventory[product.slug]),
  };
}

function ensureProduct(slug: string): Product {
  const product = getProductBySlug(slug);
  if (!product) {
    throw new InventoryError(`Товар не найден: ${slug}`);
  }
  return product;
}

export async function getProductsWithInventory(): Promise<ProductWithInventory[]> {
  const inventory = await getInventoryMap();
  return productCatalog.map((product) => withAvailability(product, inventory));
}

export async function getProductWithInventoryBySlug(slug: string): Promise<ProductWithInventory | undefined> {
  const product = getProductBySlug(slug);
  if (!product) return undefined;
  const inventory = await getInventoryRecord(slug);
  return {
    ...product,
    ...deriveAvailability(product, inventory),
  };
}

export async function getInventoryBySlug(): Promise<Record<string, ProductWithInventory>> {
  const products = await getProductsWithInventory();
  return Object.fromEntries(products.map((product) => [product.slug, product]));
}

export async function setTrackedInventoryQuantity(
  slug: string,
  quantity: number,
): Promise<InventoryCommandResult> {
  const product = ensureProduct(slug);
  const record = await setInventoryQuantity(slug, quantity);
  return {
    product: { ...product, ...deriveAvailability(product, record) },
    changed: true,
  };
}

export async function adjustTrackedInventoryQuantity(
  slug: string,
  delta: number,
): Promise<InventoryCommandResult> {
  const product = ensureProduct(slug);
  const record = await getInventoryRecord(slug);
  const currentQuantity = record?.quantity ?? 0;
  const nextQuantity = Math.max(0, currentQuantity + delta);
  return setTrackedInventoryQuantity(slug, nextQuantity);
}

export async function markInventoryOutOfStock(slug: string): Promise<InventoryCommandResult> {
  return setTrackedInventoryQuantity(slug, 0);
}

export async function markInventoryInStock(slug: string): Promise<InventoryCommandResult> {
  const product = ensureProduct(slug);
  const record = await setInventoryQuantity(slug, null);
  return {
    product: { ...product, ...deriveAvailability(product, record) },
    changed: true,
  };
}

export async function getLowStockProducts(): Promise<ProductWithInventory[]> {
  const products = await getProductsWithInventory();
  return products.filter((product) => product.isLowStock);
}

export async function reserveInventoryForOrder(
  items: { slug: string; quantity: number }[],
): Promise<{ products: ProductWithInventory[] }> {
  return updateInventoryMap(async (inventory) => {
    const resolvedProducts: ProductWithInventory[] = [];

    for (const item of items) {
      const product = ensureProduct(item.slug);
      const current = withAvailability(product, inventory);

      if (!current.inStock) {
        throw new InventoryError(`Товар недоступен: ${product.name}`);
      }

      if (current.quantity !== null && item.quantity > current.quantity) {
        throw new InventoryError(
          current.quantity > 0
            ? `Доступно только ${current.quantity} шт.: ${product.name}`
            : `Товар закончился: ${product.name}`,
        );
      }

      resolvedProducts.push(current);
    }

    for (const item of items) {
      const record = inventory[item.slug];
      if (!record || record.quantity === null) continue;
      inventory[item.slug] = {
        quantity: Math.max(0, record.quantity - item.quantity),
        updatedAt: new Date().toISOString(),
      };
    }

    return {
      inventory,
      result: { products: resolvedProducts },
    };
  });
}
