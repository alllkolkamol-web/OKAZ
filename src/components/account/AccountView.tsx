import React, { useState, useEffect } from 'react';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  Clock, 
  Truck, 
  CheckCircle2, 
  LogOut, 
  Shield, 
  ChevronDown, 
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { fetchOrders } from '../../services/db';
import { Order } from '../../types';
import { ProductCard } from '../home/ProductCard';

export const AccountView: React.FC = () => {
  const { 
    user, 
    isAdmin, 
    logoutUser, 
    setIsAuthModalOpen, 
    setCurrentView, 
    favorites, 
    products, 
    formatLYD 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    setLoadingOrders(true);
    fetchOrders(user?.uid)
      .then(setOrders)
      .finally(() => setLoadingOrders(false));
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 mx-auto flex items-center justify-center">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-stone-900 dark:text-white">
          تسجيل الدخول لحسابك
        </h2>
        <p className="text-xs text-stone-500 leading-relaxed">
          قم بتسجيل الدخول لمتابعة حالة شحناتك، عرض سجل طلباتك السابقة، وحفظ المنتجات في المفضلة.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md cursor-pointer"
        >
          تسجيل الدخول أو إنشاء حساب جديد
        </button>
      </div>
    );
  }

  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  const STATUS_CONFIG: Record<string, { label: string; color: string; step: number }> = {
    pending: { label: 'قيد المراجعة', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50 border-amber-200', step: 1 },
    confirmed: { label: 'تم التأكيد وجاري التجهيز', color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/50 border-blue-200', step: 2 },
    out_for_delivery: { label: 'مع المندوب في الطريق', color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/50 border-purple-200', step: 3 },
    delivered: { label: 'تم التسليم بنجاح', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200', step: 4 },
    cancelled: { label: 'ملغي', color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/50 border-rose-200', step: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-right">
      
      {/* Account Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/60 shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-black text-xl border border-orange-500/20">
            {user.displayName ? user.displayName.charAt(0) : <User className="w-7 h-7" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-stone-900 dark:text-white">
                {user.displayName || 'عميل عكاظ المميز'}
              </h2>
              {isAdmin && (
                <span className="px-2 py-0.5 rounded-md bg-stone-900 text-white dark:bg-white dark:text-stone-900 text-[10px] font-black">
                  مدير المتجر
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-0.5" dir="ltr">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => setCurrentView('admin')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-black flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Shield className="w-4 h-4 text-white" />
              <span>لوحة التحكم الإدارية</span>
            </button>
          )}

          <button
            onClick={logoutUser}
            className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-500 hover:text-rose-500 transition-colors cursor-pointer"
            title="تسجيل الخروج"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-3 mb-8">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-orange-500 text-white shadow-md'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>طلباتي وتتبع الشحنات ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'wishlist'
              ? 'bg-orange-500 text-white shadow-md'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>قائمة المفضلة ({favoriteProducts.length})</span>
        </button>
      </div>

      {/* Tab 1: Orders & Tracking */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {loadingOrders ? (
            <p className="text-xs text-stone-400">جاري تحميل سجل الطلبات...</p>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-stone-800/60 rounded-3xl border border-stone-200/80 dark:border-stone-700/60 space-y-3">
              <Package className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="text-sm font-bold text-stone-800 dark:text-white">لم تقم بأي طلبات بعد</h3>
              <p className="text-xs text-stone-500">اختر ما يعجبك من متجر عكاظ وسنوصله لباب بيتك فوراً</p>
              <button
                onClick={() => setCurrentView('home')}
                className="px-5 py-2 rounded-2xl bg-orange-500 text-white font-bold text-xs"
              >
                تصفح المنتجات
              </button>
            </div>
          ) : (
            orders.map((order) => {
              const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const isExpanded = expandedOrderId === order.id;

              return (
                <div 
                  key={order.id}
                  className="bg-white dark:bg-stone-800/90 rounded-3xl border border-stone-200/80 dark:border-stone-700/60 overflow-hidden shadow-xs transition-all"
                >
                  {/* Order Summary Row */}
                  <div 
                    onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/50 dark:hover:bg-stone-700/20"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-stone-900 dark:text-white">
                            #{order.orderNumber}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-400 mt-1">
                          تاريخ الطلب: {order.createdAt.split('T')[0]} | الوجهة: {order.shippingAddress.city}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <div className="text-left">
                        <span className="text-xs text-stone-400 block">الإجمالي:</span>
                        <span className="text-sm font-black text-orange-600 dark:text-orange-400">
                          {formatLYD(order.total)}
                        </span>
                      </div>

                      <div className="p-1 rounded-xl text-stone-400 hover:text-stone-700">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Tracking Stepper */}
                  <div className="px-6 py-4 bg-stone-50/70 dark:bg-stone-900/50 border-t border-stone-100 dark:border-stone-800">
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
                      <div className={`p-2 rounded-xl border ${status.step >= 1 ? 'border-orange-500 bg-orange-500/10 text-orange-600' : 'border-stone-200 dark:border-stone-700 text-stone-400'}`}>
                        1. تم الاستلام
                      </div>
                      <div className={`p-2 rounded-xl border ${status.step >= 2 ? 'border-orange-500 bg-orange-500/10 text-orange-600' : 'border-stone-200 dark:border-stone-700 text-stone-400'}`}>
                        2. جاري التجهيز
                      </div>
                      <div className={`p-2 rounded-xl border ${status.step >= 3 ? 'border-orange-500 bg-orange-500/10 text-orange-600' : 'border-stone-200 dark:border-stone-700 text-stone-400'}`}>
                        3. مع المندوب
                      </div>
                      <div className={`p-2 rounded-xl border ${status.step >= 4 ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600' : 'border-stone-200 dark:border-stone-700 text-stone-400'}`}>
                        4. تم التسليم
                      </div>
                    </div>
                  </div>

                  {/* Expanded Items & Full Address */}
                  {isExpanded && (
                    <div className="p-6 border-t border-stone-100 dark:border-stone-800 space-y-4 text-xs">
                      <div>
                        <h4 className="font-bold text-stone-900 dark:text-white mb-2">عنوان التسليم:</h4>
                        <p className="text-stone-600 dark:text-stone-300">
                          {order.shippingAddress.fullName} - {order.shippingAddress.phoneNumber}
                        </p>
                        <p className="text-stone-500">
                          {order.shippingAddress.city}، {order.shippingAddress.neighborhood}، {order.shippingAddress.street}
                        </p>
                        <p className="text-stone-500">{order.shippingAddress.residenceDetails}</p>
                      </div>

                      <div className="divide-y divide-stone-100 dark:divide-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img src={it.productImage} alt="" className="w-10 h-10 rounded-lg object-cover" />
                              <span className="font-bold text-stone-800 dark:text-stone-200">{it.productName}</span>
                            </div>
                            <span>{it.quantity} × {formatLYD(it.price)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Wishlist */}
      {activeTab === 'wishlist' && (
        <div>
          {favoriteProducts.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-stone-800/60 rounded-3xl border border-stone-200/80 dark:border-stone-700/60 space-y-3">
              <Heart className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="text-sm font-bold text-stone-800 dark:text-white">قائمة أمنياتك فارغة حالياً</h3>
              <p className="text-xs text-stone-500">اضغط على علامة القلب لأي منتج لحفظه هنا والرجوع إليه لاحقاً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {favoriteProducts.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
