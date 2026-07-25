export const assets = {
  logoGold: "/assets/logo-pc.png",
  logoShield: "/assets/logo-pc.png",
  bookingQr: "/assets/booking-qr.png",
} as const;

const BOOKING_URL =
  process.env.NEXT_PUBLIC_BOOKING_URL?.trim() || "https://n2371242.yclients.com";

const MAX_URL = process.env.NEXT_PUBLIC_MAX_URL?.trim() || "";

export const siteConfig = {
  name: "PC БАРБЕРШОП",
  tagline: "REBRAND YOURSELF",
  heroSlogan: "ТВОЙ ОБРАЗ. ТВОИ ПРАВИЛА.",
  subSlogan: "СТИЛЬ · ХАРАКТЕР · УВЕРЕННОСТЬ",
  motto: "ЧЕСТЬ · СТИЛЬ · ТРАДИЦИЯ",
  footerSlogan: "ТВОЙ ОБРАЗ — НАША РАБОТА",
  qualityTagline: "КАЧЕСТВО В ДЕТАЛЯХ",

  phone: "+7 (993) 458-20-77",
  phoneRaw: "79934582077",
  hours: "с 09:00 до 20:00",
  hoursLabel: "РАБОТАЕМ С 9:00 ДО 20:00",
  city: "Ростов-на-Дону",
  address: "Батуринская 165/13",
  fullAddress: "Ростов-на-Дону, Батуринская 165/13",
  addressLabel: "АДРЕС",
  mapsQuery: "Ростов-на-Дону, Батуринская 165/13",
  /** Точка организации на Яндекс.Картах (poi) */
  mapCoords: { lat: 47.199634, lon: 39.645794 },
  /** z=19 is too tight — widget often looks like a blank dotted white pane */
  mapZoom: 16,
  mapOrgId: "109284389706",
  mapsUrl:
    "https://yandex.ru/maps/39/rostov-na-donu/?ll=39.646212%2C47.199774&mode=poi&poi%5Bpoint%5D=39.645794%2C47.199634&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D109284389706&z=16",

  /** Онлайн-запись (YCLIENTS). Переопределение: NEXT_PUBLIC_BOOKING_URL */
  bookingUrl: BOOKING_URL,
  /** @deprecated используйте bookingUrl */
  dikidiUrl: BOOKING_URL,
  bookingLabel: "YCLIENTS",

  telegramBotUsername: "PC_barbershop_bot",
  telegramContact: "RS_Ilia",

  messengers: [
    { name: "Telegram", url: "https://t.me/RS_Ilia" },
    { name: "WhatsApp", url: "https://wa.me/79934582077" },
    {
      name: "Instagram",
      url: "https://www.instagram.com/rs_rebrand_yourself/",
    },
    ...(MAX_URL
      ? [{ name: "Max", url: MAX_URL, hint: "Max — найти по номеру +7 (993) 458-20-77" }]
      : []),
  ],

  social: [
    {
      id: "instagram",
      label: "Instagram",
      url: "https://www.instagram.com/rs_rebrand_yourself/",
    },
    { id: "telegram", label: "Telegram", url: "https://t.me/RS_Ilia" },
    ...(MAX_URL ? [{ id: "max", label: "Max", url: MAX_URL }] : []),
  ],

  firstVisitPromo: {
    discountPercent: 20,
    terms: [
      "Скидка действует только при первом посещении PC Барбершоп.",
      "Не суммируется с другими акциями и комплексными предложениями.",
      "Сообщите администратору или барберу о скидке при записи или перед оплатой.",
      "Акция действует до отдельного уведомления на сайте.",
    ],
  },

  promoCarousel: {
    autoplayMs: 7000,
    slides: [
      {
        id: "first-visit",
        badge: "Акция для новых гостей",
        headline: "Первое посещение —",
        headlineAccent: "скидка 20%",
        description:
          "Приходите в PC Барбершоп впервые и получите скидку на стрижку или комплекс. Сообщите о акции при записи или перед оплатой.",
        cta: { label: "Записаться онлайн", href: BOOKING_URL, external: true },
        image: "/assets/works/work-2.png",
        imageAlt: "Мужская стрижка с высоким фейдом в PC Барбершоп",
      },
      {
        id: "online-booking",
        badge: "Удобная запись",
        headline: "Онлайн-запись",
        headlineAccent: "без ожидания",
        description:
          "Выбирайте мастера и время в YCLIENTS — приходите в назначенный час без очереди. Работаем с 9:00 до 20:00 на Батуринской.",
        cta: { label: "Выбрать время", href: BOOKING_URL, external: true },
        image: "/assets/hero-poster-rs.jpg",
        imageAlt: "Постер PC Барбершоп — онлайн-запись и контакты",
      },
      {
        id: "cosmetics",
        badge: "Косметика в шопе",
        headline: "White Cosmetics",
        headlineAccent: "с самовывозом",
        description:
          "Линейка White Detox — профессиональный уход за волосами. Соберите заказ на сайте — заберите в барбершоп после стрижки.",
        cta: { label: "Открыть каталог", href: "/kosmetika", external: false },
        image: "/assets/products/white-detox/deep-cleansing-shampoo.png",
        imageAlt: "White Detox — шампунь глубокого очищения",
        variant: "product",
      },
      {
        id: "father-son",
        badge: "Комплекс",
        headline: "Отец и сын —",
        headlineAccent: "стрижка вместе",
        description:
          "Приходите с ребёнком: услуга «Преемник» для юных джентльменов 5–12 лет. Запишитесь на удобное время для двоих.",
        cta: { label: "Смотреть услуги", href: "/uslugi", external: false },
        image: "/assets/works/work-3.png",
        imageAlt: "Детская стрижка в PC Барбершоп",
      },
    ],
  },

  worksGallery: [
    {
      src: "/assets/works/work-1.png",
      alt: "Бритьё головы и оформление бороды — PC Барбершоп",
    },
    {
      src: "/assets/works/work-2.png",
      alt: "Короткая стрижка с высоким фейдом — PC Барбершоп",
    },
    {
      src: "/assets/works/work-3.png",
      alt: "Детская стрижка в PC Барбершоп",
    },
  ],

  navLeft: [
    { label: "Услуги", href: "/uslugi" },
    { label: "Косметика", href: "/kosmetika" },
    { label: "Акции", href: "/akcii" },
    { label: "Блог", href: "/blog" },
  ],

  navRight: [
    { label: "Барберы", href: "/barbery" },
    { label: "Работы", href: "/raboty" },
    { label: "Отзывы", href: "/otzyvy" },
    { label: "Контакты", href: "/kontakty" },
  ],

  nav: [
    { label: "Услуги", href: "/uslugi" },
    { label: "Косметика", href: "/kosmetika" },
    { label: "Акции", href: "/akcii" },
    { label: "Блог", href: "/blog" },
    { label: "Барберы", href: "/barbery" },
    { label: "Работы", href: "/raboty" },
    { label: "Отзывы", href: "/otzyvy" },
    { label: "Контакты", href: "/kontakty" },
  ],

  priceList: [
    {
      category: "СТРИЖКИ",
      description: "Классика, минимализм и длинный стиль",
      items: [
        {
          name: "Босс",
          subtitle: "Мужская классика",
          description:
            "Традиционный стиль для людей, принимающих решения. Подбор формы с учетом анатомии головы, мытье и строгая укладка.",
          price: "1 500 ₽",
          duration: "60 мин",
          featured: true,
        },
        {
          name: "Компаньон",
          subtitle: "Практичный минимализм",
          description:
            "Быстро, практично и без лишних вопросов. Стрижка машинкой (до двух насадок) или фейд, если верхняя часть не превышает 3 мм. Включает идеальную зачистку шейвером.",
          price: "1 000 ₽",
          duration: "45 мин",
        },
        {
          name: "Дипломат",
          subtitle: "Длинный стиль",
          description:
            "Работа ножницами для волос средней и большой длины. Грамотная архитектура формы, проработка текстуры и объема.",
          price: "1 800 ₽",
          duration: "75 мин",
          featured: true,
        },
        {
          name: "Чистая работа",
          subtitle: "Гладко начисто",
          description:
            "Тотальная зачистка. Классическое бритье головы опасной бритвой с проработкой каждого миллиметра для идеально гладкого результата.",
          price: "1 200 ₽",
          duration: "45 мин",
        },
        {
          name: "Преемник",
          subtitle: "Юный джентльмен, 5–12 лет",
          description:
            "Грамотный старт. Аккуратная стрижка с учетом анатомии, возраста и указаний старших.",
          price: "1 500 ₽",
          duration: "45 мин",
        },
      ],
    },
    {
      category: "БОРОДА И ДЕТАЛИ",
      description: "Скульптуринг и премиальное оформление",
      items: [
        {
          name: "Кодекс",
          subtitle: "Скульптуринг бороды",
          description:
            "Поддержание фасада в строгом порядке. Стрижка, создание аккуратной формы и четких линий под ваш тип лица.",
          price: "900 ₽",
          duration: "30 мин",
        },
        {
          name: "Магнат",
          subtitle: "Премиальное оформление бороды",
          description:
            "Высшая степень уважения к деталям. Комплексный уход: распаривание горячим полотенцем, детальное моделирование формы и четкая окантовка опасной бритвой.",
          price: "1 500 ₽",
          duration: "45 мин",
          featured: true,
        },
      ],
    },
    {
      category: "ДЕТАЛИ",
      description: "Ваксинг, окантовка и стайлинг",
      items: [
        {
          name: "Устранение улик",
          subtitle: "Ваксинг: 1 зона",
          description:
            "Удаление нежелательных волос горячим воском на одной зоне по вашему выбору: нос, уши или межбровье.",
          price: "300 ₽",
          duration: "15 мин",
        },
        {
          name: "Безупречный статус",
          subtitle: "Ваксинг: комплекс 3 зоны",
          description:
            "Полная эстетическая зачистка. Удаление волос горячим воском сразу в трех зонах: нос, уши и межбровье.",
          price: "600 ₽",
          duration: "25 мин",
        },
        {
          name: "Строгий контур",
          subtitle: "Окантовка",
          description:
            "Создание четких, безупречных линий на шее и висках. Быстрый способ освежить образ и поддержать строгий порядок между основными визитами.",
          price: "500 ₽",
          duration: "20 мин",
        },
        {
          name: "Чистая репутация",
          subtitle: "Укладка и стайлинг",
          description:
            "Финальный штрих, который завершает образ настоящего джентльмена. Профессиональная укладка с использованием премиальных средств.",
          price: "500 ₽",
          duration: "15 мин",
        },
      ],
    },
  ],

  barbers: [
    {
      id: "ilya",
      name: "Илья",
      role: "Барбер",
      experience: "5 лет опыта",
      photo: "/assets/barbers/ilya.jpg",
      bio: "Создаёт современные мужские образы с акцентом на детали и индивидуальный стиль. Работает со стрижками, бородой и укладкой — поможет подобрать look, который подчеркнёт характер.",
      specialties: ["Босс", "Дипломат", "Кодекс", "Магнат", "Fade"],
    },
  ],

  blogPage: {
    heroImage: "/assets/flyer-interior.png",
    subtitle:
      "Последние новости и актуальная информация из мира мужских стрижек, barbering и настоящего стиля",
    brandTagline: "Барбершоп с характером · Ростов-на-Дону",
  },

  blogPromo: {
    label: "БЛОГ",
    headline: "ВСЁ ИНТЕРЕСНОЕ",
    headlineLine2: "О МИРЕ БАРБЕРИНГА",
    description:
      "Стрижки, борода, уход, стиль и культура barbering — советы, разборы и истории от барбера PC Барбершоп.",
    cta: "Читать блог",
    image: "/assets/works/work-1.png",
    imageAlt: "Бритьё головы и оформление бороды в PC Барбершоп",
  },

  about: {
    title: "О БАРБЕРШОПЕ",
    paragraphs: [
      "PC Барбершоп на Батуринской — мужское пространство, где стрижка, борода и укладка делаются с вниманием к деталям. Мы работаем по записи, без суеты: вы приходите за результатом, а не «просто подстричься».",
      "За креслом — барбер Илья, премиальная косметика для укладки и атмосфера, в которой комфортно и впервые, и на постоянной основе. Запишитесь онлайн через YCLIENTS или загляните за средствами для домашнего ухода — соберём заказ к самовывозу.",
    ],
  },

  reviews: {
    title: "ОТЗЫВЫ",
    subtitle: "ГОСТИ О PC БАРБЕРШОП",
    rating: 4.6,
    ratingCount: 19,
    ratingLabel: "на Яндекс.Картах",
    ctaLabel: "Смотреть на Яндекс.Картах",
    ctaUrl: "https://yandex.ru/maps/org/rs/109284389706/reviews/",
    /** Seed/fallback; live list comes from data/reviews.json or Supabase via sync. */
    items: [
      {
        id: "yandex-andrey",
        name: "Андрей",
        rating: 5,
        date: "23 июля 2026",
        text: "Топ барбер Илья профессионал своего дела, чувствуется опыт. Очень умело подбирает стрижки под любой стиль и образ. Дает толковые рекомендации по уходу за волосами, укладке. Впечатляет чистота, уют и сервис в барбершопе.",
      },
      {
        id: "yandex-nikita",
        name: "Никита Полуэктов",
        rating: 5,
        date: "23 июля 2026",
        text: "Илья лучший мастер, только к нему всегда хожу, просто мастер от бога и помещение кайфовое.",
      },
      {
        id: "yandex-anastasia",
        name: "Анастасия",
        rating: 5,
        date: "13 июля 2026",
        text: "Отправила мужа на стрижку в барбершоп «РС» и осталась очень довольна результатом! Муж вернулся в отличном настроении, сказал, что атмосфера очень приятная, мастер внимательно выслушал все пожелания и сделал именно так, как он хотел. Стрижка получилась аккуратной и стильной. Однозначно рекомендуем!",
      },
    ],
  },

  seo: {
    title: "PC Барбершоп — мужские стрижки и борода | Ростов-на-Дону",
    description:
      "PC Барбершоп — мужские стрижки, борода и стайлинг. Ростов-на-Дону, Батуринская 165/13. Работаем с 9:00 до 20:00. Онлайн-запись и заказ косметики с самовывозом.",
  },
} as const;

export const pageSeo = {
  uslugi: {
    title: "Прайс-лист — PC Барбершоп",
    description:
      "Актуальные цены: Босс, Компаньон, Дипломат, Кодекс, Магнат и другие услуги PC Барбершоп. Ростов-на-Дону.",
  },
  kosmetika: {
    title: "Косметика — PC Барбершоп",
    description: "White Cosmetics — линейка White Detox. Заказ с самовывозом из PC Барбершоп.",
  },
  barbery: {
    title: "Барбер — PC Барбершоп",
    description: "Барбер Илья — PC Барбершоп. Запись через YCLIENTS.",
  },
  blog: {
    title: "Блог — PC Барбершоп",
    description:
      "Интересная информация о мире barbering: стрижки, борода, уход и стиль от барбера PC Барбершоп.",
  },
  kontakty: {
    title: "Контакты — PC Барбершоп",
    description: "Адрес, часы работы и онлайн-запись PC Барбершоп. Ростов-на-Дону, Батуринская 165/13.",
  },
  raboty: {
    title: "Наши работы — PC Барбершоп",
    description: "Фото работ барбера PC Барбершоп: стрижки, борода и мужской стиль.",
  },
  otzyvy: {
    title: "Отзывы — PC Барбершоп",
    description:
      "Отзывы гостей PC Барбершоп на Батуринской. Рейтинг и свежие впечатления с Яндекс.Карт.",
  },
  akcii: {
    title: "Акции — PC Барбершоп",
    description:
      "Действующие акции PC Барбершоп: скидки, комплексы и специальные предложения. Ростов-на-Дону.",
  },
} as const;
