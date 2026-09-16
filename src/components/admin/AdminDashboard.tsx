import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Save, 
  Layers, 
  Settings, 
  Truck, 
  Phone, 
  Mail, 
  MapPin, 
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, Order, Category, LibyanCity } from '../../types';
import { 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  fetchOrders, 
  updateOrderStatus,
  addCategory,
  updateStoreSettings
} from '../../services/db';
import { LIBYAN_CITIES_DATA } from '../../services/sampleData';

export const AdminDashboard: React.FC = () => {
  const { 
    products, 
    categories, 
    settings, 
    setCurrentView, 
    formatLYD, 
    refreshProducts, 
    refreshCategories 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'categories' | 'settings'>('analytics');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Product Modal Form State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    category: 'إلكترونيات وهواتف',
    images: [''],
    inStock: true,
    stockCount: 10,
    rating: 4.8,
    reviewCount: 1,
    features: ['ضمان معتمد 12 شهراً', 'توصيل فوري لباب البيت'],
    tags: ['جديد', 'عكاظ']
  });

  // Category Form State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatImage, setNewCatImage] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Smartphone');

  // Load orders
  useEffect(() => {
    setLoadingOrders(true);
    fetchOrders()
      .then(setOrders)
      .finally(() => setLoadingOrders(false));
  }, []);

  // Stats Calculations
  const totalSales = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const totalOrdersCount = orders.length;
  const totalProductsCount = products.length;
  const outOfStockCount = products.filter(p => !p.inStock || p.stockCount <= 0).length;

  // Open Product Modal for Add or Edit
  const handleOpenProductModal = (productToEdit?: Product) => {
    if (productToEdit) {
      setEditingProduct(productToEdit);
      setFormData({ ...productToEdit });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: 150,
        originalPrice: 190,
        category: categories[0]?.name || 'إلكترونيات وهواتف',
        images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80'],
        inStock: true,
        stockCount: 15,
        rating: 4.9,
        reviewCount: 3,
        features: ['أصلي 100% معتمد', 'ضمان رسمي 12 شهر', 'معاينة عند الاستلام'],
        tags: ['جديد', 'عكاظ']
      });
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await addProduct(formData as any);
      }
      await refreshProducts();
      setIsProductModalOpen(false);
    } catch (err) {
      console.error('Failed to save product:', err);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا المنتج نهائياً من المتجر؟')) {
      await deleteProduct(productId);
      await refreshProducts();
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: any) => {
    await updateOrderStatus(orderId, status);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await addCategory({
      id: 'cat-' + Date.now(),
      name: newCatName,
      image: newCatImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
      iconName: newCatIcon
    });
    await refreshCategories();
    setIsCatModalOpen(false);
    setNewCatName('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-right">
      
      {/* Top Admin Header */}
      <div className="p-6 rounded-3xl bg-stone-900 text-white shadow-xl mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center text-white">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black">
                لوحة إدارة متجر عُكاظ - ليبيا
              </h1>
              <p className="text-xs text-stone-400 mt-0.5">
                التحكم بالمنتجات، الطلبيات الواردة من المدن الليبية، وتوليد المحتوى بذكاء Gemini
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-colors cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لواجهة المتجر</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-3 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-orange-500 text-white shadow-md'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>المؤشرات والمبيعات</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-orange-500 text-white shadow-md'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>إدارة الطلبيات ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'products'
              ? 'bg-orange-500 text-white shadow-md'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>المنتجات والمخزون ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-orange-500 text-white shadow-md'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>الأقسام ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-orange-500 text-white shadow-md'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>إعدادات المتجر والشحن</span>
        </button>
      </div>

      {/* TAB 1: Analytics / Executive Metrics */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <div className="p-6 rounded-3xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/60 shadow-xs">
              <span className="text-xs text-stone-500 block mb-1">إجمالي المبيعات المؤكدة</span>
              <span className="text-2xl font-black text-orange-600 dark:text-orange-400">
                {formatLYD(totalSales)}
              </span>
              <span className="text-[11px] text-emerald-600 font-bold block mt-2">بالدينار الليبي (د.ل)</span>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/60 shadow-xs">
              <span className="text-xs text-stone-500 block mb-1">إجمالي الطلبات المسجلة</span>
              <span className="text-2xl font-black text-stone-900 dark:text-white">
                {totalOrdersCount} طلب
              </span>
              <span className="text-[11px] text-stone-400 block mt-2">من مختلف المدن الليبية</span>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/60 shadow-xs">
              <span className="text-xs text-stone-500 block mb-1">المنتجات في الكتالوج</span>
              <span className="text-2xl font-black text-stone-900 dark:text-white">
                {totalProductsCount} منتج
              </span>
              <span className="text-[11px] text-orange-600 block mt-2">موزعة على {categories.length} أقسام</span>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/60 shadow-xs">
              <span className="text-xs text-stone-500 block mb-1">تنبيهات المخزون المنخفض</span>
              <span className="text-2xl font-black text-rose-600">
                {outOfStockCount} صنف
              </span>
              <span className="text-[11px] text-stone-400 block mt-2">يحتاج إلى إعادة تزويد</span>
            </div>

          </div>

          {/* Quick Hub Status */}
          <div className="p-6 rounded-3xl bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-900/40">
            <h3 className="text-sm font-bold text-orange-800 dark:text-orange-300 mb-2">
              حالة مراكز التوزيع الرئيسية (Hubs):
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              • مركز طرابلس ({settings.tripoliHubAddress}): جاهزية التوصيل الفوري 24 ساعة.<br />
              • مركز بنغازي ({settings.benghaziHubAddress}): تغطية كاملة للمنطقة الشرقية خلال 24-48 ساعة.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: Orders Management */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-stone-900 dark:text-white">
              قائمة الطلبات الواردة ({orders.length})
            </h3>
          </div>

          {loadingOrders ? (
            <p className="text-xs text-stone-400">جاري تحميل الطلبات...</p>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-stone-800/60 rounded-3xl border border-stone-200 dark:border-stone-700">
              <Truck className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="text-xs text-stone-500">لا توجد طلبات واردة حالياً.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div 
                  key={order.id}
                  className="p-5 rounded-3xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/60 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-stone-900 dark:text-white">
                          #{order.orderNumber}
                        </span>
                        <span className="font-bold text-orange-600">
                          {order.shippingAddress.city} - {order.shippingAddress.neighborhood}
                        </span>
                      </div>
                      <p className="text-stone-400 text-[11px] mt-1">
                        العميل: <strong>{order.shippingAddress.fullName}</strong> | هاتف: <span dir="ltr">{order.shippingAddress.phoneNumber}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-stone-900 dark:text-white">
                        {formatLYD(order.total)}
                      </span>

                      {/* Status Selector */}
                      <select
                        value={order.status}
                        onChange={(e: any) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="p-2 rounded-xl text-xs font-bold border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 outline-none focus:border-orange-500"
                      >
                        <option value="pending">قيد المراجعة</option>
                        <option value="confirmed">تم التأكيد</option>
                        <option value="out_for_delivery">مع المندوب</option>
                        <option value="delivered">تم التسليم</option>
                        <option value="cancelled">ملغي</option>
                      </select>
                    </div>
                  </div>

                  {/* Items mini list */}
                  <div className="text-xs text-stone-600 dark:text-stone-300">
                    <p className="font-bold text-[11px] text-stone-400 mb-1">المنتجات:</p>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((it, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-700 text-[11px]">
                          {it.productName} ({it.quantity}x)
                        </span>
                      ))}
                    </div>
                    {order.shippingAddress.notes && (
                      <p className="text-[11px] text-amber-600 mt-2">
                        ملاحظة العميل: {order.shippingAddress.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Products Management */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-stone-900 dark:text-white">
              كتالوج المنتجات ({products.length})
            </h3>

            <button
              onClick={() => handleOpenProductModal()}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-orange-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة منتج جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((prod) => (
              <div 
                key={prod.id}
                className="p-4 rounded-3xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/60 shadow-xs flex flex-col justify-between"
              >
                <div className="flex gap-3 mb-3">
                  <img
                    src={prod.images[0]}
                    alt=""
                    className="w-16 h-16 rounded-2xl object-cover border border-stone-200 dark:border-stone-700 shrink-0"
                  />
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-orange-600 font-bold block">{prod.category}</span>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-white line-clamp-2">{prod.name}</h4>
                    <span className="text-xs font-black text-stone-900 dark:text-white mt-1 block">
                      {formatLYD(prod.price)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800 text-xs">
                  <span className={`text-[11px] font-bold ${prod.inStock ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {prod.inStock ? `المخزون: ${prod.stockCount}` : 'نفذ'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenProductModal(prod)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-orange-600 hover:bg-stone-100 dark:hover:bg-stone-700 cursor-pointer"
                      title="تعديل"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Categories Management */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-stone-900 dark:text-white">
              أقسام المتجر ({categories.length})
            </h3>
            <button
              onClick={() => setIsCatModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة قسم جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div 
                key={cat.id}
                className="p-4 rounded-3xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/60 shadow-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img src={cat.image} alt="" className="w-12 h-12 rounded-2xl object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-white">{cat.name}</h4>
                    <span className="text-[11px] text-stone-400">
                      {products.filter(p => p.category === cat.name).length} منتجات
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Store Settings */}
      {activeTab === 'settings' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/60 shadow-xs space-y-6">
          <h3 className="text-base font-black text-stone-900 dark:text-white">
            بيانات المتجر وسياسات الشحن في ليبيا
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">اسم المتجر</label>
              <input 
                type="text" 
                defaultValue={settings.storeName}
                disabled 
                className="w-full p-3 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-700" 
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">الحد الأدنى للشحن المجاني (د.ل)</label>
              <input 
                type="number" 
                defaultValue={settings.freeShippingThreshold}
                className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700" 
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">عنوان مركز طرابلس</label>
              <input 
                type="text" 
                defaultValue={settings.tripoliHubAddress}
                className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700" 
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">عنوان مركز بنغازي</label>
              <input 
                type="text" 
                defaultValue={settings.benghaziHubAddress}
                className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700" 
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">رقم خدمة العملاء والواتساب</label>
              <input 
                type="text" 
                defaultValue={settings.contactPhone}
                className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700" 
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">البريد الإلكتروني للشكاوى</label>
              <input 
                type="email" 
                defaultValue={settings.contactEmail}
                className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700" 
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Product */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 text-right max-h-[92vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800 mb-4">
              <h3 className="text-base font-black text-stone-900 dark:text-white">
                {editingProduct ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد للمتجر'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="p-1 rounded-lg text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">اسم المنتج <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="اسم المنتج المعروض للعملاء"
                  className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">القسم</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">السعر بالدينار الليبي (د.ل) <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">السعر الأصلي قبل الخصم (اختياري)</label>
                  <input
                    type="number"
                    value={formData.originalPrice || 0}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">الكمية في المخزن</label>
                  <input
                    type="number"
                    value={formData.stockCount || 10}
                    onChange={(e) => setFormData({ ...formData, stockCount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">رابط صورة المنتج الرئيسية (URL)</label>
                <input
                  type="url"
                  value={formData.images?.[0] || ''}
                  onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">وصف المنتج</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black transition-colors cursor-pointer"
                >
                  حفظ المنتج في الكتالوج
                </button>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-3 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-bold"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Category */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl p-6 text-right space-y-4">
            <h3 className="text-base font-black text-stone-900 dark:text-white">إضافة قسم تسوق جديد</h3>
            <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">اسم القسم</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="مثال: مستلزمات السيارات"
                  className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">رابط صورة القسم (URL)</label>
                <input
                  type="url"
                  value={newCatImage}
                  onChange={(e) => setNewCatImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white font-bold">
                  إضافة القسم
                </button>
                <button type="button" onClick={() => setIsCatModalOpen(false)} className="px-4 py-2.5 rounded-xl border border-stone-200">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
