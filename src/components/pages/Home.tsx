import React from 'react';
import { ArrowLeft, TrendingUp, Tag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { HeroBanner } from '../home/HeroBanner';
import { CategoryGrid } from '../home/CategoryGrid';
import { ProductCard } from '../home/ProductCard';

export const Home: React.FC = () => {
  const { 
    products, 
    setCurrentView, 
    setSelectedCategory 
  } = useStore();

  const featuredProducts = products.filter(p => p.isFeatured || p.rating >= 4.8).slice(0, 8);
  const newProducts = products.filter(p => p.isNew).slice(0, 8);

  return (
    <div className="space-y-6 sm:space-y-10 pb-12 text-right">
      
      {/* 1. Direct Store Welcome & Key Pillars */}
      <HeroBanner />

      {/* 2. Key Categories Grid */}
      <CategoryGrid />

      {/* 3. Featured Products (الأكثر طلباً) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3 sm:mb-5">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-black text-stone-900 dark:text-white">
                المنتجات الأكثر طلباً ومبيعاً
              </h3>
              <p className="text-[10px] sm:text-xs text-stone-500">مختارة بناءً على توفرها العالي في مخازننا في ليبيا</p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedCategory(null);
              setCurrentView('search');
            }}
            className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>عرض الكل</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 4. New Arrivals (وصل حديثاً) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3 sm:mb-5">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-black text-stone-900 dark:text-white">
                وصل حديثاً إلى متجر عُكاظ
              </h3>
              <p className="text-[10px] sm:text-xs text-stone-500">أحدث الإضافات الجاهزة للشحن الفوري</p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedCategory(null);
              setCurrentView('search');
            }}
            className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>استعراض المزيد</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
          {newProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

    </div>
  );
};

