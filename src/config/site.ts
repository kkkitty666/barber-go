export const assets = {
  logoGold: "/assets/logo-silver.png",
  logoShield: "/assets/logo-shield.png",
  lanyardBack: "/assets/lanyard/logo-back.png",
  lanyardBand: "/assets/lanyard/lanyard.png",
} as const;

export const siteConfig = {
  name: "PC БАРБЕРШОП",
  tagline: "REBRAND YOURSELF",
  heroSlogan: "ТВОЙ ОБРАЗ. ТВОИ ПРАВИЛА.",
  subSlogan: "СТИЛЬ · ХАРАКТЕР · УВЕРЕННОСТЬ",
  motto: "ЧЕСТЬ · СТИЛЬ · ТРАДИЦИЯ",
  footerSlogan: "ТВОЙ ОБРАЗ — НАША РАБОТА",
  qualityTagline: "КАЧЕСТВО В ДЕТАЛЯХ",

  phone: "+7 (995) 614-76-93",
  phoneRaw: "79956147693",
  hours: "с 09:00 до 20:00",
  hoursLabel: "РАБОТАЕМ С 9:00 ДО 20:00",
  city: "Ростов-на-Дону",
  address: "Батуринская 165/13",
  fullAddress: "Ростов-на-Дону, Батуринская 165/13",
  addressLabel: "АДРЕС",
  mapsQuery: "Ростов-на-Дону, Батуринская 165/13",
  mapCoords: { lat: 47.2009, lon: 39.6461 },
  mapZoom: 17,

  // TODO: заменить на прямую ссылку записи салона в Dikidi
  dikidiUrl: "https://dikidi.net/",

  telegramBotUsername: "PC_barbershop_bot",

  messengers: [
    { name: "WhatsApp", url: "https://wa.me/79956147693" },
    { name: "Telegram", url: "https://t.me/PC_barbershop_bot" },
    { name: "Max", url: "https://max.ru/" },
  ],

  social: [
    { id: "max", label: "Max", url: "https://max.ru/" },
    { id: "telegram", label: "Telegram", url: "https://t.me/PC_barbershop_bot" },
    // TODO: заменить на реальный профиль
    { id: "instagram", label: "Instagram", url: "https://instagram.com/pcbarbershop" },
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

  worksGallery: [
    {
      src: "/assets/works/work-4.jpg",
      alt: "Мужская стрижка — работа барбера PC Барбершоп",
    },
    {
      src: "/assets/works/work-5.jpg",
      alt: "Детская стрижка в PC Барбершоп",
    },
    { src: "/assets/works/work-1.jpg", alt: "Мужская стрижка — работа мастера PC Барбершоп" },
    { src: "/assets/works/work-2.jpg", alt: "Стрижка и оформление бороды" },
    { src: "/assets/works/work-3.jpg", alt: "Мужской образ после стрижки" },
  ],

  navLeft: [
    { label: "Услуги", href: "/uslugi" },
    { label: "Косметика", href: "/kosmetika" },
    { label: "Наши работы", href: "/raboty" },
  ],

  navRight: [
    { label: "Барберы", href: "/barbery" },
    { label: "Блог", href: "/blog" },
    { label: "Контакты", href: "/kontakty" },
  ],

  nav: [
    { label: "Услуги", href: "/uslugi" },
    { label: "Косметика", href: "/kosmetika" },
    { label: "Наши работы", href: "/raboty" },
    { label: "Барберы", href: "/barbery" },
    { label: "Блог", href: "/blog" },
    { label: "Контакты", href: "/kontakty" },
  ],

  priceList: [
    {
      category: "СТРИЖКИ",
      description: "Классика, fade и современные мужские образы",
      items: [
        { name: "Мужская стрижка", price: "1 500 ₽", duration: "60 мин", featured: true, icon: "haircut" },
        { name: "Стрижка машинкой", price: "1 200 ₽", duration: "45 мин", icon: "clipper" },
        { name: "Детская стрижка", price: "1 000 ₽", duration: "45 мин", icon: "child" },
        { name: "Стрижка + укладка", price: "1 800 ₽", duration: "75 мин", featured: true, icon: "combo-cut" },
        { name: "Камуфляж седины", price: "1 500 ₽", duration: "60 мин", icon: "gray-cover" },
      ],
    },
    {
      category: "БОРОДА И БРИТЬЁ",
      description: "Контур, форма и ритуальное бритьё",
      items: [
        { name: "Стрижка бороды", price: "800 ₽", duration: "30 мин", icon: "beard" },
        { name: "Стрижка усов и бороды", price: "1 100 ₽", duration: "45 мин", featured: true, icon: "beard-mustache" },
        { name: "Бритьё бороды", price: "1 200 ₽", duration: "40 мин", icon: "shave-beard" },
        { name: "Бритьё головы", price: "1 500 ₽", duration: "45 мин", icon: "shave-head" },
        { name: "Королевское бритьё", price: "2 000 ₽", duration: "60 мин", featured: true, icon: "royal-shave" },
      ],
    },
    {
      category: "УХОД И СТАЙЛИНГ",
      description: "Финальный штрих и премиальные средства",
      items: [
        { name: "Укладка / стайлинг", price: "500 ₽", duration: "15 мин", icon: "styling" },
        { name: "Мытьё головы", price: "300 ₽", duration: "15 мин", icon: "wash" },
        { name: "Окрашивание бороды", price: "1 200 ₽", duration: "45 мин", icon: "beard-dye" },
        { name: "Комплекс: стрижка + борода", price: "2 200 ₽", duration: "90 мин", featured: true, icon: "combo-full" },
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
      specialties: ["Мужские стрижки", "Борода", "Стайлинг", "Fade"],
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
    image: "/assets/flyer-interior.png",
    imageAlt: "Барбер за работой в PC Барбершоп",
  },

  about: {
    title: "О БАРБЕРШОПЕ",
    paragraphs: [
      "PC Барбершоп на Батуринской — мужское пространство, где стрижка, борода и укладка делаются с вниманием к деталям. Мы работаем по записи, без суеты: вы приходите за результатом, а не «просто подстричься».",
      "В команде — опытные барберы, премиальная косметика для укладки и атмосфера, в которой комфортно и впервые, и на постоянной основе. Запишитесь онлайн или загляните за средствами для домашнего ухода — соберём заказ к самовывозу.",
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
    description: "Актуальные цены на мужские стрижки, бороду, бритьё и уход в PC Барбершоп. Ростов-на-Дону.",
  },
  kosmetika: {
    title: "Косметика — PC Барбершоп",
    description: "Премиальные средства для укладки и ухода. Заказ с самовывозом из PC Барбершоп.",
  },
  barbery: {
    title: "Барберы — PC Барбершоп",
    description: "Команда мастеров PC Барбершоп. Запись через Dikidi.",
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
} as const;
