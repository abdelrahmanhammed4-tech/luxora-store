import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../context/StoreContext';

export const NotFoundPage: React.FC = () => {
  const { setCurrentView } = useStore();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-charcoal-950 text-center px-6">
      <h1 className="text-9xl font-serif text-gold-luxe mb-6">404</h1>
      <h2 className="text-3xl font-serif mb-4 text-charcoal-900 dark:text-white">Page Not Found</h2>
      <p className="text-charcoal-500 mb-8 max-w-md">The page you are looking for might have been removed or is temporarily unavailable.</p>
      <button onClick={() => setCurrentView('home')} className="px-8 py-3 bg-gold-luxe text-white rounded-lg hover:bg-gold-600 transition-colors">Back to Home</button>
    </motion.div>
  );
};
