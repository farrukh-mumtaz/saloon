import {
  type CurrencyCode,
  type LanguageCode,
  SUPPORTED_CURRENCIES,
  SUPPORTED_LANGUAGES,
} from '../types/i18n';

// Storage keys
const STORAGE_KEY_CURRENCY = 'diamond_trim_currency_v1';
const STORAGE_KEY_LANGUAGE = 'diamond_trim_language_v1';

// Initial defaults
export const DEFAULT_CURRENCY: CurrencyCode = 'USD';
export const DEFAULT_LANGUAGE: LanguageCode = 'en';

// Helper to extract numeric USD value from strings like "$85", "85", "$120.00"
export const parsePriceUSD = (priceStr: string | number): number => {
  if (typeof priceStr === 'number') return priceStr;
  const cleaned = priceStr.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

// Dynamic currency conversion and formatting
export const formatCurrency = (
  amountUSD: number,
  currencyCode: CurrencyCode = 'USD'
): string => {
  const cfg = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.USD;
  const converted = amountUSD * cfg.rate;

  let formattedNumber: string;
  if (currencyCode === 'PKR') {
    // For PKR, format with comma separators without decimals (e.g. 23,500)
    formattedNumber = Math.round(converted).toLocaleString('en-US');
  } else if (currencyCode === 'AED' || currencyCode === 'SAR') {
    formattedNumber = Math.round(converted).toLocaleString('en-US');
  } else {
    // USD, EUR, GBP, CAD: use standard integer or 2 decimals if needed
    formattedNumber = Number.isInteger(converted)
      ? converted.toLocaleString('en-US')
      : converted.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  if (cfg.formatPrefix) {
    return `${cfg.symbol}${formattedNumber}`;
  } else {
    return `${formattedNumber} ${cfg.symbol}`;
  }
};

// Convert formatted price string (e.g. "$85") to active currency
export const convertPriceString = (
  rawPrice: string,
  targetCurrency: CurrencyCode
): string => {
  const amountUSD = parsePriceUSD(rawPrice);
  return formatCurrency(amountUSD, targetCurrency);
};

// Get stored currency
export const getStoredCurrency = (): CurrencyCode => {
  if (typeof window === 'undefined') return DEFAULT_CURRENCY;
  const stored = localStorage.getItem(STORAGE_KEY_CURRENCY) as CurrencyCode;
  return stored && SUPPORTED_CURRENCIES[stored] ? stored : DEFAULT_CURRENCY;
};

// Save currency
export const setStoredCurrency = (currency: CurrencyCode): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_CURRENCY, currency);
  window.dispatchEvent(new Event('diamond_trim_currency_change'));
};

// Get stored language
export const getStoredLanguage = (): LanguageCode => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  const stored = localStorage.getItem(STORAGE_KEY_LANGUAGE) as LanguageCode;
  return stored && SUPPORTED_LANGUAGES[stored] ? stored : DEFAULT_LANGUAGE;
};

// Save language
export const setStoredLanguage = (lang: LanguageCode): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_LANGUAGE, lang);
  const cfg = SUPPORTED_LANGUAGES[lang];
  if (cfg) {
    document.documentElement.setAttribute('dir', cfg.dir);
    document.documentElement.setAttribute('lang', cfg.code);
  }
  window.dispatchEvent(new Event('diamond_trim_language_change'));
};

// Multilingual Dictionary
export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Navigation
    'nav.services': 'Services',
    'nav.whyUs': 'Why Diamond Trim',
    'nav.gallery': 'Gallery',
    'nav.reviews': 'Reviews',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contact',
    'nav.forSalons': 'For Salons (SaaS)',
    'nav.admin': 'Admin',
    'nav.book': 'Book Appointment',
    'nav.signIn': 'Sign In',
    'nav.myAccount': 'My Account',
    'nav.promotions': 'Offers & Coupons',

    // Hero Section
    'hero.badge': 'Acoustic Privacy • Ultra-Sterile Suites',
    'hero.subtitle': 'If you are pursuing to relax your body and mind, step into our private VIP suites and experience bespoke master treatments.',
    'hero.ctaReadMore': 'Explore Treatments',
    'hero.ctaBook': 'Book Suite',

    // Common UI
    'common.duration': 'Duration',
    'common.price': 'Price',
    'common.apply': 'Apply',
    'common.discount': 'Discount',
    'common.total': 'Total',
    'common.subtotal': 'Subtotal',
    'common.savings': 'Savings',
    'common.cancel': 'Cancel',
    'common.save': 'Save Changes',
    'common.loading': 'Loading...',
    'common.copied': 'Copied to clipboard!',
    'common.copyCode': 'Copy Code',
    'common.claim': 'Claim Voucher',
    'common.claimed': 'Claimed',
    'common.redeem': 'Redeem in Booking',
    'common.switchCurrency': 'Currency',
    'common.switchLanguage': 'Language',

    // Customer Auth & Account
    'auth.welcomeBack': 'Welcome Back to Diamond Trim',
    'auth.welcomeSub': 'Sign in to manage your appointments, view loyalty perks, and access exclusive promotions.',
    'auth.createAccount': 'Create Your VIP Guest Account',
    'auth.createSub': 'Join Diamond Trim Atelier for automated 20% welcome discount, private suite preferences, and loyalty rewards.',
    'auth.fullName': 'Full Name',
    'auth.email': 'Email Address',
    'auth.phone': 'Phone Number',
    'auth.password': 'Password',
    'auth.loginBtn': 'Sign In',
    'auth.registerBtn': 'Create Account & Get 20% Off',
    'auth.haveAccount': 'Already have an account? Sign In',
    'auth.needAccount': 'New to Diamond Trim? Create Account',
    'auth.logout': 'Sign Out',
    'auth.loginSuccess': 'Signed in successfully',
    'auth.regSuccess': 'Account created! Welcome coupon WELCOME20 applied.',

    // Customer Dashboard
    'account.myDashboard': 'Guest VIP Atelier Portal',
    'account.tier': 'VIP Status',
    'account.loyaltyPoints': 'Loyalty Reward Points',
    'account.totalVisits': 'Atelier Visits',
    'account.totalSpent': 'Total Lifetime Value',
    'account.myBookings': 'My Bookings',
    'account.myCoupons': 'My Coupons & Offers',
    'account.preferences': 'Atelier Preferences',
    'account.noBookings': 'No active reservations yet. Book your first private suite appointment today!',
    'account.refreshmentPref': 'Preferred Refreshment',
    'account.privacyPref': 'Acoustic Suite Mode',
    'account.allergyPref': 'Special Care & Allergy Notes',

    // Coupons & Promotions
    'promo.title': 'Exclusive Promotions & Vouchers',
    'promo.subtitle': 'Redeem luxury savings on your next appointment in our private VIP suites.',
    'promo.enterCode': 'Enter Promo Code',
    'promo.applied': 'Coupon Applied!',
    'promo.invalid': 'Invalid or expired coupon code',

    // SaaS B2B Section
    'saas.title': 'Power Your Luxury Salon with Diamond Trim Atelier OS',
    'saas.subtitle': 'Sell your treatments online with 3D/video hero interaction, multi-suite management, automated customer journey tracking, and global multi-currency payments.',
    'saas.monthly': 'Monthly Billing',
    'saas.annual': 'Annual Billing (Save 20%)',
    'saas.perMonth': '/ month',
    'saas.startTrial': 'Start 14-Day Free Trial',
    'saas.bookDemo': 'Request Salon Demo',
  },

  ar: {
    // Navigation (Arabic)
    'nav.services': 'الخدمات',
    'nav.whyUs': 'لماذا داياموند تريم',
    'nav.gallery': 'المعرض',
    'nav.reviews': 'التقييمات',
    'nav.faq': 'الأسئلة الشائعة',
    'nav.contact': 'اتصل بنا',
    'nav.forSalons': 'للصالونات والشركات (SaaS)',
    'nav.admin': 'لوحة الإدارة',
    'nav.book': 'حجز موعد',
    'nav.signIn': 'تسجيل الدخول',
    'nav.myAccount': 'حسابي',
    'nav.promotions': 'العروض والكوبونات',

    // Hero Section
    'hero.badge': 'خصوصية صوتية تامة • أجنحة VIP فائقة التعقيم',
    'hero.subtitle': 'إذا كنت تبحث عن استرخاء عميق لجسمك وعقلك، تفضل بزيارة أجنحتنا الخاصة واستمتع بجلسات التجميل والعناية الفاخرة.',
    'hero.ctaReadMore': 'استكشف الخدمات',
    'hero.ctaBook': 'احجز الجناح',

    // Common UI
    'common.duration': 'المدة',
    'common.price': 'السعر',
    'common.apply': 'تطبيق',
    'common.discount': 'الخصم',
    'common.total': 'المجموع الإجمالي',
    'common.subtotal': 'المجموع الفرعي',
    'common.savings': 'التوفير',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ التغييرات',
    'common.loading': 'جاري التحميل...',
    'common.copied': 'تم النسخ للحافظة!',
    'common.copyCode': 'نسخ الكود',
    'common.claim': 'الحصول على الكوبون',
    'common.claimed': 'تم الحصول عليه',
    'common.redeem': 'استخدام في الحجز',
    'common.switchCurrency': 'العملة',
    'common.switchLanguage': 'اللغة',

    // Customer Auth & Account
    'auth.welcomeBack': 'مرحباً بعودتك إلى داياموند تريم',
    'auth.welcomeSub': 'قم بتسجيل الدخول لإدارة مواعيدك، واستعراض نقاط الولاء، والاستفادة من العروض الحصرية.',
    'auth.createAccount': 'إنشاء حساب ضيف VIP',
    'auth.createSub': 'انضم إلى صالون داياموند تريم للحصول على خصم ترحيبي 20% وتفضيلات الأجنحة الخاصة.',
    'auth.fullName': 'الاسم الكامل',
    'auth.email': 'البريد الإلكتروني',
    'auth.phone': 'رقم الهاتف',
    'auth.password': 'كلمة المرور',
    'auth.loginBtn': 'تسجيل الدخول',
    'auth.registerBtn': 'إنشاء حساب والحصول على خصم 20%',
    'auth.haveAccount': 'لديك حساب بالفعل؟ تسجيل الدخول',
    'auth.needAccount': 'جديد في داياموند تريم؟ أنشئ حساباً',
    'auth.logout': 'تسجيل الخروج',
    'auth.loginSuccess': 'تم تسجيل الدخول بنجاح',
    'auth.regSuccess': 'تم إنشاء الحساب بنجاح! تم تطبيق كود الترحيب WELCOME20.',

    // Customer Dashboard
    'account.myDashboard': 'بوابة ضيوف VIP',
    'account.tier': 'فئة العضوية VIP',
    'account.loyaltyPoints': 'نقاط مكافآت الولاء',
    'account.totalVisits': 'عدد الزيارات',
    'account.totalSpent': 'إجمالي الإنفاق',
    'account.myBookings': 'مواعيدي',
    'account.myCoupons': 'كوبوناتي وعروضي',
    'account.preferences': 'تفضيلات الجناح الخاص',
    'account.noBookings': 'لا توجد حجوزات نشطة حالياً. احجز أول موعد لك في أجنحتنا الخاصة اليوم!',
    'account.refreshmentPref': 'المشروب المفضل',
    'account.privacyPref': 'درجة العزل الصوتي للجناح',
    'account.allergyPref': 'ملاحظات الحساسية والعناية الخاصة',

    // Coupons & Promotions
    'promo.title': 'العروض الحصرية والكوبونات',
    'promo.subtitle': 'استمتع بخصومات فاخرة على موعدك القادم في أجنحتنا الملكية المعزولة.',
    'promo.enterCode': 'أدخل كود الخصم',
    'promo.applied': 'تم تطبيق الكوبون!',
    'promo.invalid': 'كود الكوبون غير صحيح أو منتهي الصلاحية',

    // SaaS B2B Section
    'saas.title': 'شغّل صالونك الراقي بنظام Diamond Trim Atelier OS',
    'saas.subtitle': 'منصة رقمية متكاملة لصالونات التجميل الفاخرة مع نظام حجز تفاعلي، إدارة الأجنحة، تتبع رحلة العميل والعملات المتعددة.',
    'saas.monthly': 'اشتراك شهري',
    'saas.annual': 'اشتراك سنوي (خصم 20%)',
    'saas.perMonth': '/ شهرياً',
    'saas.startTrial': 'ابدأ تجربة مجانية 14 يوماً',
    'saas.bookDemo': 'طلب عرض توضيحي للصالون',
  },

  fr: {
    // Navigation (French)
    'nav.services': 'Prestations',
    'nav.whyUs': 'Pourquoi Diamond Trim',
    'nav.gallery': 'Galerie',
    'nav.reviews': 'Avis Clients',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contact',
    'nav.forSalons': 'Pour Salons (SaaS)',
    'nav.admin': 'Administration',
    'nav.book': 'Prendre Rendez-vous',
    'nav.signIn': 'Connexion',
    'nav.myAccount': 'Mon Compte',
    'nav.promotions': 'Offres & Coupons',

    // Hero Section
    'hero.badge': 'Confidentialité Acoustique • Suites Stériles VIP',
    'hero.subtitle': 'Si vous cherchez à détendre votre corps et votre esprit, rejoignez nos suites privées et vivez une expérience sur mesure.',
    'hero.ctaReadMore': 'Découvrir les Soins',
    'hero.ctaBook': 'Réserver une Suite',

    // Common UI
    'common.duration': 'Durée',
    'common.price': 'Tarif',
    'common.apply': 'Appliquer',
    'common.discount': 'Remise',
    'common.total': 'Total',
    'common.subtotal': 'Sous-total',
    'common.savings': 'Économies',
    'common.cancel': 'Annuler',
    'common.save': 'Enregistrer',
    'common.loading': 'Chargement...',
    'common.copied': 'Copié dans le presse-papier !',
    'common.copyCode': 'Copier le code',
    'common.claim': 'Obtenir le bon',
    'common.claimed': 'Obtenu',
    'common.redeem': 'Utiliser pour la réservation',
    'common.switchCurrency': 'Devise',
    'common.switchLanguage': 'Langue',

    // Customer Auth & Account
    'auth.welcomeBack': 'Bienvenue chez Diamond Trim',
    'auth.welcomeSub': 'Connectez-vous pour gérer vos rendez-vous, suivre vos points de fidélité et profiter de promotions exclusives.',
    'auth.createAccount': 'Créer votre Compte Privilège VIP',
    'auth.createSub': 'Rejoignez Diamond Trim Atelier et bénéficiez de 20% de remise de bienvenue.',
    'auth.fullName': 'Nom Complet',
    'auth.email': 'Adresse E-mail',
    'auth.phone': 'Téléphone',
    'auth.password': 'Mot de passe',
    'auth.loginBtn': 'Se Connecter',
    'auth.registerBtn': 'Créer mon Compte (-20%)',
    'auth.haveAccount': 'Déjà un compte ? Connectez-vous',
    'auth.needAccount': 'Nouveau client ? Créer un compte',
    'auth.logout': 'Déconnexion',
    'auth.loginSuccess': 'Connexion réussie',
    'auth.regSuccess': 'Compte créé avec succès ! Code de bienvenue WELCOME20 appliqué.',

    // Customer Dashboard
    'account.myDashboard': 'Espace Client VIP Atelier',
    'account.tier': 'Statut VIP',
    'account.loyaltyPoints': 'Points Fidélité',
    'account.totalVisits': 'Visites à l’Atelier',
    'account.totalSpent': 'Total Dépensé',
    'account.myBookings': 'Mes Rendez-vous',
    'account.myCoupons': 'Mes Coupons & Offres',
    'account.preferences': 'Préférences en Suite',
    'account.noBookings': 'Aucune réservation active. Réservez votre première suite privée aujourd’hui !',
    'account.refreshmentPref': 'Boisson Favorite',
    'account.privacyPref': 'Ambiance Acoustique',
    'account.allergyPref': 'Précautions & Allergies',

    // Coupons & Promotions
    'promo.title': 'Offres Exclusives & Bons Privilèges',
    'promo.subtitle': 'Profitez de remises prestigieuses sur votre prochain soin en suite privée.',
    'promo.enterCode': 'Code Promo',
    'promo.applied': 'Coupon Appliqué !',
    'promo.invalid': 'Code coupon invalide ou expiré',

    // SaaS B2B Section
    'saas.title': 'Propulsez votre Salon avec Diamond Trim Atelier OS',
    'saas.subtitle': 'La solution SaaS tout-en-un pour salons de luxe : réservations 3D interactives, gestion des suites, CRM parcours client et devises internationales.',
    'saas.monthly': 'Facturation Mensuelle',
    'saas.annual': 'Facturation Annuelle (-20%)',
    'saas.perMonth': '/ mois',
    'saas.startTrial': 'Essai Gratuit 14 Jours',
    'saas.bookDemo': 'Demander une Démo',
  },

  es: {
    // Navigation (Spanish)
    'nav.services': 'Servicios',
    'nav.whyUs': 'Por Qué Elegirnos',
    'nav.gallery': 'Galería',
    'nav.reviews': 'Opiniones',
    'nav.faq': 'Preguntas',
    'nav.contact': 'Contacto',
    'nav.forSalons': 'Para Salones (SaaS)',
    'nav.admin': 'Administración',
    'nav.book': 'Reservar Cita',
    'nav.signIn': 'Iniciar Sesión',
    'nav.myAccount': 'Mi Cuenta',
    'nav.promotions': 'Ofertas y Cupones',

    // Hero Section
    'hero.badge': 'Privacidad Acústica • Suites Estériles VIP',
    'hero.subtitle': 'Si busca relajar cuerpo y mente, visite nuestras suites privadas y disfrute de tratamientos magistrales a medida.',
    'hero.ctaReadMore': 'Ver Tratamientos',
    'hero.ctaBook': 'Reservar Suite',

    // Common UI
    'common.duration': 'Duración',
    'common.price': 'Precio',
    'common.apply': 'Aplicar',
    'common.discount': 'Descuento',
    'common.total': 'Total',
    'common.subtotal': 'Subtotal',
    'common.savings': 'Ahorro',
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar Cambios',
    'common.loading': 'Cargando...',
    'common.copied': '¡Copiado al portapapeles!',
    'common.copyCode': 'Copiar Código',
    'common.claim': 'Reclamar Cupón',
    'common.claimed': 'Reclamado',
    'common.redeem': 'Canjear en Reserva',
    'common.switchCurrency': 'Moneda',
    'common.switchLanguage': 'Idioma',

    // Customer Auth & Account
    'auth.welcomeBack': 'Bienvenido a Diamond Trim',
    'auth.welcomeSub': 'Inicie sesión para gestionar sus citas, puntos de fidelidad y ofertas exclusivas.',
    'auth.createAccount': 'Crear Cuenta de Huésped VIP',
    'auth.createSub': 'Únase a Diamond Trim Atelier y obtenga un 20% de descuento de bienvenida.',
    'auth.fullName': 'Nombre Completo',
    'auth.email': 'Correo Electrónico',
    'auth.phone': 'Teléfono',
    'auth.password': 'Contraseña',
    'auth.loginBtn': 'Iniciar Sesión',
    'auth.registerBtn': 'Crear Cuenta y Obtener 20%',
    'auth.haveAccount': '¿Ya tiene cuenta? Iniciar Sesión',
    'auth.needAccount': '¿Nuevo cliente? Crear Cuenta',
    'auth.logout': 'Cerrar Sesión',
    'auth.loginSuccess': 'Sesión iniciada con éxito',
    'auth.regSuccess': '¡Cuenta creada! Cupón de bienvenida WELCOME20 aplicado.',

    // Customer Dashboard
    'account.myDashboard': 'Portal de Huéspedes VIP',
    'account.tier': 'Nivel VIP',
    'account.loyaltyPoints': 'Puntos de Fidelidad',
    'account.totalVisits': 'Visitas al Atelier',
    'account.totalSpent': 'Gasto Total',
    'account.myBookings': 'Mis Citas',
    'account.myCoupons': 'Mis Cupones y Ofertas',
    'account.preferences': 'Preferencias de Suite',
    'account.noBookings': 'Sin reservas activas. ¡Reserve su primera suite privada hoy!',
    'account.refreshmentPref': 'Bebida Preferida',
    'account.privacyPref': 'Modo de Privacidad Acústica',
    'account.allergyPref': 'Notas de Cuidado y Alergias',

    // Coupons & Promotions
    'promo.title': 'Promociones Exclusivas y Cupones',
    'promo.subtitle': 'Disfrute de descuentos de lujo en su próxima cita en nuestras suites privadas.',
    'promo.enterCode': 'Introducir Código',
    'promo.applied': '¡Cupón Aplicado!',
    'promo.invalid': 'Código de cupón no válido o caducado',

    // SaaS B2B Section
    'saas.title': 'Impulse su Salón de Belleza con Diamond Trim Atelier OS',
    'saas.subtitle': 'Plataforma SaaS integral para salones de lujo: reservas interactivas, gestión de suites, CRM de viaje del cliente y pagos multimoneda.',
    'saas.monthly': 'Facturación Mensual',
    'saas.annual': 'Facturación Anual (Ahorro 20%)',
    'saas.perMonth': '/ mes',
    'saas.startTrial': 'Prueba Gratuita de 14 Días',
    'saas.bookDemo': 'Solicitar Demostración',
  },

  ur: {
    // Navigation (Urdu - RTL)
    'nav.services': 'خدمات',
    'nav.whyUs': 'ڈائمنڈ ٹرم کیوں؟',
    'nav.gallery': 'گیلری',
    'nav.reviews': 'صارفین کی رائے',
    'nav.faq': 'اکثر پوچھے گئے سوالات',
    'nav.contact': 'رابطہ',
    'nav.forSalons': 'سیلون بزنس کے لیے (SaaS)',
    'nav.admin': 'ایڈمن پینل',
    'nav.book': 'اپوائنٹمنٹ بک کریں',
    'nav.signIn': 'لاگ ان کریں',
    'nav.myAccount': 'میرا اکاؤنٹ',
    'nav.promotions': 'آفرز اور کوپنز',

    // Hero Section
    'hero.badge': 'مکمل پرائیویسی • الٹرا سٹیرائل پرائیویٹ سویٹس',
    'hero.subtitle': 'اگر آپ جسم اور ذہن کو مکمل سکون دینا چاہتے ہیں تو ہمارے پرائیویٹ وی آئی پی سویٹس میں آئیں اور اعلیٰ ترین بیوٹی ٹریٹمنٹس حاصل کریں۔',
    'hero.ctaReadMore': 'تمام خدمات دیکھیں',
    'hero.ctaBook': 'سویٹ بک کریں',

    // Common UI
    'common.duration': 'دورانیہ',
    'common.price': 'قیمت',
    'common.apply': 'لاگو کریں',
    'common.discount': 'رعایت',
    'common.total': 'کل رقم',
    'common.subtotal': 'ذیلی کل',
    'common.savings': 'بچت',
    'common.cancel': 'منسوخ کریں',
    'common.save': 'تبدیلیاں محفوظ کریں',
    'common.loading': 'لوڈ ہو رہا ہے...',
    'common.copied': 'کوڈ کاپی ہو گیا!',
    'common.copyCode': 'کوڈ کاپی کریں',
    'common.claim': 'کوپن حاصل کریں',
    'common.claimed': 'حاصل کر لیا',
    'common.redeem': 'بکنگ میں استعمال کریں',
    'common.switchCurrency': 'کرنسی',
    'common.switchLanguage': 'زبان',

    // Customer Auth & Account
    'auth.welcomeBack': 'ڈائمنڈ ٹرم میں دوبارہ خوش آمدید',
    'auth.welcomeSub': 'اپنی بکنگز، لائلٹی پوائنٹس اور خصوصی آفرز دیکھنے کے لیے لاگ ان کریں۔',
    'auth.createAccount': 'وی آئی پی گیسٹ اکاؤنٹ بنائیں',
    'auth.createSub': 'ڈائمنڈ ٹرم اٹلیئر میں شامل ہوں اور 20% ویلکم ڈسکاؤنٹ حاصل کریں۔',
    'auth.fullName': 'پورا نام',
    'auth.email': 'ای میل ایڈریس',
    'auth.phone': 'فون نمبر',
    'auth.password': 'پاس ورڈ',
    'auth.loginBtn': 'لاگ ان کریں',
    'auth.registerBtn': 'اکاؤنٹ بنائیں اور 20% بچائیں',
    'auth.haveAccount': 'پہلے سے اکاؤنٹ ہے؟ لاگ ان کریں',
    'auth.needAccount': 'پہلی بار آئے ہیں؟ نیا اکاؤنٹ بنائیں',
    'auth.logout': 'لاگ آؤٹ',
    'auth.loginSuccess': 'لاگ ان کامیاب رہا',
    'auth.regSuccess': 'اکاؤنٹ کامیابی سے بن گیا! ویلکم کوپن WELCOME20 لاگو ہو گیا۔',

    // Customer Dashboard
    'account.myDashboard': 'وی آئی پی گیسٹ پورٹل',
    'account.tier': 'وی آئی پی اسٹیٹس',
    'account.loyaltyPoints': 'لائلٹی ریوارڈ پوائنٹس',
    'account.totalVisits': 'کل وزٹس',
    'account.totalSpent': 'کل خرچ',
    'account.myBookings': 'میری بکنگز',
    'account.myCoupons': 'میرے کوپنز اور آفرز',
    'account.preferences': 'پرائیویٹ سویٹ ترجیحات',
    'account.noBookings': 'ابھی تک کوئی بکنگ موجود نہیں۔ آج ہی اپنا پرائیویٹ سویٹ بک کریں!',
    'account.refreshmentPref': 'پسندیدہ مشروب',
    'account.privacyPref': 'پرائیویسی اور ساؤنڈ موڈ',
    'account.allergyPref': 'جلد کی الرجی یا خصوصی ہدایات',

    // Coupons & Promotions
    'promo.title': 'خصوصی پروموشنز اور ڈسکاؤنٹ واؤچرز',
    'promo.subtitle': 'ہمارے پرائیویٹ سویٹس میں اپنی اگلی اپوائنٹمنٹ پر خصوصی رعایت حاصل کریں۔',
    'promo.enterCode': 'پرومو کوڈ درج کریں',
    'promo.applied': 'کوپن لاگو ہو گیا!',
    'promo.invalid': 'کوپن غلط ہے یا ختم ہو چکا ہے',

    // SaaS B2B Section
    'saas.title': 'اپنے سیلون بزنس کو Diamond Trim Atelier OS سے خودکار بنائیں',
    'saas.subtitle': 'پریمیم سیلونز کے لیے مکمل کلاؤڈ سروس: انٹرایکٹو بکنگز، سویٹس مینجمنٹ، کسٹمر جرنی ٹریکنگ اور ملٹی کرنسی ادائیگیاں۔',
    'saas.monthly': 'ماہانہ سبسکرپشن',
    'saas.annual': 'سالانہ پلان (20% بچت)',
    'saas.perMonth': '/ ماہانہ',
    'saas.startTrial': '14 دن کا مفت ٹرائل شروع کریں',
    'saas.bookDemo': 'ڈیمو بک کریں',
  },
};
