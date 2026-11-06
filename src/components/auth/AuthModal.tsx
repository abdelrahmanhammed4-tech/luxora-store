import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Mail, Eye, EyeOff, Loader2, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, pendingAction, setPendingAction } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  const { login, register } = useAuth();

  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setError('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAuthModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      setIsAuthModalOpen(false);
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (typeof window === 'undefined' || !isAuthModalOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isAuthModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
          onClick={() => setIsAuthModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[440px] flex flex-col bg-white dark:bg-charcoal-950/90 rounded-[32px] shadow-2xl border border-charcoal-100 dark:border-charcoal-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsAuthModalOpen(false)} 
              className="absolute top-6 right-6 z-10 p-2 text-charcoal-400 hover:text-charcoal-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 md:p-10">
              <div className="text-center mb-10">
                <div className="text-2xl font-serif font-bold text-charcoal-900 dark:text-gold-luxe mb-2">LUXORA</div>
                <h2 className="text-2xl font-serif text-charcoal-950 dark:text-white mb-2">
                  {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-xs text-charcoal-500 dark:text-charcoal-400 font-mono uppercase tracking-[0.2em]">
                  {mode === 'login' ? 'Sign in to continue' : 'Join the LUXORA family'}
                </p>
              </div>
              
              {error && (
                <div className="p-4 mb-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-xl text-xs text-red-600 dark:text-red-400 font-mono">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {mode === 'register' && (
                  <div className="relative group">
                    <User className="absolute left-4 top-3.5 w-4 h-4 text-charcoal-400 group-focus-within:text-gold-luxe transition-colors" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-charcoal-50 dark:bg-charcoal-900 border border-charcoal-100 dark:border-charcoal-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold-luxe text-charcoal-900 dark:text-white transition-all"
                      required
                    />
                  </div>
                )}
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-charcoal-400 group-focus-within:text-gold-luxe transition-colors" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-charcoal-50 dark:bg-charcoal-900 border border-charcoal-100 dark:border-charcoal-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold-luxe text-charcoal-900 dark:text-white transition-all"
                    required
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
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-charcoal-400 hover:text-charcoal-600 dark:hover:text-gold-luxe transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-gold-luxe text-charcoal-950 font-medium rounded-xl hover:bg-gold-500 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              <div className="mt-6 text-center text-xs text-charcoal-500 dark:text-charcoal-400">
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button 
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-gold-luxe font-medium hover:underline"
                >
                  {mode === 'login' ? 'Create Account' : 'Sign In'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
