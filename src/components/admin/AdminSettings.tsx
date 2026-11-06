import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Save, Shield, Bell, Key, Globe, Eye } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { t, theme, toggleTheme, language, setLanguage, currency, setCurrency } = useApp();
  const { user } = useAuth();

  const [storeName, setStoreName] = useState('LUXORA Genève');
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-serif text-charcoal-900 dark:text-white">{t.settings}</h2>
        <p className="text-xs text-charcoal-500 dark:text-gold-400/60 mt-1">Configure parameters, customize store presence, and refine brand preferences.</p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl font-medium tracking-wide">
          Storefront settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Brand Presence Box */}
        <div className="bg-white dark:bg-charcoal-900 p-6 rounded-2xl border border-charcoal-200 dark:border-gold-900/10 space-y-4">
          <h3 className="text-sm font-serif font-semibold text-charcoal-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-gold-luxe" /> Brand Presence & Localization
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-mono text-charcoal-800 mb-1">Store Name</label>
              <input 
                type="text" 
                value={storeName} 
                onChange={e => setStoreName(e.target.value)} 
                className="w-full p-2.5 text-xs rounded-lg border border-charcoal-200 dark:border-gold-900/15 dark:bg-charcoal-950 dark:text-white text-charcoal-900 focus:outline-none focus:border-gold-luxe" 
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-mono text-charcoal-800 mb-1">Primary Currency</label>
              <select 
                value={currency} 
                onChange={e => setCurrency(e.target.value as any)} 
                className="w-full p-2.5 text-xs rounded-lg border border-charcoal-200 dark:border-gold-900/15 dark:bg-charcoal-950 dark:text-white text-charcoal-900 focus:outline-none focus:border-gold-luxe"
              >
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="AED">AED (د.إ) - UAE Dirham</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-[10px] uppercase font-mono text-charcoal-500 mb-1">System Language</label>
              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={() => setLanguage('en')}
                  className={`flex-1 py-2 text-xs rounded-lg border transition-colors ${language === 'en' ? 'bg-gold-luxe/15 border-gold-luxe text-gold-luxe font-medium' : 'border-charcoal-200 dark:border-gold-900/15 text-charcoal-500'}`}
                >
                  English
                </button>
                <button 
                  type="button" 
                  onClick={() => setLanguage('ar')}
                  className={`flex-1 py-2 text-xs rounded-lg border transition-colors ${language === 'ar' ? 'bg-gold-luxe/15 border-gold-luxe text-gold-luxe font-medium' : 'border-charcoal-200 dark:border-gold-900/15 text-charcoal-500'}`}
                >
                  العربية
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-mono text-charcoal-500 mb-1">Active Visual Theme</label>
              <button 
                type="button" 
                onClick={toggleTheme}
                className="w-full py-2 text-xs rounded-lg border border-charcoal-200 dark:border-gold-900/15 text-charcoal-700 dark:text-gold-200 hover:border-gold-luxe hover:bg-gold-luxe/5 transition-all uppercase tracking-wider font-mono"
              >
                Switch to {theme === 'light' ? 'Dark Premium Mode' : 'Light Classic Mode'}
              </button>
            </div>
          </div>
        </div>

        {/* Curator Profile */}
        <div className="bg-white dark:bg-charcoal-900 p-6 rounded-2xl border border-charcoal-200 dark:border-gold-900/10 space-y-4">
          <h3 className="text-sm font-serif font-semibold text-charcoal-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-gold-luxe" /> Curator Profile
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-mono text-charcoal-500 mb-1">Curator Name</label>
              <input type="text" value={user?.name || ''} disabled className="w-full p-2.5 text-xs rounded-lg border border-charcoal-200 dark:border-gold-900/15 bg-charcoal-50 dark:bg-charcoal-950/40 text-charcoal-500" />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-mono text-charcoal-500 mb-1">Registered Email</label>
              <input type="text" value={user?.email || ''} disabled className="w-full p-2.5 text-xs rounded-lg border border-charcoal-200 dark:border-gold-900/15 bg-charcoal-50 dark:bg-charcoal-950/40 text-charcoal-500" />
            </div>
          </div>
        </div>

        <button 
          type="submit"
          className="px-6 py-3.5 bg-gold-luxe hover:bg-gold-500 text-charcoal-950 text-xs font-semibold uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save Storefront Settings
        </button>

      </form>
    </div>
  );
};
