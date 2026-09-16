import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  Product, 
  Category, 
  Order, 
  OrderStatus, 
  Review, 
  PromoDiscount, 
  StoreSettings, 
  NotificationItem,
  UserProfile 
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_PROMOS, 
  DEFAULT_STORE_SETTINGS 
} from './sampleData';

// Local storage fallback keys
const LS_PRODUCTS = 'okaz_products_cache';
const LS_ORDERS = 'okaz_orders_cache';
const LS_CATEGORIES = 'okaz_categories_cache';
const LS_SETTINGS = 'okaz_settings_cache';
const LS_PROMOS = 'okaz_promos_cache';
const LS_REVIEWS = 'okaz_reviews_cache';

// Helper for local storage
function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal(key: string, val: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

// Ensure database has initial data
let seedAttempted = false;
export async function seedInitialDataIfNeeded(): Promise<void> {
  if (seedAttempted) return;
  seedAttempted = true;

  try {
    const productsRef = collection(db, 'products');
    const snap = await getDocs(productsRef);
    
    if (snap.empty) {
      console.log('Seeding initial products into Firestore...');
      for (const prod of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), {
          ...prod,
          createdAt: new Date().toISOString()
        });
      }

      console.log('Seeding categories...');
      for (const cat of INITIAL_CATEGORIES) {
        await setDoc(doc(db, 'categories', cat.id), cat);
      }

      console.log('Seeding settings...');
      await setDoc(doc(db, 'settings', 'main'), DEFAULT_STORE_SETTINGS);

      console.log('Seeding promos...');
      for (const promo of INITIAL_PROMOS) {
        await setDoc(doc(db, 'discounts', promo.id), promo);
      }
    }
  } catch (error) {
    console.warn('Firestore seeding notice (using local cache mode):', error);
  }
}

// ---------------- PRODUCTS ----------------

export async function fetchProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, 'products');
    const snap = await getDocs(productsRef);
    if (!snap.empty) {
      const items: Product[] = [];
      snap.forEach(docSnap => {
        items.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      setLocal(LS_PRODUCTS, items);
      return items;
    }
  } catch (error) {
    console.warn('Firestore fetchProducts error, falling back to cache:', error);
  }
  return getLocal<Product[]>(LS_PRODUCTS, INITIAL_PRODUCTS);
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const newId = 'prod-' + Date.now();
  const newProduct: Product = {
    ...product,
    id: newId,
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'products', newId), newProduct);
  } catch (err) {
    console.warn('Failed to write product to Firestore, storing locally:', err);
  }

  // Update local cache
  const localList = getLocal<Product[]>(LS_PRODUCTS, INITIAL_PRODUCTS);
  const updated = [newProduct, ...localList];
  setLocal(LS_PRODUCTS, updated);

  return newProduct;
}

export async function updateProduct(id: string, patch: Partial<Product>): Promise<void> {
  try {
    await updateDoc(doc(db, 'products', id), patch);
  } catch (err) {
    console.warn('Firestore updateProduct fallback to local cache:', err);
  }

  const localList = getLocal<Product[]>(LS_PRODUCTS, INITIAL_PRODUCTS);
  const updated = localList.map(p => p.id === id ? { ...p, ...patch } : p);
  setLocal(LS_PRODUCTS, updated);
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'products', id));
  } catch (err) {
    console.warn('Firestore deleteProduct fallback:', err);
  }

  const localList = getLocal<Product[]>(LS_PRODUCTS, INITIAL_PRODUCTS);
  const updated = localList.filter(p => p.id !== id);
  setLocal(LS_PRODUCTS, updated);
}

// ---------------- CATEGORIES ----------------

export async function fetchCategories(): Promise<Category[]> {
  try {
    const snap = await getDocs(collection(db, 'categories'));
    if (!snap.empty) {
      const cats: Category[] = [];
      snap.forEach(d => cats.push({ id: d.id, ...(d.data() as any) }));
      setLocal(LS_CATEGORIES, cats);
      return cats;
    }
  } catch (err) {
    console.warn('fetchCategories fallback:', err);
  }
  return getLocal<Category[]>(LS_CATEGORIES, INITIAL_CATEGORIES);
}

export async function addCategory(category: Category): Promise<void> {
  try {
    await setDoc(doc(db, 'categories', category.id), category);
  } catch (err) {
    console.warn('addCategory fallback:', err);
  }
  const current = getLocal<Category[]>(LS_CATEGORIES, INITIAL_CATEGORIES);
  setLocal(LS_CATEGORIES, [...current, category]);
}

// ---------------- ORDERS ----------------

export async function createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order> {
  const timestamp = new Date().toISOString();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const orderNumber = `OKZ-${randomNum}`;
  const orderId = 'order-' + Date.now();

  const newOrder: Order = {
    ...orderData,
    id: orderId,
    orderNumber,
    createdAt: timestamp,
    updatedAt: timestamp,
    timeline: [
      {
        status: 'pending',
        timestamp,
        note: 'تم استلام طلبك بنجاح وجاري المراجعة'
      }
    ]
  };

  try {
    await setDoc(doc(db, 'orders', orderId), newOrder);
  } catch (err) {
    console.warn('createOrder fallback to local storage:', err);
  }

  const currentOrders = getLocal<Order[]>(LS_ORDERS, []);
  setLocal(LS_ORDERS, [newOrder, ...currentOrders]);

  return newOrder;
}

export async function fetchOrders(userId?: string): Promise<Order[]> {
  try {
    let q;
    if (userId) {
      q = query(collection(db, 'orders'), where('userId', '==', userId));
    } else {
      q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    }
    const snap = await getDocs(q);
    if (!snap.empty) {
      const orders: Order[] = [];
      snap.forEach(d => orders.push({ id: d.id, ...(d.data() as any) }));
      setLocal(LS_ORDERS, orders);
      return orders;
    }
  } catch (err) {
    console.warn('fetchOrders fallback:', err);
  }

  const allOrders = getLocal<Order[]>(LS_ORDERS, []);
  if (userId) {
    return allOrders.filter(o => o.userId === userId);
  }
  return allOrders;
}

export async function updateOrderStatus(
  orderId: string, 
  status: OrderStatus, 
  note?: string
): Promise<void> {
  const timestamp = new Date().toISOString();
  
  const allOrders = getLocal<Order[]>(LS_ORDERS, []);
  const target = allOrders.find(o => o.id === orderId);
  const updatedTimeline = target?.timeline ? [...target.timeline] : [];
  
  const statusLabels: Record<OrderStatus, string> = {
    pending: 'قيد المراجعة',
    confirmed: 'تم تأكيد الطلب',
    preparing: 'جاري تجهيز وتغليف الشحنة',
    shipped: 'تم تسليم الشحنة لمندوب التوصيل',
    delivered: 'تم توصيل الطلب بنجاح للعميل',
    cancelled: 'تم إلغاء الطلب'
  };

  updatedTimeline.push({
    status,
    timestamp,
    note: note || statusLabels[status]
  });

  const patch = {
    status,
    updatedAt: timestamp,
    timeline: updatedTimeline
  };

  try {
    await updateDoc(doc(db, 'orders', orderId), patch);
  } catch (err) {
    console.warn('updateOrderStatus fallback:', err);
  }

  const updatedOrders = allOrders.map(o => o.id === orderId ? { ...o, ...patch } : o);
  setLocal(LS_ORDERS, updatedOrders);
}

// ---------------- STORE SETTINGS ----------------

export async function fetchStoreSettings(): Promise<StoreSettings> {
  try {
    const docRef = doc(db, 'settings', 'main');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as StoreSettings;
      setLocal(LS_SETTINGS, data);
      return data;
    }
  } catch (err) {
    console.warn('fetchStoreSettings fallback:', err);
  }
  return getLocal<StoreSettings>(LS_SETTINGS, DEFAULT_STORE_SETTINGS);
}

export async function updateStoreSettings(settings: Partial<StoreSettings>): Promise<void> {
  try {
    await updateDoc(doc(db, 'settings', 'main'), settings);
  } catch (err) {
    console.warn('updateStoreSettings fallback:', err);
  }
  const current = getLocal<StoreSettings>(LS_SETTINGS, DEFAULT_STORE_SETTINGS);
  setLocal(LS_SETTINGS, { ...current, ...settings });
}

// ---------------- PROMO DISCOUNTS ----------------

export async function fetchDiscounts(): Promise<PromoDiscount[]> {
  try {
    const snap = await getDocs(collection(db, 'discounts'));
    if (!snap.empty) {
      const list: PromoDiscount[] = [];
      snap.forEach(d => list.push({ id: d.id, ...(d.data() as any) }));
      setLocal(LS_PROMOS, list);
      return list;
    }
  } catch (err) {
    console.warn('fetchDiscounts fallback:', err);
  }
  return getLocal<PromoDiscount[]>(LS_PROMOS, INITIAL_PROMOS);
}

export async function addPromoDiscount(promo: PromoDiscount): Promise<void> {
  try {
    await setDoc(doc(db, 'discounts', promo.id), promo);
  } catch (err) {}
  const list = getLocal<PromoDiscount[]>(LS_PROMOS, INITIAL_PROMOS);
  setLocal(LS_PROMOS, [promo, ...list]);
}

// ---------------- REVIEWS ----------------

export async function fetchProductReviews(productId: string): Promise<Review[]> {
  try {
    const q = query(collection(db, 'reviews'), where('productId', '==', productId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const list: Review[] = [];
      snap.forEach(d => list.push({ id: d.id, ...(d.data() as any) }));
      return list;
    }
  } catch (err) {
    console.warn('fetchProductReviews fallback:', err);
  }

  const allReviews = getLocal<Review[]>(LS_REVIEWS, [
    {
      id: 'rev-1',
      productId: 'prod-1',
      userId: 'user-sample',
      userName: 'محمد الفيتوري (طرابلس)',
      rating: 5,
      comment: 'هاتف أصلي 100%، وصلني خلال 24 ساعة إلى طرابلس ومعاينة قبل الدفع. شكراً متجر عكاظ!',
      createdAt: '2026-03-10',
      verifiedPurchase: true
    },
    {
      id: 'rev-2',
      productId: 'prod-2',
      userId: 'user-sample2',
      userName: 'أسامة الورفلي (بنغازي)',
      rating: 5,
      comment: 'العطر فخم جداً وثباته عالي وريحته تجلس يومين في الثوب. تغليف محترم وتوصيل ممتاز.',
      createdAt: '2026-03-12',
      verifiedPurchase: true
    }
  ]);
  return allReviews.filter(r => r.productId === productId);
}

export async function addReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
  const id = 'rev-' + Date.now();
  const newRev: Review = {
    ...review,
    id,
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'reviews', id), newRev);
  } catch (err) {}

  const all = getLocal<Review[]>(LS_REVIEWS, []);
  setLocal(LS_REVIEWS, [newRev, ...all]);
  return newRev;
}

export async function upsertUserProfile(profile: UserProfile): Promise<void> {
  try {
    await setDoc(doc(db, 'users', profile.uid), profile, { merge: true });
  } catch (err) {
    console.warn('upsertUserProfile fallback:', err);
  }
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch (err) {
    console.warn('fetchUserProfile fallback:', err);
  }
  return null;
}

