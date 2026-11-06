import React, { useMemo, useState } from 'react';
import { ProductCard } from '../components/products/ProductCard';
import { mockProducts } from '../mockData';
import { useApp } from '../context/AppContext';
import { useStore } from '../context/StoreContext';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronDown } from 'lucide-react';

export const StorePage: React.FC = () => {
  const { t, language } = useApp();
  const { products, categoryFilter, setCategoryFilter, searchQuery, setSearchQuery } = useStore();
  const [sortBy, setSortBy] = useState<'default' | 'priceAsc' | 'priceDesc' | 'rating'>('default');

  const isRtl = language === 'ar';

  const activeProductsList = useMemo(() => {
    const list = products.length > 0 ? products : mockProducts;
    return list.filter(p => p.status !== 'hidden');
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = activeProductsList.filter(p => {
      const matchesSearch = 
        p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.nameAr.includes(searchQuery) ||
        p.descriptionEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.descriptionAr.includes(searchQuery);
      
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [searchQuery, categoryFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Title */}
      <div className="mb-10 text-center lg:text-left">
        <h2 className="text-3xl font-serif font-light text-charcoal-900 dark:text-white uppercase tracking-wide">
          {categoryFilter === 'all' ? (isRtl ? 'المجموعة الكاملة' : 'The Full Collection') : categoryFilter === 'watches' ? (isRtl ? 'روائع الساعات' : 'Luxury Timepieces') : (isRtl ? 'العطور الراقية' : 'Premium Scents')}
        </h2>
        <p className="text-xs text-charcoal-500 dark:text-gold-400/60 mt-2 tracking-wider uppercase font-mono">
          {filteredAndSortedProducts.length} {isRtl ? 'إبداعات متوفرة' : 'Creations Available'}
        </p>
      </div>

      {/* Controls: Search, Category Filters, and Sorting */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-6 mb-12">
        {/* Search */}
        <div className="relative w-full lg:w-96 flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-charcoal-400 dark:text-gold-200/40 pointer-events-none" />
          <input 
            type="text"
            placeholder={t.searchProducts}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 w-full pl-11 pr-4 rounded-xl bg-white dark:bg-charcoal-900/40 border border-charcoal-200 dark:border-gold-900/10 focus:outline-none focus:border-gold-luxe focus:ring-1 focus:ring-gold-luxe transition-all text-xs text-charcoal-900 dark:text-white"
          />
        </div>

        {/* Category Pills & Sorting Select */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto justify-end">
          {/* Category Filter */}
          <div className="flex gap-2 w-full sm:w-auto justify-center">
            {(['all', 'watches', 'perfumes'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`h-11 px-6 rounded-full text-[10px] uppercase tracking-widest border transition-all duration-300 font-bold flex items-center justify-center cursor-pointer select-none active:scale-95 ${
                  categoryFilter === cat 
                    ? 'bg-gold-luxe text-charcoal-950 border-gold-luxe shadow-lg shadow-gold-500/10 scale-[1.02]'
                    : 'border-charcoal-200 dark:border-gold-900/20 text-charcoal-800 dark:text-gold-100 bg-charcoal-50/50 dark:bg-charcoal-900/20 hover:border-gold-luxe/40 hover:text-gold-luxe dark:hover:text-gold-luxe dark:hover:border-gold-luxe/40 hover:scale-[1.03]'
                }`}
              >
                {cat === 'all' ? t.viewAll : cat === 'watches' ? t.watchesCategory : t.perfumesCategory}
              </button>
            ))}
          </div>

          {/* Sort Menu */}
          <div className="relative w-full sm:w-52 flex items-center">
            <ArrowUpDown className="absolute left-4 w-3.5 h-3.5 text-charcoal-400 dark:text-gold-200/40 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="h-11 w-full pl-10 pr-10 rounded-xl bg-white dark:bg-charcoal-900/40 border border-charcoal-200 dark:border-gold-900/10 focus:outline-none focus:border-gold-luxe focus:ring-1 focus:ring-gold-luxe transition-all text-[11px] uppercase tracking-wider font-semibold text-charcoal-700 dark:text-gold-200 cursor-pointer appearance-none"
            >
              <option value="default" className="bg-white dark:bg-charcoal-950 text-charcoal-900 dark:text-white">{isRtl ? 'الترتيب الافتراضي' : 'Default Sorting'}</option>
              <option value="priceAsc" className="bg-white dark:bg-charcoal-950 text-charcoal-900 dark:text-white">{isRtl ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
              <option value="priceDesc" className="bg-white dark:bg-charcoal-950 text-charcoal-900 dark:text-white">{isRtl ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
              <option value="rating" className="bg-white dark:bg-charcoal-950 text-charcoal-900 dark:text-white">{isRtl ? 'التقييم: الأعلى' : 'Highest Rated'}</option>
            </select>
            <ChevronDown className="absolute right-4 w-3.5 h-3.5 text-charcoal-400 dark:text-gold-200/40 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredAndSortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center border border-dashed border-charcoal-200 dark:border-gold-900/10 rounded-3xl bg-white/30 dark:bg-charcoal-900/10">
          <SlidersHorizontal className="w-8 h-8 mx-auto text-charcoal-300 dark:text-gold-900/35 mb-4" />
          <p className="text-sm font-medium text-charcoal-500 dark:text-gold-100/40">
            {isRtl ? 'لم نجد أي قطع تطابق بحثك حالياً.' : 'No creations match your search parameters.'}
          </p>
          <button 
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
            }} 
            className="mt-4 px-5 py-2 bg-charcoal-900 dark:bg-gold-luxe text-white dark:text-charcoal-950 text-[10px] font-mono uppercase tracking-widest rounded-lg hover:opacity-90"
          >
            {isRtl ? 'إعادة تعيين البحث' : 'Reset Search'}
          </button>
        </div>
      )}
    </div>
  );
};
