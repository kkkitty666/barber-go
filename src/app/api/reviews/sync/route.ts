import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import {
  getReviewsSnapshotFresh,
  REVIEWS_CACHE_TAG,
  saveReviewsSnapshot,
} from "@/lib/reviews-store";
import { clientIpFromRequest, rateLimit } from "@/lib/rate-limit";
import { safeEqualSecret } from "@/lib/security";
import { PersistentStoreUnavailableError } from "@/lib/supabase";
import { fetchYandexReviewsSnapshot } from "@/lib/yandex-reviews";

function isAuthorized(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  const adminSecret = process.env.TELEGRAM_ADMIN_SECRET;

  const auth = request.headers.get("authorization");
  if (cronSecret && auth === `Bearer ${cronSecret}`) return true;

  const headerSecret = request.headers.get("x-admin-secret");
  if (adminSecret && safeEqualSecret(headerSecret, adminSecret)) return true;

  // Local/dev convenience: allow without secrets outside production.
  if (process.env.NODE_ENV !== "production" && process.env.VERCEL !== "1") {
    return true;
  }

  return false;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = clientIpFromRequest(request);
  const limited = rateLimit(`reviews:sync:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
    );
  }

  try {
    const previous = await getReviewsSnapshotFresh();
    const { snapshot, fetchedCount } = await fetchYandexReviewsSnapshot();
    const saved = await saveReviewsSnapshot(snapshot);

    revalidateTag(REVIEWS_CACHE_TAG, "max");
    revalidatePath("/");
    revalidatePath("/otzyvy");

    return NextResponse.json({
      ok: true,
      fetchedCount,
      savedCount: saved.items.length,
      rating: saved.rating,
      ratingCount: saved.ratingCount,
      syncedAt: saved.syncedAt,
      previousCount: previous.items.length,
    });
  } catch (error) {
    if (error instanceof PersistentStoreUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("Reviews sync failed:", error);
    return NextResponse.json(
      {
        error: "Не удалось синхронизировать отзывы с Яндекс.Карт",
        details: error instanceof Error ? error.message : "unknown",
      },
      { status: 502 },
    );
  }
}

export async function GET(request: Request) {
  // Vercel Cron uses GET by default for cron jobs.
  return POST(request);
}
