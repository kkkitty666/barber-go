-- PC Барбершоп — unified schema: inventory, orders, Telegram state, Yandex reviews.
-- Run in Supabase SQL Editor (or: DATABASE_URL=… node scripts/apply-supabase-schema.mjs).
-- Safe to re-run (IF NOT EXISTS). Verify: npm run db:apply-schema -- --check
-- Incremental reviews-only file (legacy): supabase/reviews.sql

create table if not exists inventory (
  product_id text primary key,
  qty integer,
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id text primary key,
  created_at timestamptz not null default now(),
  bind_token text not null,
  access_token text not null,
  items jsonb not null default '[]'::jsonb,
  total integer not null default 0,
  customer_name text not null,
  phone text not null,
  comment text,
  telegram_chat_id text,
  status text not null default 'new'
    check (status in ('new', 'assembling', 'ready', 'picked_up')),
  staff_message_id integer,
  ready_at timestamptz
);

create index if not exists orders_phone_idx on orders (phone);
create index if not exists orders_created_at_idx on orders (created_at desc);
create index if not exists orders_access_token_idx on orders (access_token);

create table if not exists telegram_bindings (
  bind_token text primary key,
  chat_id text not null,
  updated_at timestamptz not null default now()
);

create table if not exists telegram_pending_qty (
  chat_id text primary key,
  product_id text not null,
  product_index integer not null default 0,
  message_id integer,
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '1 hour')
);

-- Yandex reviews cache (synced by /api/reviews/sync cron)
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

-- Optional but mandatory for production: enable RLS and deny anon by default.
-- App uses service_role key server-side only. Never expose the anon key to the
-- client without explicit policies; never put service_role in NEXT_PUBLIC_*.
alter table inventory enable row level security;
alter table orders enable row level security;
alter table telegram_bindings enable row level security;
alter table telegram_pending_qty enable row level security;
alter table reviews enable row level security;
alter table reviews_meta enable row level security;
