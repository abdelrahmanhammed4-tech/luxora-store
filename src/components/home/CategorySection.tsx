import React from 'react';
import { useApp } from '../../context/AppContext';
import { useStore } from '../../context/StoreContext';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export const CategorySection: React.FC = () => {
  const { t, language } = useApp();
  const { setCategoryFilter, setCurrentView } = useStore();

  const handleCategoryClick = (cat: 'watches' | 'perfumes') => {
    setCategoryFilter(cat);
    setCurrentView('products');
  };

  const isRtl = language === 'ar';

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
      
      {/* Watches Category Card */}
      <motion.div 
        whileHover={{ y: -6 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        onClick={() => handleCategoryClick('watches')}
        className="relative h-96 rounded-3xl overflow-hidden group flex items-end p-10 cursor-pointer shadow-lg shadow-black/5 dark:shadow-gold-950/2 border border-charcoal-200/50 dark:border-gold-900/10"
      >
        <img 
          src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=800&auto=format&fit=crop" 
          alt="Luxury Watches" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Elegant Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-transparent opacity-80" />
        <div className="absolute inset-0 bg-gold-950/10 mix-blend-color" />
        
        <div className="relative z-10 w-full flex flex-col items-start">
          <span className="text-[10px] font-mono tracking-widest uppercase text-gold-300 mb-1">
            {isRtl ? 'إبداعات سويسرية' : 'Swiss Masterpieces'}
          </span>
          <h4 className="text-3xl font-serif font-light text-white tracking-wider mb-4 uppercase">
            {t.watchesCategory}
          </h4>
          
          <button 
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-gold-luxe rounded-lg text-xs font-mono uppercase tracking-widest font-semibold transition-all duration-300 border border-gold-luxe"
          >
            <span>{isRtl ? 'اكتشف الساعات' : 'Explore Watches'}</span>
            <ArrowRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-1 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
          </button>
        </div>
      </motion.div>

      {/* Perfumes Category Card */}
      <motion.div 
        whileHover={{ y: -6 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        onClick={() => handleCategoryClick('perfumes')}
        className="relative h-96 rounded-3xl overflow-hidden group flex items-end p-10 cursor-pointer shadow-lg shadow-black/5 dark:shadow-gold-950/2 border border-charcoal-200/50 dark:border-gold-900/10"
      >
        <img 
          src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop" 
          alt="Premium Perfumes" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Elegant Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-transparent opacity-80" />
        <div className="absolute inset-0 bg-gold-950/10 mix-blend-color" />

        <div className="relative z-10 w-full flex flex-col items-start">
          <span className="text-[10px] font-mono tracking-widest uppercase text-gold-300 mb-1">
            {isRtl ? 'عطور نادرة' : 'Exquisite Nectar'}
          </span>
          <h4 className="text-3xl font-serif font-light text-white tracking-wider mb-4 uppercase">
            {t.perfumesCategory}
          </h4>
          
          <button 
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-gold-luxe rounded-lg text-xs font-mono uppercase tracking-widest font-semibold transition-all duration-300 border border-gold-luxe"
          >
            <span>{isRtl ? 'اكتشف العطور' : 'Explore Perfumes'}</span>
            <ArrowRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-1 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
          </button>
        </div>
      </motion.div>
      
    </section>
  );
};
