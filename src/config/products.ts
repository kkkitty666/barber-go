export type ProductCategory =
  | "detox"
  | "shampoos"
  | "conditioners"
  | "shower-gels"
  | "shaving"
  | "styling";

export const productCategories: { id: ProductCategory; label: string }[] = [
  { id: "detox", label: "Детокс" },
  { id: "shampoos", label: "Шампуни" },
  { id: "conditioners", label: "Кондиционеры" },
  { id: "shower-gels", label: "Гели для душа" },
  { id: "shaving", label: "Средства для бритья" },
  { id: "styling", label: "Стайлинги" },
];

export interface Product {
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  image: string;
  price: number;
  inStock: boolean;
  volume: string;
  sku?: string;
  description: string;
  instructions: string[];
  composition?: string;
  note?: string;
}

type ProductSeed = Omit<Product, "description" | "instructions" | "inStock"> & {
  description?: string;
  instructions?: string[];
  inStock?: boolean;
};

function buildDescription(product: ProductSeed): string {
  if (product.description) {
    return product.description;
  }

  switch (product.category) {
    case "shampoos":
      return product.volume === "5 л" || product.volume === "1000 мл"
        ? `${product.name} из каталога White Cosmetics в профессиональном формате для регулярного очищения волос и кожи головы. Подходит для салонного использования и для тех, кто хочет держать любимый уход под рукой надолго.`
        : `${product.name} из каталога White Cosmetics предназначен для мягкого ежедневного очищения волос и кожи головы. Формула помогает сохранить волосы свежими, ухоженными и удобными в укладке.`;
    case "conditioners":
      return product.name.includes("крем-спрей")
        ? `${product.name} облегчает расчёсывание, смягчает волосы и помогает сохранить аккуратный ухоженный вид в течение дня. Это удобный несмываемый формат для домашнего ухода и быстрой укладки.`
        : `${product.name} из линейки White Cosmetics помогает смягчить волосы после мытья, уменьшить сухость и сделать длину более послушной. Подходит для регулярного ухода дома и после барбершоп-процедур.`;
    case "shower-gels":
      return product.name.includes("Cedar Wood")
        ? `${product.name} очищает кожу и оставляет выразительный древесный аромат. Формат White Cosmetics хорошо подходит для ежедневного использования и аккуратно дополняет мужской уход.`
        : `${product.name} мягко очищает кожу и оставляет бодрящий аромат с более спортивным характером. Подходит для ежедневного душа и хорошо вписывается в базовый домашний уход.`;
    case "shaving":
      return product.name.includes("Крем")
        ? `${product.name} помогает комфортно подготовить кожу к бритью, смягчает щетину и делает скольжение лезвия более ровным. Удобен как для домашнего, так и для профессионального использования.`
        : `${product.name} создаёт комфортное скольжение во время бритья и помогает сделать процедуру более аккуратной для кожи. Подходит для домашнего ухода и барберских ритуалов.`;
    case "styling":
      if (product.name.includes("Паста")) {
        return `${product.name} помогает задать форму причёске, сохранить естественный вид волос и обеспечить контролируемую фиксацию на каждый день. Хороший выбор для текстурных и аккуратных мужских укладок.`;
      }

      if (product.name.includes("Глина")) {
        return `${product.name} создаёт более плотную текстуру и матовый результат, сохраняя контроль над причёской в течение дня. Подходит для коротких и средних мужских стрижек.`;
      }

      if (product.name.includes("Помада")) {
        return `${product.name} подходит для более гладких и собранных укладок, помогает добавить контроль и аккуратный финиш. Особенно хорошо смотрится на классических мужских формах.`;
      }

      if (product.name.includes("Жидкая пудра")) {
        return `${product.name} добавляет объём и текстуру без перегруза волос, сохраняя более лёгкое ощущение в течение дня. Подходит для быстрой повседневной укладки.`;
      }

      if (product.name.includes("Пудра")) {
        return `${product.name} помогает быстро поднять объём у корней и добавить волосам сухую текстуру. Это удобный формат для быстрой укладки без утяжеления.`;
      }

      if (product.name.includes("Спрей")) {
        return `${product.name} упрощает укладку, помогает задать направление волосам и сохранить форму причёски. Удобен для повседневного использования дома или после стрижки.`;
      }

      if (product.name.includes("Груминг тоник")) {
        return `${product.name} подготавливает волосы к укладке, добавляет контроль и облегчает работу с феном или брашингом. Подходит как база перед основным стайлингом.`;
      }

      return `${product.name} из линейки White Cosmetics создан для мужского стайлинга и помогает поддерживать аккуратную укладку в течение дня.`;
    default:
      return `${product.name} из каталога White Cosmetics.`;
  }
}

function buildInstructions(product: ProductSeed): string[] {
  if (product.instructions) {
    return product.instructions;
  }

  switch (product.category) {
    case "shampoos":
      return [
        "Нанесите небольшое количество шампуня на влажные волосы.",
        "Вспеньте массирующими движениями по коже головы и длине.",
        "Тщательно смойте тёплой водой. При необходимости повторите.",
      ];
    case "conditioners":
      return product.name.includes("крем-спрей")
        ? [
            "Распылите средство на чистые влажные или слегка подсушенные волосы.",
            "Равномерно распределите по длине, уделяя внимание сухим участкам.",
            "Не смывайте и переходите к укладке.",
          ]
        : [
            "Нанесите кондиционер на чистые влажные волосы после шампуня.",
            "Распределите по длине, избегая корней, и оставьте на 1-3 минуты.",
            "Смойте тёплой водой и приступайте к укладке.",
          ];
    case "shower-gels":
      return [
        "Нанесите средство на влажную кожу или губку.",
        "Вспеньте массажными движениями по телу.",
        "Смойте водой и при желании повторите процедуру.",
      ];
    case "shaving":
      return product.name.includes("Крем")
        ? [
            "Нанесите крем на тёплую влажную кожу перед бритьём.",
            "Равномерно распределите по зоне бритья.",
            "После процедуры смойте остатки водой и завершите уход.",
          ]
        : [
            "Нанесите гель на увлажнённую кожу перед бритьём.",
            "Распределите средство по щетине тонким ровным слоем.",
            "Побрейте нужные зоны и тщательно смойте остатки водой.",
          ];
    case "styling":
      if (product.name.includes("Пудра")) {
        return [
          "Нанесите небольшое количество средства на сухие волосы или в прикорневую зону.",
          "Распределите руками для объёма и текстуры.",
          "Придайте причёске нужную форму пальцами или расчёской.",
        ];
      }

      if (product.name.includes("Спрей") || product.name.includes("Груминг тоник")) {
        return [
          "Распылите средство на слегка влажные или сухие волосы.",
          "Распределите по длине руками или расчёской.",
          "Уложите волосы в нужную форму естественным способом или с феном.",
        ];
      }

      return [
        "Разотрите небольшое количество средства между ладонями.",
        "Нанесите на сухие или слегка влажные волосы.",
        "Придайте причёске нужную текстуру, направление и форму.",
      ];
    default:
      return [
        "Нанесите средство согласно типу продукта и потребностям волос или кожи.",
        "Равномерно распределите по нужной зоне.",
        "Завершите уход или укладку привычным способом.",
      ];
  }
}

const productSeeds: ProductSeed[] = [
  {
    slug: "white_detox_shampun_glubokogo_ochishcheniya_250_ml",
    name: "White Detox Шампунь глубокого очищения, 250 мл",
    brand: "White Detox",
    category: "detox",
    image:
      "/assets/products/white-cosmetics/WH_Mokap_SHampun-ochistki-250-ml.png",
    price: 1440,
    volume: "250 мл",
    sku: "WC3426",
    description:
      "Шампунь глубокого очищения линейки White Detox мягко удаляет стайлинг, загрязнения и остатки hard water с волос и кожи головы. Подходит для регулярного детокс-ухода — волосы остаются чистыми, лёгкими и готовыми к дальнейшему уходу.",
    instructions: [
      "Нанесите на влажные волосы небольшое количество шампуня.",
      "Вспеньте массирующими движениями кожу головы и длину волос.",
      "Тщательно смойте тёплой водой. При необходимости повторите.",
    ],
    note: "Рекомендуем сочетать с маской-прешампунь White Detox для усиленного эффекта.",
  },
  {
    slug: "white_detox_maska_preshampun_dlya_volos_250_ml",
    name: "White Detox Маска-прешампунь для волос, 250 мл",
    brand: "White Detox",
    category: "detox",
    image:
      "/assets/products/white-cosmetics/Mokap-detoks-preshampun.png",
    price: 2319,
    volume: "250 мл",
    sku: "WC3422",
    description:
      "Маска-прешампунь подготавливает волосы и кожу головы к основному очищению. Смягчает, насыщает влагой и помогает шампуню работать эффективнее — особенно при плотной укладке или жёсткой воде.",
    instructions: [
      "Нанесите на сухие или слегка влажные волосы перед мытьём.",
      "Распределите по длине и коже головы, оставьте на 5-10 минут.",
      "Смойте и продолжите уход шампунем White Detox.",
    ],
  },
  {
    slug: "white_detox_tonik_protiv_vypadeniya_volos_100_ml",
    name: "White Detox Тоник против выпадения волос, 100 мл",
    brand: "White Detox",
    category: "detox",
    image:
      "/assets/products/white-cosmetics/Mockup_Tonik.png",
    price: 2270,
    volume: "100 мл",
    sku: "WC3424",
    description:
      "Тоник против выпадения волос укрепляет корни и поддерживает здоровье кожи головы. Лёгкая текстура не утяжеляет волосы — подходит для ежедневного применения в домашнем уходе.",
    instructions: [
      "Нанесите на чистую кожу головы небольшое количество тоника.",
      "Аккуратно вмассируйте подушечками пальцев 2-3 минуты.",
      "Не смывайте. Используйте регулярно для стабильного результата.",
    ],
  },
  {
    slug: "white_detox_shampun_protiv_perkhoti_250_ml",
    name: "White Detox Шампунь против перхоти, 250 мл",
    brand: "White Detox",
    category: "detox",
    image:
      "/assets/products/white-cosmetics/WH_Mokap_SHampun-protiv-perkhoti-250-ml.png",
    price: 2079,
    volume: "250 мл",
    sku: "WC3425",
    description:
      "Шампунь против перхоти бережно очищает кожу головы и помогает снизить проявление перхоти и зуда. Подходит для регулярного использования — волосы остаются свежими и ухоженными.",
    instructions: [
      "Нанесите на влажные волосы, вспеньте.",
      "Оставьте на 2-3 минуты, затем тщательно смойте.",
      "Для профилактики используйте 2-3 раза в неделю или по рекомендации барбера.",
    ],
  },
  {
    slug: "white_detox_shampun_protiv_vypadeniya_volos_250_ml",
    name: "White Detox Шампунь против выпадения волос, 250 мл",
    brand: "White Detox",
    category: "detox",
    image:
      "/assets/products/white-cosmetics/WH_Mokap_SHampun-protiv-vypadniya-250-ml.png",
    price: 2079,
    volume: "250 мл",
    sku: "WC3423",
    description:
      "Шампунь против выпадения волос укрепляет волосы от корней и поддерживает баланс кожи головы. Мягкая формула подходит для частого мытья — волосы выглядят плотнее и здоровее.",
    instructions: [
      "Нанесите на влажные волосы, вспеньте массирующими движениями.",
      "Оставьте на 2-3 минуты для воздействия активных компонентов.",
      "Смойте тёплой водой. Для усиления эффекта используйте тоник линейки White Detox.",
    ],
  },
  {
    slug: "white_detox_tonik_protiv_perkhoti_100_ml",
    name: "White Detox Тоник против перхоти, 100 мл",
    brand: "White Detox",
    category: "detox",
    image:
      "/assets/products/white-cosmetics/Mockup_Tonik-protiv-perkhoti.png",
    price: 2270,
    volume: "100 мл",
    sku: "WC3427",
    description:
      "Тоник против перхоти дополняет шампунь линейки White Detox — успокаивает кожу головы, снижает зуд и помогает поддерживать чистоту между мытьём.",
    instructions: [
      "Нанесите на чистую сухую или слегка влажную кожу головы.",
      "Распределите по пробору и вмассируйте 1-2 минуты.",
      "Не смывайте. Используйте после мытья или между процедурами.",
    ],
  },
  {
    slug: "white_shampun_dlya_volos_250_ml",
    name: "WHITE Шампунь для волос, 250 мл",
    brand: "WHITE",
    category: "shampoos",
    image:
      "/assets/products/white-cosmetics/SHamp250.png",
    price: 627,
    volume: "250 мл",
    sku: "WC0004",
  },
  {
    slug: "white_shampun_dlya_volos_5_l",
    name: "WHITE Шампунь для волос, 5 л",
    brand: "WHITE",
    category: "shampoos",
    image:
      "/assets/products/white-cosmetics/SHamp5000.png",
    price: 5492,
    volume: "5 л",
  },
  {
    slug: "white_shampun_dlya_volos_100_ml",
    name: "WHITE Шампунь для волос, 100 мл",
    brand: "WHITE",
    category: "shampoos",
    image:
      "/assets/products/white-cosmetics/SHamp100.png",
    price: 337,
    volume: "100 мл",
  },
  {
    slug: "white_shampun_dlya_volos_1000_ml",
    name: "WHITE Шампунь для волос, 1000 мл",
    brand: "WHITE",
    category: "shampoos",
    image:
      "/assets/products/white-cosmetics/SHamp1000.png",
    price: 1538,
    volume: "1000 мл",
  },
  {
    slug: "white_nesmyvaemyy_krem_sprey_dlya_volos_100_ml",
    name: "WHITE Несмываемый крем-спрей для волос, 100 мл",
    brand: "WHITE",
    category: "conditioners",
    image:
      "/assets/products/white-cosmetics/Krem-sprey-dlya-volos-100ml.png",
    price: 690,
    volume: "100 мл",
  },
  {
    slug: "white_konditsioner_dlya_volos_250_ml",
    name: "WHITE Кондиционер для волос, 250 мл",
    brand: "WHITE",
    category: "conditioners",
    image:
      "/assets/products/white-cosmetics/Konditsioner250.png",
    price: 627,
    volume: "250 мл",
    sku: "WC0011",
  },
  {
    slug: "white_nesmyvaemyy_krem_sprey_dlya_volos_250_ml",
    name: "WHITE Несмываемый крем-спрей для волос, 250 мл",
    brand: "WHITE",
    category: "conditioners",
    image:
      "/assets/products/white-cosmetics/Krem-sprey-dlya-volos-250ml.png",
    price: 1066,
    volume: "250 мл",
  },
  {
    slug: "white_konditsioner_dlya_volos_1000_ml",
    name: "WHITE Кондиционер для волос, 1000 мл",
    brand: "WHITE",
    category: "conditioners",
    image:
      "/assets/products/white-cosmetics/Konditsioner1000.png",
    price: 1563,
    volume: "1000 мл",
  },
  {
    slug: "white_konditsioner_dlya_volos_100_ml",
    name: "WHITE Кондиционер для волос, 100 мл",
    brand: "WHITE",
    category: "conditioners",
    image:
      "/assets/products/white-cosmetics/Konditsioner100.png",
    price: 326,
    volume: "100 мл",
  },
  {
    slug: "white_gel_parfyum_dlya_dusha_sport_energy_250_ml",
    name: "WHITE Гель-парфюм для душа \"Sport Energy\", 250 мл",
    brand: "WHITE",
    category: "shower-gels",
    image:
      "/assets/products/white-cosmetics/Sport250.png",
    price: 584,
    volume: "250 мл",
    sku: "WC2282",
  },
  {
    slug: "white_gel_parfyum_dlya_dusha_sport_energy_100_ml",
    name: "WHITE Гель-парфюм для душа \"Sport Energy\", 100 мл",
    brand: "WHITE",
    category: "shower-gels",
    image:
      "/assets/products/white-cosmetics/Sport100.png",
    price: 326,
    volume: "100 мл",
  },
  {
    slug: "white_gel_parfyum_dlya_dusha_cedar_wood_100_ml",
    name: "WHITE Гель-парфюм для душа \"Cedar Wood\", 100 мл",
    brand: "WHITE",
    category: "shower-gels",
    // No dedicated 100 ml mockup in assets — use volume-neutral Cedar Wood packshot
    // (copied from TSedarVud250.png). Do not point at *250* filename for this SKU.
    image: "/assets/products/white-cosmetics/Cedar-Wood.png",
    price: 326,
    volume: "100 мл",
  },
  {
    slug: "white_gel_parfyum_dlya_dusha_sport_energy_1000_ml",
    name: "WHITE Гель-парфюм для душа \"Sport Energy\", 1000 мл",
    brand: "WHITE",
    category: "shower-gels",
    image:
      "/assets/products/white-cosmetics/WH_Mokap_Gel-dlya-dusha-Sport-Energy-1000-ml.png",
    price: 1266,
    volume: "1000 мл",
  },
  {
    slug: "white_gel_parfyum_dlya_dusha_cedar_wood_1000_ml",
    name: "WHITE Гель-парфюм для душа \"Cedar Wood\", 1000 мл",
    brand: "WHITE",
    category: "shower-gels",
    image:
      "/assets/products/white-cosmetics/WH_Mokap_Gel-dlya-dusha-Cedar-wood-1000-ml.png",
    price: 1266,
    volume: "1000 мл",
  },
  {
    slug: "white_gel_parfyum_dlya_dusha_cedar_wood_250_ml",
    name: "WHITE Гель-парфюм для душа \"Cedar Wood\", 250 мл",
    brand: "WHITE",
    category: "shower-gels",
    image:
      "/assets/products/white-cosmetics/TSedarVud250.png",
    price: 584,
    volume: "250 мл",
  },
  {
    slug: "white_gel_dlya_britya_250_ml",
    name: "WHITE Гель для бритья, 250 мл",
    brand: "WHITE",
    category: "shaving",
    image:
      "/assets/products/white-cosmetics/Gel-dlya-britya-250.png",
    price: 967,
    volume: "250 мл",
    sku: "WC0008",
  },
  {
    slug: "white_krem_dlya_britya_250_ml",
    name: "WHITE Крем для бритья, 250 мл",
    brand: "WHITE",
    category: "shaving",
    image:
      "/assets/products/white-cosmetics/WH_Mokap_krem-dlya-britya-250-ml-_2_-_1_.png",
    price: 967,
    volume: "250 мл",
  },
  {
    slug: "white_gel_dlya_britya_1000_ml",
    name: "WHITE Гель для бритья, 1000 мл",
    brand: "WHITE",
    category: "shaving",
    image:
      "/assets/products/white-cosmetics/Gel-dlya-britya-1000.png",
    price: 1806,
    volume: "1000 мл",
  },
  {
    slug: "white_pudra_dlya_ukladki_volos_6_g_120_ml",
    name: "WHITE Пудра для укладки волос, 6 г (120 мл)",
    brand: "WHITE",
    category: "styling",
    image:
      "/assets/products/white-cosmetics/Pudra-dlya-ukladki.png",
    price: 936,
    volume: "6 г (120 мл)",
  },
  {
    slug: "white_pasta_dlya_ukladki_volos_100_ml",
    name: "WHITE Паста для укладки волос, 100 мл",
    brand: "WHITE",
    category: "styling",
    image:
      "/assets/products/white-cosmetics/Pasta100.png",
    price: 1111,
    volume: "100 мл",
    sku: "WC0027",
  },
  {
    slug: "white_zhidkaya_pudra_dlya_volos_100_ml",
    name: "WHITE Жидкая пудра для волос, 100 мл",
    brand: "WHITE",
    category: "styling",
    image:
      "/assets/products/white-cosmetics/ZHidkaya-pudra.png",
    price: 1111,
    volume: "100 мл",
  },
  {
    slug: "white_sprey_dlya_ukladki_volos_100_ml",
    name: "WHITE Спрей для укладки волос, 100 мл",
    brand: "WHITE",
    category: "styling",
    image:
      "/assets/products/white-cosmetics/Sprey-stayling-100ml.png",
    price: 774,
    volume: "100 мл",
  },
  {
    slug: "white_glina_dlya_ukladki_volos_100_ml",
    name: "WHITE Глина для укладки волос, 100 мл",
    brand: "WHITE",
    category: "styling",
    image:
      "/assets/products/white-cosmetics/Glina100.png",
    price: 1111,
    volume: "100 мл",
  },
  {
    slug: "white_sprey_dlya_ukladki_volos_250_ml",
    name: "WHITE Спрей для укладки волос, 250 мл",
    brand: "WHITE",
    category: "styling",
    image:
      "/assets/products/white-cosmetics/Sprey-stayling-250ml.png",
    price: 1111,
    volume: "250 мл",
  },
  {
    slug: "white_pasta_dlya_ukladki_volos_50_ml",
    name: "WHITE Паста для укладки волос, 50 мл",
    brand: "WHITE",
    category: "styling",
    image:
      "/assets/products/white-cosmetics/Pasta50.png",
    price: 722,
    volume: "50 мл",
  },
  {
    slug: "white_glina_dlya_ukladki_volos_50_ml",
    name: "WHITE Глина для укладки волос, 50 мл",
    brand: "WHITE",
    category: "styling",
    image:
      "/assets/products/white-cosmetics/Glina50.png",
    price: 722,
    volume: "50 мл",
  },
  {
    slug: "white_gruming_tonik_250_ml",
    name: "WHITE Груминг тоник, 250 мл",
    brand: "WHITE",
    category: "styling",
    image:
      "/assets/products/white-cosmetics/Gruming_tonik.png",
    price: 1766,
    volume: "250 мл",
  },
  {
    slug: "white_pudra_dlya_obema_s_dozatorom_6_g_30_ml",
    name: "WHITE Пудра для объема с дозатором, 6 г (30 мл)",
    brand: "WHITE",
    category: "styling",
    image:
      "/assets/products/white-cosmetics/Pudra-s-nosikom.png",
    price: 1239,
    volume: "6 г (30 мл)",
  },
  {
    slug: "white_pomada_dlya_ukladki_volos_100_ml",
    name: "WHITE Помада для укладки волос, 100 мл",
    brand: "WHITE",
    category: "styling",
    image:
      "/assets/products/white-cosmetics/Pomada100.png",
    price: 1111,
    volume: "100 мл",
  },
  {
    slug: "white_pudra_dlya_temnykh_volos_s_sifterom_60_ml",
    name: "WHITE Пудра для темных волос с сифтером, 60 мл",
    brand: "WHITE",
    category: "styling",
    image:
      "/assets/products/white-cosmetics/Pudra-dlya-temnykh-voloss-sifterom.png",
    price: 819,
    volume: "60 мл",
  },
  {
    slug: "white_pudra_dlya_ukladki_volos_s_sifterom_60_ml",
    name: "WHITE Пудра для укладки волос с сифтером, 60 мл",
    brand: "WHITE",
    category: "styling",
    image:
      "/assets/products/white-cosmetics/Pudra-dlya-volos-s-sifterom-png.png",
    price: 819,
    volume: "60 мл",
  },
  {
    slug: "white_pomada_dlya_ukladki_volos_50_ml",
    name: "WHITE Помада для укладки волос, 50 мл",
    brand: "WHITE",
    category: "styling",
    image:
      "/assets/products/white-cosmetics/Pomada50.png",
    price: 722,
    volume: "50 мл",
  },
];

export const productCatalog: Product[] = productSeeds.map((product) => ({
  ...product,
  inStock: product.inStock ?? true,
  description: buildDescription(product),
  instructions: buildInstructions(product),
}));

export function getProductBySlug(slug: string): Product | undefined {
  return productCatalog.find((p) => p.slug === slug);
}

export function getAllProductSlugs(): string[] {
  return productCatalog.map((p) => p.slug);
}

export function formatPrice(amount: number): string {
  return `${amount.toLocaleString("ru-RU")} ₽`;
}
