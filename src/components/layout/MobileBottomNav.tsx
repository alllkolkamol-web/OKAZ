import React from 'react';
import { 
  Home, 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  ShieldCheck 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const MobileBottomNav: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    setSelectedCategory, 
    setSearchQuery,
    cartCount, 
    setIsCartOpen, 
    favorites, 
    user, 
    isAdmin, 
    setIsAuthModalOpen 
  } = useStore();

  const handleHomeClick = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchClick = () => {
    setCurrentView('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAccountClick = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      setCurrentView('account');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav 
      aria-label="شريط التنقل السفلي للهاتف"
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200/90 dark:border-stone-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[max(0.35rem,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto items-center px-1">
        
        {/* 1. الرئيسية */}
        <button
          onClick={handleHomeClick}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer active:scale-95 ${
            currentView === 'home'
              ? 'text-orange-600 dark:text-orange-400 font-bold'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <div className="relative">
            <Home className={`w-5 h-5 transition-transform ${currentView === 'home' ? 'scale-110' : ''}`} />
            {currentView === 'home' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">الرئيسية</span>
        </button>

        {/* 2. استكشف / الأقسام */}
        <button
          onClick={handleSearchClick}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer active:scale-95 ${
            currentView === 'search'
              ? 'text-orange-600 dark:text-orange-400 font-bold'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <div className="relative">
            <Search className={`w-5 h-5 transition-transform ${currentView === 'search' ? 'scale-110' : ''}`} />
            {currentView === 'search' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">استكشف</span>
        </button>

        {/* 3. السلة (وسط بارز) */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center py-1 transition-all cursor-pointer active:scale-95 relative group"
        >
          <div className="relative -top-2 w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-stone-900 animate-in zoom-in-50">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] -mt-1 font-bold text-stone-700 dark:text-stone-300">السلة</span>
        </button>

        {/* 4. المفضلة */}
        <button
          onClick={() => {
            if (!user) {
              setIsAuthModalOpen(true);
            } else {
              setCurrentView('account');
            }
          }}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer active:scale-95 ${
            favorites.length > 0 && currentView === 'account'
              ? 'text-orange-600 dark:text-orange-400 font-bold'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
            {favorites.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">المفضلة</span>
        </button>

        {/* 5. حسابي أو الإدارة */}
        <button
          onClick={handleAccountClick}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer active:scale-95 ${
            currentView === 'account' || currentView === 'admin'
              ? 'text-orange-600 dark:text-orange-400 font-bold'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <div className="relative">
            {isAdmin ? (
              <ShieldCheck className="w-5 h-5 text-amber-500" />
            ) : (
              <User className={`w-5 h-5 ${user ? 'text-orange-500' : ''}`} />
            )}
            {(currentView === 'account' || currentView === 'admin') && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">
            {isAdmin ? 'الإدارة' : user ? 'حسابي' : 'تسجيل'}
          </span>
        </button>

      </div>
    </nav>
  );
};
