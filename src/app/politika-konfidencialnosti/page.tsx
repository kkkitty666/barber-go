import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — PC Барбершоп",
  description:
    "Политика обработки персональных данных PC Барбершоп: какие данные собираем, зачем и как защищаем.",
};

export default function PrivacyPage() {
  return (
    <SiteShell>
      <article className="legal-page section-padding mx-auto max-w-3xl py-12">
        <h1 className="font-display mb-6 text-2xl tracking-[0.12em] text-gold uppercase">
          Политика конфиденциальности
        </h1>
        <p className="mb-6 text-sm text-foreground-muted">
          Настоящая политика описывает, как {siteConfig.name} ({siteConfig.fullAddress}) обрабатывает
          персональные данные посетителей сайта и клиентов при записи и заказе косметики.
        </p>

        <section className="legal-block">
          <h2>1. Какие данные мы получаем</h2>
          <ul>
            <li>имя и номер телефона при оформлении заказа косметики;</li>
            <li>комментарий к заказу (по желанию);</li>
            <li>идентификатор чата Telegram, если вы подключили бота уведомлений;</li>
            <li>технические данные (IP, cookies аналитики), если подключена Метрика.</li>
          </ul>
        </section>

        <section className="legal-block">
          <h2>2. Цели обработки</h2>
          <ul>
            <li>обработка и выдача заказа самовывоза;</li>
            <li>связь по статусу заказа и запись на услуги;</li>
            <li>улучшение сайта и сервиса (при включённой аналитике).</li>
          </ul>
        </section>

        <section className="legal-block">
          <h2>3. Хранение и передача</h2>
          <p>
            Данные заказов хранятся на сервере барбершопа (или в защищённой БД поставщика) и доступны
            сотрудникам для сборки и выдачи. Мы не продаём персональные данные третьим лицам. Передача
            возможна только сервисам, необходимым для работы сайта (хостинг, база данных, Telegram API,
            аналитика — при подключении).
          </p>
        </section>

        <section className="legal-block">
          <h2>4. Ваши права</h2>
          <p>
            Вы можете запросить уточнение, удаление или ограничение обработки данных, связанных с вашим
            заказом, по телефону{" "}
            <a href={`tel:+${siteConfig.phoneRaw}`}>{siteConfig.phone}</a> или в мессенджерах на странице{" "}
            <Link href="/kontakty">контактов</Link>.
          </p>
        </section>

        <section className="legal-block">
          <h2>5. Согласие</h2>
          <p>
            Оформляя заказ на сайте, вы подтверждаете согласие на обработку указанных данных в целях
            исполнения заказа. Актуальная оферта на самовывоз косметики:{" "}
            <Link href="/oferta">публичная оферта</Link>.
          </p>
        </section>

        <p className="mt-8 text-xs text-foreground-muted">
          Последнее обновление: июль 2026. {siteConfig.name}, {siteConfig.fullAddress}.
        </p>
      </article>
    </SiteShell>
  );
}
