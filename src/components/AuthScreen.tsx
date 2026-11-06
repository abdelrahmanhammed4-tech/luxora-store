import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, 
  Lock, 
  User, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Languages, 
  Sun, 
  Moon, 
  Clock, 
  ShieldAlert, 
  UserCheck, 
  ArrowLeft,
  ArrowRight,
  BookmarkCheck
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { theme, language, t, toggleTheme, setLanguage } = useApp();
  const { login, register, resetPassword, loginAsGuest } = useAuth();

  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | 'guest'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  // Browse as guest handler
  const handleGuestBrowse = () => {
    loginAsGuest();
  };

  const [role, setRole] = useState<'customer' | 'admin' | 'superadmin'>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isRtl = language === 'ar';

  const triggerNotification = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Simple validation
    if (!email) {
      triggerNotification('error', t.validationError);
      return;
    }

    if (authMode !== 'forgot' && !password) {
      triggerNotification('error', t.validationError);
      return;
    }

    if (authMode === 'register' && password !== confirmPassword) {
      triggerNotification('error', isRtl ? 'كلمات المرور غير متطابقة.' : 'Passwords do not match.');
      return;
    }

    if (authMode === 'register' && !name) {
      triggerNotification('error', t.validationError);
      return;
    }

    setLoading(true);
    try {
      if (authMode === 'login') {
        await login(email, password);
        triggerNotification('success', t.loginSuccessMsg);
      } else if (authMode === 'register') {
        await register(name, email, password);
        triggerNotification('success', t.registerSuccessMsg);
      } else if (authMode === 'forgot') {
        await resetPassword(email);
        triggerNotification('success', t.resetSuccessMsg);
        // Go back to login after reset
        setTimeout(() => setAuthMode('login'), 3500);
      }
    } catch (err: any) {
      const errMsg = err?.message || (isRtl ? 'حدث خطأ غير متوقع.' : 'An unexpected error occurred.');
      triggerNotification('error', errMsg);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen relative flex items-center justify-center bg-charcoal-50 dark:bg-charcoal-950 text-charcoal-900 dark:text-gold-50 transition-colors duration-700 p-4 font-sans selection:bg-gold-luxe selection:text-charcoal-950 overflow-hidden">
      
      {/* Dynamic luxury ambient nodes in background */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-gold-400/5 dark:bg-gold-luxe/5 rounded-full blur-3xl animate-heartbeat-luxe" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-gold-400/5 dark:bg-gold-luxe/5 rounded-full blur-3xl animate-heartbeat-luxe [animation-delay:1.5s]" />

      {/* Exquisite Top utilities (Language, Theme) */}
      <div className="absolute top-6 right-6 left-6 flex justify-between items-center z-20">
        {/* Brand Logo Watermark */}
        <div className="flex items-center gap-1.5 opacity-80">
          <BookmarkCheck className="w-4 h-4 text-gold-luxe" />
          <span className="text-sm font-serif tracking-[0.25em] font-light text-charcoal-800 dark:text-white">
            {t.appName}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick language toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 dark:bg-charcoal-900/60 border border-charcoal-200 dark:border-gold-900/10 text-xs tracking-wider font-medium hover:border-gold-luxe/40 transition-colors"
          >
            <Languages className="w-3.5 h-3.5 text-gold-luxe" />
            <span>{language === 'en' ? 'العربية' : 'English'}</span>
          </button>

          {/* Quick theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/60 dark:bg-charcoal-900/60 border border-charcoal-200 dark:border-gold-900/10 text-charcoal-700 dark:text-gold-300 hover:text-gold-luxe transition-colors"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Toast Notification Presence */}
      <div className="absolute top-20 right-4 left-4 flex justify-center z-50 pointer-events-none">
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl glass-premium text-xs tracking-wide max-w-md shadow-xl ${
                message.type === 'success' 
                  ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-400/5' 
                  : 'border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-400/5'
              }`}
            >
              {message.type === 'success' ? (
                <UserCheck className="w-4 h-4 shrink-0" />
              ) : (
                <ShieldAlert className="w-4 h-4 shrink-0" />
              )}
              <span>{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Luxury Glass Panel */}
      <motion.div 
        className="relative z-10 w-full max-w-md rounded-3xl overflow-hidden glass-premium p-8 md:p-10 shadow-2xl transition-all duration-500"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <div className="text-center mb-8">
          {/* Animated Hourglass / Core Crown Emblem */}
          <div className="w-16 h-16 mx-auto mb-4 border border-gold-luxe/20 rounded-full flex items-center justify-center relative bg-gold-400/5">
            <Clock className="w-6 h-6 text-gold-luxe animate-spin-luxury" />
            <div className="absolute inset-1 border border-dashed border-gold-luxe/10 rounded-full" />
          </div>

          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-gold-600 dark:text-gold-400">
            HOUSE OF LUXORA
          </span>
          
          <h2 className="text-2xl md:text-3xl font-serif font-light tracking-wide text-charcoal-900 dark:text-white mt-2">
            {authMode === 'login' && t.loginTitle}
            {authMode === 'register' && t.registerTitle}
            {authMode === 'forgot' && t.forgotPasswordTitle}
          </h2>
        </div>

        {/* Input Form with AnimatePresence */}
        {authMode === 'initial' ? (
          <div className="space-y-4">
            <button
              onClick={() => setAuthMode('login')}
              className="w-full py-4 rounded-xl bg-charcoal-900 dark:bg-gold-luxe/10 text-white dark:text-gold-luxe text-sm font-medium border border-charcoal-700 dark:border-gold-luxe/20 hover:border-gold-luxe transition-all"
            >
              Admin / User Login
            </button>
            <button
              onClick={handleGuestBrowse}
              className="w-full py-4 rounded-xl bg-transparent text-charcoal-600 dark:text-gold-400/60 text-sm font-medium border border-charcoal-200 dark:border-gold-900/20 hover:border-charcoal-400 transition-all"
            >
              Browse as Guest
            </button>
          </div>
        ) : (
          <form onSubmit={handleAuthSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              
              {/* NAME FIELD (Register only) */}
              {authMode === 'register' && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  <label className="block text-[11px] font-mono uppercase text-charcoal-500 dark:text-gold-400/60 tracking-wider">
                    {t.nameLabel}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-charcoal-400 dark:text-gold-400/40 pointer-events-none">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Baron Sterling"
                      required
                      className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-charcoal-100/40 dark:bg-charcoal-900/40 border border-charcoal-200 dark:border-gold-900/15 focus:outline-none focus:border-gold-luxe focus:ring-1 focus:ring-gold-luxe transition-all"
                    />
                  </div>
                </motion.div>
              )}

              {/* EMAIL FIELD (All modes) */}
              <motion.div key="email-field" className="space-y-2">
                <label className="block text-[11px] font-mono uppercase text-charcoal-500 dark:text-gold-400/60 tracking-wider">
                  {t.emailLabel}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-charcoal-400 dark:text-gold-400/40 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@luxora.com"
                    required
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-charcoal-100/40 dark:bg-charcoal-900/40 border border-charcoal-200 dark:border-gold-900/15 focus:outline-none focus:border-gold-luxe focus:ring-1 focus:ring-gold-luxe transition-all"
                  />
                </div>
              </motion.div>

              {/* PASSWORD FIELD (Login & Register) */}
              {authMode !== 'forgot' && (
                <motion.div
                  key="password-field"
                  initial={{ opacity: 1, height: 'auto' }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <label className="block text-[11px] font-mono uppercase text-charcoal-500 dark:text-gold-400/60 tracking-wider">
                      {t.passwordLabel}
                    </label>
                    {authMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setAuthMode('forgot')}
                        className="text-[10px] font-sans text-gold-600 dark:text-gold-400 hover:underline"
                      >
                        {t.forgotPasswordLink}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-charcoal-400 dark:text-gold-400/40 pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full pl-10 pr-10 py-3 text-sm rounded-xl bg-charcoal-100/40 dark:bg-charcoal-900/40 border border-charcoal-200 dark:border-gold-900/15 focus:outline-none focus:border-gold-luxe focus:ring-1 focus:ring-gold-luxe transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-charcoal-400 dark:text-gold-400/40 hover:text-gold-luxe transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* CONFIRM PASSWORD FIELD (Register only) */}
              {authMode === 'register' && (
                <motion.div
                  key="confirm-password-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  <label className="block text-[11px] font-mono uppercase text-charcoal-500 dark:text-gold-400/60 tracking-wider">
                    {t.confirmPasswordLabel}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-charcoal-400 dark:text-gold-400/40 pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-charcoal-100/40 dark:bg-charcoal-900/40 border border-charcoal-200 dark:border-gold-900/15 focus:outline-none focus:border-gold-luxe focus:ring-1 focus:ring-gold-luxe transition-all"
                    />
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* ROLE SELECTOR PANEL (Login only) */}
            {authMode === 'login' && (
              <div className="space-y-2 pt-1">
                <label className="block text-[10px] font-mono uppercase text-charcoal-500 dark:text-gold-400/60 tracking-wider">
                  {t.roleLabel}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`py-2 px-1 rounded-xl border text-[10px] font-medium tracking-tight transition-all flex flex-col items-center justify-center gap-1 ${
                      role === 'customer'
                        ? 'bg-gold-luxe/15 border-gold-luxe text-gold-700 dark:text-gold-300'
                        : 'border-charcoal-200 dark:border-gold-900/10 bg-transparent hover:border-gold-luxe/40 text-charcoal-500 dark:text-gold-400/60'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Patron</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-2 px-1 rounded-xl border text-[10px] font-medium tracking-tight transition-all flex flex-col items-center justify-center gap-1 ${
                      role === 'admin'
                        ? 'bg-gold-luxe/15 border-gold-luxe text-gold-700 dark:text-gold-300'
                        : 'border-charcoal-200 dark:border-gold-900/10 bg-transparent hover:border-gold-luxe/40 text-charcoal-500 dark:text-gold-400/60'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Curator</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('superadmin')}
                    className={`py-2 px-1 rounded-xl border text-[10px] font-medium tracking-tight transition-all flex flex-col items-center justify-center gap-1 ${
                      role === 'superadmin'
                        ? 'bg-gold-luxe/15 border-gold-luxe text-gold-700 dark:text-gold-300'
                        : 'border-charcoal-200 dark:border-gold-900/10 bg-transparent hover:border-gold-luxe/40 text-charcoal-500 dark:text-gold-400/60'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Grand Curator</span>
                  </button>
                </div>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 via-gold-luxe to-gold-600 text-charcoal-950 text-xs font-semibold tracking-widest uppercase hover:opacity-90 active:scale-98 transition-all flex items-center justify-center gap-2 relative shadow-lg"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-charcoal-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {authMode === 'login' && t.loginButton}
                    {authMode === 'register' && t.registerButton}
                    {authMode === 'forgot' && t.resetPasswordButton}
                  </span>
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </>
              )}
            </button>
            
            {/* Back to entry button */}
            <button
              type="button"
              onClick={() => setAuthMode('initial')}
              className="w-full mt-2 text-xs text-charcoal-500 dark:text-gold-100/40 hover:underline"
            >
              Back
            </button>
          </form>
        )}

        {/* BOTTOM MODE NAVIGATION LINKS */}
        <div className="mt-8 pt-6 border-t border-charcoal-200 dark:border-gold-900/10 text-center space-y-3">
          {authMode === 'login' && (
            <p className="text-xs text-charcoal-500 dark:text-gold-100/40">
              {t.noAccountText}{' '}
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className="text-gold-600 dark:text-gold-400 font-medium hover:underline focus:outline-none ml-1"
              >
                {t.createAccountLink}
              </button>
            </p>
          )}

          {authMode === 'register' && (
            <p className="text-xs text-charcoal-500 dark:text-gold-100/40">
              {t.haveAccountText}{' '}
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-gold-600 dark:text-gold-400 font-medium hover:underline focus:outline-none ml-1"
              >
                {t.backToLoginLink}
              </button>
            </p>
          )}

          {authMode === 'forgot' && (
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className="text-xs text-gold-600 dark:text-gold-400 font-medium hover:underline focus:outline-none flex items-center justify-center gap-1.5 mx-auto"
            >
              {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{t.backToLoginLink}</span>
            </button>
          )}
        </div>
      </motion.div>

      {/* Decorative branding subtitle */}
      <div className="absolute bottom-6 text-center z-10 select-none">
        <p className="font-serif italic text-[11px] text-gold-500/50 tracking-wider">
          Genève • Paris • Dubai
        </p>
      </div>

    </div>
  );
};
