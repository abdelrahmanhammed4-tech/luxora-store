import React from 'react';
import { AdminProvider } from './context/AdminContext';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { ToastProvider } from './context/ToastContext';
import { PremiumLoader } from './components/PremiumLoader';
import { HomePage } from './pages/HomePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { FloatingButtons } from './components/common/FloatingButtons';
import { CookieConsent } from './components/common/CookieConsent';
import { QuickViewModal } from './components/products/QuickViewModal';
import { motion, AnimatePresence } from 'motion/react';

import { Helmet } from 'react-helmet-async';
// ... existing imports ...
const AppContent: React.FC = () => {
  const { isLoading } = useApp();
  const { user } = useAuth();

  return (
    <>
      <Helmet>
        <title>LUXORA | Luxury Watches & Premium Perfumes</title>
        <meta name="description" content="Discover the exquisite collection of luxury watches and premium perfumes at LUXORA. Timeless elegance and rare essences." />
        <meta name="keywords" content="luxury watches, premium perfumes, LUXORA, swiss watches, niche perfumes" />
        <meta property="og:title" content="LUXORA | Luxury Watches & Premium Perfumes" />
        <meta property="og:description" content="Discover the exquisite collection of luxury watches and premium perfumes at LUXORA." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://ais-dev-zxxlbh3dne7nj6daummhlz-236044744733.europe-west2.run.app/" />
      </Helmet>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <PremiumLoader />
          </motion.div>
        ) : (user?.role === 'admin' || user?.role === 'superadmin') ? (
          <motion.div
            key="admin"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <AdminDashboard />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <HomePage />
          </motion.div>
        )}
        <QuickViewModal />
      </AnimatePresence>
      <FloatingButtons />
      <CookieConsent />
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <AdminProvider>
          <StoreProvider>
            <ToastProvider>
              <AppContent />
            </ToastProvider>
          </StoreProvider>
        </AdminProvider>
      </AuthProvider>
    </AppProvider>
  );
}
