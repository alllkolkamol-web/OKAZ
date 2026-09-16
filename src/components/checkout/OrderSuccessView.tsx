import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Package, 
  MapPin, 
  Phone, 
  Truck, 
  Printer, 
  ShoppingBag, 
  ArrowLeft 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const OrderSuccessView: React.FC = () => {
  const { lastOrder, setCurrentView, formatLYD } = useStore();

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
  }, []);

  if (!lastOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-stone-500 mb-4">لا توجد تفاصيل للطلب الحالي.</p>
        <button
          onClick={() => setCurrentView('home')}
          className="px-6 py-2.5 rounded-2xl bg-orange-500 text-white font-bold text-xs"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-right">
      <div className="bg-white dark:bg-stone-800/95 rounded-3xl p-6 sm:p-10 border border-stone-200/80 dark:border-stone-700/60 shadow-xl space-y-8">
        
        {/* Top Success Banner */}
        <div className="text-center space-y-3 pb-6 border-b border-stone-100 dark:border-stone-700">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            شكراً لك! تم استلام طلبك بنجاح
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto">
            سنقوم بالتواصل معك هاتفياً على الرقم <span className="font-bold text-orange-600" dir="ltr">{lastOrder.shippingAddress.phoneNumber}</span> لتأكيد الشحنة وتحديد موعد التسليم.
          </p>

          <div className="inline-block mt-2 px-4 py-2 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs font-mono font-bold text-stone-800 dark:text-stone-200">
            رقم الطلب: <span className="text-orange-600 font-black">{lastOrder.orderNumber}</span>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          
          {/* Shipping Address */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-700/50 space-y-2">
            <h4 className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5 text-sm">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>عنوان التوصيل في ليبيا</span>
            </h4>
            <p className="text-stone-700 dark:text-stone-300 font-semibold">{lastOrder.shippingAddress.fullName}</p>
            <p className="text-stone-600 dark:text-stone-400" dir="ltr">{lastOrder.shippingAddress.phoneNumber}</p>
            <p className="text-stone-600 dark:text-stone-400">
              {lastOrder.shippingAddress.city} - {lastOrder.shippingAddress.neighborhood}
            </p>
            <p className="text-stone-500">{lastOrder.shippingAddress.street}</p>
            <p className="text-stone-500">{lastOrder.shippingAddress.residenceDetails}</p>
            {lastOrder.shippingAddress.notes && (
              <p className="text-[11px] text-orange-600 italic">ملاحظات: {lastOrder.shippingAddress.notes}</p>
            )}
          </div>

          {/* Shipping & Payment summary */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-700/50 space-y-2">
            <h4 className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5 text-sm">
              <Truck className="w-4 h-4 text-orange-500" />
              <span>معلومات الشحن والدفع</span>
            </h4>
            <p className="text-stone-600 dark:text-stone-400">
              نوع الشحن: <strong className="text-stone-900 dark:text-white">{lastOrder.shippingType === 'express' ? 'سريع VIP' : 'عادي'}</strong>
            </p>
            <p className="text-stone-600 dark:text-stone-400">
              طريقة الدفع: <strong className="text-stone-900 dark:text-white">الدفع عند الاستلام (كاش)</strong>
            </p>
            <p className="text-stone-600 dark:text-stone-400">
              حالة الطلب: <span className="text-amber-600 font-bold">قيد المراجعة والتجهيز</span>
            </p>
            <p className="text-stone-600 dark:text-stone-400">
              المبلغ المطلوب عند الاستلام: <strong className="text-base text-orange-600 font-black">{formatLYD(lastOrder.total)}</strong>
            </p>
          </div>

        </div>

        {/* Ordered Items List */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
            <Package className="w-4 h-4 text-orange-500" />
            <span>المنتجات المطلوبة ({lastOrder.items.length})</span>
          </h4>

          <div className="divide-y divide-stone-100 dark:divide-stone-700 rounded-2xl border border-stone-200/70 dark:border-stone-700 overflow-hidden">
            {lastOrder.items.map((item, i) => (
              <div key={i} className="p-3.5 flex items-center justify-between text-xs bg-white dark:bg-stone-800">
                <div className="flex items-center gap-3">
                  <img
                    src={item.productImage}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover border border-stone-200 dark:border-stone-700"
                  />
                  <div>
                    <h5 className="font-bold text-stone-900 dark:text-white">{item.productName}</h5>
                    <span className="text-[11px] text-stone-400">
                      الكمية: {item.quantity} × {formatLYD(item.price)}
                    </span>
                  </div>
                </div>
                <span className="font-bold text-stone-900 dark:text-white">
                  {formatLYD(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 dark:border-stone-700">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الفاتورة</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('account')}
              className="px-5 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold transition-colors cursor-pointer"
            >
              متابعة حالة الطلب في حسابي
            </button>

            <button
              onClick={() => setCurrentView('home')}
              className="px-6 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black transition-colors shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <span>مواصلة التسوق</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
