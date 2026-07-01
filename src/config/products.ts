export type ProductCategory = "styling" | "care";

export interface Product {
  slug: string;
  name: string;
  subtitle: string;
  brand: string;
  category: ProductCategory;
  image: string;
  imageFocus?: string;
  price: number;
  inStock: boolean;
  shine: 1 | 2 | 3;
  hold: 1 | 2 | 3;
  volume: string;
  fragrance?: string;
  description: string;
  instructions: string[];
  composition?: string;
  note?: string;
}

export const productCatalog: Product[] = [
  {
    slug: "boys-toys-pasta-original",
    name: "ПАСТА ORIGINAL",
    subtitle: "ЕСТЕСТВЕННЫЙ ВИД · СРЕДНЯЯ ФИКСАЦИЯ · ОБЪЁМ",
    brand: "Boy's Toys",
    category: "styling",
    image: "/assets/products/boys-toys-pasta-original.png",
    imageFocus: "52% 46%",
    price: 890,
    inStock: true,
    shine: 2,
    hold: 2,
    volume: "100 г",
    fragrance: "Перечная мята и фейхоа",
    description:
      "Лёгкая паста для естественного объёма и текстуры. Подходит для лёгких и вьющихся волос — придаёт объём без утяжеления и жирного блеска.",
    instructions: [
      "Возьмите небольшое количество пасты и разогрейте в ладонях.",
      "Равномерно распределите по сухим или слегка влажным волосам.",
      "Уложите пальцами или расчёской, придавая желаемую форму.",
    ],
    composition: "Средняя фиксация, естественный финиш.",
    note: "Спросите у барбера в PC Барбершоп — подберём укладку под ваш тип волос.",
  },
  {
    slug: "boys-toys-clay-mastic",
    name: "ГЛИНА МАСТИКА",
    subtitle: "МАТОВЫЙ ЭФФЕКТ · СИЛЬНАЯ ФИКСАЦИЯ",
    brand: "Boy's Toys",
    category: "styling",
    image: "/assets/products/boys-toys-clay-mastic.png",
    imageFocus: "50% 48%",
    price: 950,
    inStock: true,
    shine: 1,
    hold: 3,
    volume: "100 г",
    fragrance: "Карибский ром и маракуйя",
    description:
      "Глина-мастика для стальной укладки и матового финиша. Идеальна для жёстких и седых волос — держит форму весь день без липкости.",
    instructions: [
      "Нанесите на сухие волосы небольшое количество средства.",
      "Тщательно разотрите в ладонях до однородной текстуры.",
      "Сформируйте укладку, прорабатывая волосы от корней к кончикам.",
    ],
    composition: "Водная основа. Сильная фиксация, матовый эффект.",
  },
  {
    slug: "boys-toys-invisible-clay",
    name: "ИНВИЗИБЛ ГЛИНА",
    subtitle: "МАТОВЫЙ СУХОЙ ЭФФЕКТ · СИЛЬНАЯ ФИКСАЦИЯ",
    brand: "Boy's Toys",
    category: "styling",
    image: "/assets/products/boys-toys-invisible-clay.png",
    imageFocus: "54% 48%",
    price: 950,
    inStock: true,
    shine: 1,
    hold: 3,
    volume: "100 г",
    fragrance: "Лемонграсс и текила",
    description:
      "Невидимая глина с сильной фиксацией и матовым сухим эффектом. Подходит для всех типов волос, не утяжеляет и не оставляет видимого налёта.",
    instructions: [
      "Нанесите на сухие волосы небольшое количество глины.",
      "Разотрите в ладонях и равномерно распределите по волосам.",
      "Сформируйте укладку, прорабатывая текстуру кончиками пальцев.",
    ],
    composition: "Сильная фиксация, матовый сухой финиш.",
  },
  {
    slug: "boys-toys-101-karat",
    name: "101 KARAT",
    subtitle: "МАТОВЫЙ ЭФФЕКТ · СИЛЬНАЯ ФИКСАЦИЯ",
    brand: "Boy's Toys",
    category: "styling",
    image: "/assets/products/boys-toys-101-karat.png",
    imageFocus: "50% 45%",
    price: 980,
    inStock: true,
    shine: 1,
    hold: 3,
    volume: "100 г",
    fragrance: "Калифорнийский апельсин и тимьян",
    description:
      "Помада с сильной фиксацией и матовым эффектом. Предотвращает утяжеление волос — идеальна для здоровых и плотных волос.",
    instructions: [
      "Возьмите немного средства и разогрейте между ладонями.",
      "Нанесите на сухие или слегка влажные волосы.",
      "Уложите пальцами или расчёской, формируя желаемый образ.",
    ],
    composition: "Сильная фиксация, матовый эффект.",
  },
  {
    slug: "wolders-texture-paste",
    name: "TEXTURE PASTE",
    subtitle: "EXTRA STRONG · MATTE SHINE",
    brand: "Wolder's",
    category: "styling",
    image: "/assets/products/wolders-texture-paste.png",
    imageFocus: "50% 50%",
    price: 1200,
    inStock: true,
    shine: 1,
    hold: 3,
    volume: "30 мл",
    description:
      "Концентрированная паста с матовым финишем. Позволяет выстраивать объём и чёткие пряди без блеска.",
    instructions: [
      "Нанесите на сухие волосы.",
      "Разотрите в ладонях и уложите волосы по направлению роста.",
      "Для текстуры — растрепите кончиками пальцев на макушке.",
    ],
    composition: "Матовая паста. Extra strong hold.",
  },
  {
    slug: "wolders-styling-pomade",
    name: "STYLING POMADE",
    subtitle: "STRONG HOLD · LOW SHINE",
    brand: "Wolder's",
    category: "styling",
    image: "/assets/products/wolders-styling-pomade.png",
    imageFocus: "50% 44%",
    price: 1100,
    inStock: true,
    shine: 2,
    hold: 3,
    volume: "50 мл",
    description:
      "Классическая помада для аккуратных и чётких укладок. Сильная фиксация с деликатным блеском — идеальна для проборов и гладких форм.",
    instructions: [
      "Возьмите немного помады и разогрейте между ладонями.",
      "Нанесите на сухие или слегка влажные волосы.",
      "Расчешите расчёской для гладкого классического образа.",
    ],
    composition: "Помада на водной основе. Strong hold, low shine.",
    note: "Create for barbers — линейка Wolder's для точной работы мастера.",
  },
  {
    slug: "boys-toys-shampoo",
    name: "УВЛАЖНЯЮЩИЙ ШАМПУНЬ",
    subtitle: "УПЛОТНЕНИЕ И ВОССТАНОВЛЕНИЕ",
    brand: "Boy's Toys",
    category: "care",
    image: "/assets/products/boys-toys-shampoo.png",
    imageFocus: "50% 42%",
    price: 1800,
    inStock: true,
    shine: 2,
    hold: 1,
    volume: "1000 мл",
    description:
      "Мужской шампунь с D-пантенолом, растительным кератином и экстрактом грейпфрутовой цедры. Уплотняет и восстанавливает волосы — мягкость без отдельного бальзама.",
    instructions: [
      "Нанесите на влажные волосы небольшое количество шампуня.",
      "Вспеньте массирующими движениями кожу головы и длину.",
      "Тщательно смойте тёплой водой. При необходимости повторите.",
    ],
    composition: "D-пантенол, растительный кератин, экстракт грейпфрутовой цедры.",
  },
  {
    slug: "boys-toys-salt-spray",
    name: "СОЛЕВОЙ GROOMING SPRAY",
    subtitle: "ОБЪЁМ · ВЫРАЖЕННАЯ ТЕКСТУРА",
    brand: "Boy's Toys",
    category: "styling",
    image: "/assets/products/boys-toys-salt-spray.png",
    imageFocus: "50% 58%",
    price: 750,
    inStock: true,
    shine: 2,
    hold: 2,
    volume: "100 мл",
    description:
      "Солевой спрей для объёма и выраженной текстуры. Предотвращает утяжеление волос — можно использовать как пре-стайлер перед пастой или глиной.",
    instructions: [
      "Распылите на влажные или сухие волосы с расстояния 20–30 см.",
      "Взбейте волосы руками для текстуры и объёма.",
      "Досушите феном или оставьте естественной сушкой.",
    ],
    composition: "Морская соль, вода Атлантического океана.",
    note: "Пре-стайлер — усиливает фиксацию основного средства для укладки.",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return productCatalog.find((p) => p.slug === slug);
}

export function getAllProductSlugs(): string[] {
  return productCatalog.map((p) => p.slug);
}

export function formatPrice(amount: number): string {
  return `${amount.toLocaleString("ru-RU")} ₽`;
}
