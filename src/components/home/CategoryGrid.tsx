import React from 'react';
import { 
  Smartphone, 
  Sparkles, 
  Shirt, 
  Watch, 
  Home as HomeIcon, 
  Heart, 
  ArrowLeft 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const ICON_MAP: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Shirt: <Shirt className="w-5 h-5" />,
  Watch: <Watch className="w-5 h-5" />,
  Home: <HomeIcon className="w-5 h-5" />,
  Heart: <Heart className="w-5 h-5" />
};

export const CategoryGrid: React.FC = () => {
  const { categories, setSelectedCategory, setCurrentView, products } = useStore();

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setCurrentView('search');
  };

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white">
            تسوق حسب القسم
          </h3>
          <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            اختر من بين تشكيلاتنا المنتقاة بعناية للسوق الليبي
          </p>
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

      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-4">
        {categories.map((cat) => {
          const count = products.filter(p => p.category === cat.name).length;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.name)}
              className="group relative flex flex-col items-center text-center p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/60 hover:border-orange-500/60 dark:hover:border-orange-500/60 transition-all hover:shadow-md cursor-pointer active:scale-95"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden mb-2 sm:mb-3 bg-stone-100 dark:bg-stone-700 relative shadow-inner">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 p-0.5 sm:p-1 rounded-md sm:rounded-lg bg-orange-500 text-white shadow-xs">
                  {ICON_MAP[cat.iconName] || <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                </div>
              </div>

              <span className="text-[11px] sm:text-sm font-bold text-stone-800 dark:text-stone-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-1">
                {cat.name}
              </span>
              <span className="text-[10px] sm:text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">
                {count > 0 ? `${count} منتج` : 'متوفر'}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
