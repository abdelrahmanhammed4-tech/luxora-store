import { Product } from './types';

export const mockProducts: Product[] = [
  {
    id: 'p1',
    nameEn: 'Patek Philippe Nautilus 5711',
    nameAr: 'باتيك فيليب نوتيلوس ٥٧١١',
    brand: 'Patek Philippe',
    brandAr: 'باتيك فيليب',
    sku: 'PP-NAU-5711',
    descriptionEn: 'The epitome of elegant sports watches. Crafted in stainless steel with a blue embossed dial, this masterpiece offers timeless luxury and unmatched prestige.',
    descriptionAr: 'قمة الساعات الرياضية الأنيقة. صُنعت هذه التحفة الفنية من الفولاذ المقاوم للصدأ مع ميناء أزرق منقوش، وتقدم فخامة خالدة ومكانة لا مثيل لها.',
    category: 'watches',
    price: 85000,
    rating: 4.9,
    stock: 4,
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=600&auto=format&fit=crop'
    ],
    specsEn: {
      'Brand': 'Patek Philippe',
      'Model': 'Nautilus 5711/1A-010',
      'Material': 'Stainless Steel',
      'Movement': 'Automatic Caliber 26-330 S C',
      'Case Diameter': '40 mm',
      'Water Resistance': '120 m'
    },
    specsAr: {
      'العلامة التجارية': 'باتيك فيليب',
      'الموديل': 'نوتيلوس 5711/1A-010',
      'المادة': 'الفولاذ المقاوم للصدأ',
      'الحركة': 'أوتوماتيكية عيار 26-330 S C',
      'قطر الهيكل': '٤٠ مم',
      'مقاومة الماء': '١٢٠ متر'
    },
    featured: true,
    status: 'active',
    reviewsCount: 148
  },
  {
    id: 'p2',
    nameEn: 'Audemars Piguet Royal Oak',
    nameAr: 'أوديمار بيغيه رويال أوك',
    brand: 'Audemars Piguet',
    brandAr: 'أوديمار بيغيه',
    sku: 'AP-RO-15500',
    descriptionEn: 'An iconic octagonal design with exposed hexagonal screws and a beautiful Grande Tapisserie dial. The ultimate statement of modern luxury horology.',
    descriptionAr: 'تصميم ثماني الأضلاع مبهر مع براغي سداسية بارزة وميناء غراند تابيستري الفاخر. التعبير الأقوى عن صناعة الساعات الفاخرة العصرية.',
    category: 'watches',
    price: 48000,
    rating: 4.8,
    stock: 6,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=600&auto=format&fit=crop'
    ],
    specsEn: {
      'Brand': 'Audemars Piguet',
      'Model': 'Royal Oak "Jumbo"',
      'Material': '18k Rose Gold',
      'Movement': 'Selfwinding Calibre 7121',
      'Case Diameter': '39 mm',
      'Water Resistance': '50 m'
    },
    specsAr: {
      'العلامة التجارية': 'أوديمار بيغيه',
      'الموديل': 'رويال أوك "جامبو"',
      'المادة': 'ذهب وردي عيار ١٨',
      'الحركة': 'ذاتية الدفع عيار ٧١٢١',
      'قطر الهيكل': '٣٩ مم',
      'مقاومة الماء': '٥٠ متر'
    },
    featured: true,
    status: 'active',
    reviewsCount: 92
  },
  {
    id: 'p3',
    nameEn: 'Rolex Cosmograph Daytona',
    nameAr: 'رولكس كوزموغراف ديتونا',
    brand: 'Rolex',
    brandAr: 'رولكس',
    sku: 'RLX-DAY-126',
    descriptionEn: 'The supreme racing chronograph. Designed to meet the demands of professional racing drivers, featuring a black Cerachrom bezel and oystersteel band.',
    descriptionAr: 'ساعة الكرونوغراف الفائقة للسباقات. صُممت لتلبية متطلبات سائقي سباقات السيارات المحترفين، وتتميز بإطار سيراكروم الأسود وسوار أويسترستيل المتين.',
    category: 'watches',
    price: 34500,
    rating: 5.0,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1619134778706-7015533a6150?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1619134778706-7015533a6150?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=600&auto=format&fit=crop'
    ],
    specsEn: {
      'Brand': 'Rolex',
      'Model': 'Daytona 126500LN',
      'Material': 'Oystersteel',
      'Movement': 'Perpetual Mechanical Calibre 4131',
      'Case Diameter': '40 mm',
      'Water Resistance': '100 m'
    },
    specsAr: {
      'العلامة التجارية': 'رولكس',
      'الموديل': 'ديتونا ١٢٦٥٠٠LN',
      'المادة': 'أويسترستيل الفولاذي',
      'الحركة': 'ميكانيكية دائرية عيار ٤١٣١',
      'قطر الهيكل': '٤٠ مم',
      'مقاومة الماء': '١٠٠ متر'
    },
    featured: false,
    status: 'active',
    reviewsCount: 210
  },
  {
    id: 'p4',
    nameEn: 'Vacheron Constantin Overseas',
    nameAr: 'فاشيرون كونستانتين أوفرسيز',
    brand: 'Vacheron Constantin',
    brandAr: 'فاشيرون كونستانتين',
    sku: 'VC-OVE-4500',
    descriptionEn: 'An invitation to travel, this luxury steel watch features a blue dial and includes an interchangeable strap system of steel, leather, and rubber.',
    descriptionAr: 'دعوة مفتوحة للسفر والترحال، تتميز هذه الساعة الفولاذية الفاخرة بميناء أزرق وتتضمن نظام أحزمة قابلة للتبديل من الفولاذ والجلد والمطاط.',
    category: 'watches',
    price: 29800,
    rating: 4.7,
    stock: 3,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1619134778706-7015533a6150?q=80&w=600&auto=format&fit=crop'
    ],
    specsEn: {
      'Brand': 'Vacheron Constantin',
      'Model': 'Overseas 4500V',
      'Material': 'Stainless Steel',
      'Movement': 'Automatic Calibre 5100',
      'Case Diameter': '41 mm',
      'Water Resistance': '150 m'
    },
    specsAr: {
      'العلامة التجارية': 'فاشيرون كونستانتين',
      'الموديل': 'أوفرسيز ٤٥٠٠V',
      'المادة': 'الفولاذ المقاوم للصدأ',
      'الحركة': 'أوتوماتيكية عيار ٥١٠٠',
      'قطر الهيكل': '٤١ مم',
      'مقاومة الماء': '١٥٠ متر'
    },
    featured: false,
    status: 'active',
    reviewsCount: 36
  },
  {
    id: 'p5',
    nameEn: 'Luxora Royal Tourbillon Imperial',
    nameAr: 'لوكسورا توربيلون إمبريال الملكي',
    brand: 'LUXORA Genève',
    brandAr: 'لوكسورا جنيف',
    sku: 'LX-TUR-IMP',
    descriptionEn: 'The pinnacle of LUXORA horology. Featuring a hand-wound skeleton flying tourbillon movement, hand-engraved 18k white gold case, and a genuine alligator strap.',
    descriptionAr: 'قمة براعة لوكسورا في تصنيع الساعات. تتميز بحركة توربيلون طائرة مفرغة يدويًا، وهيكل من الذهب الأبيض عيار ١٨ قيراطًا منقوش يدويًا، وحزام من جلد التمساح الأصلي.',
    category: 'watches',
    price: 135000,
    rating: 5.0,
    stock: 2,
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600&auto=format&fit=crop'
    ],
    specsEn: {
      'Brand': 'LUXORA Genève',
      'Model': 'Tourbillon Imperial Black-Gold',
      'Material': '18k White Gold & Baguette Diamonds',
      'Movement': 'Hand-Wound Flying Tourbillon LX-01',
      'Case Diameter': '42 mm',
      'Water Resistance': '30 m'
    },
    specsAr: {
      'العلامة التجارية': 'لوكسورا جنيف',
      'الموديل': 'توربيلون إمبريال الأسود والذهبي',
      'المادة': 'ذهب أبيض عيار ١٨ وألماس باجيت',
      'الحركة': 'توربيلون طائر يدوي التعبئة LX-01',
      'قطر الهيكل': '٤٢ مم',
      'مقاومة الماء': '٣٠ متر'
    },
    featured: true,
    status: 'active',
    reviewsCount: 15
  },
  {
    id: 'p10',
    nameEn: 'Rolex Submariner Date',
    nameAr: 'رولكس ديت صبمارينر',
    brand: 'Rolex',
    brandAr: 'رولكس',
    sku: 'RLX-SUB-126',
    descriptionEn: 'The benchmark for divers watches. Featuring a green Cerachrom bezel and a black dial with large luminescent hour markers. Designed for the adventurous spirit.',
    descriptionAr: 'المعيار المرجعي لساعات الغوص. تتميز بإطار سيراكروم أخضر وميناء أسود مع علامات ساعات مضيئة كبيرة. مصممة لتلائم روح المغامرة.',
    category: 'watches',
    price: 14200,
    rating: 4.9,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1619134778706-7015533a6150?q=80&w=600&auto=format&fit=crop'
    ],
    specsEn: {
      'Brand': 'Rolex',
      'Model': 'Submariner 126610LV',
      'Material': 'Oystersteel',
      'Movement': 'Perpetual Mechanical 3235',
      'Case Diameter': '41 mm',
      'Water Resistance': '300 m'
    },
    specsAr: {
      'العلامة التجارية': 'رولكس',
      'الموديل': 'صبمارينر ١٢٦٦١٠LV',
      'المادة': 'أويسترستيل',
      'الحركة': 'ميكانيكية دائرية ٣٢٣٥',
      'قطر الهيكل': '٤١ مم',
      'مقاومة الماء': '٣٠٠ متر'
    },
    featured: true,
    status: 'active',
    reviewsCount: 185
  },
  {
    id: 'p11',
    nameEn: 'Omega Seamaster Diver 300M',
    nameAr: 'أوميغا سيماستر دايفر ٣٠٠م',
    brand: 'Omega',
    brandAr: 'أوميغا',
    sku: 'OMG-SEA-300',
    descriptionEn: 'A legendary diving companion with a wave-pattern dial and helium escape valve. Master Chronometer certified for extreme magnetic resistance and accuracy.',
    descriptionAr: 'رفيق الغوص الأسطوري بميناء يحمل نمط الأمواج المذهل وصمام تصريف الهيليوم. معتمدة ككرونوميتر رئيسي لمقاومة الحقول المغناطيسية والدقة الفائقة.',
    category: 'watches',
    price: 5900,
    rating: 4.8,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1604242692760-2f7b0c26856d?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1604242692760-2f7b0c26856d?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=600&auto=format&fit=crop'
    ],
    specsEn: {
      'Brand': 'Omega',
      'Model': 'Seamaster 210.30.42.20.03.001',
      'Material': 'Stainless Steel',
      'Movement': 'Omega Co-Axial Master Chronometer 8800',
      'Case Diameter': '42 mm',
      'Water Resistance': '300 m'
    },
    specsAr: {
      'العلامة التجارية': 'أوميغا',
      'الموديل': 'سيماستر ٢١٠.٣٠.٤٢.٢٠.٠٣.٠٠١',
      'المادة': 'الفولاذ المقاوم للصدأ',
      'الحركة': 'أوميغا كو-أكسيال كرونوميتر ٨٨٠٠',
      'قطر الهيكل': '٤٢ مم',
      'مقاومة الماء': '٣٠٠ متر'
    },
    featured: false,
    status: 'active',
    reviewsCount: 94
  },
  {
    id: 'p12',
    nameEn: 'TAG Heuer Monaco Chronograph',
    nameAr: 'تاغ هوير موناكو كرونوغراف',
    brand: 'TAG Heuer',
    brandAr: 'تاغ هوير',
    sku: 'TAG-MON-02',
    descriptionEn: 'The original square-faced icon worn by Steve McQueen. Features a bold blue dial, white sub-dials, and the famous crown on the left side.',
    descriptionAr: 'الأيقونة الأصلية ذات الهيكل المربع الفاخر التي ارتداها ستيف ماكوين. تتميز بميناء أزرق جريء، ومؤشرات فرعية بيضاء، والتاج الشهير على الجانب الأيسر.',
    category: 'watches',
    price: 7800,
    rating: 4.6,
    stock: 7,
    image: 'https://images.unsplash.com/photo-1539874754764-5a96559165b0?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1539874754764-5a96559165b0?q=80&w=600&auto=format&fit=crop'
    ],
    specsEn: {
      'Brand': 'TAG Heuer',
      'Model': 'Monaco Calibre 11',
      'Material': 'Fine-Brushed Steel',
      'Movement': 'Automatic Chronograph Calibre 11',
      'Case Diameter': '39 mm',
      'Water Resistance': '100 m'
    },
    specsAr: {
      'العلامة التجارية': 'تاغ هوير',
      'الموديل': 'موناكو عيار ١١',
      'المادة': 'فولاذ مصقول ناعم',
      'الحركة': 'كرونوغراف أوتوماتيكي عيار ١١',
      'قطر الهيكل': '٣٩ مم',
      'مقاومة الماء': '١٠٠ متر'
    },
    featured: false,
    status: 'active',
    reviewsCount: 42
  },
  {
    id: 'p13',
    nameEn: 'Tissot Le Locle Powermatic 80',
    nameAr: 'تيسو لو لوكل باورماتيك ٨٠',
    brand: 'Tissot',
    brandAr: 'تيسو',
    sku: 'TIS-LEL-80',
    descriptionEn: 'Elegant classical watch named after Tissots home town. Features a beautifully detailed guilloche dial, Roman numerals, and a reliable 80-hour power reserve.',
    descriptionAr: 'ساعة كلاسيكية أنيقة سُميت تيمناً ببلدة تيسو الأصلية في سويسرا. تتميز بميناء غيلوشيه المفصل ببراعة، وأرقام رومانية، واحتياطي طاقة موثوق يصل إلى ٨٠ ساعة.',
    category: 'watches',
    price: 750,
    rating: 4.5,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=600&auto=format&fit=crop'
    ],
    specsEn: {
      'Brand': 'Tissot',
      'Model': 'Le Locle T006.407.16.033.00',
      'Material': '316L Stainless Steel',
      'Movement': 'Powermatic 80.111',
      'Case Diameter': '39.3 mm',
      'Water Resistance': '30 m'
    },
    specsAr: {
      'العلامة التجارية': 'تيسو',
      'الموديل': 'لو لوكل T006.407.16.033.00',
      'المادة': 'فولاذ مقاوم للصدأ 316L',
      'الحركة': 'باورماتيك ٨٠.١١١',
      'قطر الهيكل': '٣٩.٣ مم',
      'مقاومة الماء': '٣٠ متر'
    },
    featured: false,
    status: 'active',
    reviewsCount: 112
  },
  {
    id: 'p14',
    nameEn: 'Longines Master Collection Calendar',
    nameAr: 'لونجين ماستر كوليكشن كاليندر',
    brand: 'Longines',
    brandAr: 'لونجين',
    sku: 'LON-MAS-COL',
    descriptionEn: 'The signature model illustrating Longines horological expertise. Displaying a silver barleycorn dial, moonphase indicator, and complete calendar functions.',
    descriptionAr: 'الموديل المميز الذي يوضح خبرة لونجين العريقة في صناعة الساعات. يعرض ميناءً فضياً بنقشة شعير دقيقة، ومؤشر أطوار القمر، ووظائف التقويم الكاملة.',
    category: 'watches',
    price: 3550,
    rating: 4.7,
    stock: 4,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1604242692760-2f7b0c26856d?q=80&w=600&auto=format&fit=crop'
    ],
    specsEn: {
      'Brand': 'Longines',
      'Model': 'Master Moonphase L2.909.4.78.3',
      'Material': 'Stainless Steel',
      'Movement': 'Automatic L899',
      'Case Diameter': '40 mm',
      'Water Resistance': '30 m'
    },
    specsAr: {
      'العلامة التجارية': 'لونجين',
      'الموديل': 'ماستر مونفيز L2.909.4.78.3',
      'المادة': 'الفولاذ المقاوم للصدأ',
      'الحركة': 'أوتوماتيكية L899',
      'قطر الهيكل': '٤٠ مم',
      'مقاومة الماء': '٣٠ متر'
    },
    featured: false,
    status: 'active',
    reviewsCount: 57
  },
  {
    id: 'p15',
    nameEn: 'Seiko Prospex Alpinist',
    nameAr: 'سيكو بروسبكس ألبينست',
    brand: 'Seiko',
    brandAr: 'سيكو',
    sku: 'SEI-PRO-ALP',
    descriptionEn: 'The famous explorer timepiece featuring a striking forest green dial, gold cathedral hands, and an internal rotating compass ring. Built for rugged luxury.',
    descriptionAr: 'ساعة المستكشف الشهيرة التي تتميز بميناء أخضر داكن مذهل، وعقارب ذهبية بنمط الكاتدرائية، وحلقة بوصلة داخلية دوارة. مصممة لتجمع بين الصلابة والفخامة.',
    category: 'watches',
    price: 720,
    rating: 4.6,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=600&auto=format&fit=crop'
    ],
    specsEn: {
      'Brand': 'Seiko',
      'Model': 'Alpinist SPB121J1',
      'Material': 'Stainless Steel',
      'Movement': 'Automatic Calibre 6R35',
      'Case Diameter': '39.5 mm',
      'Water Resistance': '200 m'
    },
    specsAr: {
      'العلامة التجارية': 'سيكو',
      'الموديل': 'ألبينست SPB121J1',
      'المادة': 'الفولاذ المقاوم للصدأ',
      'الحركة': 'أوتوماتيكية عيار 6R35',
      'قطر الهيكل': '٣٩.٥ مم',
      'مقاومة الماء': '٢٠٠ متر'
    },
    featured: false,
    status: 'active',
    reviewsCount: 204
  },
  {
    id: 'p16',
    nameEn: 'Citizen Tsuyosa Automatic Yellow',
    nameAr: 'سيتيزن تسويوسا الصفراء',
    brand: 'Citizen',
    brandAr: 'سيتيزن',
    sku: 'CIT-TSU-YEL',
    descriptionEn: 'A vibrant modern classic featuring an integrated steel bracelet and an ultra-bold yellow sunray dial that commands attention. Exceptional value horology.',
    descriptionAr: 'كلاسيكية عصرية مبهجة تتميز بسوار مدمج من الفولاذ وميناء أصفر ساطع يخطف الأنظار. دقة بالغة وجمال استثنائي بلمسة جريئة.',
    category: 'watches',
    price: 450,
    rating: 4.5,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=600&auto=format&fit=crop'
    ],
    specsEn: {
      'Brand': 'Citizen',
      'Model': 'Tsuyosa NJ0150-81Z',
      'Material': 'Stainless Steel',
      'Movement': 'Automatic Calibre 8210',
      'Case Diameter': '40 mm',
      'Water Resistance': '50 m'
    },
    specsAr: {
      'العلامة التجارية': 'سيتيزن',
      'الموديل': 'تسويوسا NJ0150-81Z',
      'المادة': 'الفولاذ المقاوم للصدأ',
      'الحركة': 'أوتوماتيكية عيار ٨٢١٠',
      'قطر الهيكل': '٤٠ مم',
      'مقاومة الماء': '٥٠ متر'
    },
    featured: false,
    status: 'active',
    reviewsCount: 137
  },
  {
    id: 'p17',
    nameEn: 'Casio G-Shock G-Steel Luxe',
    nameAr: 'كاسيو جي-شوك جي-ستيل الفاخرة',
    brand: 'Casio',
    brandAr: 'كاسيو',
    sku: 'CAS-GST-LUX',
    descriptionEn: 'Indestructible shock-resistant structure refined with solid steel composite casing and Bluetooth mobile links. Ultimate strength meets executive elegance.',
    descriptionAr: 'هيكل غير قابل للتدمير ومقاوم للصدمات مكسو بالفولاذ الصلب المتين، مع خاصية الاتصال بالهاتف عبر البلوتوث. القوة الفائقة تلتقي بالأناقة الإدارية.',
    category: 'watches',
    price: 350,
    rating: 4.4,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1526045478516-99145907023c?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1526045478516-99145907023c?q=80&w=600&auto=format&fit=crop'
    ],
    specsEn: {
      'Brand': 'Casio G-Shock',
      'Model': 'G-Steel GST-B400D-1A',
      'Material': 'Stainless Steel & Resin Carbon Core',
      'Movement': 'Tough Solar Quartz Bluetooth',
      'Case Diameter': '46.6 mm',
      'Water Resistance': '200 m'
    },
    specsAr: {
      'العلامة التجارية': 'كاسيو جي-شوك',
      'الموديل': 'جي-ستيل GST-B400D-1A',
      'المادة': 'الفولاذ المقاوم للصدأ مع كربون ريزن',
      'الحركة': 'شحن شمسي ذكي وبلوتوث',
      'قطر الهيكل': '٤٦.٦ مم',
      'مقاومة الماء': '٢٠٠ متر'
    },
    featured: false,
    status: 'active',
    reviewsCount: 89
  },
  {
    id: 'p6',
    nameEn: 'Maison Francis Kurkdjian Baccarat Rouge 540',
    nameAr: 'ميسون فرانسيس كوركدجيان باكارات روج ٥٤٠',
    brand: 'Maison Francis Kurkdjian',
    brandAr: 'ميسون فرانسيس كوركدجيان',
    sku: 'MFK-BAC-540',
    descriptionEn: 'Luminous and sophisticated, Baccarat Rouge 540 lays on the skin like an amber, floral and woody breeze. A highly concentrated perfume poetry.',
    descriptionAr: 'مشرق وراقي، يستقر عطر باكارات روج ٥٤٠ على البشرة مثل نسيم عنبري، زهري وخشبي مذهل. شاعرية عطرية مركزة ومثيرة للغاية.',
    category: 'perfumes',
    price: 435,
    rating: 4.9,
    stock: 24,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?q=80&w=600&auto=format&fit=crop'
    ],
    specsEn: {
      'Brand': 'Maison Francis Kurkdjian',
      'Scent Profile': 'Amber Woody Floral',
      'Key Notes': 'Jasmine, Saffron, Amberwood, Fir Resin, Cedar',
      'Concentration': 'Extrait de Parfum',
      'Volume': '70 ml'
    },
    specsAr: {
      'العلامة التجارية': 'ميسون فرانسيس كوركدجيان',
      'نوع العطر': 'عنبري خشبي زهري',
      'المكونات الأساسية': 'الياسمين، الزعفران، خشب العنبر، راتنج التنوب، الأرز',
      'التركيز': 'إكستري دي بارفوم',
      'الحجم': '٧٠ مل'
    },
    featured: true,
    status: 'active',
    reviewsCount: 312
  },
  {
    id: 'p7',
    nameEn: 'Creed Aventus',
    nameAr: 'كريد أفينتوس الأصلي',
    brand: 'Creed',
    brandAr: 'كريد',
    sku: 'CRD-AVE-100',
    descriptionEn: 'An exceptional scent celebrating strength, power, and success. Features dynamic blackcurrant, royal pineapple, birch wood, and patchouli notes.',
    descriptionAr: 'رائحة استثنائية تحتفي بالقوة والنجاح والسيادة. يتميز بنفحات حيوية من الكشمش الأسود، الأناناس الملكي، خشب البتولا، والباتشولي العطري.',
    category: 'perfumes',
    price: 475,
    rating: 4.8,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=600&auto=format&fit=crop'
    ],
    specsEn: {
      'Brand': 'Creed',
      'Scent Profile': 'Fruity Woody Amber',
      'Key Notes': 'Pineapple, Bergamot, Birch, Patchouli, Musk, Vanilla',
      'Concentration': 'Eau de Parfum',
      'Volume': '100 ml'
    },
    specsAr: {
      'العلامة التجارية': 'كريد',
      'نوع العطر': 'فاكهي خشبي عنبري',
      'المكونات الأساسية': 'الأناناس، البرغموت، البتولا، الباتشولي، المسك، الفانيليا',
      'التركيز': 'أو دي بارفوم',
      'الحجم': '١٠٠ مل'
    },
    featured: true,
    status: 'active',
    reviewsCount: 450
  },
  {
    id: 'p8',
    nameEn: 'Tom Ford Lost Cherry',
    nameAr: 'توم فورد لوست تشيري',
    brand: 'Tom Ford',
    brandAr: 'توم فورد',
    sku: 'TF-LOC-50',
    descriptionEn: 'A full-bodied journey into the once-forbidden; a contrasting scent that reveals a tempting dichotomy of playful, candy-like gleam on the outside and luscious flesh within.',
    descriptionAr: 'رحلة غنية وجريئة؛ عطر متناقض يكشف عن ثنائية مغرية من البريق الطفولي المرح من الخارج والدفء المركز واللذيذ من الداخل.',
    category: 'perfumes',
    price: 395,
    rating: 4.6,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600&auto=format&fit=crop'
    ],
    specsEn: {
      'Brand': 'Tom Ford',
      'Scent Profile': 'Oriental Sweet Warm',
      'Key Notes': 'Black Cherry, Bitter Almond, Griotte Syrup, Turkish Rose, Tonka Bean',
      'Concentration': 'Eau de Parfum Private Blend',
      'Volume': '50 ml'
    },
    specsAr: {
      'العلامة التجارية': 'توم فورد',
      'نوع العطر': 'شرقي حلو دافئ',
      'المكونات الأساسية': 'الكرز الأسود، اللوز المر، شراب الغريوت، الورد التركي، حبوب التونكا',
      'التركيز': 'أو دي بارفوم بريفات بليند',
      'الحجم': '٥٠ مل'
    },
    featured: false,
    status: 'active',
    reviewsCount: 184
  },
  {
    id: 'p9',
    nameEn: 'Luxora Oud Impérial Absolu',
    nameAr: 'لوكسورا عود إمبريال أبسولو',
    brand: 'LUXORA Parfums',
    brandAr: 'عطور لوكسورا',
    sku: 'LX-OUD-IMP',
    descriptionEn: 'An intense, smoky oud extract reserved for true connoisseurs. Hand-blended with Cambodian agarwood, rare Taif rose, saffron threads, and warm rich amber.',
    descriptionAr: 'مستخلص العود الدخاني المكثف المخصص لخبراء العطور الحقيقيين. يُمزج يدويًا مع خشب العود الكمبودي النادر، ورد الطائف الفاخر، خيوط الزعفران، والعنبر الدافئ الغني.',
    category: 'perfumes',
    price: 550,
    rating: 5.0,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop'
    ],
    specsEn: {
      'Brand': 'LUXORA Parfums',
      'Scent Profile': 'Smoky Oud Woody Spicy',
      'Key Notes': 'Wild Cambodian Oud, Taif Rose, Saffron, Frankincense, Sandalwood',
      'Concentration': 'Extrait de Parfum Absolu',
      'Volume': '100 ml'
    },
    specsAr: {
      'العلامة التجارية': 'عطور لوكسورا',
      'نوع العطر': 'عود دخاني خشبي توابل',
      'المكونات الأساسية': 'العود الكمبودي البري، ورد الطائف، الزعفران، اللبان، خشب الصندل',
      'التركيز': 'إكستري دي بارفوم أبسولو',
      'الحجم': '١٠٠ مل'
    },
    featured: true,
    status: 'active',
    reviewsCount: 68
  },
  {
    id: 'p18',
    nameEn: 'Dior Sauvage Elixir',
    nameAr: 'ديور سواج إكسير الفاخر',
    brand: 'Dior',
    brandAr: 'ديور',
    sku: 'DIO-SAU-ELX',
    descriptionEn: 'An extraordinarily concentrated fragrance steeped in the iconic freshness of Sauvage with an intoxicating heart of spices and lavender essences.',
    descriptionAr: 'عطر مركز بشكل استثنائي مغمور بالانتعاش الأيقوني المميز لعطور سوفاج مع قلب غني بالتوابل الساخنة وخلاصة الخزامى الآسرة.',
    category: 'perfumes',
    price: 240,
    rating: 4.8,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=600&auto=format&fit=crop'
    ],
    specsEn: {
      'Brand': 'Dior',
      'Scent Profile': 'Warm Spicy Fresh Woody',
      'Key Notes': 'Grapefruit, Cardamom, Nutmeg, Cinnamon, Lavender, Amber, Patchouli',
      'Concentration': 'Elixir Parfum',
      'Volume': '60 ml'
    },
    specsAr: {
      'العلامة التجارية': 'ديور',
      'نوع العطر': 'توابل دافئة خشبي منعش',
      'المكونات الأساسية': 'البرغموت، الهيل، جوزة الطيب، القرفة، الخزامى، العنبر، الباتشولي',
      'التركيز': 'إكسير بارفوم',
      'الحجم': '٦٠ مل'
    },
    featured: true,
    status: 'active',
    reviewsCount: 520
  },
  {
    id: 'p19',
    nameEn: 'Bleu de Chanel Parfum',
    nameAr: 'بلو دي شانيل بارفوم',
    brand: 'Chanel',
    brandAr: 'شانيل',
    sku: 'CHL-BLE-100',
    descriptionEn: 'An exquisite aromatic-woody fragrance of cedar and sandalwood, creating an intense, captivating, and resolutely masculine trail. The mark of absolute confidence.',
    descriptionAr: 'عطر خشبي عطري رائع من خشب الأرز وخشب الصندل الفاخر، يصنع أثراً مكثفاً وساحراً يجسد الثقة المطلقة والجاذبية اللامتناهية.',
    category: 'perfumes',
    price: 180,
    rating: 4.9,
    stock: 22,
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=600&auto=format&fit=crop'
    ],
    specsEn: {
      'Brand': 'Chanel',
      'Scent Profile': 'Aromatic Woody Citrus',
      'Key Notes': 'Lemon, Mint, Pink Pepper, Grapefruit, Cedar, Sandalwood, Incense',
      'Concentration': 'Parfum',
      'Volume': '100 ml'
    },
    specsAr: {
      'العلامة التجارية': 'شانيل',
      'نوع العطر': 'أروماتك خشبي حمضيات',
      'المكونات الأساسية': 'الليمون، النعناع، الفلفل الوردي، الجريب فروت، الأرز، خشب الصندل، البخور',
      'التركيز': 'بارفوم',
      'الحجم': '١٠٠ مل'
    },
    featured: true,
    status: 'active',
    reviewsCount: 390
  },
  {
    id: 'p20',
    nameEn: 'Tom Ford Oud Wood',
    nameAr: 'توم فورد عود وود الخاص',
    brand: 'Tom Ford',
    brandAr: 'توم فورد',
    sku: 'TF-OUW-100',
    descriptionEn: 'One of the most rare, precious, and expensive ingredients in a perfumers arsenal, oud wood is often burned in incense-filled temples. Warm and highly distinctive.',
    descriptionAr: 'واحد من أندر وأثمن المكونات في عالم العطور، يحاكي أجواء معابد الشرق المليئة بالبخور الدافئ. عطر دافئ ومميز للغاية يصعب نسيانه.',
    category: 'perfumes',
    price: 385,
    rating: 4.8,
    stock: 14,
    image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop'
    ],
    specsEn: {
      'Brand': 'Tom Ford',
      'Scent Profile': 'Oud Woody Warm Spicy',
      'Key Notes': 'Rare Oud Wood, Sandalwood, Chinese Pepper, Rosewood, Cardamom, Vanilla',
      'Concentration': 'Eau de Parfum',
      'Volume': '100 ml'
    },
    specsAr: {
      'العلامة التجارية': 'توم فورد',
      'نوع العطر': 'عود خشبي توابل دافئة',
      'المكونات الأساسية': 'خشب العود النادر، خشب الصندل، الفلفل الصيني، خشب الورد، الهيل، الفانيليا',
      'التركيز': 'أو دي بارفوم',
      'الحجم': '١٠٠ مل'
    },
    featured: false,
    status: 'active',
    reviewsCount: 228
  },
  {
    id: 'p21',
    nameEn: 'Versace Eros Parfum',
    nameAr: 'فرزاتشي إيروس بارفوم',
    brand: 'Versace',
    brandAr: 'فرزاتشي',
    sku: 'VER-ERO-100',
    descriptionEn: 'Love, passion, beauty, and desire. A luminous aura with intense, vibrant, and glowing freshness obtained from mint leaves, Italian lemon zest, and green apple.',
    descriptionAr: 'الحب، الشغف، الجمال، والرغبة. هالة مضيئة ذات انتعاش مكثف ينبض بالحيوية مستخلص من أوراق النعناع، قشور الليمون الإيطالي، والتفاح الأخضر.',
    category: 'perfumes',
    price: 135,
    rating: 4.6,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1588405748373-122b2321bc31?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1588405748373-122b2321bc31?q=80&w=600&auto=format&fit=crop'
    ],
    specsEn: {
      'Brand': 'Versace',
      'Scent Profile': 'Fresh Oriental Woody',
      'Key Notes': 'Mint, Green Apple, Lemon, Tonka Bean, Ambroxan, Geranium, Cedarwood',
      'Concentration': 'Parfum',
      'Volume': '100 ml'
    },
    specsAr: {
      'العلامة التجارية': 'فرزاتشي',
      'نوع العطر': 'منعش شرقي خشبي',
      'المكونات الأساسية': 'النعناع، التفاح الأخضر، الليمون، حبوب التونكا، الأمبروكسان، الأرز',
      'التركيز': 'بارفوم',
      'الحجم': '١٠٠ مل'
    },
    featured: false,
    status: 'active',
    reviewsCount: 415
  },
  {
    id: 'p22',
    nameEn: 'Armani Code Parfum',
    nameAr: 'أرماني كود بارفوم',
    brand: 'Giorgio Armani',
    brandAr: 'جورجيو أرماني',
    sku: 'ARM-COD-125',
    descriptionEn: 'Rewriting the code of a classic masculine fragrance. Features a strong yet sensitive woody aromatic base with clary sage and iris heart notes.',
    descriptionAr: 'إعادة كتابة كود الجاذبية الكلاسيكية العريقة للرجال. يتميز بقاعدة خشبية أروماتيكية قوية وحساسة مع نفحات المريمية وسوسن الطائف.',
    category: 'perfumes',
    price: 155,
    rating: 4.7,
    stock: 16,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600&auto=format&fit=crop'
    ],
    specsEn: {
      'Brand': 'Giorgio Armani',
      'Scent Profile': 'Aromatic Woody Amber',
      'Key Notes': 'Bergamot, Sage, Iris, Tonka Bean, Cedarwood',
      'Concentration': 'Parfum',
      'Volume': '125 ml'
    },
    specsAr: {
      'العلامة التجارية': 'جورجيو أرماني',
      'نوع العطر': 'أروماتك خشبي عنبري',
      'المكونات الأساسية': 'البرغموت، المريمية، السوسن، حبوب التونكا، خشب الأرز',
      'التركيز': 'بارفوم',
      'الحجم': '١٢٥ مل'
    },
    featured: false,
    status: 'active',
    reviewsCount: 172
  }
];
