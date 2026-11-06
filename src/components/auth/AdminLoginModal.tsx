import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const { login, user, logout } = useAuth();

  const { login, user } = useAuth();
  

  // useEffect(() => {
  //   if (user && user.role === 'customer') {
  //     setError('Access Denied. Administrator privileges required.');
  //     logout();
  //     setIsLoading(false);
  //   }
  // }, [user, logout]);



  useEffect(() => {
  if (!isOpen || !user) return;

  // لو Admin أو SuperAdmin اقفل المودال وسيبه يكمل
  if (user.role === 'admin' || user.role === 'superadmin') {
    setIsLoading(false);
    onClose();
    return;
  }

  // لو Customer متعملوش Logout
  setError('Access Denied. Administrator privileges required.');
  setIsLoading(false);
}, [isOpen, user, onClose]);

  

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      setIsLoading(false);
    }
  };

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[440px] max-h-[90vh] flex flex-col bg-white dark:bg-charcoal-950/90 rounded-[32px] shadow-2xl border border-charcoal-100 dark:border-charcoal-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={onClose} 
              className="absolute top-6 right-6 z-10 p-2 text-charcoal-400 hover:text-charcoal-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="overflow-y-auto p-8 md:p-10">
              <div className="text-center mb-10">
                <div className="text-2xl font-serif font-bold text-charcoal-900 dark:text-gold-luxe mb-2">LUXORA</div>
                <h2 className="text-2xl font-serif text-charcoal-950 dark:text-white mb-2">Administrator Access</h2>
                <p className="text-xs text-charcoal-500 dark:text-charcoal-400 font-mono uppercase tracking-[0.2em]">Authorized personnel only.</p>
              </div>
              
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 mb-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-xl text-xs text-red-600 dark:text-red-400 font-mono">
                  {error}
                </motion.div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-charcoal-400 group-focus-within:text-gold-luxe transition-colors" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-charcoal-50 dark:bg-charcoal-900 border border-charcoal-100 dark:border-charcoal-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold-luxe text-charcoal-900 dark:text-white transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-charcoal-400 group-focus-within:text-gold-luxe transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 bg-charcoal-50 dark:bg-charcoal-900 border border-charcoal-100 dark:border-charcoal-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold-luxe text-charcoal-900 dark:text-white transition-all"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-charcoal-400 hover:text-charcoal-600 dark:hover:text-gold-luxe transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 text-sm font-mono uppercase tracking-widest text-charcoal-500 hover:text-charcoal-900 dark:hover:text-white transition-colors"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-3 bg-gold-luxe text-charcoal-950 font-medium rounded-xl hover:bg-gold-500 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Sign In
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
