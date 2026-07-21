# Операторская шпаргалка — PC Барбершоп

Кратко для сотрудников и владельца: env, Telegram, остатки, заказы.

## Переменные окружения

См. [`.env.example`](./.env.example) и [DEPLOY.md](./DEPLOY.md).

Минимум для заказов и бота:

- `NEXT_PUBLIC_APP_URL`
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_STAFF_CHAT_ID`, `TELEGRAM_WEBHOOK_SECRET`
- `TELEGRAM_ADMIN_SECRET` — для `POST /api/telegram/setup` (отдельно от webhook; на проде без него setup отключён)
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (**обязательно на проде**)

Опционально:

- `NEXT_PUBLIC_MAX_URL` — ссылка профиля Max
- `NEXT_PUBLIC_YANDEX_METRIKA_ID` — аналитика

После деплоя или смены `TELEGRAM_WEBHOOK_SECRET` обязательно: `npm run telegram:webhook`  
(секрет уходит в Telegram как `secret_token`, не в URL).

## Telegram: первичная настройка

```bash
# токен, секрет, URL, staff chat — в .env.local
npm run telegram:setup      # команды бота + проверка
npm run telegram:webhook    # после деплоя HTTPS
npm run telegram:verify     # статус webhook
```

Бот: `@PC_barbershop_bot` (см. `siteConfig.telegramBotUsername`).

Сотрудники работают в группе, чей ID = `TELEGRAM_STAFF_CHAT_ID`.

## Команды остатков (staff-чат)

| Команда | Действие |
|---------|----------|
| `/stock` | Категория → товар → кнопки ➖ / ➕ / ввод числа |
| `/lowstock` | Товары с остатком ≤ 3 шт. |
| `/cancel` | Отменить ввод количества |
| `/help` | Подсказка |

Остатки синхронизируются с каталогом на сайте (`/kosmetika`).

## Сценарий заказа косметики

1. Клиент собирает корзину → оформляет заказ (имя, телефон, согласие с офертой).
2. Опционально подключает бота по ссылке «Подключить Telegram».
3. В staff-чат приходит новый заказ со статусами (кнопки в сообщении).
4. Когда заказ готов — клиент получает уведомление в Telegram (если привязан).
5. Самовывоз: {адрес из siteConfig} — Батуринская 165/13, 09:00–20:00. Оплата при получении.

История заказов у клиента: номер заказа + телефон (или сохранённые в браузере ссылки после оформления).

## Полезные страницы сайта

- Запись: YCLIENTS (`dikidiUrl` в конфиге)
- Косметика: `/kosmetika`
- Политика / оферта: `/politika-konfidencialnosti`, `/oferta`

## На будущее (не реализовано)

- **Админка / CMS** — правки цен, акций и товаров без деплоя (например Sanity/Payload или простая таблица в Supabase + protected UI).
- **Онлайн-оплата** — ЮKassa: создавать платёж при заказе, webhook на статус; сейчас модель — самовывоз и оплата в шопе.

Подробный деплой: [DEPLOY.md](./DEPLOY.md).
