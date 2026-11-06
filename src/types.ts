export type Theme = 'light' | 'dark';
export type Language = 'en' | 'ar';
export type Currency = 'USD' | 'EUR' | 'AED';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'customer' | 'admin' | 'superadmin';
  permissions?: {
    canAddAdmins?: boolean;
    canRemoveAdmins?: boolean;
    canChangePermissions?: boolean;
    canManageInventory?: boolean;
  };
}

export interface Product {
  id: string;
  nameEn: string;
  nameAr: string;
  brand?: string;
  brandAr?: string;
  sku?: string;
  descriptionEn: string;
  descriptionAr: string;
  category: 'watches' | 'perfumes';
  price: number;
  rating: number;
  stock: number;
  image: string;
  images: string[];
  specsEn: Record<string, string>;
  specsAr: Record<string, string>;
  featured: boolean;
  status: 'active' | 'draft' | 'out_of_stock';
  reviewsCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Certificate {
  issued: boolean;
  certificateId: string;
  issuedAt: string;
  verificationCode: string;
  pdfGenerated: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  products: any;
  originalProducts?: any[];
  price: number;
  totalPrice?: number;
  status: 'Pending' | 'Preparing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus?: 'paid' | 'unpaid' | 'refunded';
  payment?: string;
  shipping?: string;
  shippingAddress?: string;
  phone?: string;
  date: string;
  createdAt?: string;
  certificate?: Certificate;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'suspended';
  orderCount: number;
  totalSpent: number;
  createdAt: string;
}

export interface AdminStats {
  totalSales: number;
  totalRevenue: number;
  totalProfit: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  isFreeShipping?: boolean;
  active: boolean;
  expiresAt: any;
  usageLimit: number;
  usedCount: number;
  minimumOrderAmount: number;
  description: string;
}

export interface TranslationKeys {
  appName: string;
  brandTagline: string;
  loadingMessage: string;
  languageEn: string;
  languageAr: string;
  themeLight: string;
  themeDark: string;
  foundationShowcase: string;
  responsiveTest: string;
  typographyShowcase: string;
  brandColors: string;
  luxeExperience: string;
  interactiveDesign: string;
  activeLanguage: string;
  activeTheme: string;
  arabicRtlCheck: string;
  englishLtrCheck: string;
  layoutResponsiveDesc: string;
  goldAccent: string;
  platinumAccent: string;
  slateAccent: string;
  obsidianAccent: string;
  watchesCategory: string;
  perfumesCategory: string;
  readyForNextPhases: string;
  readyForNextPhasesDesc: string;
  initialWelcome: string;
  welcomeSub: string;
  enterButton: string;
  // Auth translation keys
  loginTitle: string;
  registerTitle: string;
  forgotPasswordTitle: string;
  emailLabel: string;
  passwordLabel: string;
  confirmPasswordLabel: string;
  nameLabel: string;
  loginButton: string;
  registerButton: string;
  resetPasswordButton: string;
  forgotPasswordLink: string;
  backToLoginLink: string;
  noAccountText: string;
  createAccountLink: string;
  haveAccountText: string;
  loginSuccessMsg: string;
  registerSuccessMsg: string;
  resetSuccessMsg: string;
  validationError: string;
  logoutButton: string;
  adminPortal: string;
  customerPortal: string;
  roleLabel: string;
  roleAdmin: string;
  roleCustomer: string;
  // Storefront translations
  navHome: string;
  navProducts: string;
  navCategories: string;
  navFavorites: string;
  navCart: string;
  navProfile: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCTA: string;
  featuredProductsTitle: string;
  bestSellersTitle: string;
  viewAll: string;
  addToCart: string;
  quickView: string;
  // Product & Shop translations
  price: string;
  filters: string;
  sortBy: string;
  searchProducts: string;
  productDetails: string;
  specifications: string;
  relatedProducts: string;
  cartTitle: string;
  favoritesTitle: string;
  checkout: string;
  emptyCart: string;
  emptyFavorites: string;
  // Admin translation keys
  adminDashboard: string;
  overview: string;
  manageProducts: string;
  manageOrders: string;
  manageCustomers: string;
  analytics: string;
  inventory: string;
  settings: string;
  logout: string;
}
