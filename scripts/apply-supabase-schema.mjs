#!/usr/bin/env node
/**
 * Verify / guide applying supabase/schema.sql (includes reviews).
 *
 * Service-role REST cannot run DDL. This script:
 *  1. Loads SUPABASE_* from env or .env.local
 *  2. Probes required tables via PostgREST
 *  3. If DATABASE_URL / SUPABASE_DB_URL is set and `psql` exists, applies schema.sql
 *  4. Otherwise prints exact SQL Editor steps
 *
 *   node scripts/apply-supabase-schema.mjs
 *   node scripts/apply-supabase-schema.mjs --check
 */
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ENV_PATH = join(root, ".env.local");
const SCHEMA_PATH = join(root, "supabase/schema.sql");

const REQUIRED_TABLES = [
  "inventory",
  "orders",
  "telegram_bindings",
  "telegram_pending_qty",
  "reviews",
  "reviews_meta",
];

function loadEnvFile(path) {
  if (!existsSync(path)) return {};
  const env = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

async function tableExists(supabase, table) {
  const { error } = await supabase.from(table).select("*").limit(1);
  if (!error) return true;
  const msg = error.message || "";
  if (/Could not find the table|PGRST205|schema cache/i.test(msg)) return false;
  // Other errors (e.g. RLS, bad column) still mean the table exists
  if (/column|permission|JWT|row-level/i.test(msg)) return true;
  console.warn(`  ? ${table}: unexpected probe error: ${msg}`);
  return false;
}

function printSqlEditorSteps() {
  console.log(`
── Apply schema in Supabase SQL Editor ────────────────────────────────
1. Open https://supabase.com/dashboard → your project → SQL Editor
2. Paste the full contents of: supabase/schema.sql
   (includes inventory, orders, telegram_*, reviews, reviews_meta + RLS)
3. Run the query (safe to re-run: IF NOT EXISTS)
4. Re-check: node scripts/apply-supabase-schema.mjs --check
5. Then: curl -X POST "$NEXT_PUBLIC_APP_URL/api/reviews/sync" \\
     -H "Authorization: Bearer $CRON_SECRET"

Optional: set DATABASE_URL (Postgres connection string from
Settings → Database) and re-run this script to apply via psql.
───────────────────────────────────────────────────────────────────────
`);
}

async function main() {
  const checkOnly = process.argv.includes("--check");
  const fileEnv = loadEnvFile(ENV_PATH);
  const url = process.env.SUPABASE_URL || fileEnv.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || fileEnv.SUPABASE_SERVICE_ROLE_KEY;
  const dbUrl =
    process.env.DATABASE_URL ||
    process.env.SUPABASE_DB_URL ||
    process.env.POSTGRES_URL ||
    fileEnv.DATABASE_URL ||
    fileEnv.SUPABASE_DB_URL ||
    fileEnv.POSTGRES_URL;

  if (!url || !key) {
    console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (env or .env.local)");
    process.exit(1);
  }

  if (!existsSync(SCHEMA_PATH)) {
    console.error(`Missing ${SCHEMA_PATH}`);
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log("Probing tables via service role…");
  const status = {};
  for (const table of REQUIRED_TABLES) {
    status[table] = await tableExists(supabase, table);
    console.log(`  ${status[table] ? "✓" : "✗"} ${table}`);
  }

  const missing = REQUIRED_TABLES.filter((t) => !status[t]);
  if (missing.length === 0) {
    console.log("\nAll required tables present. Schema OK.");
    process.exit(0);
  }

  console.log(`\nMissing: ${missing.join(", ")}`);

  if (checkOnly) {
    printSqlEditorSteps();
    process.exit(2);
  }

  if (dbUrl) {
    const psql = spawnSync("psql", [dbUrl, "-v", "ON_ERROR_STOP=1", "-f", SCHEMA_PATH], {
      encoding: "utf8",
    });
    if (psql.error) {
      console.error(`psql failed to start: ${psql.error.message}`);
    } else if (psql.status !== 0) {
      console.error(psql.stderr || psql.stdout || "psql failed");
    } else {
      console.log("Applied schema.sql via psql.");
      let stillMissing = [];
      for (const table of missing) {
        if (!(await tableExists(supabase, table))) stillMissing.push(table);
      }
      if (stillMissing.length === 0) {
        console.log("Verification OK — all tables present.");
        process.exit(0);
      }
      console.warn(`Still missing after psql: ${stillMissing.join(", ")}`);
    }
  } else {
    console.log(
      "\nNo DATABASE_URL / SUPABASE_DB_URL — cannot apply DDL with service_role alone.",
    );
  }

  printSqlEditorSteps();
  process.exit(2);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
