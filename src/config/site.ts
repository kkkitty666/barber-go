export const assets = {
  logoGold: "/assets/logo-pc.png",
  logoShield: "/assets/logo-pc.png",
  bookingQr: "/assets/booking-qr.png",
} as const;

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

  /** Онлайн-запись (YCLIENTS) */
  dikidiUrl: "https://n2371242.yclients.com",
  bookingLabel: "YCLIENTS",

  telegramBotUsername: "PC_barbershop_bot",
  telegramContact: "RS_Ilia",

  messengers: [
    { name: "Telegram", url: "https://t.me/RS_Ilia" },
    { name: "WhatsApp", url: "https://wa.me/79934582077" },
    // Max: задайте NEXT_PUBLIC_MAX_URL=https://max.ru/u/... иначе — главная с подсказкой по номеру.
    {
      name: "Max",
      url: process.env.NEXT_PUBLIC_MAX_URL?.trim() || "https://max.ru/",
      hint: "Max — найти по номеру +7 (993) 458-20-77",
    },
  ],

  social: [
    {
      id: "max",
      label: "Max",
      url: process.env.NEXT_PUBLIC_MAX_URL?.trim() || "https://max.ru/",
    },
    { id: "telegram", label: "Telegram", url: "https://t.me/RS_Ilia" },
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
    autoplayMs: 6500,
    slides: [
      {
        id: "first-visit",
        badge: "Акция для новых гостей",
        headline: "Первое посещение —",
        headlineAccent: "скидка 20%",
        description:
          "Приходите в PC Барбершоп впервые и получите скидку на стрижку или комплекс. Сообщите о акции при записи или перед оплатой.",
        cta: { label: "Записаться онлайн", href: "https://n2371242.yclients.com", external: true },
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
        cta: { label: "Выбрать время", href: "https://n2371242.yclients.com", external: true },
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
    {
      src: "/assets/hero-poster-rs.jpg",
      alt: "Атмосфера и стиль PC Барбершоп — Ростов-на-Дону",
    },
    {
      src: "/assets/flyer-interior.png",
      alt: "Интерьер PC Барбершоп на Батуринской",
    },
    {
      src: "/assets/works/work-2.png",
      alt: "Мужской фейд и чистая окантовка — работа мастера PC",
    },
  ],

  navLeft: [
    { label: "Услуги", href: "/uslugi" },
    { label: "Косметика", href: "/kosmetika" },
    { label: "Наши работы", href: "/raboty" },
  ],

  navRight: [
    { label: "Барберы", href: "/barbery" },
    { label: "Блог", href: "/blog" },
    { label: "Акции", href: "/akcii" },
    { label: "Контакты", href: "/kontakty" },
  ],

  nav: [
    { label: "Услуги", href: "/uslugi" },
    { label: "Косметика", href: "/kosmetika" },
    { label: "Наши работы", href: "/raboty" },
    { label: "Барберы", href: "/barbery" },
    { label: "Блог", href: "/blog" },
    { label: "Акции", href: "/akcii" },
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
          icon: "haircut",
        },
        {
          name: "Компаньон",
          subtitle: "Практичный минимализм",
          description:
            "Быстро, практично и без лишних вопросов. Стрижка машинкой (до двух насадок) или фейд, если верхняя часть не превышает 3 мм. Включает идеальную зачистку шейвером.",
          price: "1 000 ₽",
          duration: "45 мин",
          icon: "clipper",
        },
        {
          name: "Дипломат",
          subtitle: "Длинный стиль",
          description:
            "Работа ножницами для волос средней и большой длины. Грамотная архитектура формы, проработка текстуры и объема.",
          price: "1 800 ₽",
          duration: "75 мин",
          featured: true,
          icon: "combo-cut",
        },
        {
          name: "Чистая работа",
          subtitle: "Гладко начисто",
          description:
            "Тотальная зачистка. Классическое бритье головы опасной бритвой с проработкой каждого миллиметра для идеально гладкого результата.",
          price: "1 200 ₽",
          duration: "45 мин",
          icon: "shave-head",
        },
        {
          name: "Преемник",
          subtitle: "Юный джентльмен, 5–12 лет",
          description:
            "Грамотный старт. Аккуратная стрижка с учетом анатомии, возраста и указаний старших.",
          price: "1 500 ₽",
          duration: "45 мин",
          icon: "child",
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
          icon: "beard",
        },
        {
          name: "Магнат",
          subtitle: "Премиальное оформление бороды",
          description:
            "Высшая степень уважения к деталям. Комплексный уход: распаривание горячим полотенцем, детальное моделирование формы и четкая окантовка опасной бритвой.",
          price: "1 500 ₽",
          duration: "45 мин",
          featured: true,
          icon: "royal-shave",
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
          icon: "wash",
        },
        {
          name: "Безупречный статус",
          subtitle: "Ваксинг: комплекс 3 зоны",
          description:
            "Полная эстетическая зачистка. Удаление волос горячим воском сразу в трех зонах: нос, уши и межбровье.",
          price: "600 ₽",
          duration: "25 мин",
          icon: "combo-full",
        },
        {
          name: "Строгий контур",
          subtitle: "Окантовка",
          description:
            "Создание четких, безупречных линий на шее и висках. Быстрый способ освежить образ и поддержать строгий порядок между основными визитами.",
          price: "500 ₽",
          duration: "20 мин",
          icon: "shave-beard",
        },
        {
          name: "Чистая репутация",
          subtitle: "Укладка и стайлинг",
          description:
            "Финальный штрих, который завершает образ настоящего джентльмена. Профессиональная укладка с использованием премиальных средств.",
          price: "500 ₽",
          duration: "15 мин",
          icon: "styling",
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
    {
      id: "roman",
      name: "Роман",
      role: "Барбер",
      experience: "4 года опыта",
      photo: "/assets/logo-pc.png",
      bio: "Сильные стороны — классика и аккуратный фейд. Любит чёткие линии, спокойный сервис и стрижку «под задачу»: от офиса до выходного образа.",
      specialties: ["Компаньон", "Босс", "Строгий контур", "Кодекс"],
    },
    {
      id: "artem",
      name: "Артём",
      role: "Барбер",
      experience: "3 года опыта",
      photo: "/assets/logo-pc.png",
      bio: "Работает с длинным стилем и текстурой, помогает с укладкой и подбором домашнего ухода. Комфортно принимает и взрослых, и юных гостей.",
      specialties: ["Дипломат", "Преемник", "Чистая репутация", "Магнат"],
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
      "Стрижки, борода, уход, стиль и культура barbering — советы, разборы и истории от мастеров PC Барбершоп.",
    cta: "Читать блог",
    image: "/assets/works/work-1.png",
    imageAlt: "Бритьё головы и оформление бороды в PC Барбершоп",
  },

  about: {
    title: "О БАРБЕРШОПЕ",
    paragraphs: [
      "PC Барбершоп на Батуринской — мужское пространство, где стрижка, борода и укладка делаются с вниманием к деталям. Мы работаем по записи, без суеты: вы приходите за результатом, а не «просто подстричься».",
      "В команде — опытные барберы, премиальная косметика для укладки и атмосфера, в которой комфортно и впервые, и на постоянной основе. Запишитесь онлайн через YCLIENTS или загляните за средствами для домашнего ухода — соберём заказ к самовывозу.",
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
    title: "Барберы — PC Барбершоп",
    description: "Команда мастеров PC Барбершоп. Запись через YCLIENTS.",
  },
  blog: {
    title: "Блог — PC Барбершоп",
    description:
      "Интересная информация о мире barbering: стрижки, борода, уход и стиль от барберов PC Барбершоп.",
  },
  kontakty: {
    title: "Контакты — PC Барбершоп",
    description: "Адрес, часы работы и онлайн-запись PC Барбершоп. Ростов-на-Дону, Батуринская 165/13.",
  },
  raboty: {
    title: "Наши работы — PC Барбершоп",
    description: "Фото работ мастеров PC Барбершоп: стрижки, борода и мужской стиль.",
  },
  akcii: {
    title: "Акции — PC Барбершоп",
    description:
      "Действующие акции PC Барбершоп: скидки, комплексы и специальные предложения. Ростов-на-Дону.",
  },
} as const;
