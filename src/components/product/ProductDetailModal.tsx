import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Check, 
  Share2, 
  Scale, 
  Plus,
  Minus
} from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { 
    formatLYD, 
    addToCart, 
    toggleFavorite, 
    isFavorite, 
    addToCompare, 
    compareList,
    setCurrentView
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  const isFav = isFavorite(product.id);
  const isCompared = compareList.some(p => p.id === product.id);

  // Initialize variants
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      const initial: Record<string, string> = {};
      product.variants.forEach(v => {
        if (v.options.length > 0) initial[v.name] = v.options[0];
      });
      setSelectedVariants(initial);
    }
  }, [product]);

  const handleAddToCart = (instantCheckout = false) => {
    addToCart(product, quantity, selectedVariants);
    if (instantCheckout) {
      onClose();
      setCurrentView('checkout');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden text-right max-h-[90vh] max-h-[90dvh] flex flex-col animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull Handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center bg-stone-50/70 dark:bg-stone-800/40">
          <div className="w-10 h-1 rounded-full bg-stone-300 dark:bg-stone-600"></div>
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/40">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/60 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
              {product.category}
            </span>
            <span className="text-[11px] sm:text-xs text-stone-400">رمز: {product.sku || product.id}</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 sm:p-2 rounded-xl text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              title="مشاركة رابط المنتج"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {copiedLink && (
              <span className="text-[10px] sm:text-[11px] text-emerald-600 font-bold">تم النسخ!</span>
            )}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Gallery Column */}
            <div className="md:col-span-6 space-y-4">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-inner">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                {product.isNew && (
                  <span className="absolute top-4 right-4 px-2.5 py-1 rounded-xl bg-amber-500 text-white text-xs font-bold shadow-xs">
                    جديد
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-orange-500 shadow-md scale-105'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Libyan Value Highlights */}
              <div className="p-4 rounded-2xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-900/40 space-y-2 text-xs text-stone-700 dark:text-stone-300">
                <div className="flex items-center gap-2 font-bold text-orange-700 dark:text-orange-400">
                  <Truck className="w-4 h-4" />
                  <span>توصيل سريع لكافة المدن الليبية (طرابلس، بنغازي، مصراتة...)</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>الدفع عند الاستلام كاش مع حق المعاينة المباشرة قبل الدفع</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-600" />
                  <span>ضمان ذهبي وإرجاع مجاني خلال 7 أيام للمنتجات المغلفة</span>
                </div>
              </div>
            </div>

            {/* Info Column */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                {/* Title & Rating */}
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white leading-snug mb-3">
                  {product.name}
                </h2>

                {/* Pricing in Libyan Dinar */}
                <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-800/80 mb-5 flex items-baseline justify-between border border-stone-200/60 dark:border-stone-700/60">
                  <div>
                    <span className="text-xs text-stone-500 dark:text-stone-400 block mb-1">
                      السعر الحالي في ليبيا (كاش عند الاستلام):
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-orange-600 dark:text-orange-400">
                      {formatLYD(product.price)}
                    </span>
                  </div>

                  <div className="text-left">
                    {product.inStock ? (
                      <span className="inline-block px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                        متوفر جاهز للشحن ({product.stockCount} قطعة)
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 text-xs font-bold">
                        نفذت الكمية
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Variants Selection */}
                {product.variants && product.variants.map((variant) => (
                  <div key={variant.id} className="mb-4">
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
                      اختر {variant.name}: <span className="text-orange-600">{selectedVariants[variant.name]}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {variant.options.map((opt) => {
                        const isSelected = selectedVariants[variant.name] === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => setSelectedVariants({ ...selectedVariants, [variant.name]: opt })}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-orange-500 text-white shadow-md'
                                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Quantity and Actions */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-stone-700 dark:text-stone-300">الكمية:</span>
                    <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-2xl bg-stone-50 dark:bg-stone-800 overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2.5 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-4 text-xs font-black text-stone-900 dark:text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stockCount || 99, quantity + 1))}
                        className="p-2.5 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="p-3 rounded-2xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                      title="المفضلة"
                    >
                      <Heart className={`w-5 h-5 ${isFav ? 'text-rose-500 fill-rose-500' : ''}`} />
                    </button>

                    <button
                      onClick={() => addToCompare(product)}
                      className={`p-3 rounded-2xl border transition-colors cursor-pointer ${
                        isCompared 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-600' 
                          : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50'
                      }`}
                      title="مقارنة"
                    >
                      <Scale className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => handleAddToCart(false)}
                      disabled={!product.inStock}
                      className="w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-98 text-white font-black text-sm transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>إضافة إلى السلة</span>
                    </button>

                    <button
                      onClick={() => handleAddToCart(true)}
                      disabled={!product.inStock}
                      className="w-full py-3.5 rounded-2xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>شراء فوري كاش</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Key Features List */}
          {product.features && product.features.length > 0 && (
            <div className="pt-6 border-t border-stone-100 dark:border-stone-800">
              <h3 className="text-base font-black text-stone-900 dark:text-white mb-3">
                المواصفات وأبرز الميزات
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.features.map((feat, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60 text-xs text-stone-800 dark:text-stone-200"
                  >
                    <div className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
