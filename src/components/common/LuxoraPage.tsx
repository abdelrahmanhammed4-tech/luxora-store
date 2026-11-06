import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface LuxoraPageProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const LuxoraPage: React.FC<LuxoraPageProps> = ({ title, subtitle, children }) => {
  const { setCurrentView } = useStore();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white dark:bg-charcoal-950 text-charcoal-900 dark:text-white pt-24 pb-16 px-6"
    >
      <div className="max-w-4xl mx-auto">
        <button 
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 text-charcoal-500 hover:text-gold-luxe mb-8 transition-colors"
        >
            <ArrowLeft size={16} />
            Back to Home
        </button>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">{title}</h1>
          {subtitle && <p className="text-gold-luxe uppercase tracking-widest text-sm">{subtitle}</p>}
        </div>

        <div className="bg-charcoal-50 dark:bg-charcoal-900 p-8 md:p-12 rounded-3xl border border-charcoal-100 dark:border-charcoal-800 shadow-xl">
            {children}
        </div>
      </div>
    </motion.div>
  );
};
