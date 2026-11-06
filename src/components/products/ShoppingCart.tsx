import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import { Coupon } from '../../types';
import { mockProducts } from '../../mockData';
import { 
  ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ArrowRight, ShieldCheck, 
  CheckCircle, Tag, Info, Percent, Truck, CreditCard, Sparkles, RefreshCw,
  Gift, Heart, X, AlertTriangle, HelpCircle, Calendar, Archive
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../../lib/firebase';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';

export const ShoppingCart: React.FC = () => {
  const { 
    cart, 
    isLoadingCart,
    appliedCoupon,
    setAppliedCoupon,
    removeFromCart, 
    updateCartQuantity, 
    clearCart, 
    setCurrentView, 
    favorites, 
    toggleFavorite,
    products,
    setIsAuthModalOpen,
    setPendingAction
  } = useStore();
  const { t, language } = useApp();
  const { user } = useAuth();
  const { incrementCouponUsage, decrementStockTransaction } = useAdmin();
  
  const handleAction = (action: () => void) => {
    if (!user) {
      setPendingAction(action);
      setIsAuthModalOpen(true);
      return;
    }
    action();
  };
  
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  
  // Dialog and feedback states
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  
  // Checkout fields
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [orderId, setOrderId] = useState('');

  const isRtl = language === 'ar';

  // Load defaults
  useEffect(() => {
    if (user) {
      setCardName(user.name || '');
    }
  }, [user]);

  // Toast auto-clear
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
  };

  const activeProductsList = products.length > 0 ? products : mockProducts;

  // Resolve cart items
  const resolvedCartItems = (Array.isArray(cart) ? cart : []).map(cartItem => {
    const product = activeProductsList.find(p => p.id === cartItem?.productId);
    return {
      product,
      quantity: cartItem?.quantity || 0
    };
  }).filter(item => item.product !== undefined && item.product.status !== 'hidden') as { product: typeof mockProducts[0]; quantity: number }[];

  // Calculate pricing
  const subtotal = Array.isArray(resolvedCartItems) ? resolvedCartItems.reduce((acc, item) => acc + ((item.product?.price ?? 0) * (item.quantity ?? 0)), 0) : 0;
  
  // Tax 15% luxury duty
  const taxRate = 0.15;
  const tax = subtotal * taxRate;
  
  // Promo code details
  let discountAmount = 0;
  let isFreeShipPromo = false;

  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
       discountAmount = subtotal * (appliedCoupon.discountValue / 100);
    } else if (appliedCoupon.discountType === 'fixed') {
       discountAmount = Math.min(appliedCoupon.discountValue, subtotal);
    }
    if (appliedCoupon.isFreeShipping) {
      isFreeShipPromo = true;
    }
  }

  // Free shipping threshold
  const isFreeShippingThreshold = subtotal >= 500;
  const isFreeShippingActive = isFreeShippingThreshold || isFreeShipPromo;
  
  // Shipping cost
  const standardShippingCost = subtotal === 0 ? 0 : 30;
  const shippingFee = isFreeShippingActive ? 0 : standardShippingCost;

  const grandTotal = subtotal + tax + shippingFee - discountAmount;

  // Quantity changes
  const handleQuantityChange = (productId: string, currentQty: number, change: number, maxStock: number, name: string) => {
    const newQty = currentQty + change;
    if (newQty <= 0) {
      removeFromCart(productId);
      showToast(
        isRtl ? `تمت إزالة "${name}" من حقيبة التسوق` : `Removed "${name}" from your bag`,
        'info'
      );
    } else if (newQty <= maxStock) {
      updateCartQuantity(productId, newQty);
      showToast(
        isRtl ? `تم تحديث الكمية لـ "${name}"` : `Updated quantity for "${name}"`,
        'success'
      );
    } else {
      showToast(
        isRtl ? `عذراً، يتوفر فقط ${maxStock} من هذا المنتج في المخزون` : `Only ${maxStock} items available in stock`,
        'error'
      );
    }
  };

  const handleRemoveItem = (productId: string, name: string) => {
    removeFromCart(productId);
    showToast(
      isRtl ? `تمت إزالة "${name}" من حقيبة التسوق` : `Removed "${name}" from your bag`,
      'info'
    );
  };

  // Promo code execution
  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');

    const trimmedCode = promoInput.trim().toUpperCase();
    if (!trimmedCode) return;

    try {
      const q = query(collection(db, 'coupons'), where('code', '==', trimmedCode));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setPromoError(isRtl ? 'كود الخصم المدخل غير صالح.' : 'Invalid promotional code.');
        showToast(isRtl ? 'كود غير صالح' : 'Invalid Promo Code', 'error');
        return;
      }

      const couponDoc = querySnapshot.docs[0];
      const coupon = { id: couponDoc.id, ...couponDoc.data() } as Coupon;

      // Validations
      if (!coupon.active) {
        setPromoError(isRtl ? 'كود الخصم غير مفعل.' : 'Coupon disabled.');
        showToast(isRtl ? 'كود غير صالح' : 'Invalid Promo Code', 'error');
        return;
      }
      
      // Check expiration
      if (coupon.expiresAt && coupon.expiresAt.toDate() < new Date()) {
         setPromoError(isRtl ? 'كود الخصم منتهي الصلاحية.' : 'Coupon expired.');
         showToast(isRtl ? 'كود منتهي' : 'Coupon Expired', 'error');
         return;
      }

      // Usage limit
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        setPromoError(isRtl ? 'تم تجاوز حد استخدام الكود.' : 'Coupon usage limit exceeded.');
        showToast(isRtl ? 'تم تجاوز الحد' : 'Usage limit exceeded', 'error');
        return;
      }

      // Minimum order
      if (subtotal < coupon.minimumOrderAmount) {
         setPromoError(isRtl ? `الحد الأدنى للطلب هو $${coupon.minimumOrderAmount}.` : `Minimum order amount is $${coupon.minimumOrderAmount}.`);
         showToast(isRtl ? 'الحد الأدنى لم يكتمل' : 'Minimum order not reached', 'error');
         return;
      }

      setAppliedCoupon(coupon);
      setPromoSuccess(isRtl ? 'تم تطبيق كود الخصم بنجاح!' : 'Coupon applied successfully!');
      showToast(isRtl ? 'تم تطبيق كود الخصم' : 'Promo Code Applied', 'success');
      setPromoInput('');

    } catch (err) {
      console.error(err);
      setPromoError(isRtl ? 'حدث خطأ أثناء تطبيق الكود.' : 'Error applying coupon.');
      showToast(isRtl ? 'خطأ' : 'Error', 'error');
    }
  };

  const handleRemovePromo = () => {
    setAppliedCoupon(null);
    setPromoSuccess('');
    setPromoError('');
    showToast(isRtl ? 'تمت إزالة كود الخصم' : 'Promo code removed', 'info');
  };

  // Clear cart with confirmation dialog
  const handleConfirmClear = () => {
    clearCart();
    setShowClearConfirm(false);
    showToast(isRtl ? 'تم تفريغ حقيبة التسوق بالكامل' : 'Shopping bag cleared successfully', 'success');
  };

  // Validation helpers
  const isValidAddress = (addr: string) => addr.trim().length >= 10 && /[a-zA-Z]/.test(addr);
  const isValidPhone = (phone: string) => /^\+[0-9]{8,15}$/.test(phone);
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidCardName = (name: string) => /^[a-zA-Z]+\s+[a-zA-Z]+(\s+[a-zA-Z]+)*$/.test(name.trim());
  const luhnCheck = (cardNumber: string) => {
    const digits = cardNumber.replace(/\s+/g, '').split('').map(Number);
    let sum = 0;
    for (let i = digits.length - 2; i >= 0; i -= 2) {
      let d = digits[i] * 2;
      digits[i] = d > 9 ? d - 9 : d;
    }
    return (digits.reduce((a, b) => a + b, 0) % 10 === 0);
  };
  const isValidExpiry = (expiry: string) => {
    if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiry)) return false;
    const [month, year] = expiry.split('/').map(Number);
    const now = new Date();
    const expiryDate = new Date(2000 + year, month - 1);
    return expiryDate > now;
  };
  const isValidCVV = (cvv: string) => /^[0-9]{3,4}$/.test(cvv);

  // Checkout form validator
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!isValidAddress(address)) {
      errors.address = isRtl ? 'يرجى إدخال عنوان توصيل صحيح (10 أحرف كحد أدنى)' : 'Valid address required (min 10 characters)';
    }
    if (!isValidPhone(phone)) {
      errors.phone = isRtl ? 'رقم الهاتف يجب أن يبدأ بـ + ويحتوي على 8-15 رقماً' : 'Phone must start with + followed by 8-15 digits';
    }
    const email = user?.email || 'patron@luxora.com';
    if (!isValidEmail(email)) {
      errors.email = isRtl ? 'بريد إلكتروني غير صالح' : 'Invalid email address';
    }
    if (!isValidCardName(cardName)) {
      errors.cardName = isRtl ? 'يرجى إدخال الاسم الكامل (كلمتان على الأقل)' : 'Please enter full name (min 2 words)';
    }
    const cleanCard = cardNumber.replace(/\s+/g, '');
    if (!luhnCheck(cleanCard)) {
      errors.cardNumber = isRtl ? 'رقم البطاقة غير صالح' : 'Invalid credit card number';
    }
    if (!isValidExpiry(expiry)) {
      errors.expiry = isRtl ? 'تاريخ انتهاء غير صالح أو منتهي' : 'Invalid or expired date (MM/YY)';
    }
    if (!isValidCVV(cvv)) {
      errors.cvv = isRtl ? 'رمز CVV غير صالح (3-4 أرقام)' : 'Invalid CVV (3-4 digits)';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast(isRtl ? 'يرجى إكمال الحقول المطلوبة' : 'Please complete the required fields', 'error');
      return;
    }

    setIsProcessingCheckout(true);
    
    // Luxury boutique transaction simulator
    setTimeout(async () => {
      try {
        const generatedId = `LXR-${Math.floor(100000 + Math.random() * 900000)}`;
        
        const newOrder = {
          id: generatedId,
          customerId: user?.id || 'guest',
          customerName: user?.name || 'Exclusive Patron',
          customerEmail: user?.email || 'patron@luxora.com',
          products: resolvedCartItems.map(item => ({
            productId: item.product.id,
            nameEn: item.product.nameEn,
            nameAr: item.product.nameAr,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image
          })),
          totalPrice: grandTotal,
          status: 'pending',
          paymentStatus: 'paid',
          shippingAddress: address,
          phone: phone,
          createdAt: new Date().toISOString()
        };

        // Store in local storage orders database
        const savedOrders = localStorage.getItem('luxora_customer_orders');
        let ordersList = [];
        if (savedOrders) {
          try {
            ordersList = JSON.parse(savedOrders);
          } catch (_) {}
        }
        ordersList = [newOrder, ...ordersList];
        localStorage.setItem('luxora_customer_orders', JSON.stringify(ordersList));

        // Decrement stock
        await decrementStockTransaction(resolvedCartItems.map(item => ({ productId: item.product.id, quantity: item.quantity })));
        
        // Save order to Firestore
        setDoc(doc(db, 'orders', generatedId), {
          id: generatedId,
          customerName: newOrder.customerName,
          customerEmail: newOrder.customerEmail,
          products: newOrder.products,
          price: newOrder.totalPrice,
          totalPrice: newOrder.totalPrice,
          status: 'Pending',
          paymentStatus: 'paid',
          payment: 'Paid (Card)',
          shipping: 'Express Courier',
          shippingAddress: newOrder.shippingAddress,
          phone: newOrder.phone,
          createdAt: newOrder.createdAt,
          date: new Date().toISOString().split('T')[0]
        }).catch(err => {
          console.warn("Firestore order placement failed/operating offline:", err);
        });
        
        if (appliedCoupon) {
          incrementCouponUsage(appliedCoupon.id);
        }

        setIsProcessingCheckout(false);
        setOrderId(generatedId);
        setCheckoutStep('success');
        clearCart();
      } catch (err: any) {
        console.error("Checkout failed:", err);
        setIsProcessingCheckout(false);
        showToast(err.message || (isRtl ? 'عذراً، تعذر إتمام الطلب' : 'Checkout failed'), 'error');
      }
    }, 2800);
  };

  // Helper to format arrival dates dynamically
  const getArrivalDateStr = (daysMin: number, daysMax: number) => {
    const today = new Date();
    const minDate = new Date(today.getTime() + daysMin * 24 * 60 * 60 * 1000);
    const maxDate = new Date(today.getTime() + daysMax * 24 * 60 * 60 * 1000);

    const formatOptions: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    };

    const localeStr = isRtl ? 'ar-EG' : 'en-US';
    const minStr = minDate.toLocaleDateString(localeStr, formatOptions);
    const maxStr = maxDate.toLocaleDateString(localeStr, formatOptions);

    return `${minStr} - ${maxStr}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: isRtl ? '50%' : '-50%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3.5 rounded-xl shadow-2xl border flex items-center gap-3 backdrop-blur-md transition-all duration-300 ${
              toastMessage.type === 'success' 
                ? 'bg-emerald-950/90 border-emerald-500/20 text-emerald-200' 
                : toastMessage.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/20 text-rose-200'
                : 'bg-charcoal-900/90 border-gold-500/20 text-gold-200'
            }`}
          >
            {toastMessage.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
            {toastMessage.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
            {toastMessage.type === 'info' && <Info className="w-4 h-4 text-gold-400 animate-pulse" />}
            <span className="text-xs font-mono tracking-wide uppercase font-semibold">{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/75 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-gold-900/10 rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto text-rose-500 border border-rose-500/20">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-serif text-charcoal-900 dark:text-white uppercase tracking-wider">
                  {isRtl ? 'تفريغ حقيبة التسوق؟' : 'Empty Shopping Bag?'}
                </h3>
                <p className="text-xs text-charcoal-500 dark:text-gold-200/60 leading-relaxed">
                  {isRtl 
                    ? 'هل أنت متأكد من رغبتك في إزالة جميع المنتجات الفاخرة من حقيبتك؟ لا يمكن التراجع عن هذا الإجراء.' 
                    : 'Are you sure you want to remove all premium masterpieces from your cart? This action is irreversible.'}
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-3 border border-charcoal-200 dark:border-gold-900/10 rounded-xl hover:bg-charcoal-50 dark:hover:bg-charcoal-950/40 text-[10px] font-mono uppercase tracking-widest font-bold text-charcoal-500 dark:text-gold-200 cursor-pointer"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  onClick={handleConfirmClear}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-mono uppercase tracking-widest font-bold cursor-pointer"
                >
                  {isRtl ? 'تفريغ السلة' : 'Clear Cart'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">

        {/* 1. SKELETON LOADING STATE */}
        {isLoadingCart ? (
          <motion.div
            key="loading-skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <div className="space-y-3">
              <div className="h-4 w-28 bg-charcoal-200 dark:bg-charcoal-800 rounded animate-pulse" />
              <div className="h-8 w-64 bg-charcoal-300 dark:bg-charcoal-700 rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-gold-900/10 p-6 rounded-2xl flex gap-4 animate-pulse">
                    <div className="w-20 h-20 bg-charcoal-200 dark:bg-charcoal-800 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/4 bg-charcoal-200 dark:bg-charcoal-800 rounded" />
                      <div className="h-5 w-1/2 bg-charcoal-300 dark:bg-charcoal-700 rounded" />
                      <div className="h-3 w-1/3 bg-charcoal-200 dark:bg-charcoal-800 rounded" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="lg:col-span-4 bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-gold-900/10 p-6 rounded-2xl h-80 animate-pulse space-y-4">
                <div className="h-4 w-1/3 bg-charcoal-200 dark:bg-charcoal-800 rounded" />
                <div className="h-8 bg-charcoal-300 dark:bg-charcoal-700 rounded" />
                <div className="h-8 bg-charcoal-200 dark:bg-charcoal-800 rounded" />
                <div className="h-12 bg-gold-500/10 dark:bg-gold-500/5 rounded" />
              </div>
            </div>
          </motion.div>
        ) : checkoutStep === 'success' ? (
          
          /* 2. SUCCESS THANK YOU SCREEN */
          <motion.div
            key="success-thankyou"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-xl mx-auto bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-gold-900/10 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 -mr-24 -mt-24 w-60 h-60 bg-gold-luxe/5 rounded-full blur-3xl pointer-events-none" />
            
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
              className="w-20 h-20 rounded-full bg-gold-luxe/10 flex items-center justify-center text-gold-luxe mx-auto border border-gold-luxe/20"
            >
              <CheckCircle className="w-10 h-10" />
            </motion.div>

            <div className="space-y-3">
              <span className="inline-block px-3 py-1 bg-gold-luxe/10 text-gold-600 dark:text-gold-400 text-[9px] font-mono rounded-full font-bold uppercase tracking-widest">
                {isRtl ? 'تم تأكيد المعاملة الفاخرة' : 'Luxury Transaction Approved'}
              </span>
              <h2 className="text-2xl font-serif font-light text-charcoal-900 dark:text-white uppercase tracking-wider">
                {isRtl ? 'شكراً لاختيارك لوكسورا' : 'Gratitude From LUXORA'}
              </h2>
              <p className="text-xs text-charcoal-500 dark:text-gold-200/60 leading-relaxed max-w-md mx-auto">
                {isRtl
                  ? `تم توثيق طلب الحجز الحصري الخاص بك تحت رقم (${orderId}). سيقوم خبير الشؤون اللوجستية لدينا بالتواصل معك فوراً لتنسيق التسليم الحراسي والآمن.`
                  : `Your luxury reservation has been cataloged as Reference ID: ${orderId}. Our concierge logistics unit will contact you shortly to arrange certified hand-delivery.`}
              </p>
            </div>

            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setCurrentView('profile')}
                className="w-full py-3.5 bg-charcoal-950 dark:bg-white text-white dark:text-charcoal-950 hover:bg-opacity-90 text-[10px] font-mono font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isRtl ? 'استعراض الحجوزات' : 'View Reservations'}</span>
                {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setCurrentView('products')}
                className="w-full py-3.5 border border-gold-luxe/40 hover:border-gold-luxe text-gold-luxe hover:bg-gold-luxe/5 text-[10px] font-mono font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer"
              >
                {isRtl ? 'مواصلة الاقتناء' : 'Browse Masterpieces'}
              </button>
            </div>
          </motion.div>
        ) : checkoutStep === 'checkout' ? (
          
          /* 3. SECURE CHECKOUT FLOW */
          <motion.div
            key="checkout-flow"
            initial={{ opacity: 0, x: isRtl ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRtl ? 30 : -30 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
          >
            {/* Header Return panel */}
            <div className="lg:col-span-12">
              <button 
                onClick={() => setCheckoutStep('cart')}
                className="flex items-center gap-2 text-xs font-mono text-charcoal-500 hover:text-gold-luxe transition-colors mb-4 cursor-pointer"
              >
                {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                <span>{isRtl ? 'العودة لحقيبة التسوق' : 'Back to Shopping Bag'}</span>
              </button>
              <h1 className="text-2xl font-serif font-light text-charcoal-900 dark:text-white tracking-wide uppercase">
                {isRtl ? 'إتمام اقتناء المنتجات الفاخرة' : 'Complete Luxury Acquisition'}
              </h1>
            </div>

            {/* Input fields */}
            <form onSubmit={handlePlaceOrder} className="lg:col-span-7 bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-gold-900/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <h3 className="text-xs font-serif uppercase tracking-widest text-charcoal-900 dark:text-white border-b border-charcoal-100 dark:border-gold-900/5 pb-3 flex items-center gap-2 font-bold">
                <Truck className="w-4 h-4 text-gold-luxe" />
                {isRtl ? 'عنوان التوصيل المؤمن والحراسة' : 'WHITE-GLOVE INSURED CARGO'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-charcoal-400 mb-1.5 font-bold">
                    {isRtl ? 'عنوان التوصيل والمنزل' : 'Consignee Delivery Address'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isRtl ? 'مثال: حي النخيل، شارع الأمير تركي، الرياض، المملكة العربية السعودية' : 'e.g., Mayfair, London, UK'}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={`w-full px-4 py-3 text-xs rounded-xl border ${formErrors.address ? 'border-rose-500' : 'border-charcoal-200 dark:border-gold-900/15'} bg-charcoal-50/50 dark:bg-charcoal-950/40 focus:outline-none focus:border-gold-luxe text-charcoal-900 dark:text-white`}
                  />
                  {formErrors.address && <p className="text-[10px] text-rose-500 font-mono mt-1">{formErrors.address}</p>}
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-charcoal-400 mb-1.5 font-bold">
                    {isRtl ? 'رقم الهاتف للتواصل' : 'Private Phone Number'}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+966 50 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full px-4 py-3 text-xs rounded-xl border ${formErrors.phone ? 'border-rose-500' : 'border-charcoal-200 dark:border-gold-900/15'} bg-charcoal-50/50 dark:bg-charcoal-950/40 focus:outline-none focus:border-gold-luxe text-charcoal-900 dark:text-white`}
                  />
                  {formErrors.phone && <p className="text-[10px] text-rose-500 font-mono mt-1">{formErrors.phone}</p>}
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-charcoal-400 mb-1.5 font-bold">
                    {isRtl ? 'البريد الإلكتروني للعميل' : 'Notification Patron Email'}
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || 'patron@luxora.com'}
                    className="w-full px-4 py-3 text-xs rounded-xl border border-charcoal-100 dark:border-gold-900/5 bg-charcoal-100/50 dark:bg-charcoal-950/20 text-charcoal-400 font-mono"
                  />
                </div>
              </div>

              <h3 className="text-xs font-serif uppercase tracking-widest text-charcoal-900 dark:text-white border-b border-charcoal-100 dark:border-gold-900/5 pt-4 pb-3 flex items-center gap-2 font-bold">
                <CreditCard className="w-4 h-4 text-gold-luxe" />
                {isRtl ? 'بوابة التحويل الائتماني والضمان' : 'SECURE SECURED TRANSMISSION'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-charcoal-400 mb-1.5 font-bold">
                    {isRtl ? 'الاسم الكامل لحامل البطاقة' : 'Cardholder Signature Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isRtl ? 'عبد الرحمن حميد' : 'Abdelrahman Hammed'}
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className={`w-full px-4 py-3 text-xs rounded-xl border ${formErrors.cardName ? 'border-rose-500' : 'border-charcoal-200 dark:border-gold-900/15'} bg-charcoal-50/50 dark:bg-charcoal-950/40 focus:outline-none focus:border-gold-luxe text-charcoal-900 dark:text-white`}
                  />
                  {formErrors.cardName && <p className="text-[10px] text-rose-500 font-mono mt-1">{formErrors.cardName}</p>}
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-charcoal-400 mb-1.5 font-bold">
                    {isRtl ? 'رقم بطاقة الائتمان' : 'Insured Credit Card Number'}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    placeholder="4000 1234 5678 9010"
                    value={cardNumber}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                      const matches = v.match(/\d{4,16}/g);
                      const match = (matches && matches[0]) || '';
                      const parts = [];
                      for (let i = 0, len = match.length; i < len; i += 4) {
                        parts.push(match.substring(i, i + 4));
                      }
                      setCardNumber(parts.length > 0 ? parts.join(' ') : v);
                    }}
                    className={`w-full px-4 py-3 text-xs rounded-xl border ${formErrors.cardNumber ? 'border-rose-500' : 'border-charcoal-200 dark:border-gold-900/15'} bg-charcoal-50/50 dark:bg-charcoal-950/40 focus:outline-none focus:border-gold-luxe text-charcoal-900 dark:text-white font-mono`}
                  />
                  {formErrors.cardNumber && <p className="text-[10px] text-rose-500 font-mono mt-1">{formErrors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-charcoal-400 mb-1.5 font-bold">
                      {isRtl ? 'تاريخ الصلاحية' : 'Expiry Date'}
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                        if (v.length > 2) {
                          v = v.substring(0, 2) + '/' + v.substring(2, 4);
                        }
                        setExpiry(v);
                      }}
                      className={`w-full px-4 py-3 text-xs rounded-xl border ${formErrors.expiry ? 'border-rose-500' : 'border-charcoal-200 dark:border-gold-900/15'} bg-charcoal-50/50 dark:bg-charcoal-950/40 focus:outline-none focus:border-gold-luxe text-charcoal-900 dark:text-white font-mono text-center`}
                    />
                    {formErrors.expiry && <p className="text-[10px] text-rose-500 font-mono mt-1">{formErrors.expiry}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-charcoal-400 mb-1.5 font-bold">
                      {isRtl ? 'رمز الأمان (CVV)' : 'CVV Code'}
                    </label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      placeholder="•••"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                      className={`w-full px-4 py-3 text-xs rounded-xl border ${formErrors.cvv ? 'border-rose-500' : 'border-charcoal-200 dark:border-gold-900/15'} bg-charcoal-50/50 dark:bg-charcoal-950/40 focus:outline-none focus:border-gold-luxe text-charcoal-900 dark:text-white font-mono text-center`}
                    />
                    {formErrors.cvv && <p className="text-[10px] text-rose-500 font-mono mt-1">{formErrors.cvv}</p>}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isProcessingCheckout}
                  className="w-full py-4 bg-gradient-to-r from-gold-500 via-gold-luxe to-gold-600 hover:opacity-95 text-charcoal-950 text-xs font-mono font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold-500/10 cursor-pointer disabled:opacity-55"
                >
                  {isProcessingCheckout ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-charcoal-950" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-charcoal-950" />
                  )}
                  <span>
                    {isProcessingCheckout 
                      ? (isRtl ? 'جاري توثيق المعاملة المؤمنة...' : 'Securing Luxury Transaction...')
                      : (isRtl ? `تأكيد التحويل واستبقاء القطع ($${(grandTotal ?? 0).toLocaleString()})` : `Invest ${(grandTotal ?? 0).toLocaleString()} Now`)}
                  </span>
                </button>
              </div>
            </form>

            {/* Portfolio Overview */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-gold-900/10 rounded-3xl p-6 shadow-sm">
                <h3 className="text-xs uppercase font-mono tracking-widest text-charcoal-900 dark:text-white font-bold border-b border-charcoal-100 dark:border-gold-900/5 pb-3">
                  {isRtl ? 'محتويات الحجز' : 'Acquisition Portfolio'}
                </h3>
                
                <div className="divide-y divide-charcoal-100 dark:divide-gold-900/5 max-h-[300px] overflow-y-auto pr-1">
                  {(Array.isArray(resolvedCartItems) ? resolvedCartItems : []).map(({ product, quantity }, index) => (
                    <div key={product?.id || index} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-charcoal-50 dark:bg-charcoal-950 border border-charcoal-100 dark:border-gold-900/10 flex-shrink-0">
                        <img src={product?.image} alt={isRtl ? product?.nameAr : product?.nameEn} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[11px] font-serif font-light text-charcoal-900 dark:text-white truncate">
                          {isRtl ? product?.nameAr : product?.nameEn}
                        </h4>
                        <p className="text-[9px] text-charcoal-400 font-mono mt-0.5">
                          {quantity} × ${(product?.price ?? 0).toLocaleString()}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-gold-luxe font-mono self-center">
                        ${((product?.price ?? 0) * (quantity ?? 0)).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-charcoal-100 dark:border-gold-900/5 pt-4 space-y-2.5 font-mono text-xs">
                  <div className="flex justify-between text-charcoal-500">
                    <span>{isRtl ? 'المجموع الفرعي للمقتنيات:' : 'Portfolio Subtotal:'}</span>
                    <span>${(subtotal ?? 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-charcoal-500">
                    <span>{isRtl ? 'رسوم التسجيل والضريبة (١٥٪):' : 'Luxury VAT / Duty (15%):'}</span>
                    <span>${(tax ?? 0).toLocaleString()}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-500 font-bold">
                      <span>{isRtl ? 'ميزة كود الخصم الفاخر:' : 'Patron Promo Benefit:'}</span>
                      <span>-{appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}%` : `$${appliedCoupon.discountValue}`}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-charcoal-500">
                    <span>{isRtl ? 'الشحن والتأمين والمرافقة:' : 'Insured Escort Cargo:'}</span>
                    <span className={isFreeShippingActive ? 'text-emerald-500 font-bold text-[10px]' : ''}>
                      {isFreeShippingActive ? (isRtl ? 'مكاني بالكامل' : 'COMPLIMENTARY') : `$${(shippingFee ?? 0).toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-charcoal-900 dark:text-white font-bold pt-3 border-t border-charcoal-100 dark:border-gold-900/10 text-sm">
                    <span>{isRtl ? 'الإجمالي الاستثماري:' : 'Grand Acquisition:'}</span>
                    <span className="text-gold-luxe text-base">${(grandTotal ?? 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-gold-luxe/15 rounded-2xl bg-gold-luxe/5 text-center text-[10px] font-mono text-gold-600 dark:text-gold-400 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-luxe animate-pulse" />
                <span>{isRtl ? 'حماية تامة ٢٥٦ بت وتغطية لوجستية مرافقة' : '256-Bit SSL Encrypted / Insured Delivery Escort'}</span>
              </div>
            </div>
          </motion.div>
        ) : (
          
          /* 4. MAIN CURATED SHOPPING BAG PAGE */
          <motion.div
            key="shopping-bag-main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Elegant Header with action bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-[10px] uppercase font-mono tracking-widest text-gold-600 dark:text-gold-400 font-bold mb-1">
                  {isRtl ? 'مقتنياتك الفاخرة' : 'Your Selected sanctuary'}
                </p>
                <h1 className="text-3xl font-serif font-light text-charcoal-900 dark:text-white tracking-wide uppercase">
                  {isRtl ? 'حقيبة المقتنيات النادرة' : 'Curated Shopping Sanctuary'}
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {resolvedCartItems.length > 0 && (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors cursor-pointer py-1.5 px-3 rounded-lg hover:bg-rose-500/5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'تفريغ الحقيبة بالكامل' : 'Empty Entire Cart'}</span>
                  </button>
                )}
                <button
                  onClick={() => setCurrentView('products')}
                  className="group flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-charcoal-500 hover:text-gold-luxe transition-colors cursor-pointer py-1.5 px-3 rounded-lg hover:bg-charcoal-50/50 dark:hover:bg-charcoal-950/20"
                >
                  {isRtl ? <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> : <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />}
                  <span>{isRtl ? 'الرجوع للمتجر' : 'Continue Hunt'}</span>
                </button>
              </div>
            </div>

            {resolvedCartItems.length === 0 ? (
              
              /* EMPTY CART SCREEN */
              <motion.div 
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-gold-900/10 rounded-3xl p-12 text-center space-y-6 shadow-sm max-w-2xl mx-auto"
              >
                <div className="w-20 h-20 rounded-full bg-charcoal-50 dark:bg-charcoal-950 flex items-center justify-center mx-auto text-charcoal-300 dark:text-gold-950 border border-charcoal-100 dark:border-gold-900/10 relative">
                  <ShoppingBag className="w-10 h-10" />
                  <motion.div 
                    animate={{ scale: [1, 1.15, 1] }} 
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute -top-1 -right-1 bg-gold-luxe text-charcoal-950 rounded-full p-1"
                  >
                    <Gift className="w-3.5 h-3.5" />
                  </motion.div>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-xl font-serif font-light text-charcoal-900 dark:text-white uppercase tracking-wider">
                    {isRtl ? 'حقيبة المقتنيات فارغة تماماً' : 'Your Curated Sanctuary is Empty.'}
                  </h2>
                  <p className="text-xs text-charcoal-500 dark:text-gold-200/60 leading-relaxed max-w-sm mx-auto">
                    {isRtl
                      ? 'لم تقم بحفظ أي قطع نادرة من الساعات أو العطور بعد. تصفح المجموعات لإضافتها.'
                      : 'You have not reserved any premium watches or rare perfumes. Embark on our catalog of masterpieces to add your first selection.'}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setCurrentView('products')}
                    className="px-8 py-3.5 bg-gradient-to-r from-gold-500 via-gold-luxe to-gold-600 hover:opacity-90 text-charcoal-950 text-xs font-mono font-bold uppercase tracking-widest rounded-xl transition-all shadow-md shadow-gold-500/5 cursor-pointer font-bold"
                  >
                    {isRtl ? 'تصفح المقتنيات النادرة' : 'Browse Products'}
                  </button>
                </div>
              </motion.div>
            ) : (
              
              /* COMPREHENSIVE FULL GRID CART VIEW */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                
                {/* 5. ITEM LIST PANEL (8 SPAN) */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Free Shipping Dynamic Progress Slider */}
                  <div className="bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-gold-900/10 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-gold-luxe flex-shrink-0" />
                      <div>
                        <h4 className="text-xs font-serif font-semibold text-charcoal-900 dark:text-white uppercase tracking-wider">
                          {isFreeShippingThreshold 
                            ? (isRtl ? 'تهانينا! لقد حصلت على توصيل مجاني فاخر!' : 'Congratulations! You unlocked FREE Shipping.') 
                            : (isRtl ? 'الخدمة اللوجستية وتوصيل النخبة المأمن' : 'Curated White-Glove Logistics')}
                        </h4>
                        <p className="text-[11px] text-charcoal-400 mt-0.5 font-sans">
                          {isFreeShippingThreshold 
                            ? (isRtl ? 'لقد تجاوزت سلتك $500 وتم تفعيل الشحن المؤمن المجاني بالكامل.' : 'Your sanctuary cart total is $500 or more. Complimentary secured hand-delivery is active.') 
                            : (isRtl 
                              ? `أنت على بعد $${(500 - subtotal).toLocaleString()} فقط من الشحن المجاني الفاخر المأمن.`
                              : `You are only $${(500 - subtotal).toLocaleString()} away from FREE Shipping.`)}
                        </p>
                      </div>
                    </div>
                    {/* Progress indicator */}
                    <div className="flex items-center gap-2">
                      <div className="w-28 h-2 bg-charcoal-100 dark:bg-charcoal-950 rounded-full overflow-hidden border border-charcoal-200/50 dark:border-gold-900/5 relative">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((subtotal / 500) * 100, 100)}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full bg-gradient-to-r from-gold-400 to-gold-luxe"
                        />
                      </div>
                      <span className="text-[10px] font-mono text-charcoal-400">
                        {Math.round(Math.min((subtotal / 500) * 100, 100))}%
                      </span>
                    </div>
                  </div>

                  {/* Cart Items Portfolio Wrapper */}
                  <div className="bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-gold-900/10 rounded-3xl overflow-hidden divide-y divide-charcoal-100 dark:divide-gold-900/5 shadow-sm">
                    <AnimatePresence mode="popLayout">
                      {resolvedCartItems.map(({ product, quantity }) => {
                        const name = isRtl ? product.nameAr : product.nameEn;
                        const brand = isRtl ? product.brandAr : product.brand;
                        const categoryStr = product.category === 'watches' 
                          ? (isRtl ? 'ساعة فاخرة' : 'Luxury Timepiece') 
                          : (isRtl ? 'عطر نادٍ' : 'Premium Perfume');

                        return (
                          <motion.div
                            key={product.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center group"
                          >
                            {/* Product Artwork Frame */}
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-charcoal-50 dark:bg-charcoal-950 border border-charcoal-100 dark:border-gold-900/10 flex-shrink-0 cursor-pointer"
                                 onClick={() => {
                                   setCurrentView('product-details');
                                   // Set selected product id in StoreContext
                                   const store = useStore();
                                   store.setSelectedProductId(product.id);
                                 }}
                            >
                              <img src={product.image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                            </div>

                            {/* Specifications / Info */}
                            <div className="flex-1 min-w-0 space-y-1">
                              <span className="text-[9px] font-mono uppercase text-gold-600 dark:text-gold-400 tracking-wider">
                                {brand}
                              </span>
                              <h3 
                                onClick={() => {
                                  setCurrentView('product-details');
                                  const store = useStore();
                                  store.setSelectedProductId(product.id);
                                }}
                                className="text-sm font-serif font-light text-charcoal-900 dark:text-white truncate cursor-pointer hover:text-gold-luxe transition-colors"
                              >
                                {name}
                              </h3>
                              <div className="flex items-center gap-2.5 text-[9px] text-charcoal-400 font-mono">
                                <span>{categoryStr}</span>
                                <span className="w-1 h-1 bg-charcoal-300 dark:bg-gold-900/40 rounded-full" />
                                <span>{isRtl ? 'رمز:' : 'SKU:'} {product.sku || product.id.toUpperCase()}</span>
                              </div>
                              <span className="inline-block text-[9px] text-emerald-500 font-mono">
                                {isRtl ? 'مؤمن وجاهز للتسليم الفوري' : 'In Premium Stock / Verified Authenticity'}
                              </span>
                            </div>

                            {/* Quantity Adjuster column */}
                            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                              <div className="text-left sm:text-right">
                                <span className="text-xs text-charcoal-400 font-mono">
                                  ${product.price.toLocaleString()} {isRtl ? 'للقطعة' : '/ unit'}
                                </span>
                              </div>

                              {/* Quantity Selector Panel */}
                              <div className="flex items-center border border-charcoal-200 dark:border-gold-900/10 rounded-xl bg-charcoal-50/50 dark:bg-charcoal-950/40">
                                <button
                                  onClick={() => handleQuantityChange(product.id, quantity, -1, product.stock, name)}
                                  className="px-3 py-2 text-charcoal-500 hover:text-gold-luxe transition-colors cursor-pointer"
                                  title={isRtl ? 'تقليل الكمية' : 'Decrease'}
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-3 text-xs font-bold font-mono text-charcoal-900 dark:text-white">
                                  {quantity}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(product.id, quantity, 1, product.stock, name)}
                                  disabled={quantity >= product.stock}
                                  className="px-3 py-2 text-charcoal-500 hover:text-gold-luxe disabled:opacity-30 transition-colors cursor-pointer"
                                  title={isRtl ? 'زيادة الكمية' : 'Increase'}
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* Item Total and Delete Column */}
                            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-28 gap-4 border-t sm:border-t-0 pt-4 sm:pt-0 border-charcoal-100 dark:border-gold-900/5">
                              <span className="text-sm font-bold text-gold-luxe font-mono">
                                ${(product.price * quantity).toLocaleString()}
                              </span>

                              <div className="flex gap-2">
                                <button
                                  onClick={() => toggleFavorite(product.id)}
                                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                                    favorites.includes(product.id)
                                      ? 'text-rose-500 bg-rose-500/5'
                                      : 'text-charcoal-400 hover:text-rose-500 hover:bg-rose-500/5'
                                  }`}
                                  title={isRtl ? 'أضف للمفضلة' : 'Add to Favorites'}
                                >
                                  <Heart className="w-3.5 h-3.5 fill-current" />
                                </button>
                                <button
                                  onClick={() => handleRemoveItem(product.id, name)}
                                  className="p-2 rounded-xl text-charcoal-400 hover:text-rose-500 hover:bg-rose-500/5 transition-all cursor-pointer"
                                  title={isRtl ? 'حذف القطعة' : 'Remove Masterpiece'}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>

                {/* 6. ORDER SUMMARY & PROMO SECTION (4 SPAN) */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Order Summary details */}
                  <div className="bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-gold-900/10 rounded-3xl p-6 shadow-sm space-y-5">
                    <h3 className="text-xs font-serif uppercase tracking-widest text-charcoal-900 dark:text-white font-bold border-b border-charcoal-100 dark:border-gold-900/5 pb-3">
                      {isRtl ? 'ملخص الفاتورة الفاخرة' : 'INVESTMENT PORTFOLIO'}
                    </h3>

                    <div className="space-y-3 font-mono text-xs">
                      {/* Subtotal */}
                      <div className="flex justify-between text-charcoal-500">
                        <span>{isRtl ? 'المجموع الفرعي:' : 'Portfolio Subtotal:'}</span>
                        <span>${subtotal.toLocaleString()}</span>
                      </div>

                      {/* Tax */}
                      <div className="flex justify-between text-charcoal-500">
                        <span className="flex items-center gap-1">
                          {isRtl ? 'ضريبة القيمة المضافة (١٥٪):' : 'Luxury Duty / VAT (15%):'}
                          <Info className="w-3 h-3 text-charcoal-400 cursor-pointer" title="15% state tax and licensing assessment." />
                        </span>
                        <span>${tax.toLocaleString()}</span>
                      </div>

                      {/* Discounts */}
                      <AnimatePresence>
                        {appliedCoupon && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex justify-between text-emerald-500 font-bold overflow-hidden"
                          >
                            <span className="flex items-center gap-1">
                              <Tag className="w-3.5 h-3.5" />
                              {isRtl ? `كود الحصانة (${appliedCoupon.code}):` : `Privilege Code (${appliedCoupon.code}):`}
                            </span>
                            <span>
                              {appliedCoupon.discountType === 'percentage' ? `-${appliedCoupon.discountValue}% (-$${discountAmount.toLocaleString()})` : (appliedCoupon.isFreeShipping ? (isRtl ? 'شحن مجاني' : 'Free Ship') : `-$${discountAmount.toLocaleString()}`)}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Shipping */}
                      <div className="flex justify-between text-charcoal-500">
                        <span>{isRtl ? 'تأمين ونقل الحراسة:' : 'Insured Escort Cargo:'}</span>
                        {isFreeShippingActive ? (
                          <span className="text-emerald-500 font-bold text-[10px] tracking-wider uppercase">
                            {isRtl ? 'مكاني بالكامل' : 'COMPLIMENTARY'}
                          </span>
                        ) : (
                          <span>${shippingFee.toLocaleString()}</span>
                        )}
                      </div>

                      {/* Grand Total */}
                      <div className="flex justify-between text-charcoal-900 dark:text-white font-bold pt-4 border-t border-charcoal-100 dark:border-gold-900/10 text-sm">
                        <span>{isRtl ? 'الإجمالي العام:' : 'Grand Acquisition:'}</span>
                        <span className="text-gold-luxe text-base">${grandTotal.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Promo input form */}
                    <div className="border-t border-charcoal-100 dark:border-gold-900/5 pt-4 space-y-3">
                      <p className="text-[10px] uppercase font-mono tracking-wider text-charcoal-400">
                        {isRtl ? 'تطبيق امتياز خاص / كود خصم' : 'APPLY PATRON RESERVE PRIVILEGE'}
                      </p>
                      
                      {!appliedCoupon ? (
                        <form onSubmit={handleApplyPromo} className="flex gap-2">
                          <input
                            type="text"
                            placeholder={isRtl ? 'أدخل كود الخصم' : 'e.g., WELCOME10'}
                            value={promoInput}
                            onChange={(e) => setPromoInput(e.target.value)}
                            className="flex-1 px-3 py-2 text-xs rounded-xl border border-charcoal-200 dark:border-gold-900/15 bg-charcoal-50/50 dark:bg-charcoal-950/40 focus:outline-none focus:border-gold-luxe uppercase text-charcoal-900 dark:text-white font-mono"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 bg-charcoal-900 dark:bg-gold-luxe hover:bg-opacity-95 text-white dark:text-charcoal-950 text-[10px] font-mono uppercase tracking-widest font-bold rounded-xl transition-all cursor-pointer"
                          >
                            {isRtl ? 'تطبيق' : 'Apply'}
                          </button>
                        </form>
                      ) : (
                        <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-500 font-mono">
                          <div className="flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5" />
                            <span>{appliedCoupon.code}</span>
                          </div>
                          <button
                            onClick={handleRemovePromo}
                            className="p-1 hover:bg-emerald-500/10 rounded-full transition-all text-emerald-400 cursor-pointer"
                            title={isRtl ? 'إزالة الكود' : 'Remove Privilege'}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      {promoError && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-rose-500 font-mono">{promoError}</motion.p>
                      )}
                      {promoSuccess && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-emerald-500 font-mono">{promoSuccess}</motion.p>
                      )}
                    </div>

                    {/* Checkout CTA */}
                    <div className="pt-2">
                      <button
                        onClick={() => handleAction(() => setCheckoutStep('checkout'))}
                        className="w-full py-4 bg-gradient-to-r from-gold-500 via-gold-luxe to-gold-600 hover:opacity-95 text-charcoal-950 text-xs font-mono font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold-500/10 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-charcoal-950" />
                        <span>{isRtl ? 'إتمام الحجز الآمن' : 'Proceed to Acquisition'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Estimated Delivery Section */}
                  <div className="bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-gold-900/10 rounded-3xl p-6 shadow-sm space-y-4">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-charcoal-900 dark:text-white font-bold border-b border-charcoal-100 dark:divide-gold-900/5 pb-2.5 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gold-luxe" />
                      {isRtl ? 'تقدير الشحن والتسليم الفاخر' : 'TEMPORAL LOGISTICS ESTIMATES'}
                    </h4>
                    
                    <div className="space-y-4 text-xs font-sans">
                      <div className="flex justify-between items-start border-b border-charcoal-50 dark:border-gold-900/5 pb-2.5">
                        <div>
                          <p className="font-semibold text-charcoal-900 dark:text-white">{isRtl ? 'الشحن الجوي العادي' : 'Standard Insured Cargo'}</p>
                          <p className="text-[10px] text-charcoal-400 mt-0.5">{isRtl ? 'خلال ٣-٥ أيام عمل' : '3–5 Business Days'}</p>
                        </div>
                        <span className="text-[10px] font-mono text-gold-luxe text-right block max-w-[150px]">
                          {getArrivalDateStr(3, 5)}
                        </span>
                      </div>

                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-charcoal-900 dark:text-white">{isRtl ? 'الشحن الجوي السريع والمؤمن' : 'Express Courier Escort'}</p>
                          <p className="text-[10px] text-charcoal-400 mt-0.5">{isRtl ? 'خلال ١-٢ أيام عمل' : '1–2 Business Days'}</p>
                        </div>
                        <span className="text-[10px] font-mono text-gold-luxe text-right block max-w-[150px]">
                          {getArrivalDateStr(1, 2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Guaranteed Trust badge */}
                  <div className="p-4 bg-charcoal-50/50 dark:bg-charcoal-950/20 border border-charcoal-100 dark:border-gold-900/5 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-gold-luxe flex-shrink-0" />
                      <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal-900 dark:text-white font-bold">
                        {isRtl ? 'ضمان التوثيق والنقاء التام' : '100% Certified Authenticity Guarantee'}
                      </span>
                    </div>
                    <p className="text-[10px] text-charcoal-500 dark:text-gold-200/50 leading-relaxed font-sans">
                      {isRtl 
                        ? 'كل قطعة من مجموعة لوكسورا تفحص بدقة بالغة تحت إشراف خبرائنا ويرافقها شهادة حيازة رسمية وضمان عالمي ممدد.' 
                        : 'Every piece inside the House of Luxora has undergone detailed validation audits by horological curators and olfactory specialists. Accompanied by original credentials.'}
                    </p>
                  </div>

                </div>

              </div>
            )}

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};
