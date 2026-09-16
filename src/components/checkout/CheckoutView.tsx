import React, { useState } from 'react';
import { 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  User, 
  FileText, 
  Building, 
  Compass, 
  Banknote, 
  CreditCard, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { LibyanCity, ShippingAddress } from '../../types';
import { LIBYAN_CITIES_DATA } from '../../services/sampleData';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    shippingFee,
    discountAmount,
    cartTotal,
    appliedPromo,
    selectedCity,
    setSelectedCity,
    shippingType,
    setShippingType,
    submitOrder,
    setCurrentView,
    user,
    formatLYD
  } = useStore();

  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: user?.displayName || '',
    phoneNumber: '',
    secondaryPhone: '',
    city: selectedCity,
    neighborhood: '',
    street: '',
    residenceDetails: '',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'sadad' | 'tadawul' | 'mobicash'>('cash_on_delivery');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900 dark:text-white">سلة التسوق فارغة</h2>
        <p className="text-sm text-stone-500">يرجى إضافة منتجات إلى السلة قبل التوجه لصفحة الدفع.</p>
        <button
          onClick={() => setCurrentView('home')}
          className="px-6 py-2.5 rounded-2xl bg-orange-500 text-white font-bold text-sm"
        >
          العودة للمتجر
        </button>
      </div>
    );
  }

  const handleCityChange = (city: LibyanCity | string) => {
    setSelectedCity(city);
    setFormData(prev => ({ ...prev, city }));
  };

  const validateLibyanPhone = (phone: string): boolean => {
    const clean = phone.replace(/[\s\-\+]/g, '');
    // Libyan mobile formats: 091XXXXXXX, 092XXXXXXX, 094XXXXXXX, 093XXXXXXX, 095XXXXXXX, or +2189...
    return clean.length >= 9 && clean.length <= 13;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullName.trim()) {
      setErrorMessage('يرجى كتابة الاسم الثلاثي بالكامل');
      return;
    }

    if (!formData.phoneNumber.trim() || !validateLibyanPhone(formData.phoneNumber)) {
      setErrorMessage('يرجى إدخال رقم هاتف ليبي صحيح (مثال: 0912345678)');
      return;
    }

    if (!formData.neighborhood.trim()) {
      setErrorMessage('يرجى تحديد المنطقة أو الحي السكني');
      return;
    }

    if (!formData.street.trim()) {
      setErrorMessage('يرجى كتابة اسم الشارع أو أقرب نقطة دالة معروفة');
      return;
    }

    if (!formData.residenceDetails.trim()) {
      setErrorMessage('يرجى كتابة تفاصيل السكن (رقم المنزل / الطابق / العمارة)');
      return;
    }

    setSubmitting(true);
    try {
      await submitOrder(formData, paymentMethod);
    } catch (err: any) {
      console.error('Order submission error:', err);
      setErrorMessage('حدث خطأ أثناء حفظ الطلب، يرجى المحاولة مجدداً');
      setSubmitting(false);
    }
  };

  const selectedCityInfo = LIBYAN_CITIES_DATA.find(c => c.city === selectedCity);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-orange-600 transition-colors cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة ومواصلة التسوق</span>
        </button>
        <span className="text-stone-300">/</span>
        <h1 className="text-lg font-black text-stone-900 dark:text-white">
          إتمام الطلب والشحن في ليبيا
        </h1>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center gap-3 text-rose-700 dark:text-rose-400 text-xs font-bold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Customer Info */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/60 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-stone-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-orange-500" />
              <span>بيانات المستلم والاتصال</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. Full name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  1. الاسم الثلاثي بالكامل <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="مثال: أحمد عبد الله الفيتوري"
                  className="w-full text-xs p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 outline-none focus:border-orange-500"
                />
              </div>

              {/* 2. Phone number */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  2. رقم هاتف التواصل (ليبي) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="091XXXXXXX أو 092XXXXXXX"
                    dir="ltr"
                    className="w-full text-xs p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 outline-none focus:border-orange-500 text-right"
                  />
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5">
                رقم هاتف بديل (اختياري للطوارئ)
              </label>
              <input
                type="tel"
                value={formData.secondaryPhone}
                onChange={(e) => setFormData({ ...formData, secondaryPhone: e.target.value })}
                placeholder="رقم آخر في حال انشغال الخط"
                dir="ltr"
                className="w-full text-xs p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 outline-none focus:border-orange-500 text-right"
              />
            </div>
          </div>

          {/* Section 2: Delivery & Libyan Address Details */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/60 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-stone-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>عنوان التوصيل في ليبيا</span>
            </h3>

            {/* 4. Location / City */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                3. المدينة / المنطقة <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full text-xs p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 outline-none focus:border-orange-500 font-bold"
              >
                {LIBYAN_CITIES_DATA.map((c) => (
                  <option key={c.city} value={c.city}>
                    {c.city} (توصيل عادي: {c.standardDays} - {c.fee} د.ل)
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Shipping type */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
                4. نوع الشحن وسرعة التوصيل <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  shippingType === 'standard'
                    ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/30 text-stone-900 dark:text-white'
                    : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                }`}>
                  <input
                    type="radio"
                    name="shippingType"
                    checked={shippingType === 'standard'}
                    onChange={() => setShippingType('standard')}
                    className="mt-0.5 text-orange-600 focus:ring-orange-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold">شحن عادي</span>
                      <span className="text-[10px] bg-stone-200 dark:bg-stone-700 px-1.5 py-0.5 rounded font-bold">
                        {selectedCityInfo?.standardDays || '24-48 ساعة'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">توصيل آمن لباب المنزل بأقل تكلفة</p>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  shippingType === 'express'
                    ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/30 text-stone-900 dark:text-white'
                    : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                }`}>
                  <input
                    type="radio"
                    name="shippingType"
                    checked={shippingType === 'express'}
                    onChange={() => setShippingType('express')}
                    className="mt-0.5 text-orange-600 focus:ring-orange-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold">شحن سريع VIP</span>
                      <span className="text-[10px] bg-orange-500 text-white px-1.5 py-0.5 rounded font-bold">
                        {selectedCityInfo?.expressDays || 'أسرع وقت'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">أولوية فائقة وتوصيل سريع ومباشر</p>
                  </div>
                </label>
              </div>
            </div>

            {/* 5. Neighborhood */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                5. المنطقة / الحي السكني <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                placeholder="مثال: حي الأندلس، السياحية، بن عاشور، الحدائق، الكيش، الصابري..."
                className="w-full text-xs p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 outline-none focus:border-orange-500"
              />
            </div>

            {/* 6. Street & landmark */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                6. اسم الشارع أو أقرب نقطة دالة <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                placeholder="مثال: بجوار صيدلية الهلال، بالقرب من جامع القدس، شارع النصر..."
                className="w-full text-xs p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 outline-none focus:border-orange-500"
              />
            </div>

            {/* 7. Residence details */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                7. تفاصيل السكن والمبنى <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.residenceDetails}
                onChange={(e) => setFormData({ ...formData, residenceDetails: e.target.value })}
                placeholder="مثال: عمارة رقم 4، شقة 12، الطابق الثاني، أو فيلا خاصة بلون أبيض"
                className="w-full text-xs p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 outline-none focus:border-orange-500"
              />
            </div>

            {/* 8. Notes */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                8. ملاحظات إضافية على الطلب أو وقت التوصيل المفضل (اختياري)
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="أي تعليمات للمندوب، مثل: يرجى الاتصال قبل الوصول بنصف ساعة..."
                className="w-full text-xs p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 outline-none focus:border-orange-500"
              />
            </div>

          </div>

          {/* Section 3: Payment Methods */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/60 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-stone-900 dark:text-white flex items-center gap-2">
              <Banknote className="w-4 h-4 text-orange-500" />
              <span>طريقة الدفع في ليبيا</span>
            </h3>

            <div className="space-y-3">
              {/* Working Option: Cash on Delivery */}
              <label className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                paymentMethod === 'cash_on_delivery'
                  ? 'border-orange-500 bg-orange-50/60 dark:bg-orange-950/40 text-stone-900 dark:text-white shadow-xs'
                  : 'border-stone-200 dark:border-stone-700'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cash_on_delivery'}
                  onChange={() => setPaymentMethod('cash_on_delivery')}
                  className="mt-1 text-orange-600 focus:ring-orange-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-black text-stone-900 dark:text-white">
                      💵 الدفع عند الاستلام (كاش)
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                      مفعل ومضمون 100%
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                    ادفع نقداً لمندوب التوصيل بعد معاينة وفحص المنتجات والتأكد من مطابقتها لطلبك.
                  </p>
                </div>
              </label>

              {/* Libyan Banking Gateway Architecture (Upcoming Integrations) */}
              <div className="grid grid-cols-3 gap-2 opacity-60">
                <div className="p-3 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 text-center">
                  <span className="text-xs font-bold block text-stone-700 dark:text-stone-300">سداد (Sadad)</span>
                  <span className="text-[10px] text-stone-400">قريباً عبر API</span>
                </div>
                <div className="p-3 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 text-center">
                  <span className="text-xs font-bold block text-stone-700 dark:text-stone-300">تداول (Tadawul)</span>
                  <span className="text-[10px] text-stone-400">قريباً عبر API</span>
                </div>
                <div className="p-3 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 text-center">
                  <span className="text-xs font-bold block text-stone-700 dark:text-stone-300">موبي كاش</span>
                  <span className="text-[10px] text-stone-400">قريباً عبر API</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Order Review & Submit */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/60 shadow-xl sticky top-24 space-y-5">
            <h3 className="text-base font-black text-stone-900 dark:text-white pb-3 border-b border-stone-100 dark:border-stone-700">
              ملخص الطلب ({cart.length} أصناف)
            </h3>

            {/* Items Mini List */}
            <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-stone-100 dark:divide-stone-800">
              {cart.map((item, i) => (
                <div key={i} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.product.images[0]}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover border border-stone-200 dark:border-stone-700 shrink-0"
                    />
                    <div>
                      <h5 className="font-bold text-stone-900 dark:text-white line-clamp-1">
                        {item.product.name}
                      </h5>
                      <span className="text-stone-400 text-[11px]">
                        الكمية: {item.quantity} × {formatLYD(item.product.price)}
                      </span>
                    </div>
                  </div>
                  <span className="font-black text-stone-900 dark:text-white shrink-0">
                    {formatLYD(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-3 border-t border-stone-100 dark:border-stone-700 space-y-2 text-xs text-stone-600 dark:text-stone-300">
              <div className="flex items-center justify-between">
                <span>المجموع الفرعي:</span>
                <span className="font-bold text-stone-900 dark:text-white">{formatLYD(cartSubtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 font-bold">
                  <span>الخصم ({appliedPromo?.code}):</span>
                  <span>- {formatLYD(discountAmount)}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span>تكلفة الشحن إلى ({selectedCity}):</span>
                <span className="font-bold">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">شحن مجاني</span>
                  ) : (
                    formatLYD(shippingFee)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between text-base font-black text-stone-900 dark:text-white">
                <span>المبلغ الإجمالي للدفع:</span>
                <span className="text-xl text-orange-600 dark:text-orange-400">
                  {formatLYD(cartTotal)}
                </span>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              id="confirm-place-order-btn"
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-sm transition-all shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{submitting ? 'جاري تأكيد وتسجيل الطلب...' : 'تأكيد الطلب والدفع عند الاستلام'}</span>
            </button>

            {/* Libyan Trust Signals */}
            <div className="pt-2 text-[11px] text-stone-500 text-center space-y-1">
              <p>✓ فحص ومعاينة الشحنة قبل السداد عند باب البيت</p>
              <p>✓ ضمان رسمي 12 شهراً لكافة الأجهزة الإلكترونية</p>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};
