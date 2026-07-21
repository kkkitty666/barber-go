# Деплой PC Барбершоп

Рекомендуемая схема: **Vercel + Supabase**. Альтернатива — один VPS с Node и Postgres.

## 1. Supabase

1. Создайте проект на [supabase.com](https://supabase.com).
2. В SQL Editor выполните [`supabase/schema.sql`](./supabase/schema.sql).  
   **RLS обязателен** — в schema уже включён. Не отдавайте anon key клиенту без политик; приложение использует только **service_role** на сервере.
3. Скопируйте **Project URL** и **service_role** key (Settings → API).  
   Service role — только на сервере, никогда в `NEXT_PUBLIC_*` и никогда в git.

Опционально перенесите локальные JSON:

```bash
# при заполненных SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY в .env.local
node scripts/migrate-json-to-supabase.mjs
```

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
| `NEXT_PUBLIC_MAX_URL` | нет | личная ссылка Max `https://max.ru/u/...` |
| `NEXT_PUBLIC_YANDEX_METRIKA_ID` | нет | ID счётчика Метрики |

3. Deploy Production.
4. После деплоя (и после любой ротации `TELEGRAM_WEBHOOK_SECRET`) зарегистрируйте webhook:

```bash
npm run telegram:webhook
```

Проверка: `npm run telegram:verify`.

Секреты только в env хостинга / `.env.local`. Не коммитьте `.env*`.

### Breaking: webhook secret

Секрет больше **не** передаётся в query `?secret=`. Telegram шлёт заголовок `X-Telegram-Bot-Api-Secret-Token`.  
После выката этого кода: задайте/ротируйте `TELEGRAM_WEBHOOK_SECRET` и снова выполните `npm run telegram:webhook`.

## 3. VPS (альтернатива)

- Node 20+, `npm run build && npm run start` (или PM2).
- Postgres / Supabase с тем же `schema.sql`.
- HTTPS (Caddy/Nginx) → `NEXT_PUBLIC_APP_URL`.
- Те же env и `npm run telegram:webhook`.

JSON-fallback только для локальной разработки; на проде нужна БД.

## 4. Чеклист после деплоя

- [ ] `SUPABASE_*` заданы на проде
- [ ] `TELEGRAM_ADMIN_SECRET` задан (если пользуетесь `/api/telegram/setup`)
- [ ] `TELEGRAM_WEBHOOK_SECRET` ротирован при необходимости + `npm run telegram:webhook`
- [ ] Оформить тестовый заказ косметики → сообщение в Telegram staff-чат
- [ ] `/stock` в боте меняет остаток → сайт после refresh показывает новое значение
- [ ] `https://ваш-домен/sitemap.xml` и `/robots.txt` открываются
- [ ] Checkout требует согласие с политикой и офертой
