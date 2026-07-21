import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Публичная оферта — PC Барбершоп",
  description:
    "Публичная оферта на заказ и самовывоз косметики в PC Барбершоп, Ростов-на-Дону.",
};

export default function OfferPage() {
  return (
    <SiteShell>
      <article className="legal-page section-padding mx-auto max-w-3xl py-12">
        <h1 className="font-display mb-6 text-2xl tracking-[0.12em] text-gold uppercase">
          Публичная оферта
        </h1>
        <p className="mb-6 text-sm text-foreground-muted">
          Настоящий документ является предложением {siteConfig.name} ({siteConfig.fullAddress})
          заключить договор розничной купли-продажи косметики с самовывозом на условиях ниже.
        </p>

        <section className="legal-block">
          <h2>1. Предмет</h2>
          <p>
            Продавец предлагает купить товары из каталога «Косметика» на сайте. Заказ оформляется
            онлайн; получение — самовывозом по адресу {siteConfig.fullAddress} в часы работы{" "}
            {siteConfig.hours}.
          </p>
        </section>

        <section className="legal-block">
          <h2>2. Оформление и оплата</h2>
          <ul>
            <li>заказ считается принятым после подтверждения на сайте и/или уведомления в Telegram;</li>
            <li>наличие позиций резервируется при оформлении с учётом остатков;</li>
            <li>оплата — при получении в барбершопе (наличные или карта), если не указано иное;</li>
            <li>цена фиксируется на момент оформления заказа.</li>
          </ul>
        </section>

        <section className="legal-block">
          <h2>3. Получение и отказ</h2>
          <p>
            Заказ нужно забрать в согласованный срок после статуса «готов». Если товар не забран в
            разумный срок, резерв может быть снят. Перед получением проверьте комплектность. Претензии
            по количеству и видимым дефектам принимаются при выдаче.
          </p>
        </section>

        <section className="legal-block">
          <h2>4. Услуги барбершопа</h2>
          <p>
            Стрижки и другие услуги записываются отдельно (YCLIENTS и т.п.) и не входят в предмет этой
            оферты о косметике.
          </p>
        </section>

        <section className="legal-block">
          <h2>5. Персональные данные</h2>
          <p>
            Обработка данных при заказе регулируется{" "}
            <Link href="/politika-konfidencialnosti">политикой конфиденциальности</Link>.
          </p>
        </section>

        <section className="legal-block">
          <h2>6. Контакты</h2>
          <p>
            Телефон: <a href={`tel:+${siteConfig.phoneRaw}`}>{siteConfig.phone}</a>
            <br />
            Адрес: {siteConfig.fullAddress}
          </p>
        </section>

        <p className="mt-8 text-xs text-foreground-muted">
          Акцепт оферты — оформление заказа на сайте с подтверждением согласия. Обновлено: июль 2026.
        </p>
      </article>
    </SiteShell>
  );
}
