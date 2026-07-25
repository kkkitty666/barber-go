import { siteConfig } from "@/config/site";

export type PromotionCta = {
  label: string;
  href: string;
  external?: boolean;
};

export type Promotion = {
  id: string;
  badge: string;
  title: string;
  titleAccent?: string;
  description: string;
  terms: string[];
  image: string;
  imageAlt: string;
  cta: PromotionCta;
  active: boolean;
};

export const promotions: Promotion[] = [
  {
    id: "first-visit",
    badge: "Для новых гостей",
    title: "Первое посещение —",
    titleAccent: "скидка 20%",
    description:
      "Приходите в PC Барбершоп впервые и получите скидку на стрижку или комплекс. Сообщите о акции при записи или перед оплатой.",
    terms: [
      "Скидка действует только при первом посещении PC Барбершоп.",
      "Не суммируется с другими акциями и комплексными предложениями.",
      "Сообщите администратору или барберу о скидке при записи или перед оплатой.",
      "Акция действует до отдельного уведомления на сайте.",
    ],
    image: "/assets/works/work-2.png",
    imageAlt: "Мужская стрижка с фейдом в PC Барбершоп",
    cta: { label: "Записаться со скидкой", href: siteConfig.bookingUrl, external: true },
    active: true,
  },
  {
    id: "father-son",
    badge: "Комплекс",
    title: "Отец и сын —",
    titleAccent: "стрижка вместе",
    description:
      "Приходите с ребёнком: услуга «Преемник» для юных джентльменов 5–12 лет. Запишитесь на удобное время для двоих.",
    terms: [
      "Акция распространяется на одновременную запись отца и ребёнка.",
      "Детская стрижка — «Преемник» по прайсу, взрослая — по выбранной услуге.",
      "Запись через YCLIENTS или по телефону салона.",
      "Акция действует до отдельного уведомления на сайте.",
    ],
    image: "/assets/works/work-3.png",
    imageAlt: "Детская стрижка в PC Барбершоп",
    cta: { label: "Записаться на двоих", href: siteConfig.bookingUrl, external: true },
    active: true,
  },
  {
    id: "combo-cut-beard",
    badge: "Борода",
    title: "Магнат —",
    titleAccent: "премиум для бороды",
    description:
      "Распаривание горячим полотенцем, моделирование формы и окантовка опасной бритвой — услуга «Магнат» для безупречного контура.",
    terms: [
      "«Магнат» — 1 500 ₽, около 45 минут.",
      "«Кодекс» (скульптуринг) — 900 ₽, если нужен более короткий формат.",
      "Не суммируется со скидкой на первое посещение без уточнения у мастера.",
      "Актуальные цены — в разделе «Услуги».",
    ],
    image: "/assets/works/work-1.png",
    imageAlt: "Бритьё головы и оформление бороды в PC Барбершоп",
    cta: { label: "Смотреть прайс", href: "/uslugi", external: false },
    active: true,
  },
  {
    id: "cosmetics-pickup",
    badge: "Косметика",
    title: "Заказ с",
    titleAccent: "самовывозом",
    description:
      "White Cosmetics — линейка White Detox для ухода за волосами. Соберите заказ на сайте — заберите в барбершоп после стрижки.",
    terms: [
      "Оформление заказа на сайте, оплата при получении в салоне.",
      "Сбор заказа — обычно в день обращения или на следующий рабочий день.",
      "Ассортимент и цены — в каталоге косметики.",
    ],
    image: "/assets/products/white-detox/deep-cleansing-shampoo.png",
    imageAlt: "White Detox — шампунь глубокого очищения",
    cta: { label: "Открыть каталог", href: "/kosmetika", external: false },
    active: true,
  },
];

export const activePromotions = promotions.filter((promo) => promo.active);
