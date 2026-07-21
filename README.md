# PC Барбершоп

Сайт барбершопа на Next.js: запись (YCLIENTS), каталог White Cosmetics с самовывозом, Telegram-бот заказов и остатков.

## Быстрый старт

```bash
npm install
cp .env.example .env.local
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

Без `SUPABASE_*` данные пишутся в `data/*.json` (только для локальной разработки).

## Документация

- [DEPLOY.md](./DEPLOY.md) — Vercel + Supabase, webhook Telegram, env
- [OPERATOR.md](./OPERATOR.md) — команды остатков, сценарий заказа, заметки на будущее
- [`supabase/schema.sql`](./supabase/schema.sql) — схема БД

## Скрипты Telegram

```bash
npm run telegram:setup
npm run telegram:webhook
npm run telegram:verify
```

## Миграция JSON → Supabase

```bash
node scripts/migrate-json-to-supabase.mjs
```
