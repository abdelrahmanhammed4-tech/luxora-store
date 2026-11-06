import React, { useState } from 'react';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { Overview } from '../components/admin/Overview';
import { AdminProducts } from '../components/admin/AdminProducts';
import { AdminOrders } from '../components/admin/AdminOrders';
import { AdminCustomers } from '../components/admin/AdminCustomers';
import { AdminAnalytics } from '../components/admin/AdminAnalytics';
import { AdminInventory } from '../components/admin/AdminInventory';
import { AdminSettings } from '../components/admin/AdminSettings';
import { AdminUserManagement } from '../components/admin/AdminUserManagement';
import { AdminManagement } from '../components/admin/AdminManagement';
import { AdminCoupons } from '../components/admin/AdminCoupons';
import { AdminCertificates } from '../components/admin/AdminCertificates';
import { AdminNewsletter } from '../components/admin/AdminNewsletter';
import { useApp } from '../context/AppContext';
import { AdminProvider } from '../context/AdminContext';
import { Sun, Moon, Languages, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminDashboardContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { theme, toggleTheme, language, setLanguage, t } = useApp();

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': 
        return <Overview />;
      case 'manageProducts': 
        return <AdminProducts />;
      case 'manageOrders': 
        return <AdminOrders />;
      case 'manageCustomers': 
        return <AdminCustomers />;
      case 'manageUsers':
        return <AdminUserManagement />;
      case 'certificates':
        return <AdminCertificates />;
      case 'analytics': 
        return <AdminAnalytics />;
      case 'inventory': 
        return <AdminInventory />;
      case 'coupons':
        return <AdminCoupons />;
      case 'newsletter':
        return <AdminNewsletter />;
      case 'settings': 
        return <AdminSettings />;
      case 'adminManagement':
        return <AdminManagement />;
      default: 
        return <Overview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-charcoal-50 dark:bg-charcoal-950 transition-colors duration-500 font-sans">
      
      {/* Sidebar navigation */}
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />
      
      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header of Dashboard with quick controls */}
        <header className="h-20 bg-white dark:bg-charcoal-900 border-b border-charcoal-200 dark:border-gold-900/10 px-4 sm:px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2.5 rounded-xl bg-charcoal-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-gold-200 hover:text-gold-luxe transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xs sm:text-sm font-serif font-medium uppercase tracking-widest text-charcoal-900 dark:text-gold-100 truncate max-w-[180px] sm:max-w-none">
              {t.adminDashboard} • {t[activeTab as keyof typeof t] || activeTab}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Quick language toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-charcoal-50 dark:bg-charcoal-950 border border-charcoal-200 dark:border-gold-900/10 text-xs tracking-wider font-medium hover:border-gold-luxe/40 transition-colors dark:text-gold-100 min-h-[44px]"
            >
              <Languages className="w-3.5 h-3.5 text-gold-luxe" />
              <span className="hidden sm:inline">{language === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {/* Quick theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-charcoal-50 dark:bg-charcoal-950 border border-charcoal-200 dark:border-gold-900/10 text-charcoal-700 dark:text-gold-300 hover:text-gold-luxe transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Content body with responsive overflow */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  return (
    <AdminProvider>
      <AdminDashboardContent />
    </AdminProvider>
  );
};
