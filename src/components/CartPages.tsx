"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/config/products";
import { useCart } from "@/context/CartContext";
import { saveOrderRef } from "@/lib/order-history-client";
import "./CartPages.css";

interface InventoryItemState {
  slug: string;
  quantity: number | null;
  inStock: boolean;
  isLowStock: boolean;
  availabilityLabel: string;
}

function useInventoryBySlug() {
  const [bySlug, setBySlug] = useState<Record<string, InventoryItemState>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/inventory", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { bySlug?: Record<string, InventoryItemState> }) => {
        if (cancelled) return;
        setBySlug(data.bySlug ?? {});
        setLoaded(true);
      })
      .catch(() => {
        if (cancelled) return;
        setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { bySlug, loaded };
}

function getCartIssue(
  quantity: number,
  inventory?: InventoryItemState,
): string | null {
  if (!inventory) return null;
  if (!inventory.inStock) return "Нет в наличии";
  if (inventory.quantity !== null && quantity > inventory.quantity) {
    return inventory.quantity > 0 ? `Доступно только ${inventory.quantity} шт.` : "Нет в наличии";
  }
  return null;
}

export function CartPageContent() {
  const { items, total, setQuantity, removeItem } = useCart();
  const { bySlug } = useInventoryBySlug();

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <h1 className="cart-page__title">Корзина пуста</h1>
        <p className="cart-empty__text">Добавьте средства из каталога — оформим самовывоз из барбершопа.</p>
        <Link href="/kosmetika" className="btn-primary text-xs">
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="cart-page__title">Корзина</h1>
      <ul className="cart-list">
        {items.map((item) => {
          const inventory = bySlug[item.slug];
          const issue = getCartIssue(item.quantity, inventory);
          const maxQuantity = inventory?.quantity ?? null;

          return (
          <li key={item.slug} className="cart-line">
            <span className="cart-line__image-wrap">
              <Image
                src={item.image}
                alt=""
                width={72}
                height={72}
                className="cart-line__image"
                style={{ objectFit: "contain", backgroundColor: "#ffffff" }}
              />
            </span>
            <div className="cart-line__info">
              <p className="cart-line__brand">{item.brand}</p>
              <Link href={`/kosmetika/${item.slug}`} className="cart-line__name">
                {item.name}
              </Link>
              <p className="cart-line__price">{formatPrice(item.price)}</p>
              {inventory ? (
                <p
                  className={`cart-line__stock${inventory.inStock ? "" : " cart-line__stock--out"}${
                    inventory.isLowStock ? " cart-line__stock--low" : ""
                  }`}
                >
                  {inventory.availabilityLabel}
                </p>
              ) : null}
              {issue ? <p className="cart-line__issue">{issue}</p> : null}
            </div>
            <div className="cart-line__controls">
              <div className="cart-qty">
                <button
                  type="button"
                  onClick={() => setQuantity(item.slug, item.quantity - 1, { inStock: inventory?.inStock })}
                  aria-label="Уменьшить"
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity(item.slug, item.quantity + 1, {
                      inStock: inventory?.inStock,
                      maxQuantity,
                    })
                  }
                  aria-label="Увеличить"
                  disabled={inventory ? !inventory.inStock || (maxQuantity !== null && item.quantity >= maxQuantity) : false}
                >
                  +
                </button>
              </div>
              <button type="button" className="cart-line__remove" onClick={() => removeItem(item.slug)}>
                Удалить
              </button>
            </div>
            <p className="cart-line__sum">{formatPrice(item.price * item.quantity)}</p>
          </li>
          );
        })}
      </ul>
      <div className="cart-summary">
        <p>
          Итого: <strong>{formatPrice(total)}</strong>
        </p>
        <p className="cart-summary__note">Самовывоз из {siteConfig.fullAddress}</p>
        <div className="cart-summary__actions">
          <Link href="/kosmetika/oformlenie" className="btn-primary text-xs cart-summary__checkout">
            Оформить заказ
          </Link>
        </div>
      </div>
    </div>
  );
}

export function CheckoutPageContent() {
  const router = useRouter();
  const { items, total, clearCart, hydrated } = useCart();
  const { bySlug, loaded: inventoryLoaded } = useInventoryBySlug();
  const [bindToken, setBindToken] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [consent, setConsent] = useState(false);
  const [telegramLinked, setTelegramLinked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successId, setSuccessId] = useState("");

  useEffect(() => {
    if (!hydrated) return;
    if (items.length === 0 && !successId) router.replace("/kosmetika/korzina");
  }, [hydrated, items.length, router, successId]);

  useEffect(() => {
    fetch("/api/orders")
      .then(async (res) => {
        if (!res.ok) throw new Error("Не удалось получить токен привязки");
        return res.json() as Promise<{ bindToken?: string }>;
      })
      .then((data) => {
        if (data.bindToken) {
          setBindToken(data.bindToken);
          setError("");
        } else {
          setError("Не удалось подготовить оформление. Обновите страницу.");
        }
      })
      .catch(() => {
        setBindToken("");
        setError("Не удалось подготовить оформление. Обновите страницу.");
      });
  }, []);

  const botLink = bindToken
    ? `https://t.me/${siteConfig.telegramBotUsername}?start=bind_${bindToken}`
    : "#";
  const blockingIssues = useMemo(
    () =>
      items
        .map((item) => ({
          item,
          issue: getCartIssue(item.quantity, bySlug[item.slug]),
        }))
        .filter((entry): entry is { item: (typeof items)[number]; issue: string } => Boolean(entry.issue)),
    [bySlug, items],
  );
  const hasBlockingIssues = blockingIssues.length > 0;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!consent) {
      setError("Подтвердите согласие с политикой конфиденциальности и офертой.");
      return;
    }
    if (hasBlockingIssues) {
      setError("Проверьте наличие товаров в заказе. Некоторые позиции недоступны или их осталось меньше.");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bindToken,
          customerName,
          phone,
          comment,
          items: items.map((item) => ({ slug: item.slug, quantity: item.quantity })),
        }),
      });

      const data = (await response.json()) as {
        orderId?: string;
        accessToken?: string;
        error?: string;
        telegramLinked?: boolean;
      };
      if (!response.ok) throw new Error(data.error ?? "Ошибка оформления");

      const orderId = data.orderId ?? "";
      if (orderId) saveOrderRef(orderId, phone, data.accessToken);
      setSuccessId(orderId);
      setTelegramLinked(Boolean(data.telegramLinked));
      clearCart();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Не удалось оформить заказ");
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) {
    return (
      <div className="checkout-page">
        <p className="checkout-page__lead">Загрузка корзины...</p>
      </div>
    );
  }

  if (successId) {
    return (
      <div className="cart-success">
        <h1 className="cart-page__title">Заказ принят</h1>
        <p>Номер заказа: <strong>#{successId}</strong></p>
        {telegramLinked ? (
          <p>Мы отправим уведомление в Telegram, когда заказ будет собран.</p>
        ) : (
          <p>Подключите Telegram-бота, чтобы получить уведомление о готовности заказа.</p>
        )}
        <p className="cart-summary__note">Самовывоз: {siteConfig.fullAddress}</p>
        <div className="cart-summary__actions">
          <Link href="/kosmetika" className="btn-primary text-xs">
            Вернуться в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1 className="cart-page__title">Оформление заказа</h1>
      <p className="checkout-page__lead">Самовывоз из барбершопа. Оплата при получении.</p>

      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <label className="checkout-field">
            <span>Имя</span>
            <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required minLength={2} />
          </label>
          <label className="checkout-field">
            <span>Телефон</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="+7 (999) 000-00-00"
            />
          </label>
          <label className="checkout-field">
            <span>Комментарий</span>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />
          </label>

          <div className="checkout-telegram">
            <p className="checkout-telegram__title">Уведомление в Telegram</p>
            <p className="checkout-telegram__text">
              Откройте бота и нажмите «Старт» — так мы сможем сообщить, когда заказ собран.
            </p>
            <a href={botLink} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs">
              Подключить Telegram
            </a>
          </div>

          <label className="checkout-consent">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
            />
            <span>
              Соглашаюсь с{" "}
              <Link href="/politika-konfidencialnosti" target="_blank">
                политикой конфиденциальности
              </Link>{" "}
              и{" "}
              <Link href="/oferta" target="_blank">
                публичной офертой
              </Link>
            </span>
          </label>

          {error && <p className="checkout-error">{error}</p>}

          {hasBlockingIssues ? (
            <p className="checkout-error">
              Проверьте корзину: часть товаров недоступна или превышает текущий остаток.
            </p>
          ) : null}

          <button
            type="submit"
            className="btn-primary text-xs"
            disabled={submitting || !bindToken || !inventoryLoaded || hasBlockingIssues || !consent}
          >
            {submitting ? "Отправляем..." : !inventoryLoaded ? "Проверяем остатки..." : "Подтвердить заказ"}
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>Ваш заказ</h2>
          <ul>
            {items.map((item) => (
              <li key={item.slug}>
                {item.name} ×{item.quantity} — {formatPrice(item.price * item.quantity)}
                {bySlug[item.slug] ? ` · ${bySlug[item.slug].availabilityLabel}` : ""}
              </li>
            ))}
          </ul>
          <p className="checkout-summary__total">Итого: {formatPrice(total)}</p>
        </aside>
      </div>
    </div>
  );
}
