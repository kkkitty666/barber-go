-- PC Барбершоп — schema for orders, inventory, Telegram state
-- Run in Supabase SQL editor (or psql) before setting SUPABASE_* env vars.

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

-- Optional but mandatory for production: enable RLS and deny anon by default.
-- App uses service_role key server-side only. Never expose the anon key to the
-- client without explicit policies; never put service_role in NEXT_PUBLIC_*.
alter table inventory enable row level security;
alter table orders enable row level security;
alter table telegram_bindings enable row level security;
alter table telegram_pending_qty enable row level security;
