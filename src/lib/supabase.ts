import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null | undefined;

export class PersistentStoreUnavailableError extends Error {
  constructor(
    message = "Persistent store (Supabase) is required in production. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
  ) {
    super(message);
    this.name = "PersistentStoreUnavailableError";
  }
}

/** True on Vercel or NODE_ENV=production — JSON file fallback must not be used. */
export function isProductionRuntime(): boolean {
  return process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/** Fail closed in production when Supabase is missing. No-op in local/dev. */
export function assertPersistentStore(): void {
  if (isProductionRuntime() && !isSupabaseConfigured()) {
    throw new PersistentStoreUnavailableError();
  }
}

/** Server-only Supabase client (service role). Returns null when not configured. */
export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    client = null;
    return client;
  }

  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

/** PostgREST / Postgres errors when a table has not been migrated yet. */
export function isMissingRelationError(error: { message?: string; code?: string } | null | undefined): boolean {
  if (!error) return false;
  const message = error.message ?? "";
  return (
    error.code === "PGRST205" ||
    error.code === "42P01" ||
    /could not find the table/i.test(message) ||
    /schema cache/i.test(message) ||
    /relation .* does not exist/i.test(message)
  );
}
