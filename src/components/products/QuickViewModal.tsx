import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Heart } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { mockProducts } from '../../mockData';

export const QuickViewModal: React.FC = () => {
  const { quickViewProductId, setQuickViewProductId, addToCart, toggleFavorite, favorites, products, setIsAuthModalOpen, setPendingAction } = useStore();
  const { user } = useAuth();
  const { language } = useApp();

  const handleAction = (action: () => void) => {
    if (!user) {
      setPendingAction(action);
      setIsAuthModalOpen(true);
      return;
    }
    action();
  };

  const activeProductsList = products.length > 0 ? products : mockProducts;
  const product = activeProductsList.find(p => p.id === quickViewProductId);
  const isFavorite = product ? favorites.includes(product.id) : false;

  if (!product) return null;

  return (
    <AnimatePresence>
      {quickViewProductId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setQuickViewProductId(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-charcoal-900 rounded-3xl p-8 max-w-2xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setQuickViewProductId(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-charcoal-100 dark:hover:bg-charcoal-800"
            >
              <X className="w-6 h-6 text-charcoal-500" />
            </button>
            <div className="flex flex-col md:flex-row gap-8">
              <img src={product.image} alt={language === 'en' ? product.nameEn : product.nameAr} className="w-full md:w-1/2 aspect-square object-cover rounded-2xl" />
              <div className="flex flex-col justify-center">
                <h2 className="text-2xl font-serif text-charcoal-900 dark:text-white mb-2">{language === 'en' ? product.nameEn : product.nameAr}</h2>
                <p className="text-gold-luxe font-semibold text-xl mb-4">${product.price.toLocaleString()}</p>
                <p className="text-charcoal-600 dark:text-charcoal-400 text-sm mb-6">{language === 'en' ? product.descriptionEn : product.descriptionAr}</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleAction(() => addToCart(product.id, 1))}
                    className="flex-1 py-3 bg-gold-luxe text-charcoal-950 rounded-xl font-bold hover:bg-gold-600 transition flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </button>
                  <button
                    onClick={() => handleAction(() => toggleFavorite(product.id))}
                    className={`p-3 rounded-xl border ${isFavorite ? 'border-rose-500 text-rose-500' : 'border-charcoal-200 dark:border-gold-900/10'}`}
                  >
                    <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
