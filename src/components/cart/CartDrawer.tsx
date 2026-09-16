import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  Tag, 
  CheckCircle2, 
  Truck, 
  Sparkles 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartCount,
    cartSubtotal,
    shippingFee,
    discountAmount,
    cartTotal,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    updateCartQuantity,
    removeFromCart,
    setCurrentView,
    settings,
    formatLYD
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoMessage({ text: res.message, isError: !res.success });
    if (res.success) setPromoInput('');
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
  };

  const remainingForFreeShipping = Math.max(0, settings.freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, Math.round((cartSubtotal / settings.freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white dark:bg-stone-900 h-full max-h-[100dvh] shadow-2xl flex flex-col justify-between text-right border-l border-stone-200 dark:border-stone-800 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <h3 className="text-base font-black text-stone-900 dark:text-white">
              سلة المشتريات ({cartCount})
            </h3>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Tracker */}
        {cartSubtotal > 0 && (
          <div className="bg-orange-50/80 dark:bg-orange-950/30 p-3.5 border-b border-orange-100 dark:border-orange-900/40 text-xs">
            {remainingForFreeShipping > 0 ? (
              <p className="text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-orange-600" />
                <span>أضف بـ <strong className="text-orange-600 font-bold">{formatLYD(remainingForFreeShipping)}</strong> أخرى للحصول على شحن مجاني!</span>
              </p>
            ) : (
              <p className="text-emerald-700 dark:text-emerald-400 font-bold mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>تهانينا! طلبيتك مؤهلة للشحن المجاني لجميع المدن الليبية!</span>
              </p>
            )}
            <div className="w-full h-1.5 bg-orange-200 dark:bg-stone-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400">
                <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
              </div>
              <p className="text-sm font-bold text-stone-800 dark:text-stone-200">
                سلة مشترياتك فارغة حالياً
              </p>
              <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                استكشف أحدث الهواتف والإلكترونيات والعطور الفاخرة بأسعار مميزة في ليبيا
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setCurrentView('home');
                }}
                className="px-5 py-2.5 rounded-2xl bg-orange-500 text-white text-xs font-black hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20 cursor-pointer"
              >
                تصفح المنتجات الآن
              </button>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div 
                key={`${item.product.id}-${idx}`}
                className="flex gap-3 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/50"
              >
                {/* Image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white dark:bg-stone-700 shrink-0 border border-stone-200/60 dark:border-stone-600">
                  <img
                    src={item.product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80'}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 dark:text-white line-clamp-1">
                        {item.product.name}
                      </h4>
                      {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-stone-400 hover:text-rose-500 transition-colors p-1"
                      title="حذف من السلة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Price & Quantity Stepper */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-black text-orange-600 dark:text-orange-400">
                      {formatLYD(item.product.price * item.quantity)}
                    </span>

                    <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-xl bg-white dark:bg-stone-900 overflow-hidden">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="p-1.5 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-stone-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="p-1.5 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Calculations and Checkout CTA */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/40 space-y-3">
            
            {/* Promo Code Form */}
            <div>
              {appliedPromo ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>كوبون {appliedPromo.code}: خصم {formatLYD(discountAmount)}</span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-rose-600 text-[11px] font-bold hover:underline cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="كوبون الخصم (اختياري)"
                    className="flex-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-orange-500 uppercase"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-xl bg-stone-800 dark:bg-stone-700 text-white text-xs font-bold hover:bg-stone-700 cursor-pointer"
                  >
                    تطبيق
                  </button>
                </form>
              )}
              {promoMessage && (
                <p className={`text-[11px] mt-1 ${promoMessage.isError ? 'text-rose-500' : 'text-emerald-600'}`}>
                  {promoMessage.text}
                </p>
              )}
            </div>

            {/* Financial Summary */}
            <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
              <div className="flex items-center justify-between">
                <span>المجموع الفرعي:</span>
                <span className="font-bold text-stone-900 dark:text-white">{formatLYD(cartSubtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 font-bold">
                  <span>الخصم:</span>
                  <span>- {formatLYD(discountAmount)}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span>تكلفة الشحن التقديرية:</span>
                <span className="font-bold">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600">مجاني</span>
                  ) : (
                    formatLYD(shippingFee)
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-200 dark:border-stone-700 text-sm font-black text-stone-900 dark:text-white">
                <span>الإجمالي النهائي:</span>
                <span className="text-base text-orange-600 dark:text-orange-400">{formatLYD(cartTotal)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              id="cart-checkout-proceed-btn"
              onClick={handleProceedCheckout}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-sm transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>متابعة إتمام الطلب</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
