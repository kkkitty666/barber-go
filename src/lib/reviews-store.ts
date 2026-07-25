import { promises as fs } from "fs";
import path from "path";
import { unstable_cache } from "next/cache";
import { siteConfig } from "@/config/site";
import type { ReviewItem, ReviewsSnapshot } from "./reviews-types";
import {
  assertPersistentStore,
  getSupabase,
  isMissingRelationError,
  isProductionRuntime,
  isSupabaseConfigured,
} from "./supabase";

const DATA_DIR = path.join(process.cwd(), "data");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");

const STORAGE_BUCKET = "app-data";
const STORAGE_OBJECT = "reviews.json";

/** Cache tag invalidated by /api/reviews/sync after a successful Yandex pull. */
export const REVIEWS_CACHE_TAG = "reviews";

/** Align with Vercel cron (every 6h); on-demand revalidateTag still refreshes sooner. */
export const REVIEWS_REVALIDATE_SECONDS = 60 * 60 * 6;

const SEED: ReviewsSnapshot = {
  rating: siteConfig.reviews.rating,
  ratingCount: siteConfig.reviews.ratingCount,
  syncedAt: null,
  items: siteConfig.reviews.items.map((item) => ({
    id: item.id,
    name: item.name,
    rating: item.rating,
    date: item.date,
    text: item.text,
    source: "yandex" as const,
  })),
};

function normalizeSnapshot(raw: unknown): ReviewsSnapshot {
  if (!raw || typeof raw !== "object") return SEED;
  const data = raw as Partial<ReviewsSnapshot>;
  const items: ReviewItem[] = Array.isArray(data.items)
    ? data.items
        .filter((item): item is ReviewItem => Boolean(item && typeof item === "object" && item.id && item.text))
        .map(
          (item): ReviewItem => ({
            id: String(item.id),
            name: String(item.name || "Гость"),
            rating: Math.min(5, Math.max(1, Number(item.rating) || 5)),
            date: String(item.date || ""),
            dateIso: item.dateIso ? String(item.dateIso) : null,
            text: String(item.text).trim(),
            source: item.source === "manual" ? "manual" : "yandex",
          }),
        )
        .filter((item) => item.text.length > 0)
    : SEED.items;

  return {
    rating: typeof data.rating === "number" && data.rating > 0 ? data.rating : SEED.rating,
    ratingCount:
      typeof data.ratingCount === "number" && data.ratingCount > 0
        ? Math.round(data.ratingCount)
        : items.length || SEED.ratingCount,
    syncedAt: typeof data.syncedAt === "string" ? data.syncedAt : null,
    items,
  };
}

async function readJsonSnapshot(): Promise<ReviewsSnapshot> {
  try {
    const raw = await fs.readFile(REVIEWS_FILE, "utf8");
    return normalizeSnapshot(JSON.parse(raw));
  } catch {
    return SEED;
  }
}

async function writeJsonSnapshot(snapshot: ReviewsSnapshot) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(REVIEWS_FILE, JSON.stringify(snapshot, null, 2), "utf8");
}

async function ensureBucket(bucket: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured");

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw new Error(`storage listBuckets failed: ${listError.message}`);

  if (buckets?.some((b) => b.name === bucket)) return;

  const { error: createError } = await supabase.storage.createBucket(bucket, {
    public: false,
  });
  // Concurrent create is fine — treat "already exists" as success.
  if (createError && !/already exists/i.test(createError.message)) {
    throw new Error(`storage createBucket failed: ${createError.message}`);
  }
}

async function readStorageSnapshot(): Promise<ReviewsSnapshot | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase.storage.from(STORAGE_BUCKET).download(STORAGE_OBJECT);
  if (error) {
    // Missing bucket/object → treat as empty; other errors bubble as null with log in caller.
    const message = error.message ?? "";
    if (
      /not found|does not exist|404|No such file|Object not found|Bucket not found/i.test(message)
    ) {
      return null;
    }
    throw new Error(`storage download failed: ${message}`);
  }
  if (!data) return null;

  const text = await data.text();
  if (!text.trim()) return null;
  return normalizeSnapshot(JSON.parse(text));
}

async function writeStorageSnapshot(snapshot: ReviewsSnapshot) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured");

  await ensureBucket(STORAGE_BUCKET);

  const body = JSON.stringify(snapshot);
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(STORAGE_OBJECT, body, {
    contentType: "application/json",
    upsert: true,
  });
  if (error) throw new Error(`storage upload failed: ${error.message}`);
}

async function readSupabaseSnapshot(): Promise<ReviewsSnapshot | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const [{ data: meta, error: metaError }, { data: rows, error: rowsError }] = await Promise.all([
    supabase.from("reviews_meta").select("rating, rating_count, synced_at").eq("id", "default").maybeSingle(),
    supabase
      .from("reviews")
      .select("id, name, rating, date_label, date_iso, text, source")
      .order("date_iso", { ascending: false, nullsFirst: false }),
  ]);

  // Tables not migrated yet — fall back to Storage / seed / json.
  if (isMissingRelationError(metaError) || isMissingRelationError(rowsError)) {
    return null;
  }

  if (metaError) throw new Error(`reviews_meta read failed: ${metaError.message}`);
  if (rowsError) throw new Error(`reviews read failed: ${rowsError.message}`);

  const items: ReviewItem[] = (rows ?? []).map((row) => ({
    id: String(row.id),
    name: String(row.name),
    rating: Number(row.rating),
    date: String(row.date_label),
    dateIso: row.date_iso ? String(row.date_iso) : null,
    text: String(row.text),
    source: row.source === "manual" ? "manual" : "yandex",
  }));

  if (!items.length && !meta) return null;

  return normalizeSnapshot({
    rating: meta?.rating ?? SEED.rating,
    ratingCount: meta?.rating_count ?? items.length,
    syncedAt: meta?.synced_at ? String(meta.synced_at) : null,
    items: items.length ? items : SEED.items,
  });
}

class MissingReviewsRelationError extends Error {
  constructor(cause?: { message?: string; code?: string }) {
    super(cause?.message || "reviews relation missing");
    this.name = "MissingReviewsRelationError";
    if (cause?.code) (this as Error & { code?: string }).code = cause.code;
  }
}

function throwWriteError(label: string, error: { message?: string; code?: string }) {
  if (isMissingRelationError(error)) throw new MissingReviewsRelationError(error);
  throw new Error(`${label}: ${error.message}`);
}

async function writeSupabaseSnapshot(snapshot: ReviewsSnapshot) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured");

  const now = new Date().toISOString();
  const { error: metaError } = await supabase.from("reviews_meta").upsert({
    id: "default",
    rating: snapshot.rating,
    rating_count: snapshot.ratingCount,
    synced_at: snapshot.syncedAt,
    updated_at: now,
  });
  if (metaError) throwWriteError("reviews_meta write failed", metaError);

  const { data: existing, error: existingError } = await supabase.from("reviews").select("id");
  if (existingError) throwWriteError("reviews id list failed", existingError);

  const nextIds = new Set(snapshot.items.map((item) => item.id));
  const toDelete = (existing ?? []).map((row) => String(row.id)).filter((id) => !nextIds.has(id));
  if (toDelete.length) {
    const { error: deleteError } = await supabase.from("reviews").delete().in("id", toDelete);
    if (deleteError) throwWriteError("reviews delete failed", deleteError);
  }

  if (snapshot.items.length) {
    const { error: upsertError } = await supabase.from("reviews").upsert(
      snapshot.items.map((item) => ({
        id: item.id,
        name: item.name,
        rating: item.rating,
        date_label: item.date,
        date_iso: item.dateIso || null,
        text: item.text,
        source: item.source || "yandex",
        updated_at: now,
      })),
      { onConflict: "id" },
    );
    if (upsertError) throwWriteError("reviews upsert failed", upsertError);
  }
}

async function loadReviewsSnapshotUncached(): Promise<ReviewsSnapshot> {
  assertPersistentStore();

  if (isSupabaseConfigured()) {
    try {
      const fromDb = await readSupabaseSnapshot();
      if (fromDb?.items.length) return fromDb;
    } catch (error) {
      console.error("Reviews Supabase SQL read failed, trying Storage:", error);
    }

    try {
      const fromStorage = await readStorageSnapshot();
      if (fromStorage?.items.length) return fromStorage;
    } catch (error) {
      console.error("Reviews Supabase Storage read failed, using seed/json:", error);
    }
  }

  return readJsonSnapshot();
}

/**
 * Cached read for pages/layout (ISR-friendly).
 * Prefer this for rendering; use getReviewsSnapshotFresh in sync/admin paths.
 */
export const getReviewsSnapshot = unstable_cache(
  async () => loadReviewsSnapshotUncached(),
  ["reviews-snapshot"],
  { revalidate: REVIEWS_REVALIDATE_SECONDS, tags: [REVIEWS_CACHE_TAG] },
);

/** Bypass Next data cache (sync route / debugging). */
export async function getReviewsSnapshotFresh(): Promise<ReviewsSnapshot> {
  return loadReviewsSnapshotUncached();
}

export async function saveReviewsSnapshot(snapshot: ReviewsSnapshot): Promise<ReviewsSnapshot> {
  assertPersistentStore();
  const normalized = normalizeSnapshot(snapshot);

  if (isSupabaseConfigured()) {
    try {
      await writeSupabaseSnapshot(normalized);
    } catch (error) {
      if (!(error instanceof MissingReviewsRelationError) && !isMissingRelationError(error as { message?: string; code?: string })) {
        throw error;
      }
      await writeStorageSnapshot(normalized);
    }

    // Mirror to local JSON outside production so local/dev stays inspectable.
    if (!isProductionRuntime()) {
      await writeJsonSnapshot(normalized);
    }
  } else {
    await writeJsonSnapshot(normalized);
  }

  return normalized;
}

export function getReviewsSeed(): ReviewsSnapshot {
  return SEED;
}
