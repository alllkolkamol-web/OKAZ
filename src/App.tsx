/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './components/pages/Home';
import { SearchFilterView } from './components/search/SearchFilterView';
import { CheckoutView } from './components/checkout/CheckoutView';
import { OrderSuccessView } from './components/checkout/OrderSuccessView';
import { AccountView } from './components/account/AccountView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { ProductComparisonModal } from './components/product/ProductComparisonModal';
import { AuthModal } from './components/auth/AuthModal';
import { SupportModal } from './components/support/SupportModal';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Scale, ShieldAlert } from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    currentView, 
    setCurrentView,
    isAdmin,
    setIsAuthModalOpen,
    selectedProduct, 
    setSelectedProduct, 
    compareList,
    setIsCompareModalOpen
  } = useStore();

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Dynamic View */}
      <main className="flex-1 pb-20 lg:pb-0">
        {currentView === 'home' && <Home />}
        {currentView === 'search' && <SearchFilterView />}
        {currentView === 'checkout' && <CheckoutView />}
        {currentView === 'order_success' && <OrderSuccessView />}
        {currentView === 'account' && <AccountView />}
        {currentView === 'admin' && (
          isAdmin ? (
            <AdminDashboard />
          ) : (
            <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center shadow-inner">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-stone-900 dark:text-white">
                منطقة إدارية مخصصة لمدير متجر عُكاظ
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed max-w-sm mx-auto">
                لوحة التحكم الإدارية غير متاحة للمستخدمين العاديين. يرجى تسجيل الدخول بحساب الإدارة المعتمد للوصول.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs shadow-md cursor-pointer hover:from-amber-700 hover:to-orange-700 transition-all"
                >
                  تسجيل دخول الإدارة
                </button>
                <button
                  onClick={() => setCurrentView('home')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs cursor-pointer hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                >
                  العودة للمتجر
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Floating Compare Trigger Button if comparison items exist */}
      {compareList.length > 0 && (
        <div className="fixed bottom-20 left-3 sm:bottom-6 sm:left-6 z-30 flex flex-col items-start gap-2.5">
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-xl backdrop-blur-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="مقارنة المنتجات"
          >
            <Scale className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            <span>مقارنة ({compareList.length})</span>
          </button>
        </div>
      )}

      {/* Global Modals and Drawers */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <CartDrawer />
      <ProductComparisonModal />
      <AuthModal />
      <SupportModal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
