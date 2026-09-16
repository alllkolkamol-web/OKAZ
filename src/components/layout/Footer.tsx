import React from 'react';
import { 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Headphones 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { 
    setCurrentView, 
    setSelectedCategory, 
    categories, 
    setIsSupportModalOpen
  } = useStore();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 transition-colors pt-12 pb-24 md:pb-12">
      {/* Value propositions banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 p-6 rounded-3xl bg-stone-800/80 border border-stone-700/60">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">توصيل لكافة مدن ليبيا</h4>
              <p className="text-xs text-stone-400 mt-0.5">خلال 24-48 ساعة لباب بيتك</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">معاينة قبل الدفع</h4>
              <p className="text-xs text-stone-400 mt-0.5">تأكد من طلبك واستلم بكل راحة</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">إرجاع واستبدال مرن</h4>
              <p className="text-xs text-stone-400 mt-0.5">ضمان ذهبي واسترجاع خلال 7 أيام</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">خدمة عملاء مباشرة</h4>
              <p className="text-xs text-stone-400 mt-0.5">فريق دعم لمتابعة طلباتك</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Brand Col */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-md">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-white font-sans">
              متجر عُكاظ<span className="text-orange-500">.</span>
            </span>
          </div>

          <p className="text-sm text-stone-400 leading-relaxed">
            المنصة الرائدة للتسوق المباشر في ليبيا. نوفر لك تشكيلة من أحدث الهواتف الذكية، الأجهزة الإلكترونية، العطور الأصلية، والأزياء الراقية بأسعار واضحة بالدينار الليبي مع خدمة التوصيل السريع والدفع عند الاستلام.
          </p>

          <div className="pt-2">
            <p className="text-xs text-stone-400 mb-2 font-medium">طرق الدفع المعتمدة:</p>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="px-3 py-1.5 rounded-xl bg-stone-800 text-stone-200 border border-stone-700 font-bold">
                💵 الدفع عند الاستلام (كاش)
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-stone-800/60 text-stone-400 border border-stone-700/60">
                سداد (قريباً)
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-stone-800/60 text-stone-400 border border-stone-700/60">
                تداول (قريباً)
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-stone-800/60 text-stone-400 border border-stone-700/60">
                موبي كاش (قريباً)
              </span>
            </div>
          </div>
        </div>

        {/* Quick Categories */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">الأقسام الرئيسية</h4>
          <ul className="space-y-2 text-xs">
            {categories.slice(0, 6).map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setCurrentView('search');
                  }}
                  className="text-stone-400 hover:text-orange-400 transition-colors cursor-pointer"
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Care */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">خدمة العملاء والسياسات</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button 
                onClick={() => setIsSupportModalOpen(true)}
                className="text-stone-400 hover:text-orange-400 transition-colors cursor-pointer"
              >
                سياسة الشحن والتوصيل في ليبيا
              </button>
            </li>
            <li>
              <button 
                onClick={() => setIsSupportModalOpen(true)}
                className="text-stone-400 hover:text-orange-400 transition-colors cursor-pointer"
              >
                سياسة المعاينة والإرجاع
              </button>
            </li>
            <li>
              <button 
                onClick={() => setIsSupportModalOpen(true)}
                className="text-stone-400 hover:text-orange-400 transition-colors cursor-pointer"
              >
                الضمان للأجهزة
              </button>
            </li>
            <li>
              <button 
                onClick={() => setIsSupportModalOpen(true)}
                className="text-stone-400 hover:text-orange-400 transition-colors cursor-pointer"
              >
                الأسئلة الشائعة
              </button>
            </li>
            <li>
              <button 
                onClick={() => setCurrentView('account')}
                className="text-stone-400 hover:text-orange-400 transition-colors cursor-pointer"
              >
                تتبع حالة الطلب
              </button>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
        <p>© 2026 متجر عكاظ (Okaz Store) - جميع الحقوق محفوظة لخدمة السوق الليبي.</p>
        <div className="flex items-center gap-6">
          <span className="text-stone-400">
            الأسعار بالدينار الليبي (د.ل)
          </span>
        </div>
      </div>
    </footer>
  );
};
