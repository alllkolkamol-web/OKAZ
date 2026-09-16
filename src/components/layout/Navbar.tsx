import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  User as UserIcon, 
  Moon, 
  Sun, 
  ShieldCheck, 
  Truck, 
  Menu, 
  X, 
  ChevronDown,
  LayoutDashboard,
  LogOut,
  PackageCheck,
  HelpCircle,
  Scale
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Navbar: React.FC = () => {
  const {
    cartCount,
    cartSubtotal,
    setIsCartOpen,
    favorites,
    isDarkMode,
    toggleDarkMode,
    user,
    isAdmin,
    setIsAuthModalOpen,
    logoutUser,
    currentView,
    setCurrentView,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    setIsSupportModalOpen,
    compareList,
    setIsCompareModalOpen,
    settings,
    formatLYD
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentView('search');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 transition-colors shadow-xs">
      {/* Top Announcement Bar */}
      {settings.showAnnouncement && (
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-xs md:text-sm py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="shrink-0 bg-white/20 px-2 py-0.5 rounded-full text-[11px] font-bold">عكاظ مباشر</span>
              <p className="truncate text-stone-100 font-medium">{settings.announcementText}</p>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-xs shrink-0 font-medium">
              <button 
                onClick={() => setIsSupportModalOpen(true)}
                className="hover:underline flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>مركز المساعدة والسياسات</span>
              </button>
              <span className="text-white/40">|</span>
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" />
                <span>شحن سريع لكل المدن</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              id="mobile-menu-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo */}
            <div 
              id="brand-logo"
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery('');
                setCurrentView('home');
              }}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-stone-900 dark:text-white leading-none font-sans">
                  عُكاظ<span className="text-orange-500">.</span>
                </span>
                <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 tracking-wider">
                  سوق ليبيا الأول
                </span>
              </div>
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-2">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                id="main-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن أحدث الهواتف، العطور، الساعات، أو الملابس..."
                className="w-full bg-stone-100 dark:bg-stone-800/90 text-stone-900 dark:text-stone-100 text-sm rounded-2xl pl-12 pr-4 py-3 border border-transparent focus:border-orange-500 focus:bg-white dark:focus:bg-stone-800 outline-none transition-all shadow-inner"
              />
              <button
                type="submit"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 text-stone-400 hover:text-orange-500 transition-colors cursor-pointer"
                title="بحث"
              >
                <Search className="w-4 h-4 stroke-[2.2]" />
              </button>
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3">


            {/* Comparison Pill (if any items) */}
            {compareList.length > 0 && (
              <button
                id="compare-navbar-btn"
                onClick={() => setIsCompareModalOpen(true)}
                className="relative p-2.5 rounded-2xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                title="مقارنة المنتجات"
              >
                <Scale className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {compareList.length}
                </span>
              </button>
            )}

            {/* Dark / Light Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleDarkMode}
              className="p-2.5 rounded-2xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              title={isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Wishlist */}
            <button
              id="favorites-navbar-btn"
              onClick={() => {
                if (!user) {
                  setIsAuthModalOpen(true);
                } else {
                  setCurrentView('account');
                }
              }}
              className="relative p-2.5 rounded-2xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              title="المفضلة"
            >
              <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              id="cart-navbar-btn"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700/80 text-stone-900 dark:text-stone-100 transition-all cursor-pointer group"
              title="سلة التسوق"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-stone-900">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden xl:inline text-xs font-bold text-stone-700 dark:text-stone-300">
                {cartSubtotal > 0 ? formatLYD(cartSubtotal) : 'السلة'}
              </span>
            </button>

            {/* User Account / Auth Dropdown */}
            <div className="relative">
              {user ? (
                <div className="relative">
                  <button
                    id="user-menu-btn"
                    onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-all cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-xs">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'ع'}
                    </div>
                    <span className="hidden lg:inline text-xs font-bold text-stone-800 dark:text-stone-200 max-w-[100px] truncate">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                  </button>

                  {accountMenuOpen && (
                    <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-stone-800 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-700 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-700">
                        <p className="text-xs font-bold text-stone-900 dark:text-white truncate">
                          {user.displayName || 'عميل عكاظ'}
                        </p>
                        <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 text-[10px] font-black">
                            مدير المتجر
                          </span>
                        )}
                      </div>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            setCurrentView('admin');
                            setAccountMenuOpen(false);
                          }}
                          className="w-full text-right px-4 py-2.5 text-xs font-bold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 flex items-center gap-2 cursor-pointer"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>لوحة تحكم المدير</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setCurrentView('account');
                          setAccountMenuOpen(false);
                        }}
                        className="w-full text-right px-4 py-2.5 text-xs font-medium text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700/50 flex items-center gap-2 cursor-pointer"
                      >
                        <PackageCheck className="w-4 h-4 text-stone-500" />
                        <span>طلباتي وتتبّع الشحنات</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsSupportModalOpen(true);
                          setAccountMenuOpen(false);
                        }}
                        className="w-full text-right px-4 py-2.5 text-xs font-medium text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700/50 flex items-center gap-2 cursor-pointer"
                      >
                        <HelpCircle className="w-4 h-4 text-stone-500" />
                        <span>الدعم والمساعدة</span>
                      </button>

                      <div className="border-t border-stone-100 dark:border-stone-700 my-1"></div>

                      <button
                        onClick={() => {
                          logoutUser();
                          setAccountMenuOpen(false);
                        }}
                        className="w-full text-right px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>تسجيل الخروج</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                    <button
                      id="login-trigger-btn"
                      onClick={() => setIsAuthModalOpen(true)}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold text-xs sm:text-sm hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>تسجيل الدخول</span>
                    </button>
                  </div>
                )}

                {/* Prominent Admin Shortcut ONLY for authenticated Store Admin */}
                {isAdmin && (
                  <button
                    onClick={() => setCurrentView('admin')}
                    className="flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 px-3 py-2 rounded-2xl shadow-sm transition-all cursor-pointer shrink-0"
                    title="لوحة تحكم مدير المتجر"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">لوحة الإدارة</span>
                  </button>
                )}
              </div>

          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن المنتجات في ليبيا..."
              className="w-full bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm rounded-2xl pl-10 pr-4 py-2.5 border border-transparent focus:border-orange-500 outline-none"
            />
            <button
              type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Categories Bar (Desktop) */}
        <div className="hidden lg:flex items-center justify-between border-t border-stone-100 dark:border-stone-800 py-2.5 text-xs font-bold">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery('');
                setCurrentView('home');
              }}
              className={`whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === null && currentView === 'home'
                  ? 'text-orange-600 dark:text-orange-400 font-black border-b-2 border-orange-500 pb-1'
                  : 'text-stone-700 dark:text-stone-300 hover:text-orange-500'
              }`}
            >
              جميع الأقسام
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setCurrentView('search');
                }}
                className={`whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.name
                    ? 'text-orange-600 dark:text-orange-400 font-black border-b-2 border-orange-500 pb-1'
                    : 'text-stone-600 dark:text-stone-400 hover:text-orange-500'
                }`}
              >
                {cat.name}
              </button>
            ))}

          </div>

          <div className="flex items-center gap-4 text-stone-500 text-xs shrink-0">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>معاينة قبل الدفع</span>
            </span>
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-orange-500" />
              <span>دفع كاش عند الاستلام</span>
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-18 bg-black/60 backdrop-blur-xs z-50">
          <div className="bg-white dark:bg-stone-900 w-4/5 max-w-sm h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
                <span className="font-black text-lg text-stone-900 dark:text-white">أقسام متجر عكاظ</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-2">
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setCurrentView('home');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-right py-2.5 px-3 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 font-bold text-sm text-stone-800 dark:text-stone-200"
                >
                  🏠 الصفحة الرئيسية
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setCurrentView('search');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-right py-2.5 px-3 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 font-medium text-sm text-stone-700 dark:text-stone-300 flex items-center justify-between"
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full">
                      {cat.productCount || 5} منتج
                    </span>
                  </button>
                ))}

              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-3">
              <button
                onClick={() => {
                  setIsSupportModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium text-xs flex items-center justify-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                <span>مركز المساعدة والسياسات</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => {
                    setCurrentView('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>لوحة تحكم المدير</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
