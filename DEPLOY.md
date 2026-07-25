# Деплой PC Барбершоп

Рекомендуемая схема: **Vercel + Supabase**. Альтернатива — один VPS с Node и Postgres.

## 1. Supabase

1. Создайте проект на [supabase.com](https://supabase.com).
2. В SQL Editor выполните **один** файл [`supabase/schema.sql`](./supabase/schema.sql) — минимум для заказов/остатков/Telegram:
   `inventory`, `orders`, `telegram_bindings`, `telegram_pending_qty` + RLS.  
   Таблицы `reviews` / `reviews_meta` **опциональны**: пока их нет, отзывы пишутся в private Storage bucket `app-data` (`reviews.json`). Позже можно накатить `reviews.sql` / полный `schema.sql` для реляционного стора — код сам предпочтёт SQL, если таблицы появятся.  
   **RLS обязателен** — в schema уже включён. Не отдавайте anon key клиенту без политик; приложение использует только **service_role** на сервере.
3. Скопируйте **Project URL** и **service_role** key (Settings → API).  
   Service role — только на сервере, никогда в `NEXT_PUBLIC_*` и никогда в git.
4. Проверка таблиц:

```bash
npm run db:apply-schema -- --check
```

Если есть Postgres connection string (`DATABASE_URL` / Settings → Database), тот же скрипт может применить `schema.sql` через `psql`. Иначе — только SQL Editor (service_role не умеет DDL).

Опционально перенесите локальные JSON / остатки:

```bash
# при заполненных SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY в .env.local
npm run db:migrate-json      # inventory + orders + telegram state
npm run db:sync-inventory    # только data/inventory.json → inventory (qty 0 = OOS)
```

`supabase/reviews.sql` — инкремент для реляционного стора отзывов (не обязателен, если устраивает Storage).

Без Supabase-переменных приложение пишет в `data/*.json` **только локально**.  
На проде (`NODE_ENV=production` или Vercel) без Supabase заказы/остатки/Telegram-состояние **падают с 503** — JSON-fallback отключён.

## 2. Vercel

1. Импортируйте репозиторий в Vercel.
2. Environment Variables:

| Variable | Обязательно | Описание |
|----------|-------------|----------|
| `NEXT_PUBLIC_APP_URL` | да | `https://ваш-домен` без `/` в конце |
| `SUPABASE_URL` | да (прод) | URL проекта Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | да (прод) | service_role key |
| `TELEGRAM_BOT_TOKEN` | да | токен @BotFather |
| `TELEGRAM_STAFF_CHAT_ID` | да | ID группы/чата сотрудников |
| `TELEGRAM_WEBHOOK_SECRET` | да | случайная строка; Telegram `secret_token` (не в URL) |
| `TELEGRAM_ADMIN_SECRET` | да, если нужен setup API | отдельный секрет для `POST /api/telegram/setup`; без него на проде setup отключён |
| `CRON_SECRET` | да (прод) | Bearer для Vercel Cron / `POST /api/reviews/sync` (`openssl rand -hex 32`) |
| `NEXT_PUBLIC_MAX_URL` | нет | личная ссылка Max `https://max.ru/u/...` |
| `NEXT_PUBLIC_YANDEX_METRIKA_ID` | нет | ID счётчика Метрики |

3. Deploy Production.
4. После деплоя (и после любой ротации `TELEGRAM_WEBHOOK_SECRET`) зарегистрируйте webhook:

```bash
npm run telegram:webhook
```

Проверка: `npm run telegram:verify`.

5. Синхронизация отзывов (Storage или SQL — оба ок):

```bash
# CRON_SECRET из .env.local / Vercel; URL = NEXT_PUBLIC_APP_URL
curl -sS -X POST "$NEXT_PUBLIC_APP_URL/api/reviews/sync" \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json"
```

Расписание уже в [`vercel.json`](./vercel.json): ежедневно `0 6 * * *` → `/api/reviews/sync`. Vercel передаёт `Authorization: Bearer $CRON_SECRET` автоматически, если переменная задана.

Секреты только в env хостинга / `.env.local`. Не коммитьте `.env*`.

### Breaking: webhook secret

Секрет больше **не** передаётся в query `?secret=`. Telegram шлёт заголовок `X-Telegram-Bot-Api-Secret-Token`.  
После выката этого кода: задайте/ротируйте `TELEGRAM_WEBHOOK_SECRET` и снова выполните `npm run telegram:webhook`.

## 3. VPS (альтернатива)

- Node 20+, `npm run build && npm run start` (или PM2).
- Postgres / Supabase с тем же `schema.sql`.
- HTTPS (Caddy/Nginx) → `NEXT_PUBLIC_APP_URL`.
- Те же env и `npm run telegram:webhook`.
- Cron: `0 6 * * * curl -X POST …/api/reviews/sync -H "Authorization: Bearer $CRON_SECRET"`.

JSON-fallback только для локальной разработки; на проде нужна БД.

## 4. Чеклист после деплоя

- [x] `SUPABASE_*` заданы на проде (и локально в `.env.local`)
- [x] В SQL Editor выполнен core schema (inventory/orders/telegram); reviews SQL опционален (Storage fallback)
- [x] `npm run db:apply-schema -- --check` — inventory/orders/telegram OK; reviews tables optional
- [x] `npm run db:sync-inventory` — 38 SKU в Supabase (qty 0 = OOS)
- [x] `TELEGRAM_ADMIN_SECRET` задан (если пользуетесь `/api/telegram/setup`)
- [x] `TELEGRAM_WEBHOOK_SECRET` + `npm run telegram:webhook` / `telegram:verify`
- [x] `CRON_SECRET` на Vercel (Production / Preview / Development)
- [ ] `POST /api/reviews/sync` с Bearer `CRON_SECRET` → 200 (пишет в Storage или SQL)
- [ ] Оформить тестовый заказ косметики → сообщение в Telegram staff-чат
- [ ] `/stock` в боте меняет остаток → сайт после refresh показывает новое значение (каталог ISR ~60 с)
- [ ] `https://ваш-домен/sitemap.xml` и `/robots.txt` открываются
- [ ] Checkout требует согласие с политикой и офертой
