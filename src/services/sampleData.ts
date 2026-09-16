import { Product, Category, PromoDiscount, StoreSettings } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'electronics',
    name: 'إلكترونيات وهواتف',
    iconName: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    productCount: 8
  },
  {
    id: 'perfumes',
    name: 'عطور وبخور',
    iconName: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
    productCount: 6
  },
  {
    id: 'fashion',
    name: 'أزياء وملابس',
    iconName: 'Shirt',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80',
    productCount: 5
  },
  {
    id: 'watches',
    name: 'ساعات وإكسسوارات',
    iconName: 'Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    productCount: 7
  },
  {
    id: 'home',
    name: 'المنزل والمطبخ',
    iconName: 'Home',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80',
    productCount: 4
  },
  {
    id: 'beauty',
    name: 'عناية وجمال',
    iconName: 'Heart',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
    productCount: 5
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'هاتف سامسونج جالاكسي S24 ألترا (512 جيجابايت)',
    category: 'إلكترونيات وهواتف',
    price: 4950,
    originalPrice: 5350,
    description: 'الهاتف الأقوى مع قلم S Pen مدمج، معالج سنابدراجون الجيل الثالث، كاميرا بدقة 200 ميجابكسل، وشاشة أموليد ديناميكية مقاومة للانعكاس. ضمان رسمي 12 شهراً لدى وكيل ليبيا.',
    features: [
      'ذاكرة تخزين داخلية 512 جيجابايت مع 12 جيجابايت رام',
      'إطار تيتانيوم فاخر ومقاوم للصدمات',
      'دعم شبكات الجيل الخامس 5G في ليبيا (ليبيانا والمدار)',
      'بطارية ضخمة 5000 مللي أمبير مع شحن فائق السرعة',
      'قلم S-Pen مدمج لكتابة الملاحظات والرسم'
    ],
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 14,
    rating: 4.9,
    reviewCount: 38,
    isFeatured: true,
    isNew: true,
    discountPercentage: 7,
    variants: [
      { id: 'v-color', name: 'اللون', options: ['تيتانيوم رمادي', 'تيتانيوم أسود', 'تيتانيوم بنفسجي'] },
      { id: 'v-storage', name: 'السعة', options: ['256 جيجابايت', '512 جيجابايت'] }
    ],
    sku: 'OKZ-SAM-S24U',
    tags: ['سامسونج', 'هواتف', 'ألترا', '5G', 'طرابلس', 'بنغازي']
  },
  {
    id: 'prod-2',
    name: 'عطر ليالي عكاظ الملكي الفاخر (100 مل)',
    category: 'عطور وبخور',
    price: 320,
    originalPrice: 400,
    description: 'توليفة شرقية ساحرة تمزج بين دهن العود الكمبودي النقي، نفحات العنبر الدافئ، ولمسات من الورد والزعفران الجبلي. ثبات يدوم أكثر من 48 ساعة وفواحان استثنائي للمناسبات الراقية.',
    features: [
      'تركيز عالي جداً Extrait de Parfum',
      'ثبات وفواحان فائق يدوم لأيام',
      'زجاجة كريستالية معبأة في علبة قطيفة فاخرة مناسبة للإهداء',
      'مناسب للجنسين بلمسة فخامة شرقية أصيلة'
    ],
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 28,
    rating: 4.8,
    reviewCount: 52,
    isFeatured: true,
    isNew: false,
    discountPercentage: 20,
    variants: [
      { id: 'v-size', name: 'الحجم', options: ['50 مل', '100 مل'] }
    ],
    sku: 'OKZ-PRF-OKZ1',
    tags: ['عطور', 'عود', 'عنبر', 'رجالي', 'نسائي']
  },
  {
    id: 'prod-3',
    name: 'ساعة ذكية أبل سيريز 9 (Apple Watch Series 9 GPS)',
    category: 'ساعات وإكسسوارات',
    price: 1850,
    originalPrice: 2050,
    description: 'شاشة ساطعة تعمل دائماً، معالج S9 الجديد مع إيماءة الضغط المزدوج المبتكرة، حساسات متطورة لتخطيط القلب وقياس الأكسجين، ومقاومة تامة للماء حتى عمق 50 متراً.',
    features: [
      'شاشة ريتنا فائقة السطوع حتى 2000 شمعة',
      'ميزة النقر المزدوج الذكية بدون لمس الشاشة',
      'تتبع اللياقة والتمارين والأنشطة اليومية بدقة متناهية',
      'سوار رياضي سيليكون مريح قابل للتغيير'
    ],
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 9,
    rating: 4.7,
    reviewCount: 24,
    isFeatured: true,
    isNew: true,
    discountPercentage: 10,
    variants: [
      { id: 'v-size', name: 'المقاس', options: ['41 ملم', '45 ملم'] },
      { id: 'v-color', name: 'اللون', options: ['سماوي نجمي', 'سواد منتصف الليل', 'فضي'] }
    ],
    sku: 'OKZ-WCH-AW9',
    tags: ['ساعات', 'أبل', 'ذكية', 'رياضة']
  },
  {
    id: 'prod-4',
    name: 'سماعات سوني اللاسلكية WH-1000XM5 عازلة للضوضاء',
    category: 'إلكترونيات وهواتف',
    price: 1420,
    originalPrice: 1580,
    description: 'أفضل نظام إلغاء ضوضاء نشط مع معالج صوتي متطور، جودة صوت نقية فائقة الوضوح، وميكروفونات مخصصة لعزل الضوضاء المحيطة لمكالمات فائقة الصفاء.',
    features: [
      'عزل صوتي فائق التطور مع 8 ميكروفونات',
      'عمر بطارية يصل إلى 30 ساعة مع الشحن السريع',
      'تصميم خفيف ومريح لجلسات الاستماع الطويلة',
      'اتصال متعدد بنقطتين في نفس الوقت'
    ],
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 16,
    rating: 4.9,
    reviewCount: 41,
    isFeatured: false,
    isNew: true,
    discountPercentage: 10,
    variants: [
      { id: 'v-color', name: 'اللون', options: ['أسود كلاسيكي', 'فضي بلاتيني'] }
    ],
    sku: 'OKZ-AUD-SNY5',
    tags: ['سماعات', 'سوني', 'صوتيات', 'موسيقى']
  },
  {
    id: 'prod-5',
    name: 'بدلة كاجوال رجالية أنيقة - قطن تركي ممتاز',
    category: 'أزياء وملابس',
    price: 340,
    originalPrice: 420,
    description: 'طقم أنيق وعصري مكون من جاكيت وبنطال بتصميم عصري ملائم للعمل والمناسبات اليومية في ليبيا. مصنوع من أجود أنواع القطن التركي مع بطانة ناعمة ومريحة.',
    features: [
      'خامة قطنية تركية 100% مع معالجة ضد التجعد',
      'قصّة عصرية متناسقة (Modern Fit)',
      'جيوب عملية داخلية وخارجية',
      'سهلة الكي والغسيل'
    ],
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 22,
    rating: 4.6,
    reviewCount: 19,
    isFeatured: false,
    isNew: false,
    discountPercentage: 19,
    variants: [
      { id: 'v-size', name: 'المقاس', options: ['M (48)', 'L (50)', 'XL (52)', 'XXL (54)'] },
      { id: 'v-color', name: 'اللون', options: ['كحلي داكن', 'رمادي فحمي', 'بيج صحراوي'] }
    ],
    sku: 'OKZ-FSH-SUIT',
    tags: ['ملابس', 'رجالي', 'أناقة', 'تركي']
  },
  {
    id: 'prod-6',
    name: 'ماكينة تحضير قهوة الإسبريسو ديلونجي ديديكا الأصلية',
    category: 'المنزل والمطبخ',
    price: 980,
    originalPrice: 1150,
    description: 'استمتع بأشهى كوب إسبريسو وكابتشينو برغوة كريمية غنية في منزلك. مضخة ضغط 15 بار إيطالية وتصميم مدمج من الستانلس ستيل بعرض 15 سم فقط ليلائم أي مطبخ.',
    features: [
      'مضخة إيطالية احترافية بقوة ضغط 15 بار',
      'ذراع تبخير حليب احترافي لرسم اللاتيه والكابتشينو',
      'تسخين سريع بنظام ثيرموبلوك في 40 ثانية',
      'هيكل متين من الستانلس ستيل المقاوم للصدأ'
    ],
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 11,
    rating: 4.8,
    reviewCount: 33,
    isFeatured: true,
    isNew: false,
    discountPercentage: 15,
    variants: [
      { id: 'v-color', name: 'اللون', options: ['فضي معدني', 'أحمر لامع', 'أسود غير لامع'] }
    ],
    sku: 'OKZ-HME-DLN1',
    tags: ['قهوة', 'إسبريسو', 'ديلونجي', 'مطبخ']
  },
  {
    id: 'prod-7',
    name: 'ساعة يد كلاسيكية رجالية سويسرية - ستانلس ستيل وذهب',
    category: 'ساعات وإكسسوارات',
    price: 750,
    originalPrice: 890,
    description: 'تحفة هندسية تجمع بين الدقة السويسرية والجمال الكلاسيكي. قرص مذهب مع زجاج ياقوتي مضاد للخدش ومقاومة للماء، مع علبة هدايا أصلية وضمان لمدة عامين.',
    features: [
      'زجاج ياقوتي (Sapphire Crystal) مضاد للخدش',
      'حزام ستانلس ستيل 316L غير قابل للصدأ مع طلاء ذهبي متين',
      'مقاومة للماء حتى 100 متر (10 بار)',
      'عرض التاريخ وتأثير فوسفوري في الظلام'
    ],
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 7,
    rating: 4.9,
    reviewCount: 15,
    isFeatured: false,
    isNew: false,
    discountPercentage: 15,
    sku: 'OKZ-WCH-SW1',
    tags: ['ساعات', 'كلاسيك', 'سويسري', 'هدايا']
  },
  {
    id: 'prod-8',
    name: 'جهاز تصفيف وتجفيف الشعر دايسون إير wrap الاحترافي',
    category: 'عناية وجمال',
    price: 2600,
    originalPrice: 2850,
    description: 'ابتكار دايسون الثوري لتصفيف وتمويج وتنعيم الشعر بالهواء دون تعريضه للحرارة الشديدة. يأتي مع 6 ملحقات مختلفة لجميع أنواع الشعر وحقيبة جلدية فاخرة للتخزين.',
    features: [
      'تقنية تأثير كواندا لتصفيف الشعر دون إتلافه بالحرارة المفرطة',
      'محرك دايسون الرقمي V9 فائق القوة والهدوء',
      'تحكم ذكي بالحرارة يقيس درجة الحرارة 40 مرة في الثانية',
      'طقم كامل مع فرش التكثيف والتمليس ومجفف التنعيم'
    ],
    images: [
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 5,
    rating: 4.9,
    reviewCount: 29,
    isFeatured: true,
    isNew: true,
    discountPercentage: 8,
    variants: [
      { id: 'v-color', name: 'اللون', options: ['نيكل ونحاسي', 'أزرق ملكي ووردي'] }
    ],
    sku: 'OKZ-BTY-DYSN',
    tags: ['دايسون', 'تجميل', 'شعر', 'عناية']
  },
  {
    id: 'prod-9',
    name: 'حذاء رياضي نايكي إير ماكس بلس (Nike Air Max Plus)',
    category: 'أزياء وملابس',
    price: 680,
    originalPrice: 790,
    description: 'الحذاء الأيقوني بتوسيد هوائي استثنائي وتصميم مموج جريء ومريح. مثالي للمشي اليومي والتمارين مع نعل مطاطي مانع للانزلاق وثبات ممتاز.',
    features: [
      'توسيد Tuned Air المبتكر لراحة طوال اليوم',
      'قماش شبكي علوي مسامي يوفر تهوية ممتازة',
      'هيكل خارجي من خامة TPU المتينة',
      'مقاومة عالية للتآكل ونعل ممتص للصدمات'
    ],
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 18,
    rating: 4.7,
    reviewCount: 36,
    isFeatured: false,
    isNew: false,
    discountPercentage: 14,
    variants: [
      { id: 'v-shoe-size', name: 'المقاس', options: ['40', '41', '42', '43', '44', '45'] },
      { id: 'v-color', name: 'اللون', options: ['أحمر وتدرجات برتقالية', 'أسود كامل', 'أبيض ثلجي'] }
    ],
    sku: 'OKZ-FSH-NKAP',
    tags: ['نايكي', 'حذاء', 'رياضة', 'شبابي']
  },
  {
    id: 'prod-10',
    name: 'مبخرة عكاظ الكهربائية الذكية المحمولة للشعر والملابس',
    category: 'عطور وبخور',
    price: 135,
    originalPrice: 175,
    description: 'مبخرة ذكية متنقلة تعمل بالشحن عبر USB-C، مثالية لتبخير الشعر، الثياب، والسيارة في دقائق بكل أمان وسهولة دون الحاجة لفحم. تقنية تسخين سيراميك فوري.',
    features: [
      'تسخين سريع خلال ثانيتين بتقنية السيراميك الذكي',
      'بطارية قابلة للشحن عبر منفذ تايب سي تكفي لـ 15 استخدام',
      'رأس خاص بأسنان لتبخير خصلات الشعر بأمان',
      'حجم أنيق ومدمج يلائم الحقيبة والسيارة'
    ],
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 45,
    rating: 4.8,
    reviewCount: 63,
    isFeatured: true,
    isNew: true,
    discountPercentage: 22,
    variants: [
      { id: 'v-color', name: 'اللون', options: ['أسود ملكي مع ذهبي', 'أبيض لؤلؤي مع روز قولد'] }
    ],
    sku: 'OKZ-PRF-MBKR',
    tags: ['بخور', 'مبخرة', 'ذكية', 'توصيل_سريع']
  },
  {
    id: 'prod-11',
    name: 'جهاز لوحي أبل آيباد آير (Apple iPad Air M2 - 128GB)',
    category: 'إلكترونيات وهواتف',
    price: 3350,
    originalPrice: 3600,
    description: 'مدعوم بقوة شريحة Apple M2 الخارقة. شاشة Liquid Retina مذهلة بمقاس 11 بوصة، دعم قلم Apple Pencil Pro ولوحة مفاتيح Magic Keyboard، مثالي للدراسة والعمل الاحترافي.',
    features: [
      'معالج M2 فائق السرعة لتشغيل أثقل برامج التصميم والمونتاج',
      'شاشة ريتنا بألوان واسعة P3 وطبقة مقاومة للانعكاس',
      'كاميرا أمامية أفقية بدقة 12 ميجابكسل مع ميزة سنتر ستيج',
      'مكبرات صوت ستيريو بدقة عالية'
    ],
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 8,
    rating: 4.9,
    reviewCount: 22,
    isFeatured: false,
    isNew: true,
    discountPercentage: 7,
    variants: [
      { id: 'v-color', name: 'اللون', options: ['رمادي فلكي', 'ضوء النجوم', 'أزرق هادئ'] }
    ],
    sku: 'OKZ-TAB-IPD2',
    tags: ['آيباد', 'أبل', 'تابلت', 'دراسة', 'تصميم']
  },
  {
    id: 'prod-12',
    name: 'قلاية هوائية فيليبس XXL سعة 7.2 لتر الذكية',
    category: 'المنزل والمطبخ',
    price: 890,
    originalPrice: 1050,
    description: 'طهي صحي ومقرمش بدهون أقل بنسبة 90% مع تقنية Rapid Air الفريدة. سعة عائلية ضخمة تتسع لدجاجة كاملة أو 1.4 كجم من البطاطس مع 16 برنامج طهي بلمسة واحدة.',
    features: [
      'سعة عائلية XXL تكفي حتى 6 أشخاص',
      'تحكم رقمي باللمس مع شاشة LED واضحة',
      'أجزاء آمنة للغسيل في غسالة الأطباق',
      'توفير استهلاك الطاقة وسرعة طهي تفوق الفرن التقليدي'
    ],
    images: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 12,
    rating: 4.7,
    reviewCount: 31,
    isFeatured: false,
    isNew: false,
    discountPercentage: 15,
    sku: 'OKZ-HME-PHLP',
    tags: ['قلاية', 'فيليبس', 'مطبخ', 'صحي']
  }
];

export const INITIAL_PROMOS: PromoDiscount[] = [
  {
    id: 'promo-okaz10',
    code: 'OKAZ10',
    discountType: 'percentage',
    value: 10,
    minOrderAmount: 100,
    active: true,
    expiresAt: '2026-12-31'
  },
  {
    id: 'promo-libya',
    code: 'LIBYA20',
    discountType: 'fixed',
    value: 20,
    minOrderAmount: 200,
    active: true,
    expiresAt: '2026-12-31'
  },
  {
    id: 'promo-welcome',
    code: 'WELCOME',
    discountType: 'percentage',
    value: 15,
    minOrderAmount: 150,
    active: true
  }
];

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'متجر عكاظ',
  storeTagline: 'وجهتك الأولى للتسوق الإلكتروني في ليبيا',
  contactPhone: '',
  contactWhatsApp: '',
  contactEmail: '',
  tripoliHubAddress: '',
  benghaziHubAddress: '',
  standardShippingFee: 15, // د.ل
  expressShippingFee: 30, // د.ل
  freeShippingThreshold: 350, // د.ل
  announcementText: 'توصيل سريع لكافة المدن الليبية مع إمكانية المعاينة والدفع عند الاستلام كاش',
  showAnnouncement: false
};

export const LIBYAN_CITIES_DATA: { city: string; standardDays: string; expressDays: string; fee: number }[] = [
  { city: 'طرابلس', standardDays: '24 ساعة', expressDays: 'نفس اليوم (خلال 6 ساعات)', fee: 15 },
  { city: 'بنغازي', standardDays: '24 - 48 ساعة', expressDays: '24 ساعة', fee: 20 },
  { city: 'مصراتة', standardDays: '24 - 48 ساعة', expressDays: '24 ساعة', fee: 18 },
  { city: 'الزاوية', standardDays: '24 ساعة', expressDays: 'نفس اليوم', fee: 15 },
  { city: 'البيضاء', standardDays: '48 ساعة', expressDays: '24 - 36 ساعة', fee: 25 },
  { city: 'طبرق', standardDays: '48 - 72 ساعة', expressDays: '48 ساعة', fee: 28 },
  { city: 'سبها', standardDays: '48 - 72 ساعة', expressDays: '48 ساعة', fee: 30 },
  { city: 'سرت', standardDays: '48 ساعة', expressDays: '24 - 48 ساعة', fee: 22 },
  { city: 'الخمس', standardDays: '24 ساعة', expressDays: '24 ساعة', fee: 18 },
  { city: 'زليتن', standardDays: '24 - 48 ساعة', expressDays: '24 ساعة', fee: 18 },
  { city: 'درنة', standardDays: '48 - 72 ساعة', expressDays: '48 ساعة', fee: 28 },
  { city: 'غريان', standardDays: '24 - 48 ساعة', expressDays: '24 ساعة', fee: 20 },
  { city: 'صبراتة', standardDays: '24 ساعة', expressDays: '24 ساعة', fee: 18 },
  { city: 'أجدابيا', standardDays: '48 ساعة', expressDays: '24 - 48 ساعة', fee: 24 }
];
