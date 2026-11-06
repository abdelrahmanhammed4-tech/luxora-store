import React from 'react';
import { useStore } from '../context/StoreContext';
import { useApp } from '../context/AppContext';
import { mockProducts } from '../mockData';
import { ProductCard } from '../components/products/ProductCard';
import { Heart, Sparkles } from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  const { favorites, setCurrentView, products } = useStore();
  const { language } = useApp();

  const isRtl = language === 'ar';

  const activeProducts = products.length > 0 ? products : mockProducts;
  const favoriteProducts = activeProducts.filter(p => favorites.includes(p.id) && p.status !== 'hidden');

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Title */}
      <div className="mb-10 text-center lg:text-left">
        <h2 className="text-3xl font-serif font-light text-charcoal-900 dark:text-white uppercase tracking-wide flex items-center justify-center lg:justify-start gap-3">
          <Heart className="w-6 h-6 text-gold-luxe fill-current" />
          <span>{isRtl ? 'مجموعتك المفضلة' : 'Your Curated Collection'}</span>
        </h2>
        <p className="text-xs text-charcoal-500 dark:text-gold-400/60 mt-2 tracking-wider uppercase font-mono">
          {favoriteProducts.length} {isRtl ? 'قطع مفضلة مخصصة' : 'Personal Curated Pieces'}
        </p>
      </div>

      {favoriteProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in">
          {favoriteProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center border border-dashed border-charcoal-200 dark:border-gold-900/10 rounded-3xl bg-white/30 dark:bg-charcoal-900/10 max-w-xl mx-auto px-6">
          <Heart className="w-8 h-8 mx-auto text-charcoal-300 dark:text-gold-900/35 mb-4" />
          <h3 className="text-sm font-serif font-semibold tracking-wider text-charcoal-800 dark:text-white uppercase">
            {isRtl ? 'المعرض الشخصي فارغ' : 'Your Curator Showcase is Empty'}
          </h3>
          <p className="text-xs text-charcoal-500 dark:text-gold-100/40 mt-2 leading-relaxed">
            {isRtl 
              ? 'تصفح إبداعات دار لوكسورا الحصرية من الساعات الفاخرة والعطور النادرة، وأضف روائعك المفضلة لبناء مجموعتك الاستثنائية.' 
              : 'Browse through our masterwork creations of haute horology and precious fragrances. Select your favorites to build your private cabinet of exquisite tastes.'}
          </p>
          <button 
            onClick={() => setCurrentView('products')} 
            className="mt-6 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-luxe text-charcoal-950 text-[10px] font-mono uppercase tracking-widest rounded-xl font-bold shadow-lg hover:opacity-90 active:scale-98 transition-all"
          >
            {isRtl ? 'اكتشف الإبداعات' : 'Explore the Creations'}
          </button>
        </div>
      )}
    </div>
  );
};
