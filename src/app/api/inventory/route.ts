import { NextResponse } from "next/server";
import { getInventoryBySlug } from "@/lib/inventory";
import { clientIpFromRequest, rateLimit } from "@/lib/rate-limit";
import { PersistentStoreUnavailableError } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const ip = clientIpFromRequest(request);
    const limited = rateLimit(`inventory:get:${ip}`, { limit: 60, windowMs: 60_000 });
    if (!limited.ok) {
      return NextResponse.json(
        { error: "Слишком много запросов. Попробуйте через минуту." },
        { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
      );
    }

    const bySlug = await getInventoryBySlug();

    return NextResponse.json(
      { bySlug },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    if (error instanceof PersistentStoreUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("Inventory GET failed:", error);
    return NextResponse.json({ error: "Не удалось загрузить остатки" }, { status: 500 });
  }
}
