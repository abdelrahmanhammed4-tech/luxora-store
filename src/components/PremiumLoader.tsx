import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';

export const PremiumLoader: React.FC = () => {
  const { language, t } = useApp();
  const [progress, setProgress] = useState(0);
  const [subPhase, setSubPhase] = useState(0);

  useEffect(() => {
    // Elegant, custom easing progress counter
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Luxury brands load with variable, deliberate velocity (slow at start, fast in middle, slow at end)
        const step = prev < 30 ? 1 : prev < 75 ? 3 : 2;
        return Math.min(prev + step, 100);
      });
    }, 45);

    return () => clearInterval(interval);
  }, []);

  // Update subheading messages to represent a high-end experience
  useEffect(() => {
    if (progress > 85) {
      setSubPhase(2);
    } else if (progress > 45) {
      setSubPhase(1);
    } else {
      setSubPhase(0);
    }
  }, [progress]);

  const welcomeMessages = language === 'ar' 
    ? [
        'جاري تهيئة نفحات العطور الفاخرة...',
        'معايرة عقارب الدقة اللامتناهية...',
        'مرحباً بك في عالم لوكسورا الراقي...'
      ]
    : [
        'Curating premium olfactory notes...',
        'Calibrating infinite-precision movements...',
        'Welcome to the Sanctuary of LUXORA...'
      ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-charcoal-950 text-gold-100 font-sans selection:bg-gold-luxe selection:text-charcoal-950">
      {/* Exquisite ambient golden light background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(189,142,67,0.12),_transparent_65%)]" />
      
      {/* Decorative luxury coordinates / code representing Swiss craftsmanship */}
      <div className="absolute top-6 left-6 font-mono text-[10px] text-gold-400/40 tracking-widest hidden sm:block">
        GENÈVE • PARIS • DUBAI
      </div>
      <div className="absolute top-6 right-6 font-mono text-[10px] text-gold-400/40 tracking-widest hidden sm:block">
        EST. 2026 • LUXORA CORP.
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center">
        {/* Holographic Spinning Gold Watch Dial / Perfume Atomizer Seal */}
        <motion.div 
          className="relative w-32 h-32 mb-10 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          {/* Chrono Outer Ring */}
          <div className="absolute inset-0 border border-gold-luxe/20 rounded-full animate-spin-luxury" />
          
          {/* Chrono Markings (Dotted) */}
          <div className="absolute inset-2 border-2 border-dashed border-gold-400/10 rounded-full animate-spin-luxury [animation-duration:30s]" />
          
          {/* Inner Golden Core */}
          <div className="absolute w-12 h-12 border border-gold-luxe/40 rounded-full flex items-center justify-center">
            <motion.div 
              className="w-1.5 h-6 bg-gold-luxe/80 rounded-full origin-bottom -mt-6"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            />
            <motion.div 
              className="w-1 h-4 bg-gold-400/60 rounded-full origin-bottom -mt-4"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 48, ease: 'linear' }}
            />
          </div>
        </motion.div>

        {/* Brand Name Typography with generous letter spacing */}
        <motion.h1 
          className="text-4xl md:text-5xl font-serif font-light tracking-[0.35em] text-white select-none mb-3"
          initial={{ letterSpacing: '0.15em', opacity: 0 }}
          animate={{ letterSpacing: '0.35em', opacity: 1 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
        >
          {t.appName}
        </motion.h1>

        {/* Sub-tagline */}
        <motion.p 
          className="text-xs font-serif text-gold-300/70 tracking-[0.25em] uppercase mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1.2 }}
        >
          {t.brandTagline}
        </motion.p>

        {/* Live Crafting Messages */}
        <div className="h-6 overflow-hidden mb-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={subPhase}
              className="text-xs font-sans text-gold-100/60 tracking-wider"
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {welcomeMessages[subPhase]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Fine Progress Meter */}
        <div className="w-64 h-[1px] bg-gold-900/40 relative overflow-hidden mb-3">
          <motion.div 
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-gold-500 via-gold-luxe to-gold-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Precision numeric progress indicator */}
        <span className="font-mono text-[11px] text-gold-400/75 tracking-widest">
          {progress.toString().padStart(3, '0')}%
        </span>
      </div>

      {/* Exquisite Luxury Bottom Footer */}
      <div className="absolute bottom-6 text-center">
        <p className="font-serif italic text-[10px] text-gold-500/40 tracking-wider">
          Timeless Precision & Rare Essence
        </p>
      </div>
    </div>
  );
};
