"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { formatPrice } from "@/config/products";
import { siteConfig } from "@/config/site";
import { formatOrderDate, orderStatusLabels } from "@/lib/order-labels";
import { getLastUsedPhone, getSavedOrderRefs } from "@/lib/order-history-client";
import type { OrderStatus } from "@/lib/orders";
import "./OrderHistory.css";

interface HistoryOrder {
  id: string;
  items: { name: string; brand: string; price: number; quantity: number }[];
  total: number;
  customerName: string;
  status: OrderStatus;
  createdAt: string;
  readyAt?: string;
  comment?: string;
}

export function OrderHistoryContent() {
  const [orders, setOrders] = useState<HistoryOrder[]>([]);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async (searchPhone?: string) => {
    setLoading(true);
    setError("");
    try {
      const orderIds = getSavedOrderRefs().map((entry) => entry.orderId);
      const response = await fetch("/api/orders/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderIds,
          phone: searchPhone?.trim() || undefined,
        }),
      });
      const data = (await response.json()) as { orders?: HistoryOrder[]; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Ошибка загрузки");
      setOrders(data.orders ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить заказы");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const lastPhone = getLastUsedPhone();
    if (lastPhone) setPhone(lastPhone);
    void loadOrders(lastPhone);
  }, [loadOrders]);

  return (
    <div className="order-history">
      <div className="order-history__header">
        <h1 className="order-history__title">История заказов</h1>
        <p className="order-history__lead">
          Здесь отображаются ваши текущие и прошлые заказы косметики с самовывозом из {siteConfig.fullAddress}.
        </p>
      </div>

      <form
        className="order-history__search"
        onSubmit={(event) => {
          event.preventDefault();
          void loadOrders(phone);
        }}
      >
        <label className="order-history__field">
          <span>Телефон</span>
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+7 (999) 000-00-00"
          />
        </label>
        <button type="submit" className="btn-secondary text-xs">
          Найти заказы
        </button>
      </form>

      {loading && <p className="order-history__status">Загрузка...</p>}
      {error && <p className="order-history__error">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <div className="order-history__empty">
          <p>Заказов пока нет. Оформите первый заказ в каталоге косметики.</p>
          <Link href="/kosmetika" className="btn-primary text-xs">
            В каталог
          </Link>
        </div>
      )}

      <ul className="order-history__list">
        {orders.map((order) => (
          <li key={order.id} className="order-history-card">
            <div className="order-history-card__head">
              <div>
                <p className="order-history-card__id">Заказ #{order.id}</p>
                <p className="order-history-card__date">{formatOrderDate(order.createdAt)}</p>
              </div>
              <span className={`order-history-card__status order-history-card__status--${order.status}`}>
                {orderStatusLabels[order.status]}
              </span>
            </div>

            <ul className="order-history-card__items">
              {order.items.map((item) => (
                <li key={`${order.id}-${item.name}`}>
                  {item.name} ×{item.quantity} — {formatPrice(item.price * item.quantity)}
                </li>
              ))}
            </ul>

            <p className="order-history-card__total">Итого: {formatPrice(order.total)}</p>
            {order.readyAt && (
              <p className="order-history-card__ready">Готов с {formatOrderDate(order.readyAt)}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
