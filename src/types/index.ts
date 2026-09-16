export type ProductVariant = {
  id: string;
  name: string; // e.g. "اللون" or "الحجم" or "السعة"
  options: string[]; // e.g. ["أسود", "فضي", "ذهبي"]
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number; // in Libyan Dinar (د.ل)
  originalPrice?: number;
  description: string;
  features?: string[];
  images: string[];
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isNew?: boolean;
  discountPercentage?: number;
  variants?: ProductVariant[];
  sku?: string;
  tags?: string[];
  createdAt?: string;
};

export type Category = {
  id: string;
  name: string;
  iconName: string;
  image: string;
  productCount?: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
  selectedVariants?: Record<string, string>;
};

export type LibyanCity = 
  | 'طرابلس'
  | 'بنغازي'
  | 'مصراتة'
  | 'الزاوية'
  | 'البيضاء'
  | 'طبرق'
  | 'سبها'
  | 'سرت'
  | 'الخمس'
  | 'زليتن'
  | 'درنة'
  | 'غريان'
  | 'صبراتة'
  | 'أجدابيا';

export type OrderStatus = 
  | 'pending'    // قيد الانتظار
  | 'confirmed'  // تم التأكيد
  | 'preparing'  // جاري التجهيز
  | 'shipped'    // تم الشحن
  | 'delivered'  // تم التوصيل
  | 'cancelled'; // ملغي

export type ShippingAddress = {
  fullName: string;
  phoneNumber: string;
  secondaryPhone?: string;
  city: LibyanCity | string;
  neighborhood: string; // الحي
  street: string; // الشارع / أقرب نقطة دالة
  residenceDetails: string; // تفاصيل السكن / رقم العمارة أو المنزل
  notes?: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  userId?: string;
  customerEmail?: string;
  items: {
    productId: string;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
    selectedVariants?: Record<string, string>;
  }[];
  shippingAddress: ShippingAddress;
  shippingCost: number;
  shippingType: 'standard' | 'express'; // شحن عادي أو سريع
  subtotal: number;
  discountAmount: number;
  promoCode?: string;
  total: number;
  paymentMethod: 'cash_on_delivery' | 'sadad' | 'tadawul' | 'mobicash';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  timeline?: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
};

export type Review = {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1 - 5
  comment: string;
  createdAt: string;
  verifiedPurchase?: boolean;
};

export type UserProfile = {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  role: 'customer' | 'admin';
  savedAddresses?: ShippingAddress[];
  createdAt: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'promo' | 'system';
  link?: string;
  date: string;
  read: boolean;
};

export type PromoDiscount = {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number; // e.g. 10% or 25 LYD
  minOrderAmount?: number;
  active: boolean;
  expiresAt?: string;
};

export type StoreSettings = {
  storeName: string;
  storeTagline: string;
  contactPhone: string;
  contactWhatsApp: string;
  contactEmail: string;
  tripoliHubAddress: string;
  benghaziHubAddress: string;
  standardShippingFee: number;
  expressShippingFee: number;
  freeShippingThreshold: number;
  announcementText: string;
  showAnnouncement: boolean;
};
