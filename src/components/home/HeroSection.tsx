import React from 'react';
import { useApp } from '../../context/AppContext';
import { useStore } from '../../context/StoreContext';
import { motion } from 'motion/react';

export const HeroSection: React.FC = () => {
  const { t } = useApp();
  const { setCurrentView, setCategoryFilter } = useStore();

  const handleExplore = () => {
    setCategoryFilter('all');
    setCurrentView('products');
  };

  return (
    <section className="relative h-[80vh] flex items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0 bg-charcoal-900 z-0">
        <img 
          src="https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1600&auto=format&fit=crop" 
          alt="Luxury Watch Background" 
          className="w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/60 to-charcoal-950/80" />
      </div>
      <div className="relative z-10 max-w-4xl px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-serif font-light text-charcoal-900 dark:text-white tracking-wide mb-6 uppercase"
        >
          {t.heroTitle}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-lg text-charcoal-800 dark:text-gray-300 mb-10 font-sans tracking-wide"
        >
          {t.heroSubtitle}
        </motion.p>
        <motion.button 
          onClick={handleExplore}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="px-10 py-4 bg-gold-luxe text-charcoal-950 text-xs font-semibold tracking-widest uppercase hover:bg-gold-500 transition-all duration-300 shadow-xl shadow-gold-500/10 rounded-sm cursor-pointer"
        >
          {t.heroCTA}
        </motion.button>
      </div>
    </section>
  );
};
