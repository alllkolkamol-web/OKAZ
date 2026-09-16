import React, { useState } from 'react';
import { X, Mail, Lock, User, ShoppingBag, AlertCircle, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ADMIN_EMAILS, DEFAULT_ADMIN_PASSWORD } from '../../context/StoreContext';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    loginEmail, 
    registerEmail, 
    loginGoogle 
  } = useStore();

  const [mode, setMode] = useState<'login' | 'register' | 'admin'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'register') {
        await registerEmail(email, password, fullName);
      } else {
        // Normal login or Admin login
        await loginEmail(email, password);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setErrorMsg('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('هذا البريد الإلكتروني مسجل مسبقاً في عكاظ');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('كلمة المرور يجب أن لا تقل عن 6 خانات');
      } else {
        setErrorMsg('تعذر تسجيل الدخول، يرجى التحقق من البيانات');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      await loginGoogle();
    } catch (err: any) {
      console.error('Google auth error:', err);
      setErrorMsg('تعذر تسجيل الدخول بواسطة جوجل، يمكنك استخدام البريد وكلمة المرور');
    } finally {
      setLoading(false);
    }
  };

  const switchToAdminMode = () => {
    setMode('admin');
    setEmail('admin@okaz.ly');
    setPassword(DEFAULT_ADMIN_PASSWORD);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 p-5 sm:p-6 text-right space-y-4 sm:space-y-5 my-auto max-h-[95dvh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${
              mode === 'admin' ? 'bg-amber-600' : 'bg-orange-500'
            }`}>
              {mode === 'admin' ? <ShieldCheck className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-base font-black text-stone-900 dark:text-white">
                {mode === 'admin' 
                  ? 'بوابة دخول إدارة متجر عُكاظ' 
                  : mode === 'login' 
                    ? 'تسجيل الدخول إلى عُكاظ' 
                    : 'إنشاء حساب عميل جديد'}
              </h3>
              {mode === 'admin' && (
                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                  منطقة إدارية مخصصة للمدير المعتمد فقط
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Customer tabs (only for customer modes) */}
        {mode !== 'admin' && (
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>المتابعة بحساب Google</span>
          </button>
        )}

        {mode !== 'admin' && (
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-stone-200 dark:border-stone-800"></div>
            <span className="flex-shrink mx-4 text-[11px] text-stone-400">أو عبر البريد الإلكتروني</span>
            <div className="flex-grow border-t border-stone-200 dark:border-stone-800"></div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {mode === 'register' && (
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">الاسم الكامل</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="محمد الطاهر"
                  className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none focus:border-orange-500"
                />
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
              {mode === 'admin' ? 'البريد الإلكتروني الخاص بالإدارة' : 'البريد الإلكتروني'}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={mode === 'admin' ? 'admin@okaz.ly' : 'name@domain.ly'}
                dir="ltr"
                className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none focus:border-orange-500 text-right"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">كلمة المرور</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none focus:border-orange-500"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {mode === 'admin' && (
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-800 dark:text-amber-300">
              💡 عند تسجيل الدخول بهذا الحساب، سيتم توجيهك تلقائياً إلى <strong>لوحة إدارة متجر عكاظ</strong> بكامل الصلاحيات.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-2xl text-white font-black text-xs transition-all shadow-md cursor-pointer disabled:opacity-50 ${
              mode === 'admin'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-amber-600/20'
                : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-orange-500/20'
            }`}
          >
            {loading 
              ? 'جاري التحقق...' 
              : mode === 'admin'
                ? 'دخول لوحة تحكم الإدارة'
                : mode === 'login' 
                  ? 'دخول لحسابي' 
                  : 'إنشاء حساب جديد'}
          </button>
        </form>

        {/* Customer switch between login & register */}
        <div className="pt-2 text-center text-xs text-stone-500 space-y-2">
          {mode === 'login' && (
            <p>
              ليس لديك حساب بعد؟{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg('');
                }}
                className="text-orange-600 font-bold hover:underline cursor-pointer"
              >
                سجل حساباً مجانياً الآن
              </button>
            </p>
          )}

          {mode === 'register' && (
            <p>
              لديك حساب بالفعل؟{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                }}
                className="text-orange-600 font-bold hover:underline cursor-pointer"
              >
                تسجيل الدخول
              </button>
            </p>
          )}

          {/* Admin portal toggle for the store owner */}
          <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px]">
            {mode === 'admin' ? (
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setEmail('');
                  setPassword('');
                  setErrorMsg('');
                }}
                className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 font-medium cursor-pointer"
              >
                ← العودة إلى تسجيل دخول الزبائن
              </button>
            ) : (
              <button
                type="button"
                onClick={switchToAdminMode}
                className="text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 font-medium cursor-pointer flex items-center gap-1 mx-auto"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>دخول إدارة المتجر (خاص بالمالك)</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
