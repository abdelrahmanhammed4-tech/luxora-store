import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { HeroSection } from '../components/home/HeroSection';
import { CategorySection } from '../components/home/CategorySection';
import { ProductGrid } from '../components/home/ProductGrid';
import { useApp } from '../context/AppContext';
import { useStore } from '../context/StoreContext';
import { StorePage } from './StorePage';
import { FavoritesPage } from './FavoritesPage';
import { ProductDetails } from '../components/products/ProductDetails';
import { UserProfile } from '../components/products/UserProfile';
import { ShoppingCart } from '../components/products/ShoppingCart';
import { ContactPage } from './ContactPage';
import { AboutUsPage } from './AboutUsPage';
import { OurStoryPage } from './OurStoryPage';
import { PrivacyPolicyPage } from './PrivacyPolicyPage';
import { TermsConditionsPage } from './TermsConditionsPage';
import { ShippingPolicyPage } from './ShippingPolicyPage';
import { ReturnPolicyPage } from './ReturnPolicyPage';
import { WarrantyPage } from './WarrantyPage';
import { FAQPage } from './FAQPage';
import { mockProducts } from '../mockData';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const { t } = useApp();
  const { currentView, products } = useStore();
  const { user } = useAuth();
  
  console.log('💎 [Home] current user:', user);
  console.log('💎 [Home] App status:', user ? 'Authenticated' : 'Guest');

  const activeProducts = products.length > 0 ? products : mockProducts;
  const featured = activeProducts.filter(p => p.featured && p.status !== 'hidden');
  const bestSellers = activeProducts.filter(p => p.rating >= 4.9 && p.status !== 'hidden');

  return (
    <div className="min-h-screen bg-charcoal-50 dark:bg-charcoal-950 transition-colors duration-500 flex flex-col justify-between">
      <div>
        <Navbar />
        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              {currentView === 'home' && (
                <>
                  <HeroSection />
                  <CategorySection />
                  <ProductGrid title={t.featuredProductsTitle} products={featured} />
                  <ProductGrid title={t.bestSellersTitle} products={bestSellers} />
                </>
              )}
              {currentView === 'products' && <StorePage />}
              {currentView === 'favorites' && <FavoritesPage />}
              {currentView === 'product-details' && <ProductDetails />}
              {currentView === 'profile' && <UserProfile />}
              {currentView === 'cart' && <ShoppingCart />}
              {currentView === 'contact' && <ContactPage />}
              {currentView === 'about' && <AboutUsPage />}
              {currentView === 'story' && <OurStoryPage />}
              {currentView === 'privacy' && <PrivacyPolicyPage />}
              {currentView === 'terms' && <TermsConditionsPage />}
              {currentView === 'shipping' && <ShippingPolicyPage />}
              {currentView === 'return' && <ReturnPolicyPage />}
              {currentView === 'warranty' && <WarrantyPage />}
              {currentView === 'faq' && <FAQPage />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Footer />
    </div>
  );
};
