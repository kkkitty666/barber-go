import { siteConfig } from "@/config/site";
import type { ReviewItem, ReviewsSnapshot } from "./reviews-types";

const MONTHS_RU = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
] as const;

function formatRuDate(input: Date): string {
  return `${input.getUTCDate()} ${MONTHS_RU[input.getUTCMonth()]} ${input.getUTCFullYear()}`;
}

/** Mimics qs.stringify with case-insensitive key sort (Yandex Maps client). */
function qsStringify(obj: Record<string, string | number | boolean | null | undefined>): string {
  const pairs: string[] = [];
  const keys = Object.keys(obj).sort((a, b) => {
    const left = a.toLowerCase();
    const right = b.toLowerCase();
    return left < right ? -1 : left > right ? 1 : 0;
  });

  for (const key of keys) {
    const val = obj[key];
    if (val === undefined) continue;
    if (val === null) {
      pairs.push(`${key}=`);
      continue;
    }
    if (typeof val === "boolean" || typeof val === "number") {
      pairs.push(`${key}=${val}`);
      continue;
    }
    pairs.push(`${key}=${encodeURIComponent(String(val)).replace(/%20/g, "+")}`);
  }

  return pairs.join("&");
}

function yandexSHash(query: string): string {
  let n = 5381;
  for (let i = 0; i < query.length; i += 1) {
    n = (Math.imul(33, n) ^ query.charCodeAt(i)) >>> 0;
  }
  return String(n);
}

function buildSignedUrl(base: string, params: Record<string, string | number | boolean>): string {
  const hashInput = qsStringify(params);
  return `${base}?${hashInput}&s=${encodeURIComponent(yandexSHash(hashInput))}`;
}

function pickCookies(response: Response): string {
  const headers = response.headers as Headers & { getSetCookie?: () => string[] };
  const setCookies =
    typeof headers.getSetCookie === "function"
      ? headers.getSetCookie()
      : ([response.headers.get("set-cookie")].filter(Boolean) as string[]);

  return setCookies
    .map((cookie) => cookie.split(";")[0]?.trim())
    .filter(Boolean)
    .join("; ");
}

function extractCsrf(html: string): string | null {
  return html.match(/"csrfToken"\s*:\s*"([^"]+)"/)?.[1] ?? null;
}

function extractSessionId(html: string): string | null {
  return html.match(/"sessionId"\s*:\s*"([^"]+)"/)?.[1] ?? null;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function parseReviewRow(raw: unknown, index: number): ReviewItem | null {
  const row = asRecord(raw);
  if (!row) return null;

  const text = String(row.text ?? row.reviewBody ?? row.message ?? "").trim();
  if (!text) return null;

  const author = asRecord(row.author) || asRecord(row.authorInfo) || asRecord(row.user) || null;
  const name =
    String(row.authorName ?? author?.name ?? author?.publicDisplayName ?? row.name ?? "Гость").trim() ||
    "Гость";

  const ratingRaw = row.rating ?? row.stars ?? row.score ?? 5;
  const rating = Math.min(5, Math.max(1, Math.round(Number(ratingRaw) || 5)));
  const id = String(row.reviewId ?? row.id ?? `yandex-${index}-${name}`).trim();

  const updatedTime = row.updatedTime ?? row.timeCreated ?? row.createdTime ?? row.date;

  let dateIso: string | null = null;
  let date = "";
  if (typeof updatedTime === "number") {
    const ms = updatedTime > 1e12 ? updatedTime : updatedTime * 1000;
    const d = new Date(ms);
    if (!Number.isNaN(d.getTime())) {
      dateIso = d.toISOString();
      date = formatRuDate(d);
    }
  } else if (typeof updatedTime === "string" && updatedTime) {
    const d = new Date(updatedTime);
    if (!Number.isNaN(d.getTime())) {
      dateIso = d.toISOString();
      date = formatRuDate(d);
    } else {
      date = updatedTime;
    }
  }

  if (!date) date = "Яндекс.Карты";

  return {
    id: id.startsWith("yandex-") ? id : `yandex-${id}`,
    name,
    rating,
    date,
    dateIso,
    text,
    source: "yandex",
  };
}

function extractReviewsFromPayload(payload: unknown): ReviewItem[] {
  const root = asRecord(payload);
  if (!root) return [];

  const data = asRecord(root.data) ?? root;
  const candidates: unknown[] = [];

  for (const key of ["reviews", "items", "reviewList", "list"]) {
    const value = data[key];
    if (Array.isArray(value)) candidates.push(...value);
  }

  const nested = asRecord(data.reviews);
  if (nested && Array.isArray(nested.items)) candidates.push(...nested.items);

  const parsed = candidates
    .map((row, index) => parseReviewRow(row, index))
    .filter((row): row is ReviewItem => Boolean(row));

  const byId = new Map<string, ReviewItem>();
  for (const item of parsed) byId.set(item.id, item);
  return [...byId.values()].sort((a, b) => {
    const aTime = a.dateIso ? Date.parse(a.dateIso) : 0;
    const bTime = b.dateIso ? Date.parse(b.dateIso) : 0;
    return bTime - aTime;
  });
}

function extractMeta(
  payload: unknown,
  items: ReviewItem[],
): Pick<ReviewsSnapshot, "rating" | "ratingCount"> {
  const root = asRecord(payload);
  const data = asRecord(root?.data) ?? root ?? {};
  const company = asRecord(data.companyMeta) ?? asRecord(data.business) ?? asRecord(data.org) ?? data;

  const rating =
    Number(
      company.rating ??
        company.score ??
        asRecord(company.ratingData)?.ratingValue ??
        asRecord(data.params)?.rating,
    ) || undefined;

  const ratingCount =
    Number(
      company.reviewCount ??
        company.ratingCount ??
        company.reviewsCount ??
        asRecord(company.ratingData)?.reviewCount ??
        asRecord(data.params)?.totalReviews,
    ) || undefined;

  return {
    rating: rating && rating > 0 ? Math.round(rating * 10) / 10 : 4.6,
    ratingCount: ratingCount && ratingCount > 0 ? Math.round(ratingCount) : items.length,
  };
}

export interface YandexReviewsFetchResult {
  snapshot: ReviewsSnapshot;
  fetchedCount: number;
}

/**
 * Pulls public reviews for the org from Yandex Maps internal AJAX API.
 * Unofficial endpoint — if Yandex changes it, sync keeps the last cached snapshot.
 */
export async function fetchYandexReviewsSnapshot(): Promise<YandexReviewsFetchResult> {
  const orgId = siteConfig.mapOrgId;
  const reviewsPageUrl = `https://yandex.ru/maps/org/rs/${orgId}/reviews/`;
  const headers: Record<string, string> = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept-Language": "ru-RU,ru;q=0.9,en;q=0.8",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    Referer: "https://yandex.ru/maps/",
  };

  const pageRes = await fetch(reviewsPageUrl, {
    headers,
    signal: AbortSignal.timeout(20000),
    cache: "no-store",
  });
  if (!pageRes.ok) {
    throw new Error(`Yandex reviews page HTTP ${pageRes.status}`);
  }

  const html = await pageRes.text();
  let cookie = pickCookies(pageRes);
  let csrf = extractCsrf(html);
  const sessionId = extractSessionId(html);

  if (!csrf) throw new Error("Yandex CSRF token not found");
  if (!sessionId) throw new Error("Yandex sessionId not found");

  const allItems: ReviewItem[] = [];
  let metaPayload: unknown = null;
  const maxPages = 5;

  for (let page = 1; page <= maxPages; page += 1) {
    const params = {
      ajax: "1",
      businessId: orgId,
      csrfToken: csrf,
      sessionId,
      locale: "ru_RU",
      page,
      pageSize: 50,
      ranking: "by_time",
    };

    const url = buildSignedUrl("https://yandex.ru/maps/api/business/fetchReviews", params);
    const res = await fetch(url, {
      headers: {
        ...headers,
        Accept: "*/*",
        "X-Requested-With": "XMLHttpRequest",
        "X-Retpath-Y": reviewsPageUrl,
        Referer: reviewsPageUrl,
        ...(cookie ? { Cookie: cookie } : {}),
      },
      signal: AbortSignal.timeout(20000),
      cache: "no-store",
    });

    cookie = [cookie, pickCookies(res)].filter(Boolean).join("; ");
    const payload = await res.json().catch(() => null);
    const payloadRecord = asRecord(payload);

    if (!res.ok || (payloadRecord && !asRecord(payloadRecord.data)?.reviews && payloadRecord.csrfToken)) {
      const token = payloadRecord?.csrfToken;
      if (typeof token === "string" && token && token !== csrf) {
        csrf = token;
        page -= 1;
        continue;
      }
      if (!res.ok) throw new Error(`Yandex fetchReviews HTTP ${res.status}`);
    }

    metaPayload = payload;
    const pageItems = extractReviewsFromPayload(payload);
    if (!pageItems.length) break;

    const before = allItems.length;
    const seen = new Set(allItems.map((item) => item.id));
    for (const item of pageItems) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        allItems.push(item);
      }
    }
    if (allItems.length === before || pageItems.length < 50) break;
  }

  if (!allItems.length) {
    throw new Error("Yandex returned zero reviews");
  }

  // Prefer aggregate rating from the HTML when API meta is sparse.
  const htmlRating = Number(html.match(/"ratingValue"\s*:\s*([0-9.]+)/)?.[1]);
  const htmlCount = Number(
    html.match(/"ratingCount"\s*:\s*([0-9]+)/)?.[1] ??
      html.match(/"reviewCount"\s*:\s*([0-9]+)/)?.[1],
  );
  const meta = extractMeta(metaPayload, allItems);

  return {
    fetchedCount: allItems.length,
    snapshot: {
      rating: htmlRating > 0 ? Math.round(htmlRating * 10) / 10 : meta.rating,
      ratingCount: htmlCount > 0 ? htmlCount : meta.ratingCount,
      syncedAt: new Date().toISOString(),
      items: allItems,
    },
  };
}
