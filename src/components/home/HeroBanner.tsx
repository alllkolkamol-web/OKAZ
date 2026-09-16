import React from 'react';
import { ArrowLeft, Truck, ShieldCheck, Banknote } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const HeroBanner: React.FC = () => {
  const { setSelectedCategory, setCurrentView } = useStore();

  return (
    <div className="relative w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-4">
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 text-white p-5 sm:p-8 md:p-10 border border-stone-800 shadow-lg text-right">
        
        {/* Subtle decorative background pattern */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold mb-3">
            <span>متجر عُكاظ المباشر</span>
          </div>

          <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-white leading-snug tracking-tight mb-2 sm:mb-3">
            تسوق مباشر لأحدث الإلكترونيات والأزياء والعطور في ليبيا
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 mb-5 leading-relaxed max-w-2xl">
            نوفر لك تجربة تسوق موثوقة ومباشرة مع ضمان المعاينة الكاملة لطلبك قبل الدفع والتوصيل السريع إلى باب بيتك في جميع المدن الليبية.
          </p>

          {/* Core Trust Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 pt-2 pb-4">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div className="text-right">
                <span className="text-xs font-bold block text-white">توصيل لجميع المدن</span>
                <span className="text-[10px] text-stone-400">طرابلس، بنغازي ولكل المناطق</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-right">
                <span className="text-xs font-bold block text-white">معاينة قبل الدفع</span>
                <span className="text-[10px] text-stone-400">تأكد من سلامة طلبك أولاً</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Banknote className="w-4 h-4" />
              </div>
              <div className="text-right">
                <span className="text-xs font-bold block text-white">دفع نقداً (كاش)</span>
                <span className="text-[10px] text-stone-400">تسليم المبلغ عند الاستلام</span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setCurrentView('search');
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs sm:text-sm hover:from-amber-600 hover:to-orange-700 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>تصفح جميع المنتجات</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

