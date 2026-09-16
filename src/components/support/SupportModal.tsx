import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  Truck, 
  ChevronDown, 
  ChevronUp
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { LIBYAN_CITIES_DATA } from '../../services/sampleData';

export const SupportModal: React.FC = () => {
  const { isSupportModalOpen, setIsSupportModalOpen, settings, formatLYD } = useStore();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!isSupportModalOpen) return null;

  const FAQS = [
    {
      q: 'كيف تتم عملية الشحن والتوصيل في ليبيا؟',
      a: 'نوفر خدمة التوصيل المباشر لباب منزلك أو مقر عملك في كافة المدن والمناطق الليبية مع التوصيل خلال 24 إلى 48 ساعة للمدن الرئيسية، وحتى 72 ساعة للمناطق البعيدة.'
    },
    {
      q: 'هل يمكنني فحص ومعاينة المنتج قبل دفع المبلغ للمندوب؟',
      a: 'نعم بكل تأكيد! هذه ميزة أساسية في متجر عكاظ لضمان راحة بالك 100%. يمكنك فتح الشحنة ومعاينة المنتج والتأكد من مطابقته للمواصفات المعروضة قبل تسليم المبلغ النقدي للمندوب.'
    },
    {
      q: 'ما هي طرق الدفع المعتمدة؟',
      a: 'حالياً، الطريقة الأساسية والمعتمدة هي الدفع نقداً عند الاستلام (كاش بالدينار الليبي). كما نعمل على دمج بوابات الدفع الإلكتروني المصرفية في ليبيا مثل سداد (Sadad)، وتداول، وموبي كاش قريباً.'
    },
    {
      q: 'ما هي سياسة الضمان والاسترجاع؟',
      a: 'يحق لك استرجاع أو استبدال المنتج خلال 7 أيام من تاريخ الاستلام في حال وجود أي عيب مصنعي أو رغبة بالاستبدال، بشرط بقاء المنتج بغلافه الأصلي مع ضمان الصيانة المعتمد.'
    },
    {
      q: 'كيف يمكنني متابعة حالة طلبيتي؟',
      a: 'يمكنك متابعة حالة طلبيتك بكل سهولة من خلال قسم "حسابي" في شريط التنقل لمعرفة ما إذا كانت طلبيتك قيد التجهيز أو في طريقها مع مندوب التوصيل.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 text-right space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-white">
                مركز المساعدة وسياسات متجر عُكاظ
              </h3>
              <p className="text-xs text-stone-500">كل ما يهمك معرفته عن الشحن، الدفع، والمعاينة في ليبيا</p>
            </div>
          </div>

          <button
            onClick={() => setIsSupportModalOpen(false)}
            className="p-1 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Libyan Shipping Rates Preview */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-stone-900 dark:text-white flex items-center gap-2">
            <Truck className="w-4 h-4 text-orange-500" />
            <span>جدول أوقات وأسعار التوصيل حسب المدن الليبية:</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
            {LIBYAN_CITIES_DATA.slice(0, 9).map((c) => (
              <div key={c.city} className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700">
                <span className="font-bold text-stone-800 dark:text-stone-200 block">{c.city}</span>
                <span className="text-stone-500 block mt-0.5">{c.standardDays}</span>
                <span className="text-orange-600 font-bold block">{formatLYD(c.fee)}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-emerald-600 font-bold">
            * الشحن مجاني تماماً لأي طلب يتجاوز {formatLYD(settings.freeShippingThreshold)} دينار ليبي!
          </p>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-black text-stone-900 dark:text-white">
            الأسئلة الأكثر شيوعاً (FAQ):
          </h4>
          <div className="space-y-2">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden bg-white dark:bg-stone-850"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-3.5 text-right flex items-center justify-between text-xs font-bold text-stone-900 dark:text-white hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-orange-500" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                  </button>

                  {isOpen && (
                    <div className="p-3.5 pt-0 text-xs text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-100 dark:border-stone-800/60 bg-stone-50/50 dark:bg-stone-800/30">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Direct customer service note */}
        <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 flex items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-orange-900 dark:text-orange-300 block">خدمة عملاء مباشرة لجميع المدن الليبية</span>
            <span className="text-stone-500">فريقنا متواجد لمتابعة طلبك والتأكد من استلامه ومعاينته بأعلى مستويات الجودة والرضا.</span>
          </div>
        </div>

      </div>
    </div>
  );
};
