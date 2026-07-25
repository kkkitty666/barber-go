-- Incremental: reviews tables only.
-- Prefer the unified migration: supabase/schema.sql (already includes these
-- tables + inventory/orders/telegram + RLS). Use this file only if the base
-- schema was applied earlier without reviews.
-- Safe to re-run (IF NOT EXISTS).
-- Verify: node scripts/apply-supabase-schema.mjs --check

create table if not exists reviews (
  id text primary key,
  name text not null,
  rating numeric not null check (rating >= 1 and rating <= 5),
  date_label text not null,
  date_iso timestamptz,
  text text not null,
  source text not null default 'yandex'
    check (source in ('yandex', 'manual')),
  updated_at timestamptz not null default now()
);

create index if not exists reviews_date_iso_idx on reviews (date_iso desc nulls last);

create table if not exists reviews_meta (
  id text primary key default 'default',
  rating numeric not null,
  rating_count integer not null,
  synced_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table reviews enable row level security;
alter table reviews_meta enable row level security;
