import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Product, 
  Category, 
  CartItem, 
  Order, 
  OrderStatus, 
  ShippingAddress, 
  LibyanCity, 
  PromoDiscount, 
  StoreSettings, 
  UserProfile, 
  NotificationItem 
} from '../types';
import { 
  fetchProducts, 
  fetchCategories, 
  fetchStoreSettings, 
  fetchDiscounts, 
  createOrder, 
  fetchOrders, 
  updateOrderStatus, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  seedInitialDataIfNeeded 
} from '../services/db';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  DEFAULT_STORE_SETTINGS, 
  LIBYAN_CITIES_DATA 
} from '../services/sampleData';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User 
} from '../lib/firebase';
import { updateProfile } from 'firebase/auth';

export const ADMIN_EMAILS = [
  'admin@okaz.ly',
  'alllkolkamol@gmail.com'
];
export const DEFAULT_ADMIN_PASSWORD = 'Okaz@2026Admin';

interface StoreContextType {
  // Data
  products: Product[];
  categories: Category[];
  settings: StoreSettings;
  loading: boolean;
  
  // Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  shippingFee: number;
  discountAmount: number;
  cartTotal: number;
  appliedPromo: PromoDiscount | null;
  addToCart: (product: Product, quantity?: number, variants?: Record<string, string>) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Shipping
  selectedCity: LibyanCity | string;
  setSelectedCity: (city: LibyanCity | string) => void;
  shippingType: 'standard' | 'express';
  setShippingType: (type: 'standard' | 'express') => void;

  // Favorites
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  // Navigation & Views
  currentView: 'home' | 'search' | 'checkout' | 'account' | 'admin' | 'order-success';
  setCurrentView: (view: 'home' | 'search' | 'checkout' | 'account' | 'admin' | 'order-success') => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Modals & Drawers
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isSupportModalOpen: boolean;
  setIsSupportModalOpen: (open: boolean) => void;
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: (open: boolean) => void;
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;

  // Orders
  orders: Order[];
  lastOrder: Order | null;
  submitOrder: (shippingAddress: ShippingAddress, paymentMethod: any) => Promise<Order>;
  changeOrderStatus: (orderId: string, status: OrderStatus, note?: string) => Promise<void>;

  // Authentication & Roles
  user: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loginGoogle: () => Promise<void>;
  loginEmail: (email: string, pass: string) => Promise<void>;
  registerEmail: (email: string, pass: string, name: string) => Promise<void>;
  logoutUser: () => Promise<void>;

  // Admin Catalog Management
  saveProductAction: (product: Omit<Product, 'id'> | Product) => Promise<void>;
  deleteProductAction: (id: string) => Promise<void>;
  updateSettingsAction: (patch: Partial<StoreSettings>) => Promise<void>;
  refreshAllData: () => Promise<void>;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Formatting helper
  formatLYD: (amount: number) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [promos, setPromos] = useState<PromoDiscount[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Cart & checkout
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('okaz_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<PromoDiscount | null>(null);
  const [selectedCity, setSelectedCity] = useState<LibyanCity | string>('طرابلس');
  const [shippingType, setShippingType] = useState<'standard' | 'express'>('standard');
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('okaz_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Views & filters
  const [currentView, setCurrentView] = useState<'home' | 'search' | 'checkout' | 'account' | 'admin' | 'order-success'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [compareList, setCompareList] = useState<Product[]>([]);

  // Auth
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Theme
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('okaz_theme') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('okaz_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('okaz_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Persist cart & favorites
  useEffect(() => {
    try {
      localStorage.setItem('okaz_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('okaz_favorites', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const email = currentUser.email?.toLowerCase() || '';
        const isOwner = ADMIN_EMAILS.includes(email);
        setUserProfile(prev => ({
          uid: currentUser.uid,
          email: currentUser.email || '',
          displayName: currentUser.displayName || currentUser.email?.split('@')[0] || (isOwner ? 'مدير متجر عكاظ' : 'عميل عكاظ'),
          role: isOwner ? 'admin' : (prev?.role === 'admin' ? 'admin' : 'customer'),
          createdAt: prev?.createdAt || new Date().toISOString()
        }));
      } else {
        // Clear profile if not in custom admin session
        setUserProfile(prev => (prev?.role === 'admin' && prev.email === 'admin@okaz.ly' ? prev : null));
      }
    });
    return () => unsubscribe();
  }, []);

  // Initial data loading
  const loadStoreData = async () => {
    setLoading(true);
    try {
      await seedInitialDataIfNeeded();
      const [prods, cats, sets, disc, ords] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchStoreSettings(),
        fetchDiscounts(),
        fetchOrders(user?.uid)
      ]);
      if (prods.length > 0) setProducts(prods);
      if (cats.length > 0) setCategories(cats);
      setSettings(sets);
      setPromos(disc);
      setOrders(ords);
    } catch (err) {
      console.warn('Initial store data load warning:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStoreData();
  }, [user]);

  // Cart operations
  const addToCart = (product: Product, quantity = 1, variants?: Record<string, string>) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => 
        item.product.id === product.id && 
        JSON.stringify(item.selectedVariants || {}) === JSON.stringify(variants || {})
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(newQty, product.stockCount || 99)
        };
        return updated;
      } else {
        return [...prev, { product, quantity, selectedVariants: variants }];
      }
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity: Math.min(quantity, item.product.stockCount || 99) };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  // Cart calculations
  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }, [cart]);

  // Calculate Libyan shipping fee based on city and cart subtotal
  const shippingFee = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    if (cartSubtotal >= settings.freeShippingThreshold) return 0;

    const cityData = LIBYAN_CITIES_DATA.find(c => c.city === selectedCity);
    const baseFee = cityData ? cityData.fee : settings.standardShippingFee;
    return shippingType === 'express' ? baseFee + 12 : baseFee;
  }, [cartSubtotal, selectedCity, shippingType, settings]);

  const discountAmount = useMemo(() => {
    if (!appliedPromo || cartSubtotal === 0) return 0;
    if (appliedPromo.minOrderAmount && cartSubtotal < appliedPromo.minOrderAmount) return 0;

    if (appliedPromo.discountType === 'percentage') {
      return Math.round((cartSubtotal * appliedPromo.value) / 100);
    } else {
      return Math.min(appliedPromo.value, cartSubtotal);
    }
  }, [appliedPromo, cartSubtotal]);

  const cartTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - discountAmount + shippingFee);
  }, [cartSubtotal, discountAmount, shippingFee]);

  const applyPromoCode = (code: string): { success: boolean; message: string } => {
    const normalized = code.trim().toUpperCase();
    const found = promos.find(p => p.code.toUpperCase() === normalized && p.active);

    if (!found) {
      return { success: false, message: 'رمز القسيمة غير صالح أو منتهي الصلاحية' };
    }

    if (found.minOrderAmount && cartSubtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `الحد الأدنى للطلب لتفعيل هذا الكوبون هو ${found.minOrderAmount} د.ل`
      };
    }

    setAppliedPromo(found);
    return { 
      success: true, 
      message: `تم تطبيق كود الخصم بنجاح! وفرت ${found.discountType === 'percentage' ? `${found.value}%` : `${found.value} د.ل`}` 
    };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  // Favorites
  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  // Compare
  const addToCompare = (product: Product) => {
    setCompareList(prev => {
      if (prev.find(p => p.id === product.id)) return prev;
      if (prev.length >= 3) {
        return [prev[1], prev[2], product];
      }
      return [...prev, product];
    });
    setIsCompareModalOpen(true);
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(prev => prev.filter(p => p.id !== productId));
  };

  const clearCompare = () => setCompareList([]);

  // Order submission
  const submitOrder = async (
    shippingAddress: ShippingAddress, 
    paymentMethod: any
  ): Promise<Order> => {
    const orderData = {
      userId: user?.uid || 'guest-' + Date.now(),
      customerEmail: user?.email || shippingAddress.phoneNumber + '@okaz.guest',
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images[0] || '',
        price: item.product.price,
        quantity: item.quantity,
        selectedVariants: item.selectedVariants
      })),
      shippingAddress,
      shippingCost: shippingFee,
      shippingType,
      subtotal: cartSubtotal,
      discountAmount,
      promoCode: appliedPromo?.code,
      total: cartTotal,
      paymentMethod,
      paymentStatus: 'pending' as const,
      status: 'pending' as const
    };

    const newOrder = await createOrder(orderData);
    setOrders(prev => [newOrder, ...prev]);
    setLastOrder(newOrder);
    clearCart();
    setCurrentView('order-success');
    return newOrder;
  };

  const changeOrderStatus = async (orderId: string, status: OrderStatus, note?: string) => {
    await updateOrderStatus(orderId, status, note);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  // Auth methods
  const loginGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const email = res.user.email?.toLowerCase() || '';
      const isOwner = ADMIN_EMAILS.includes(email);
      
      setUserProfile({
        uid: res.user.uid,
        email: res.user.email || '',
        displayName: res.user.displayName || (isOwner ? 'مدير متجر عكاظ' : 'عميل عكاظ'),
        role: isOwner ? 'admin' : 'customer',
        createdAt: new Date().toISOString()
      });

      setIsAuthModalOpen(false);
      if (isOwner) {
        // Automatically redirect to Admin Dashboard!
        setCurrentView('admin');
      } else {
        if (currentView === 'admin') {
          setCurrentView('home');
        }
      }
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      throw err;
    }
  };

  const loginEmail = async (email: string, pass: string) => {
    const normalizedEmail = email.trim().toLowerCase();

    try {
      // 1. Dedicated Admin check (admin@okaz.ly / Okaz@2026Admin)
      if (normalizedEmail === 'admin@okaz.ly' && pass === DEFAULT_ADMIN_PASSWORD) {
        let loggedUser: any = null;
        try {
          const cred = await signInWithEmailAndPassword(auth, normalizedEmail, pass);
          loggedUser = cred.user;
        } catch (authErr: any) {
          if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential') {
            try {
              const cred = await createUserWithEmailAndPassword(auth, normalizedEmail, pass);
              await updateProfile(cred.user, { displayName: 'مدير متجر عكاظ' });
              loggedUser = cred.user;
            } catch (createErr) {
              console.warn('Fallback admin local session:', createErr);
            }
          }
        }

        setUserProfile({
          uid: loggedUser?.uid || 'admin-okaz-master',
          email: normalizedEmail,
          displayName: 'مدير متجر عكاظ',
          role: 'admin',
          createdAt: new Date().toISOString()
        });

        setIsAuthModalOpen(false);
        // Automatically redirect to Admin Dashboard!
        setCurrentView('admin');
        return;
      }

      // 2. Regular Firebase Auth Login
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const isOwner = ADMIN_EMAILS.includes(cred.user.email?.toLowerCase() || '');

      setUserProfile({
        uid: cred.user.uid,
        email: cred.user.email || email,
        displayName: cred.user.displayName || cred.user.email?.split('@')[0] || (isOwner ? 'مدير متجر عكاظ' : 'عميل عكاظ'),
        role: isOwner ? 'admin' : 'customer',
        createdAt: new Date().toISOString()
      });

      setIsAuthModalOpen(false);
      if (isOwner) {
        // Automatically redirect to Admin Dashboard!
        setCurrentView('admin');
      } else {
        if (currentView === 'admin') {
          setCurrentView('home');
        }
      }
    } catch (err: any) {
      console.error('Email Sign In Error:', err);
      throw err;
    }
  };

  const registerEmail = async (email: string, pass: string, name: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      const isOwner = ADMIN_EMAILS.includes(email.toLowerCase());
      setUserProfile({
        uid: res.user.uid,
        email,
        displayName: name,
        role: isOwner ? 'admin' : 'customer',
        createdAt: new Date().toISOString()
      });
      setIsAuthModalOpen(false);
      if (isOwner) {
        setCurrentView('admin');
      }
    } catch (err: any) {
      console.error('Email Registration Error:', err);
      throw err;
    }
  };

  const logoutUser = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    setUser(null);
    setUserProfile(null);
    setCurrentView('home');
  };

  // Admin operations
  const isAdmin = useMemo(() => {
    const email = (user?.email || userProfile?.email || '').toLowerCase();
    return ADMIN_EMAILS.includes(email) || userProfile?.role === 'admin';
  }, [user, userProfile]);

  const saveProductAction = async (product: Omit<Product, 'id'> | Product) => {
    if ('id' in product && product.id) {
      await updateProduct(product.id, product);
      setProducts(prev => prev.map(p => p.id === product.id ? (product as Product) : p));
    } else {
      const created = await addProduct(product as Omit<Product, 'id'>);
      setProducts(prev => [created, ...prev]);
    }
  };

  const deleteProductAction = async (id: string) => {
    await deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateSettingsAction = async (patch: Partial<StoreSettings>) => {
    setSettings(prev => ({ ...prev, ...patch }));
  };

  const refreshAllData = async () => {
    await loadStoreData();
  };

  // Libyan Dinar formatting helper
  const formatLYD = (amount: number) => {
    return `${Number(amount).toLocaleString('ar-LY')} د.ل`;
  };

  return (
    <StoreContext.Provider value={{
      products,
      categories,
      settings,
      loading,
      cart,
      cartCount,
      cartSubtotal,
      shippingFee,
      discountAmount,
      cartTotal,
      appliedPromo,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      applyPromoCode,
      removePromoCode,
      isCartOpen,
      setIsCartOpen,
      selectedCity,
      setSelectedCity,
      shippingType,
      setShippingType,
      favorites,
      toggleFavorite,
      isFavorite,
      currentView,
      setCurrentView,
      selectedCategory,
      setSelectedCategory,
      selectedProduct,
      setSelectedProduct,
      searchQuery,
      setSearchQuery,
      isAuthModalOpen,
      setIsAuthModalOpen,
      isSupportModalOpen,
      setIsSupportModalOpen,
      isCompareModalOpen,
      setIsCompareModalOpen,
      compareList,
      addToCompare,
      removeFromCompare,
      clearCompare,
      orders,
      lastOrder,
      submitOrder,
      changeOrderStatus,
      user,
      userProfile,
      isAdmin,
      loginGoogle,
      loginEmail,
      registerEmail,
      logoutUser,
      saveProductAction,
      deleteProductAction,
      updateSettingsAction,
      refreshAllData,
      isDarkMode,
      toggleDarkMode,
      formatLYD
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
