import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { 
  Sun, 
  Moon, 
  Languages, 
  Sparkles, 
  Clock, 
  Compass, 
  Layers, 
  Sliders, 
  Eye, 
  Check, 
  RefreshCw, 
  ShieldCheck, 
  ArrowRight,
  ArrowLeft,
  Flame,
  Droplet,
  LogOut,
  UserCheck
} from 'lucide-react';

export const FoundationShowcase: React.FC = () => {
  const { theme, language, t, toggleTheme, setLanguage, triggerWelcomeReset } = useApp();
  const { user, logout } = useAuth();
  const [sandboxText, setSandboxText] = useState('');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const colors = [
    { name: 'Pure Obsidian', hex: '#0A0A0A', desc: 'The base element of luxury. Deep, absolute black that creates a cinema-like frame for luxury goods.', role: 'Dark Background' },
    { name: 'Royal Gold', hex: '#D4AF37', desc: 'High-karat yellow gold luster. Serves as the high-contrast focal point for accents and interactive borders.', role: 'Interactive Accents' },
    { name: 'Warm Bronze', hex: '#A38A5E', desc: 'Muted champagne-bronze. Used for elegant secondary texts, borders, and sub-headings.', role: 'Secondary Accents' },
    { name: 'Ivory Marble', hex: '#FAF6EE', desc: 'Slightly warm off-white. Offers an expensive-looking background contrast in light mode without harsh glare.', role: 'Light Background' }
  ];

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const isRtl = language === 'ar';

  return (
    <div className="min-h-screen bg-charcoal-50 dark:bg-charcoal-950 text-charcoal-900 dark:text-gold-50 transition-colors duration-700 selection:bg-gold-luxe selection:text-charcoal-950 pb-20">
      
      {/* Decorative Brand Top Banner */}
      <div className="bg-gradient-to-r from-gold-900 via-gold-600 to-gold-900 text-white text-center py-2 px-4 text-xs tracking-[0.2em] font-sans font-light uppercase flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-gold-200" />
        <span>{t.initialWelcome}</span>
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-gold-200" />
      </div>

      {/* Main Luxury Header */}
      <header className="border-b border-charcoal-200 dark:border-gold-900/10 py-6 px-6 md:px-12 glass-premium sticky top-0 z-40 transition-colors duration-500">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Logo, Slogan & User Badge */}
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left rtl:sm:text-right">
            <div>
              <h1 className="text-3xl font-serif font-light tracking-[0.25em] text-charcoal-900 dark:text-white inline-block">
                {t.appName}
              </h1>
              <p className="text-[10px] font-sans text-charcoal-500 dark:text-gold-400/60 uppercase tracking-[0.2em] mt-1">
                {t.brandTagline}
              </p>
            </div>

            {/* Noble User Greeting */}
            {user && (
              <div className="flex items-center gap-3 bg-gold-400/10 px-4 py-2 rounded-2xl border border-gold-luxe/15">
                <UserCheck className="w-4 h-4 text-gold-luxe shrink-0" />
                <div className="text-left rtl:text-right">
                  <p className="text-[10px] font-mono tracking-wider text-charcoal-400 dark:text-gold-400/60 uppercase leading-none mb-1">
                    {user.role === 'admin' ? t.roleAdmin : t.roleCustomer}
                  </p>
                  <p className="text-xs font-serif font-medium text-charcoal-900 dark:text-gold-100 leading-none">
                    {user.name}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Utility Switchers (Language & Theme) */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            
            {/* Language Switcher */}
            <div className="flex items-center bg-charcoal-100 dark:bg-charcoal-900 p-1 rounded-full border border-charcoal-200 dark:border-gold-900/20">
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-1.5 rounded-full text-xs tracking-wider transition-all duration-300 ${
                  language === 'en'
                    ? 'bg-gold-luxe text-charcoal-950 font-medium font-sans'
                    : 'text-charcoal-500 hover:text-charcoal-900 dark:text-gold-400/60 dark:hover:text-white'
                }`}
              >
                {t.languageEn}
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className={`px-4 py-1.5 rounded-full text-xs tracking-wider transition-all duration-300 ${
                  language === 'ar'
                    ? 'bg-gold-luxe text-charcoal-950 font-medium font-sans'
                    : 'text-charcoal-500 hover:text-charcoal-900 dark:text-gold-400/60 dark:hover:text-white'
                }`}
              >
                {t.languageAr}
              </button>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-charcoal-100 dark:bg-charcoal-900 border border-charcoal-200 dark:border-gold-900/20 text-charcoal-700 dark:text-gold-300 hover:text-gold-luxe dark:hover:text-gold-luxe transition-colors"
              title={theme === 'light' ? t.themeDark : t.themeLight}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Replay Welcome Intro */}
            <button
              onClick={triggerWelcomeReset}
              className="p-2.5 rounded-full bg-charcoal-100 dark:bg-charcoal-900 border border-charcoal-200 dark:border-gold-900/20 text-charcoal-700 dark:text-gold-300 hover:text-gold-luxe dark:hover:text-gold-luxe transition-colors"
              title="Replay Luxury Intro"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 mt-12">
        
        {/* Welcome Section / Mood Intro */}
        <section className="mb-16">
          <div className="relative rounded-3xl overflow-hidden py-16 px-8 md:px-16 text-center border border-charcoal-200 dark:border-gold-900/10 bg-gradient-to-b from-charcoal-100/50 via-white/80 to-charcoal-50/50 dark:from-charcoal-900/40 dark:via-charcoal-950/80 dark:to-charcoal-900/20 gold-glow">
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-400/5 rounded-full blur-3xl -z-10" />

            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] tracking-widest text-gold-700 dark:text-gold-400 bg-gold-400/10 mb-6 uppercase font-mono font-medium">
                  <Clock className="w-3.5 h-3.5 animate-spin-luxury" />
                  Phase 1: Project Foundation Live
                </span>
                
                <h2 className="text-4xl md:text-5xl font-serif font-light tracking-wide text-charcoal-900 dark:text-white mb-6 leading-tight">
                  {t.welcomeSub}
                </h2>

                <p className="text-sm text-charcoal-500 dark:text-gold-100/60 leading-relaxed font-sans max-w-2xl mx-auto mb-10">
                  {t.readyForNextPhasesDesc}
                </p>

                {/* Live Core Features of Phase 1 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-left rtl:text-right">
                  <div className="p-4 rounded-2xl bg-charcoal-100/40 dark:bg-charcoal-900/40 border border-charcoal-200/50 dark:border-gold-900/5">
                    <span className="text-xs font-mono text-gold-600 dark:text-gold-400">01 / STYLING</span>
                    <h4 className="font-serif font-medium text-sm mt-1">Tailwind v4 Engine</h4>
                  </div>
                  <div className="p-4 rounded-2xl bg-charcoal-100/40 dark:bg-charcoal-900/40 border border-charcoal-200/50 dark:border-gold-900/5">
                    <span className="text-xs font-mono text-gold-600 dark:text-gold-400">02 / INTERACTIVITY</span>
                    <h4 className="font-serif font-medium text-sm mt-1">Dual Theme Swapper</h4>
                  </div>
                  <div className="p-4 rounded-2xl bg-charcoal-100/40 dark:bg-charcoal-900/40 border border-charcoal-200/50 dark:border-gold-900/5">
                    <span className="text-xs font-mono text-gold-600 dark:text-gold-400">03 / MULTI-LANG</span>
                    <h4 className="font-serif font-medium text-sm mt-1">Bidirectional RTL/LTR</h4>
                  </div>
                  <div className="p-4 rounded-2xl bg-charcoal-100/40 dark:bg-charcoal-900/40 border border-charcoal-200/50 dark:border-gold-900/5">
                    <span className="text-xs font-mono text-gold-600 dark:text-gold-400">04 / INTRO</span>
                    <h4 className="font-serif font-medium text-sm mt-1">Preloading Sequencer</h4>
                  </div>
                </div>

              </motion.div>
            </div>
          </div>
        </section>

        {/* Section: Architectural Sandboxes */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          
          {/* Box 1: Interactive Language & Alignments Showcase */}
          <div className="lg:col-span-2 rounded-3xl p-8 border border-charcoal-200 dark:border-gold-900/10 bg-white dark:bg-charcoal-900/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Languages className="w-5 h-5 text-gold-luxe" />
                <h3 className="text-xl font-serif tracking-wide">{t.interactiveDesign}</h3>
              </div>

              {/* Grid showcasing responsive RTL and LTR flips */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                
                {/* LTR Standard Sample Card */}
                <div className="p-5 rounded-2xl bg-charcoal-50 dark:bg-charcoal-900/60 border border-charcoal-200 dark:border-gold-900/5 text-left" dir="ltr">
                  <span className="text-[10px] font-mono uppercase text-gold-600 dark:text-gold-400 tracking-wider">
                    LTR Text Flow Alignment
                  </span>
                  <h4 className="text-base font-serif font-medium text-charcoal-900 dark:text-white mt-2 mb-2">
                    {t.englishLtrCheck}
                  </h4>
                  <p className="text-xs text-charcoal-500 dark:text-gold-100/50 leading-relaxed">
                    Designed for elegant Western presentation. Clean typography aligning seamlessly to the left margin.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-gold-luxe font-mono cursor-pointer hover:underline">
                    <span>Exquisite horology details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* RTL Standard Sample Card */}
                <div className="p-5 rounded-2xl bg-charcoal-50 dark:bg-charcoal-900/60 border border-charcoal-200 dark:border-gold-900/5 text-right" dir="rtl">
                  <span className="text-[10px] font-mono uppercase text-gold-600 dark:text-gold-400 tracking-wider">
                    تخطيط محاذاة النص RTL
                  </span>
                  <h4 className="text-base font-serif font-medium text-charcoal-900 dark:text-white mt-2 mb-2">
                    {t.arabicRtlCheck}
                  </h4>
                  <p className="text-xs text-charcoal-500 dark:text-gold-100/50 leading-relaxed">
                    مُصمم خصيصاً للغة العربية الفصحى الفاخرة لضمان التناسق والتوازن الجمالي بين اليمين واليسار.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-gold-luxe font-mono cursor-pointer hover:underline justify-end">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>تفاصيل الساعات الفاخرة</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Current Active Parameters */}
            <div className="mt-8 pt-6 border-t border-charcoal-200 dark:border-gold-900/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <span className="block text-[10px] font-mono text-charcoal-400 dark:text-gold-400/40 uppercase">
                    {t.activeLanguage}
                  </span>
                  <span className="text-sm font-serif font-medium text-gold-600 dark:text-gold-400">
                    {language === 'ar' ? 'العربية (Arabic RTL)' : 'English (LTR)'}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-charcoal-400 dark:text-gold-400/40 uppercase">
                    {t.activeTheme}
                  </span>
                  <span className="text-sm font-serif font-medium text-gold-600 dark:text-gold-400">
                    {theme === 'dark' ? t.themeDark : t.themeLight}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-emerald-400/10 text-emerald-500 dark:text-emerald-400 text-xs px-3 py-1 rounded-full border border-emerald-500/20 font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>Ready for Client Router</span>
              </div>
            </div>
          </div>

          {/* Box 2: Premium Colors & Visual Tokens Panel */}
          <div className="rounded-3xl p-8 border border-charcoal-200 dark:border-gold-900/10 bg-white dark:bg-charcoal-900/20">
            <div className="flex items-center gap-3 mb-6">
              <Sliders className="w-5 h-5 text-gold-luxe" />
              <h3 className="text-xl font-serif tracking-wide">{t.brandColors}</h3>
            </div>

            <p className="text-xs text-charcoal-500 dark:text-gold-100/50 mb-6 leading-relaxed">
              Click on any swatch below to copy its Hexadecimal color code to your clipboard.
            </p>

            <div className="space-y-4">
              {colors.map((c, i) => (
                <div 
                  key={i}
                  onClick={() => handleCopyColor(c.hex)}
                  className="group flex items-center justify-between p-3 rounded-2xl bg-charcoal-50 dark:bg-charcoal-900/60 border border-charcoal-200 dark:border-gold-900/5 cursor-pointer hover:border-gold-luxe/40 dark:hover:border-gold-luxe/40 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    {/* Swatch Circle */}
                    <div 
                      className="w-10 h-10 rounded-full border border-charcoal-200 dark:border-gold-900/20 shadow-sm"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div>
                      <h4 className="text-xs font-serif font-medium text-charcoal-900 dark:text-white group-hover:text-gold-luxe transition-colors">
                        {c.name}
                      </h4>
                      <p className="text-[10px] text-charcoal-400 dark:text-gold-400/50 font-mono">
                        {c.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-charcoal-500 dark:text-gold-400/60">
                      {c.hex}
                    </span>
                    {copiedColor === c.hex ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <div className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section: Typography System & Live Sandbox */}
        <section className="mb-16">
          <div className="rounded-3xl p-8 md:p-12 border border-charcoal-200 dark:border-gold-900/10 bg-white dark:bg-charcoal-900/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Compass className="w-5 h-5 text-gold-luxe" />
                  <h3 className="text-2xl font-serif tracking-wide">{t.typographyShowcase}</h3>
                </div>
                <p className="text-xs text-charcoal-500 dark:text-gold-100/50 leading-relaxed max-w-xl">
                  Luxury is defined by typographic precision. We utilize 'Playfair Display' for absolute grandeur, 'Inter' for effortless readability, and 'JetBrains Mono' for fine metadata values.
                </p>
              </div>

              {/* Dynamic Sandbox Input */}
              <div className="w-full md:w-80">
                <span className="block text-[10px] font-mono text-charcoal-400 dark:text-gold-400/40 uppercase mb-2">
                  Live Typography Sandbox
                </span>
                <input
                  type="text"
                  value={sandboxText}
                  onChange={(e) => setSandboxText(e.target.value)}
                  placeholder={isRtl ? 'اكتب عبارة تجريبية هنا...' : 'Type custom showcase text...'}
                  className="w-full px-4 py-2 text-xs rounded-xl bg-charcoal-50 dark:bg-charcoal-900 border border-charcoal-200 dark:border-gold-900/20 focus:outline-none focus:border-gold-luxe focus:ring-1 focus:ring-gold-luxe transition-all"
                />
              </div>
            </div>

            {/* Typography Spec Panels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Grand Display Font */}
              <div className="p-6 rounded-2xl bg-charcoal-50 dark:bg-charcoal-900/40 border border-charcoal-200 dark:border-gold-900/5">
                <span className="font-mono text-[10px] text-gold-600 dark:text-gold-400 tracking-wider">
                  01 / SERIF DISPLAY
                </span>
                <p className="text-xs text-charcoal-400 font-serif mt-1 mb-4">Playfair Display (Light 300 / Medium 500)</p>
                
                <h4 className="text-3xl font-serif font-light text-charcoal-900 dark:text-white leading-tight min-h-[80px]">
                  {sandboxText || (isRtl ? 'الدقة والأصالة السويسرية' : 'The Luxury Watchmaker Movement')}
                </h4>
                
                <div className="mt-4 pt-4 border-t border-charcoal-200 dark:border-gold-900/10 font-mono text-[10px] text-charcoal-400 dark:text-gold-400/40">
                  font-family: var(--font-serif)
                </div>
              </div>

              {/* Card 2: Inter Sans-Serif Body */}
              <div className="p-6 rounded-2xl bg-charcoal-50 dark:bg-charcoal-900/40 border border-charcoal-200 dark:border-gold-900/5">
                <span className="font-mono text-[10px] text-gold-600 dark:text-gold-400 tracking-wider">
                  02 / SYSTEM SANS UI
                </span>
                <p className="text-xs text-charcoal-400 font-sans mt-1 mb-4">Inter Sans (Reg 400 / Medium 500 / Bold 700)</p>
                
                <h4 className="text-lg font-sans font-normal text-charcoal-900 dark:text-white leading-relaxed min-h-[80px]">
                  {sandboxText || (isRtl ? 'نهدف إلى ابتكار معايير جديدة للساعات الراقية والعطور الأنيقة.' : 'We aim to forge standard-setting luxury models across fine watchmaking and perfume curation.')}
                </h4>

                <div className="mt-4 pt-4 border-t border-charcoal-200 dark:border-gold-900/10 font-mono text-[10px] text-charcoal-400 dark:text-gold-400/40">
                  font-family: var(--font-sans)
                </div>
              </div>

              {/* Card 3: JetBrains Mono Spec Codes */}
              <div className="p-6 rounded-2xl bg-charcoal-50 dark:bg-charcoal-900/40 border border-charcoal-200 dark:border-gold-900/5">
                <span className="font-mono text-[10px] text-gold-600 dark:text-gold-400 tracking-wider">
                  03 / TECHNICAL MONOSPACE
                </span>
                <p className="text-xs text-charcoal-400 font-mono mt-1 mb-4">JetBrains Mono (Technical Details)</p>
                
                <h4 className="text-xs font-mono text-gold-600 dark:text-gold-400 leading-normal min-h-[80px]">
                  {sandboxText ? `MODEL_VAL: ${sandboxText.toUpperCase()}` : `LX-REF: 902.11\nSTOCK_QTY: 42\nPRICE_USD: $14,500.00\nCALIBRATION: PASSED`}
                </h4>

                <div className="mt-4 pt-4 border-t border-charcoal-200 dark:border-gold-900/10 font-mono text-[10px] text-charcoal-400 dark:text-gold-400/40">
                  font-family: var(--font-mono)
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section: Fluid Grid & Future Categorization (Watches & Perfumes) */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Layers className="w-5 h-5 text-gold-luxe" />
            <h3 className="text-2xl font-serif tracking-wide">{t.responsiveTest}</h3>
          </div>
          
          <p className="text-xs text-charcoal-500 dark:text-gold-100/50 mb-8 leading-relaxed max-w-2xl">
            {t.layoutResponsiveDesc}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Watches Category Foundation Slide */}
            <div className="group relative rounded-3xl overflow-hidden min-h-[380px] flex flex-col justify-end p-8 border border-charcoal-200 dark:border-gold-900/10 bg-gradient-to-t from-charcoal-950 via-charcoal-950/65 to-transparent">
              {/* Background Luxury Watch Decor */}
              <div className="absolute inset-0 bg-charcoal-900 dark:bg-charcoal-950 opacity-40 group-hover:scale-105 transition-transform duration-700 -z-10" />
              
              {/* Floating Symbolism (Chrono Face) */}
              <div className="absolute top-8 right-8 w-20 h-20 border border-gold-luxe/10 rounded-full flex items-center justify-center -z-10">
                <Flame className="w-8 h-8 text-gold-luxe/15" />
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] tracking-widest text-gold-400 bg-gold-400/15 mb-3 uppercase w-fit font-mono font-medium">
                HAUTE HORLOGERIE
              </span>
              
              <h4 className="text-2xl md:text-3xl font-serif text-white tracking-wide mb-3">
                {t.watchesCategory}
              </h4>
              
              <p className="text-xs text-gold-100/70 max-w-sm leading-relaxed mb-6">
                Representing the pinnacle of mechanical precision. Hand-assembled complications, tourbillon movements, and grade-5 titanium casings.
              </p>

              <div className="w-full h-[1px] bg-gold-900/20 mb-4" />

              <div className="flex items-center justify-between text-xs text-gold-400/80 font-mono">
                <span>Phase 2: Product Catalog Ready</span>
                <span>4 Items Configured</span>
              </div>
            </div>

            {/* Perfumes Category Foundation Slide */}
            <div className="group relative rounded-3xl overflow-hidden min-h-[380px] flex flex-col justify-end p-8 border border-charcoal-200 dark:border-gold-900/10 bg-gradient-to-t from-charcoal-950 via-charcoal-950/65 to-transparent">
              {/* Background Luxury Perfume Decor */}
              <div className="absolute inset-0 bg-charcoal-900 dark:bg-charcoal-950 opacity-40 group-hover:scale-105 transition-transform duration-700 -z-10" />
              
              {/* Floating Symbolism (Scent droplet) */}
              <div className="absolute top-8 right-8 w-20 h-20 border border-gold-luxe/10 rounded-full flex items-center justify-center -z-10">
                <Droplet className="w-8 h-8 text-gold-luxe/15" />
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] tracking-widest text-gold-400 bg-gold-400/15 mb-3 uppercase w-fit font-mono font-medium">
                LES PARFUMS RARES
              </span>
              
              <h4 className="text-2xl md:text-3xl font-serif text-white tracking-wide mb-3">
                {t.perfumesCategory}
              </h4>
              
              <p className="text-xs text-gold-100/70 max-w-sm leading-relaxed mb-6">
                Exquisite, rare essences crafted in partnership with master French perfumers. Pure extract-level densities containing natural oud, ambergris, and rose petals.
              </p>

              <div className="w-full h-[1px] bg-gold-900/20 mb-4" />

              <div className="flex items-center justify-between text-xs text-gold-400/80 font-mono">
                <span>Phase 2: Olfactory Notes Calibrated</span>
                <span>4 Scents Registered</span>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Footer Design */}
      <footer className="border-t border-charcoal-200 dark:border-gold-900/10 mt-20 pt-12 text-center px-6">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl font-serif font-light tracking-[0.2em] text-charcoal-900 dark:text-white uppercase">
            {t.appName}
          </h3>
          <p className="text-[10px] font-sans text-gold-600 dark:text-gold-400 uppercase tracking-[0.15em] mt-1.5">
            {t.brandTagline}
          </p>
          
          <div className="w-12 h-[1px] bg-gold-luxe/40 mx-auto my-6" />

          <p className="text-xs text-charcoal-400 dark:text-gold-100/40 leading-relaxed max-w-md mx-auto">
            A premium full-stack, enterprise-ready design crafted with React, Vite, and custom Tailwind variables.
          </p>

          <p className="text-[10px] font-mono text-charcoal-400/60 dark:text-gold-400/20 mt-12">
            © 2026 LUXORA INC. ALL RIGHTS RESERVED. GENÈVE • DUBAI • TOKYO
          </p>
        </div>
      </footer>

    </div>
  );
};
