import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { Search, ShoppingBag, Heart, User, LogOut, Menu, Sun, Moon, Languages, Shield, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminLoginModal } from '../auth/AdminLoginModal';
import { AuthModal } from '../auth/AuthModal';

export const Navbar: React.FC = () => {
  const { t, toggleTheme, theme, language, setLanguage } = useApp();
  const { user, logout } = useAuth();
  
  console.log('💎 [Navbar] current user:', user);
  console.log('💎 [Navbar] App status:', user ? 'Authenticated' : 'Guest');

  const { currentView, setCurrentView, setCategoryFilter, cart, favorites, setIsAuthModalOpen } = useStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const isRtl = language === 'ar';

  return (
    <nav className="sticky top-0 z-40 bg-charcoal-50/80 dark:bg-charcoal-950/80 backdrop-blur-md border-b border-charcoal-200 dark:border-gold-900/10 transition-colors duration-500">
      
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Left section: Logo */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setCurrentView('home')} 
            className="text-2xl font-serif font-light tracking-[0.25em] text-charcoal-900 dark:text-white hover:opacity-80 transition-opacity"
          >
            {t.appName}
          </button>
        </div>

        {/* Middle section: Navigation Links */}
        <div className="hidden lg:flex items-center gap-8 text-xs font-sans tracking-wider uppercase">
          <button 
            onClick={() => {
              setCurrentView('home');
              setCategoryFilter('all');
            }} 
            className={`hover:text-gold-luxe transition-colors pb-1 border-b-2 ${
              currentView === 'home' 
                ? 'text-gold-luxe border-gold-luxe/60' 
                : 'text-charcoal-500 dark:text-gold-100/70 border-transparent'
            }`}
          >
            {t.navHome}
          </button>
          
          <button 
            onClick={() => {
              setCurrentView('products');
              setCategoryFilter('all');
            }} 
            className={`hover:text-gold-luxe transition-colors pb-1 border-b-2 ${
              currentView === 'products' 
                ? 'text-gold-luxe border-gold-luxe/60' 
                : 'text-charcoal-500 dark:text-gold-100/70 border-transparent'
            }`}
          >
            {t.navProducts}
          </button>

          <button 
            onClick={() => {
              setCurrentView('products');
              setCategoryFilter('watches');
            }} 
            className="text-charcoal-500 dark:text-gold-100/70 hover:text-gold-luxe transition-colors pb-1 border-transparent"
          >
            {t.watchesCategory}
          </button>

          <button 
            onClick={() => {
              setCurrentView('products');
              setCategoryFilter('perfumes');
            }} 
            className="text-charcoal-500 dark:text-gold-100/70 hover:text-gold-luxe transition-colors pb-1 border-transparent"
          >
            {t.perfumesCategory}
          </button>
        </div>

        {/* Right section: Control Utility & Icons */}
        <div className="flex items-center gap-4 text-charcoal-900 dark:text-gold-100 relative">
          
          {/* Admin Login */}
          {!user && (
            <button 
              onClick={() => setIsAdminModalOpen(true)}
              className="text-[10px] font-mono uppercase tracking-widest text-gold-luxe hover:text-gold-500 transition-colors"
            >
              Admin Login
            </button>
          )}

          {/* User Auth: Sign In or Profile */}
          {!user ? (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-2 text-xs font-medium uppercase tracking-wider bg-gold-luxe text-charcoal-950 rounded-full hover:bg-gold-500 transition-colors"
            >
              {t.signIn || 'Sign In'}
            </button>
          ) : (
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-1 p-1.5 rounded-full hover:bg-charcoal-200/40 dark:hover:bg-gold-900/10 transition-colors"
                title="Profile"
              >
                <User className="w-4 h-4 cursor-pointer" />
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {/* Premium dropdown list */}
              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-72 glass-premium border border-charcoal-200 dark:border-gold-900/10 rounded-2xl p-5 shadow-2xl z-50 text-left font-sans"
                    >
                      <div className="pb-3 border-b border-charcoal-200 dark:border-gold-900/10">
                        <p className="text-[10px] font-mono uppercase text-gold-600 dark:text-gold-400 tracking-wider">
                          {user?.role === 'superadmin' ? 'Grand Curator' : user?.role === 'admin' ? 'Curator' : 'Exclusive Patron'}
                        </p>
                        <h4 className="text-sm font-semibold text-charcoal-900 dark:text-white truncate">
                          {user?.name || 'Exclusive Patron'}
                        </h4>
                        <p className="text-xs text-charcoal-500 dark:text-gold-100/50 truncate">
                          {user?.email}
                        </p>
                      </div>

                      <div className="pt-3 space-y-2">
                        {/* My Profile & Orders Button */}
                        <button 
                          onClick={() => {
                            setIsProfileOpen(false);
                            setCurrentView('profile');
                          }}
                          className={`flex items-center justify-between w-full p-2 text-xs rounded-lg hover:bg-charcoal-100 dark:hover:bg-gold-900/5 transition-colors ${currentView === 'profile' ? 'text-gold-luxe font-medium bg-gold-900/5' : 'text-gray-950 dark:text-white'}`}
                        >
                          <span className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-gold-luxe" />
                            {isRtl ? 'حسابي وطلباتي' : 'My Account & Orders'}
                          </span>
                          <span className="text-[10px] font-mono text-gold-600 dark:text-gold-400">
                            {isRtl ? 'عرض' : 'View'}
                          </span>
                        </button>
                        
                        <button 
                          onClick={() => {
                            setIsProfileOpen(false);
                            setCurrentView('favorites');
                          }}
                          className={`flex items-center justify-between w-full p-2 text-xs rounded-lg hover:bg-charcoal-100 dark:hover:bg-gold-900/5 transition-colors ${currentView === 'favorites' ? 'text-gold-luxe font-medium bg-gold-900/5' : 'text-gray-950 dark:text-white'}`}
                        >
                          <span className="flex items-center gap-2">
                            <Heart className="w-3.5 h-3.5 text-gold-luxe" />
                            {isRtl ? 'المفضلة' : 'Wishlist'}
                          </span>
                        </button>

                        <button 
                          onClick={() => {
                            setIsProfileOpen(false);
                            logout();
                          }}
                          className="flex items-center justify-between w-full p-2 text-xs rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/10 text-rose-600 transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <LogOut className="w-3.5 h-3.5" />
                            {isRtl ? 'تسجيل الخروج' : 'Logout'}
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
          
          {/* Quick Search trigger */}
          <button 
            onClick={() => setCurrentView('products')}
            className={`p-1.5 rounded-full hover:bg-charcoal-200/40 dark:hover:bg-gold-900/10 transition-colors ${currentView === 'products' ? 'text-gold-luxe' : ''}`}
            title={t.searchProducts}
          >
            <Search className="w-4 h-4 cursor-pointer" />
          </button>

          {/* Favorites icon */}
          <button 
            onClick={() => setCurrentView('favorites')}
            className={`p-1.5 rounded-full hover:bg-charcoal-200/40 dark:hover:bg-gold-900/10 transition-colors relative ${currentView === 'favorites' ? 'text-gold-luxe' : ''}`}
            title="Favorites"
          >
            <Heart className="w-4 h-4 cursor-pointer" />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold-luxe text-charcoal-950 text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Cart Bag */}
          <button 
            onClick={() => setCurrentView('cart')}
            className={`p-1.5 rounded-full hover:bg-charcoal-200/40 dark:hover:bg-gold-900/10 transition-colors relative ${currentView === 'cart' ? 'text-gold-luxe' : ''}`}
            title="Cart"
          >
            <ShoppingBag className="w-4 h-4 cursor-pointer" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold-luxe text-charcoal-950 text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </button>

        </div>
      </div>
      <AdminLoginModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />
      <AuthModal />
    </nav>
  );
};
