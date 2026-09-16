import React from 'react';
import { Heart, ShoppingBag, Scale, Check, Eye } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    formatLYD, 
    addToCart, 
    toggleFavorite, 
    isFavorite, 
    setSelectedProduct, 
    addToCompare, 
    compareList 
  } = useStore();

  const isFav = isFavorite(product.id);
  const isCompared = compareList.some(p => p.id === product.id);

  return (
    <div 
      onClick={() => setSelectedProduct(product)}
      className="group relative flex flex-col bg-white dark:bg-stone-800/90 rounded-2xl sm:rounded-3xl border border-stone-200/80 dark:border-stone-700/60 overflow-hidden hover:shadow-xl hover:border-orange-500/50 dark:hover:border-orange-500/50 transition-all duration-300 cursor-pointer"
    >
      
      {/* Top Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-stone-100 dark:bg-stone-700/50">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-1 z-10 pointer-events-none">
          {product.isNew && (
            <span className="px-2 py-0.5 rounded-lg bg-amber-500/90 text-white text-[9px] sm:text-[10px] font-bold shadow-xs">
              جديد
            </span>
          )}
        </div>

        {/* Favorite & Quick Actions */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-1.5 z-10">
          <button
            id={`fav-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
            className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/90 dark:bg-stone-800/90 backdrop-blur-xs flex items-center justify-center text-stone-700 dark:text-stone-300 hover:text-rose-500 shadow-md transition-colors cursor-pointer active:scale-90"
            aria-label="إضافة للمفضلة"
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFav ? 'text-rose-500 fill-rose-500' : ''}`} />
          </button>

          <button
            id={`compare-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              addToCompare(product);
            }}
            className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full backdrop-blur-xs flex items-center justify-center shadow-md transition-colors cursor-pointer active:scale-90 ${
              isCompared 
                ? 'bg-blue-600 text-white' 
                : 'bg-white/90 dark:bg-stone-800/90 text-stone-700 dark:text-stone-300 hover:text-blue-600'
            }`}
            title="مقارنة المنتج"
          >
            <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Overlay Quick View Button (Desktop hover only) */}
        <div className="hidden sm:block absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            className="w-full py-2.5 rounded-2xl bg-white/95 dark:bg-stone-900/95 text-stone-900 dark:text-white text-xs font-black shadow-lg backdrop-blur-xs flex items-center justify-center gap-1.5 hover:bg-orange-500 hover:text-white transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>معاينة تفاصيل المنتج</span>
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-2.5 sm:p-4 md:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Category */}
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-stone-500 dark:text-stone-400 mb-1">
            <span className="font-semibold text-orange-600 dark:text-orange-400 truncate">
              {product.category}
            </span>
            {product.brand && (
              <span className="text-[10px] text-stone-400 truncate max-w-[80px]">
                {product.brand}
              </span>
            )}
          </div>

          {/* Title */}
          <h4 
            className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white leading-snug line-clamp-2 hover:text-orange-600 dark:hover:text-orange-400 transition-colors mb-1 sm:mb-2"
          >
            {product.name}
          </h4>

          {/* Short stock indicator */}
          <div className="flex items-center gap-1.5 mb-2">
            {product.inStock ? (
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>متوفر ({product.stockCount})</span>
              </span>
            ) : (
              <span className="text-[10px] sm:text-[11px] font-semibold text-rose-500">
                نفذت الكمية
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-2 sm:pt-3 border-t border-stone-100 dark:border-stone-700/60 flex items-center justify-between gap-1.5">
          <div className="flex flex-col">
            <span className="text-xs sm:text-base font-black text-stone-900 dark:text-white leading-none">
              {formatLYD(product.price)}
            </span>
          </div>

          <button
            id={`add-cart-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1);
            }}
            disabled={!product.inStock}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xs ${
              product.inStock
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 active:scale-90'
                : 'bg-stone-200 dark:bg-stone-700 text-stone-400 cursor-not-allowed'
            }`}
            title="إضافة للسلة"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
            <span className="hidden md:inline">أضف</span>
          </button>
        </div>
      </div>

    </div>
  );
};
