import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  SlidersHorizontal, 
  RotateCcw, 
  Search
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../home/ProductCard';

export const SearchFilterView: React.FC = () => {
  const { 
    products, 
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    formatLYD 
  } = useStore();

  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(6000);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory && p.category !== selectedCategory) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        const matchTags = p.tags ? p.tags.some(t => t.toLowerCase().includes(q)) : false;
        if (!matchName && !matchDesc && !matchCat && !matchTags) return false;
      }

      // In stock
      if (inStockOnly && !p.inStock) return false;

      // Price
      if (p.price > maxPrice) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      // 'newest'
      return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, inStockOnly, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setInStockOnly(false);
    setMaxPrice(6000);
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 text-right">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-8">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-stone-900 dark:text-white">
            {selectedCategory || (searchQuery ? `نتائج البحث عن: "${searchQuery}"` : 'تصفح جميع المنتجات')}
          </h1>
          <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">
            تم العثور على ({filteredProducts.length}) منتج متاح للتوصيل الفوري في ليبيا
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold active:scale-95 cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-orange-500" />
            <span>تصفية ({selectedCategory ? '1' : '0'})</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500 hidden sm:inline">ترتيب حسب:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-orange-500"
            >
              <option value="newest">الأحدث</option>
              <option value="price-asc">السعر: من الأقل للأعلى</option>
              <option value="price-desc">السعر: من الأعلى للأقل</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Desktop Filter Sidebar */}
        <aside className={`md:col-span-3 space-y-6 ${mobileFilterOpen ? 'block' : 'hidden md:block'}`}>
          <div className="p-5 rounded-3xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/60 shadow-xs space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-700">
              <h3 className="text-sm font-black text-stone-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-orange-500" />
                <span>تصفية النتائج</span>
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-stone-400 hover:text-orange-500 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>إعادة ضبط</span>
              </button>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-2.5">
                التصنيف / القسم
              </label>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-right px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    selectedCategory === null
                      ? 'bg-orange-500 text-white font-bold'
                      : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700'
                  }`}
                >
                  جميع الأقسام ({products.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-right px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                      selectedCategory === cat.name
                        ? 'bg-orange-500 text-white font-bold'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] opacity-70">
                      {products.filter(p => p.category === cat.name).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price Slider (in LYD) */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-stone-800 dark:text-stone-200 mb-2">
                <span>الحد الأقصى للسعر:</span>
                <span className="text-orange-600">{formatLYD(maxPrice)}</span>
              </div>
              <input
                type="range"
                min={50}
                max={6000}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>50 د.ل</span>
                <span>6,000 د.ل</span>
              </div>
            </div>

            {/* In stock toggle */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-700 dark:text-stone-300">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4 cursor-pointer"
                />
                <span>المنتجات المتوفرة في المخزون فقط</span>
              </label>
            </div>

          </div>
        </aside>

        {/* Product Grid */}
        <main className="md:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-stone-800/60 rounded-3xl border border-stone-200/80 dark:border-stone-700/60 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-700 text-stone-400 mx-auto flex items-center justify-center">
                <Search className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-base font-bold text-stone-800 dark:text-white">
                لم نجد منتجات مطابقة لخيارات البحث
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                جرب تغيير التصنيف، توسيع نطاق السعر، أو إزالة الكلمات المفتاحية
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-2xl bg-orange-500 text-white font-bold text-xs hover:bg-orange-600 transition-colors shadow-md cursor-pointer"
              >
                إعادة ضبط جميع الفلاتر
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2.5 sm:gap-5">
              {filteredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
};
