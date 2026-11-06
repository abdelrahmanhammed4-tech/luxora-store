import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { mockProducts } from '../../mockData';
import { ArrowLeft, Heart, ShoppingBag, Star, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

export const ProductDetails: React.FC = () => {
  const { selectedProductId, setSelectedProductId, setCurrentView, toggleFavorite, favorites, addToCart, products, setIsAuthModalOpen } = useStore();
  const { language, t, formatPrice } = useApp();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'desc' | 'specs'>('desc');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>('');
  const [showToast, setShowToast] = useState(false);

  const handleAction = (action: () => void) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    action();
  };

  const activeProductsList = products.length > 0 ? products : mockProducts;
  const product = activeProductsList.find(p => p.id === selectedProductId);

  // Sync active image when product ID changes
  React.useEffect(() => {
    if (product) {
      setActiveImage(product.image);
    }
  }, [selectedProductId, product]);
  
  if (!product) {
    return (
      <div className="py-24 text-center">
        <p className="text-sm text-charcoal-500">Product not found.</p>
        <button onClick={() => setCurrentView('home')} className="mt-4 text-xs font-mono uppercase text-gold-luxe underline">
          Back to Home
        </button>
      </div>
    );
  }

  const isFavorite = favorites.includes(product.id);
  const isRtl = language === 'ar';
  
  const name = isRtl ? product.nameAr : product.nameEn;
  const description = isRtl ? product.descriptionAr : product.descriptionEn;
  const specs = isRtl ? product.specsAr : product.specsEn;

  // Find related products in same category (excluding current)
  const relatedProducts = mockProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    handleAction(() => {
      addToCart(product.id, quantity);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    });
  };

  const mainImageToShow = activeImage || product.image;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 font-sans text-charcoal-900 dark:text-gold-50 relative">
      
      {/* Premium Toast Notification */}
      {showToast && (
        <motion.div 
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-charcoal-950/90 dark:bg-gold-luxe text-white dark:text-charcoal-950 rounded-xl shadow-2xl border border-gold-400/20 flex items-center gap-4 backdrop-blur-md"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest font-semibold">
              {isRtl 
                ? `تمت إضافة ${quantity} من "${name}" إلى حقيبة التسوق`
                : `Added ${quantity}x "${name}" to your shopping bag`}
            </span>
          </div>
          <button
            onClick={() => {
              setShowToast(false);
              setCurrentView('cart');
            }}
            className="px-3 py-1 bg-white dark:bg-charcoal-950 text-charcoal-950 dark:text-gold-100 text-[10px] font-mono uppercase tracking-widest rounded hover:bg-gold-luxe hover:text-charcoal-950 transition-colors border border-charcoal-200/50 dark:border-gold-900/10 cursor-pointer font-bold"
          >
            {isRtl ? 'عرض الحقيبة' : 'View Bag'}
          </button>
        </motion.div>
      )}

      {/* Back Button */}
      <button 
        onClick={() => setCurrentView('products')} 
        className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-charcoal-500 hover:text-gold-luxe mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isRtl ? 'العودة للمنتجات' : 'Back to Products'}</span>
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column: Premium Gallery */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div 
            key={mainImageToShow}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="aspect-[4/3] rounded-3xl overflow-hidden bg-charcoal-100 dark:bg-charcoal-900 border border-charcoal-200 dark:border-gold-900/10"
          >
            <img 
              src={mainImageToShow} 
              alt={name} 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-4">
            {/* Always include main image as first thumbnail */}
            {[product.image, ...product.images.filter(img => img !== product.image)].map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveImage(img)}
                className={`aspect-square rounded-xl overflow-hidden bg-charcoal-100 dark:bg-charcoal-900 border cursor-pointer hover:border-gold-luxe transition-all duration-300 ${mainImageToShow === img ? 'border-gold-luxe scale-98 ring-2 ring-gold-500/10' : 'border-charcoal-200 dark:border-gold-900/10 opacity-70 hover:opacity-100'}`}
              >
                <img src={img} alt={`${name} ${idx}`} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Premium Purchase Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-gold-600 dark:text-gold-400 uppercase">
                {product.category === 'watches' ? (isRtl ? 'ساعات فاخرة' : 'Luxury Watches') : (isRtl ? 'عطور راقية' : 'Premium Perfumes')}
              </span>
              <h1 className="text-3xl font-serif font-light tracking-wide text-charcoal-900 dark:text-white mt-1">
                {name}
              </h1>
            </div>

            {/* Price & Rating */}
            <div className="flex items-center gap-6 pb-4 border-b border-charcoal-200 dark:border-gold-900/10">
              <span className="text-2xl font-semibold text-gold-luxe font-mono">
                {formatPrice(product.price)}
              </span>
              <div className="flex items-center gap-1.5 text-xs">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'opacity-30'}`} 
                    />
                  ))}
                </div>
                <span className="font-mono text-charcoal-500">({product.rating})</span>
              </div>
            </div>

            {/* Stock Status Badge */}
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? (product.stock < 5 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500') : 'bg-rose-500'}`} />
              <span className="text-xs font-mono tracking-wider uppercase text-charcoal-500">
                {product.stock > 0 
                  ? (product.stock < 5 
                      ? (isRtl ? `متوفر (مخزون منخفض: ${product.stock})` : `In Stock (Low Stock: ${product.stock})`)
                      : (isRtl ? `متوفر في المخزون (${product.stock} قطع)` : `In Stock (${product.stock} units)`))
                  : (isRtl ? 'غير متوفر حالياً' : 'Out of Stock')}
              </span>
            </div>

            {/* Description / Specifications tab switcher */}
            <div className="space-y-4">
              <div className="flex gap-4 border-b border-charcoal-200 dark:border-gold-900/10 pb-1">
                <button 
                  onClick={() => setActiveTab('desc')}
                  className={`text-xs uppercase font-mono tracking-wider pb-2 transition-all ${activeTab === 'desc' ? 'text-gold-luxe border-b-2 border-gold-luxe font-bold' : 'text-charcoal-400 hover:text-charcoal-600'}`}
                >
                  {isRtl ? 'التفاصيل' : 'Description'}
                </button>
                <button 
                  onClick={() => setActiveTab('specs')}
                  className={`text-xs uppercase font-mono tracking-wider pb-2 transition-all ${activeTab === 'specs' ? 'text-gold-luxe border-b-2 border-gold-luxe font-bold' : 'text-charcoal-400 hover:text-charcoal-600'}`}
                >
                  {isRtl ? 'المواصفات' : 'Specifications'}
                </button>
              </div>

              <div className="text-xs leading-relaxed text-charcoal-600 dark:text-gold-100/70 min-h-24">
                {activeTab === 'desc' ? (
                  <p>{description}</p>
                ) : (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 font-mono">
                    {Object.entries(specs).map(([key, val]) => (
                      <div key={key} className="flex flex-col pb-1.5 border-b border-charcoal-100 dark:border-gold-900/5">
                        <span className="text-[10px] text-charcoal-400 uppercase">{key}</span>
                        <span className="text-charcoal-800 dark:text-gold-200 mt-0.5">{val}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quantity and Checkout buttons */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-charcoal-200 dark:border-gold-900/10 rounded-xl bg-white dark:bg-charcoal-900/40">
                <button 
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(prev => prev - 1)}
                  className="px-4 py-2.5 hover:text-gold-luxe disabled:opacity-30 transition-colors font-mono"
                >
                  -
                </button>
                <span className="px-3 font-mono text-xs font-semibold">{quantity}</span>
                <button 
                  disabled={quantity >= product.stock}
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="px-4 py-2.5 hover:text-gold-luxe disabled:opacity-30 transition-colors font-mono"
                >
                  +
                </button>
              </div>

              {/* Favorite Button */}
              <button 
                onClick={() => handleAction(() => toggleFavorite(product.id))}
                className={`p-3 border border-charcoal-200 dark:border-gold-900/10 rounded-xl hover:bg-gold-luxe/5 transition-all ${isFavorite ? 'text-rose-500 border-rose-500/20 bg-rose-500/5' : ''}`}
                title="Add to wishlist"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* Add to Bag and Express Checkout */}
            <div className="flex flex-col gap-3">
              <button 
                disabled={product.stock <= 0}
                onClick={handleAddToCart}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-500 via-gold-luxe to-gold-600 hover:opacity-90 active:scale-[0.99] text-charcoal-950 font-sans text-xs font-semibold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-30"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isRtl ? 'إضافة إلى حقيبة التسوق' : 'Add to Shopping Bag'}</span>
              </button>
            </div>
          </div>

          {/* Quick trust assurances */}
          <div className="grid grid-cols-3 gap-2 pt-6 border-t border-charcoal-200 dark:border-gold-900/10 text-center text-[10px] uppercase font-mono tracking-wider text-charcoal-400">
            <div className="flex flex-col items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-gold-luxe" />
              <span>{isRtl ? 'أصلي ١٠٠٪' : '100% Authentic'}</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Truck className="w-4 h-4 text-gold-luxe" />
              <span>{isRtl ? 'شحن مؤمن' : 'Insured Delivery'}</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-gold-luxe" />
              <span>{isRtl ? 'إرجاع سهل' : 'Complimentary Return'}</span>
            </div>
          </div>

        </div>

      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-12 border-t border-charcoal-200 dark:border-gold-900/10">
          <h3 className="text-xl font-serif text-charcoal-900 dark:text-white mb-8">
            {isRtl ? 'إبداعات ذات صلة' : 'Related Creations'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map(p => {
              const pName = isRtl ? p.nameAr : p.nameEn;
              const pFav = favorites.includes(p.id);
              return (
                <div 
                  key={p.id}
                  className="group border border-charcoal-200 dark:border-gold-900/10 rounded-2xl overflow-hidden bg-white dark:bg-charcoal-900/40 hover:border-gold-luxe/40 transition-all cursor-pointer"
                  onClick={() => {
                    setSelectedProductId(p.id);
                    setQuantity(1);
                  }}
                >
                  <div className="aspect-square bg-charcoal-100 dark:bg-charcoal-900 relative overflow-hidden">
                    <img src={p.image} alt={pName} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div className="p-5">
                    <h4 className="text-xs font-serif font-medium text-charcoal-900 dark:text-white truncate">{pName}</h4>
                    <p className="text-[10px] text-charcoal-400 uppercase tracking-widest mt-1">{p.category}</p>
                    <p className="text-xs font-semibold text-gold-luxe mt-2">{formatPrice(p.price)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
