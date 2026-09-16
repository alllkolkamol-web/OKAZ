import React from 'react';
import { X, Scale, ShoppingBag, Trash2, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ProductComparisonModal: React.FC = () => {
  const { 
    isCompareModalOpen, 
    setIsCompareModalOpen, 
    compareList, 
    removeFromCompare, 
    clearCompare, 
    addToCart, 
    formatLYD 
  } = useStore();

  if (!isCompareModalOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={() => setIsCompareModalOpen(false)}
    >
      <div 
        className="relative w-full max-w-5xl bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden text-right max-h-[90vh] max-h-[90dvh] flex flex-col animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center bg-stone-50/80 dark:bg-stone-800/50">
          <div className="w-10 h-1 rounded-full bg-stone-300 dark:bg-stone-600"></div>
        </div>

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/80 dark:bg-stone-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-stone-900 dark:text-white">
                مقارنة المنتجات ({compareList.length})
              </h3>
              <p className="text-[11px] text-stone-500">مقارنة المواصفات والأسعار لمساعدتك على الاختيار الأمثل</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {compareList.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs text-rose-600 hover:underline cursor-pointer"
              >
                مسح القائمة
              </button>
            )}
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Table Comparison */}
        <div className="p-6 overflow-x-auto flex-1">
          {compareList.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Scale className="w-12 h-12 text-stone-300 mx-auto" />
              <p className="text-sm font-bold text-stone-700 dark:text-stone-300">لم تقم بإضافة أي منتجات للمقارنة بعد</p>
              <p className="text-xs text-stone-500">اضغط على أيقونة الميزان في بطاقة أي منتج لمقارنته هنا</p>
            </div>
          ) : (
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr>
                  <th className="p-3 w-40 text-stone-500 font-bold bg-stone-50 dark:bg-stone-800/40 rounded-xl">البيان / المنتج</th>
                  {compareList.map((prod) => (
                    <th key={prod.id} className="p-3 min-w-[200px] text-center border-l border-stone-100 dark:border-stone-800 align-top">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                          <img src={prod.images[0]} alt="" className="w-full h-full object-cover" />
                          <button
                            onClick={() => removeFromCompare(prod.id)}
                            className="absolute top-1 left-1 p-1 rounded-full bg-white/80 dark:bg-stone-900/80 text-rose-500 hover:bg-rose-50 shadow-xs"
                            title="إزالة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h4 className="font-bold text-stone-900 dark:text-white line-clamp-2 text-center">
                          {prod.name}
                        </h4>
                        <span className="text-sm font-black text-orange-600 block">
                          {formatLYD(prod.price)}
                        </span>
                        <button
                          onClick={() => addToCart(prod, 1)}
                          disabled={!prod.inStock}
                          className="w-full py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>أضف للسلة</span>
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                <tr>
                  <td className="p-3 font-bold text-stone-600 dark:text-stone-400">التصنيف</td>
                  {compareList.map(prod => (
                    <td key={prod.id} className="p-3 text-center border-l border-stone-100 dark:border-stone-800 font-medium">
                      {prod.category}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-bold text-stone-600 dark:text-stone-400">حالة التوفر بالمخزون</td>
                  {compareList.map(prod => (
                    <td key={prod.id} className="p-3 text-center border-l border-stone-100 dark:border-stone-800 font-bold">
                      {prod.inStock ? (
                        <span className="text-emerald-600">متوفر ({prod.stockCount} قطعة)</span>
                      ) : (
                        <span className="text-rose-500">غير متوفر</span>
                      )}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-bold text-stone-600 dark:text-stone-400">الميزات والمواصفات</td>
                  {compareList.map(prod => (
                    <td key={prod.id} className="p-3 border-l border-stone-100 dark:border-stone-800 align-top">
                      <ul className="space-y-1.5 text-[11px] text-stone-600 dark:text-stone-300">
                        {prod.features && prod.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
};
