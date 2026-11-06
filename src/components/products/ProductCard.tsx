import React from 'react';
import { motion } from 'motion/react';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleFavorite, addToCart, favorites, setSelectedProductId, setCurrentView, setQuickViewProductId, setIsAuthModalOpen } = useStore();
  const { language, t } = useApp();
  const { user } = useAuth();
  const isFavorite = favorites.includes(product.id);

  const handleAction = (action: () => void) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    action();
  };

  const handleViewDetails = () => {
    setSelectedProductId(product.id);
    setCurrentView('product-details');
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProductId(product.id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      viewport={{ once: true }}
      className="group border border-charcoal-200 dark:border-gold-900/10 rounded-2xl overflow-hidden bg-white dark:bg-charcoal-900/40 hover:border-gold-luxe/40 transition-all duration-300 flex flex-col justify-between"
    >
      <div className="relative aspect-square bg-charcoal-100 dark:bg-charcoal-900 overflow-hidden cursor-pointer" onClick={handleViewDetails}>
        <img src={product.image} alt={language === 'en' ? product.nameEn : product.nameAr} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={handleQuickView}
            className="p-3 bg-white border border-charcoal-200 rounded-full hover:bg-gold-luxe transition-colors" 
            title={t.quickView}
          >
            <Eye className="w-4 h-4 text-charcoal-900" />
          </button>
          
          <button 
            onClick={() => handleAction(() => toggleFavorite(product.id))}
            className={`p-3 bg-white border border-charcoal-200 rounded-full transition-colors ${isFavorite ? 'text-rose-500' : 'text-charcoal-900 hover:text-rose-500'}`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          
          <button 
            disabled={product.stock <= 0}
            onClick={() => handleAction(() => addToCart(product.id, 1))}
            className="p-3 bg-white border border-charcoal-200 rounded-full hover:bg-gold-luxe transition-colors text-charcoal-900 disabled:opacity-30 disabled:cursor-not-allowed"
            title={t.addToCart}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-6 cursor-pointer" onClick={handleViewDetails}>
        <h4 className="text-sm font-medium text-charcoal-900 dark:text-white mb-1 hover:text-gold-luxe transition-colors">{language === 'en' ? product.nameEn : product.nameAr}</h4>
        <p className="text-xs text-charcoal-500 dark:text-gold-400/60 mb-3 uppercase tracking-wider flex justify-between items-center">
          {product.category}
          {product.stock <= 0 && <span className="text-[10px] font-bold text-rose-500 uppercase">{t.outOfStock || 'Out of Stock'}</span>}
          {product.stock > 0 && product.stock < 5 && <span className="text-[10px] font-bold text-amber-500 uppercase">{t.lowStock || 'Low Stock'}</span>}
        </p>
        <p className="text-sm font-semibold text-gold-luxe">${(product.price ?? 0).toLocaleString()}</p>
      </div>
    </motion.div>
  );
};
