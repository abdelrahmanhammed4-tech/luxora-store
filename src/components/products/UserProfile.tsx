import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useStore } from '../../context/StoreContext';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { 
  User, Mail, Phone, MapPin, Calendar, ShoppingBag, 
  Search, ShieldCheck, ChevronRight, ChevronLeft, Truck, 
  Clock, Package, FileCheck, ExternalLink, RefreshCw, AlertCircle, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CertificateModal } from './CertificateModal';

interface OrderItem {
  productId: string;
  nameEn: string;
  nameAr: string;
  price: number;
  quantity: number;
  image: string;
}

interface LocalOrder {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  products: OrderItem[];
  totalPrice: number;
  status: 'Pending' | 'Preparing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'paid' | 'unpaid' | 'refunded';
  shippingAddress: string;
  phone: string;
  createdAt: string;
  certificate?: {
    issued: boolean;
    certificateId: string;
    issuedAt: string;
    verificationCode: string;
    pdfGenerated: boolean;
  };
}

export const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useApp();
  const { setCurrentView, products } = useStore();
  const isRtl = language === 'ar';
  
  const safeText = (text: string | undefined | null) => text && text.trim() !== "" ? text : (isRtl ? 'غير متوفر' : 'Not Available');

  const [orders, setOrders] = useState<LocalOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false);
  const [certificateSuccess, setCertificateSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  // Load and seed orders if empty
  useEffect(() => {
    const savedOrders = null;
    let loadedOrders: LocalOrder[] = [{ id: 'dummy', customerId: 'dummy', customerName: 'dummy', customerEmail: 'dummy', products: [], totalPrice: 0, status: 'Pending', paymentStatus: 'paid', shippingAddress: 'dummy', phone: 'dummy', createdAt: 'dummy' }];
    // ...
  }, [user, isRtl]);

  // Load orders from Firestore
  useEffect(() => {
    if (!user) return;

    const loadLocalOrders = () => {
      try {
        const saved = localStorage.getItem('luxora_customer_orders');
        if (saved) {
          const parsed = JSON.parse(saved) as LocalOrder[];
          const filtered = parsed.filter(o => o.customerId === user.id || o.customerEmail === user.email);
          setOrders(filtered);
          if (filtered.length > 0 && !selectedOrderId) {
            setSelectedOrderId(filtered[0].id);
          }
        }
      } catch (_) {}
    };

    if (user.id === 'guest') {
      loadLocalOrders();
      return;
    }
    
    const q = query(collection(db, 'orders'), where('customerEmail', '==', user.email));
    
    const unsub = onSnapshot(q, (snapshot) => {
        const loadedOrders: LocalOrder[] = snapshot.docs.map(doc => {
            const data = doc.data();
            const productsInOrder = Array.isArray(data.products) 
                ? data.products.map((p: any) => ({
                    ...p,
                    image: p.image || products.find(prod => prod.id === p.productId)?.image || 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=600'
                }))
                : typeof data.products === 'string'
                    ? [{ 
                        productId: 'unknown', 
                        nameEn: data.products, 
                        nameAr: data.products, 
                        price: (data.price || 0) / (parseInt(data.products.split('(')[1]?.split(')')[0]) || 1),
                        quantity: parseInt(data.products.split('(')[1]?.split(')')[0] || '1') || 1,
                        image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=600'
                    }]
                    : [];

            return {
                id: doc.id,
                customerId: data.customerId || "",
                customerName: data.customerName || "",
                customerEmail: data.customerEmail || "",
                products: productsInOrder,
                totalPrice: Number(data.totalPrice || data.price) || 0,
                status: data.status || 'Pending',
                paymentStatus: data.paymentStatus || 'unpaid',
                shippingAddress: data.shippingAddress || "",
                phone: data.phone || "",
                createdAt: data.createdAt || new Date().toISOString().split('T')[0],
                certificate: data.certificate
            };
        }) as LocalOrder[];

        // Filter orders corresponding to current user
        const filteredUserOrders = loadedOrders.filter(
            o => o.customerId === user?.id || o.customerEmail === user?.email
        );
        setOrders(filteredUserOrders);

        // Default select first order for immediate tracking/receipt view
        if (filteredUserOrders.length > 0 && !selectedOrderId) {
            setSelectedOrderId(filteredUserOrders[0].id);
        }
    }, (err) => {
        console.warn("UserProfile orders snapshot fallback to local storage:", err.message);
        loadLocalOrders();
    });

    return () => unsub();
  }, [user, products]);

  // Clean up selected order if it gets deleted
  useEffect(() => {
    if (selectedOrderId && orders.length > 0 && !orders.find(o => o.id === selectedOrderId)) {
      setSelectedOrderId(null);
    }
  }, [orders, selectedOrderId]);

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  // Filter logic
  const filteredOrders = orders.filter(o => {
    // Search query match (Order ID or product name)
    const matchesSearch = 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.products.some(p => 
        p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.nameAr.includes(searchQuery)
      );

    // Status filter match
    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'active') {
      return matchesSearch && (o.status === 'pending' || o.status === 'processing' || o.status === 'shipped');
    }
    return matchesSearch && o.status === statusFilter;
  });

  const getStatusColor = (status: LocalOrder['status']) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-400/10 text-emerald-500 border-emerald-500/20';
      case 'Shipped':
        return 'bg-blue-400/10 text-blue-500 border-blue-500/20';
      case 'Preparing':
        return 'bg-amber-400/10 text-amber-500 border-amber-500/20';
      case 'Pending':
        return 'bg-gold-luxe/10 text-gold-luxe border-gold-luxe/20';
      case 'Cancelled':
        return 'bg-rose-400/10 text-rose-500 border-rose-500/20';
      default:
        return 'bg-charcoal-400/10 text-charcoal-400 border-charcoal-400/20';
    }
  };

  const getStatusText = (status: LocalOrder['status']) => {
    if (isRtl) {
      switch (status) {
        case 'Pending': return 'قيد الانتظار';
        case 'Preparing': return 'جاري التجهيز';
        case 'Shipped': return 'تم الشحن';
        case 'Delivered': return 'تم التوصيل';
        case 'Cancelled': return 'ملغي';
      }
    } else {
      switch (status) {
        case 'Pending': return 'Pending Reservation';
        case 'Preparing': return 'Artisan Preparation';
        case 'Shipped': return 'In Transit';
        case 'Delivered': return 'Delivered & Signed';
        case 'Cancelled': return 'Cancelled';
      }
    }
  };

  // Get tracking milestones
  const getTrackingSteps = (status: LocalOrder['status']) => {
    const steps = [
      {
        titleEn: 'Order Placed',
        titleAr: 'تسجيل طلب الحجز',
        descEn: 'Your luxury reservation is logged securely.',
        descAr: 'تم تسجيل طلبك الفاخر بأمان في نظامنا.',
        icon: Clock,
        completed: true
      },
      {
        titleEn: 'Artisan Prep',
        titleAr: 'التجهيز الفني',
        descEn: 'Watchmakers & perfumers inspect quality.',
        descAr: 'المتخصصون يدققون القطع الفاخرة ويجهزونها.',
        icon: Package,
        completed: status !== 'Pending' && status !== 'Cancelled'
      },
      {
        titleEn: 'Insured Shipping',
        titleAr: 'الشحن المأمن',
        descEn: 'Courier dispatch with white-glove transit.',
        descAr: 'الشحن الفاخر مع حراسة وتأمين كامل.',
        icon: Truck,
        completed: status === 'Shipped' || status === 'Delivered'
      },
      {
        titleEn: 'Delivered',
        titleAr: 'تم التوصيل والتحقق',
        descEn: 'Signed and handed over to patron.',
        descAr: 'تم التسليم يداً بيد مع التوقيع والتوثيق.',
        icon: FileCheck,
        completed: status === 'Delivered'
      }
    ];
    return steps;
  };

  const copyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleGenerateCertificate = async () => {
    if (!selectedOrder) return;
    if (selectedOrder.status !== 'Delivered') {
      setToastMessage(isRtl ? 'ستصبح الشهادة الرقمية متاحة بعد تسليم طلبك بنجاح.' : 'The Digital Certificate will become available after your order has been successfully delivered.');
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    setIsGeneratingCertificate(true);
    try {
      const certificateId = `CERT-LXR-${Math.floor(100000 + Math.random() * 900000)}`;
      const newCertificate = {
        issued: true,
        certificateId: certificateId,
        issuedAt: new Date().toISOString(),
        verificationCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
        pdfGenerated: false
      };

      await updateDoc(doc(db, 'orders', selectedOrder.id), {
        certificate: newCertificate
      });

      setIsGeneratingCertificate(false);
      setCertificateSuccess(true);
      setTimeout(() => setCertificateSuccess(false), 4000);
    } catch (e) {
      console.error(e);
      setIsGeneratingCertificate(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Page Title & Breadcrumb */}
      <div className="mb-10 text-center sm:text-left rtl:sm:text-right">
        <p className="text-[10px] uppercase font-mono tracking-widest text-gold-600 dark:text-gold-400 font-bold mb-1">
          {isRtl ? 'الملف الشخصي والخدمات الخاصة' : 'Luxe Lounge & Concierge'}
        </p>
        <h1 className="text-3xl font-serif font-light text-charcoal-900 dark:text-white tracking-wide uppercase">
          {isRtl ? 'حسابك الفاخر' : 'Your Luxury Portfolio'}
        </h1>
        <p className="text-xs text-charcoal-400 mt-2 max-w-xl">
          {isRtl 
            ? 'مرحباً بك في مجلس لوكسورا الرقمي الخاص بك. تتبع حجوزاتك، استعرض شهادات الأصالة، وقم بإدارة ذوقك الرفيع.'
            : 'Welcome to your private lounge. Monitor your fine watch & perfume reservations, view certificates, and manage your exceptional history.'}
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Patron Card & Orders List (span 5) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* 1. Patron Card */}
          <div className="relative overflow-hidden bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-gold-900/10 rounded-3xl p-6 shadow-sm">
            {/* Ambient golden backdrop spotlight */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-gold-luxe/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-gold-500 via-gold-luxe to-gold-600 p-[2px]">
                <div className="w-full h-full rounded-full bg-white dark:bg-charcoal-950 flex items-center justify-center font-serif text-charcoal-900 dark:text-gold-100 text-xl font-light">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <span className="inline-block px-2 py-0.5 bg-gold-luxe/10 text-gold-600 dark:text-gold-400 text-[9px] font-mono rounded-full font-bold uppercase tracking-wider mb-1">
                  {user?.role === 'superadmin' ? (isRtl ? 'أمين الصندوق الكبير' : 'Grand Curator') : (isRtl ? 'عضو نخبة لوكسورا' : 'Exclusive Patron')}
                </span>
                <h3 className="text-base font-serif text-charcoal-900 dark:text-white truncate">
                  {user?.name || (isRtl ? 'عضو لوكسورا المميز' : 'Exclusive Patron')}
                </h3>
                <p className="text-xs text-charcoal-400 truncate flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-gold-600 dark:text-gold-500 flex-shrink-0" />
                  <span>{user?.email}</span>
                </p>
              </div>
            </div>

            {/* Quick Profile metadata */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-charcoal-100 dark:border-gold-900/5 font-mono text-xs text-charcoal-600 dark:text-gold-200/60">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-charcoal-400" />
                <span className="truncate">{safeText(selectedOrder?.phone)}</span>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <Calendar className="w-3.5 h-3.5 text-charcoal-400" />
                <span>{safeText(selectedOrder?.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* 2. Order History Navigator */}
          <div className="bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-gold-900/10 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-serif uppercase tracking-wider text-charcoal-900 dark:text-white">
                {isRtl ? 'حجوزاتك الاستثنائية' : 'Reservations Ledger'}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-charcoal-100 dark:bg-charcoal-950 text-charcoal-500 rounded">
                {orders.length} {isRtl ? 'طلب' : 'total'}
              </span>
            </div>

            {/* Search and Filters */}
            <div className="space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400`} />
                <input 
                  type="text"
                  placeholder={isRtl ? 'البحث برقم الحجز أو اسم القطعة...' : 'Search Ledger...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full ${isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 text-xs rounded-xl border border-charcoal-200 dark:border-gold-900/15 bg-charcoal-50/50 dark:bg-charcoal-950/40 focus:outline-none focus:border-gold-luxe text-charcoal-900 dark:text-white font-serif`}
                />
              </div>

              {/* Status Tabs */}
              <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
                {(['all', 'active', 'completed', 'cancelled'] as const).map(tab => {
                  const getTabLabel = (tName: string) => {
                    if (isRtl) {
                      switch (tName) {
                        case 'all': return 'الكل';
                        case 'active': return 'النشطة';
                        case 'completed': return 'المسلمة';
                        case 'cancelled': return 'الملغاة';
                      }
                    }
                    return tName.charAt(0).toUpperCase() + tName.slice(1);
                  };

                  return (
                    <button
                      key={tab}
                      onClick={() => setStatusFilter(tab)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all flex-shrink-0 border ${
                        statusFilter === tab
                          ? 'bg-gold-luxe text-charcoal-950 border-gold-luxe font-bold'
                          : 'border-transparent text-charcoal-500 dark:text-gold-200/50 hover:bg-charcoal-50 dark:hover:bg-gold-900/5'
                      }`}
                    >
                      {getTabLabel(tab)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Orders list */}
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 pl-1 scrollbar-thin">
              {filteredOrders.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-charcoal-200 dark:border-gold-900/10 rounded-2xl">
                  <AlertCircle className="w-8 h-8 text-charcoal-300 dark:text-gold-900/40 mx-auto mb-3" />
                  <p className="text-xs text-charcoal-500 dark:text-gold-200/50">
                    {orders.length === 0 
                      ? (isRtl ? 'لا توجد طلبات بعد' : 'No Orders Yet')
                      : (isRtl ? 'لم نعثر على أي سجلات مطابقة.' : 'No reservations match your criteria.')
                    }
                  </p>
                </div>
              ) : (
                filteredOrders.map(order => {
                  const isSelected = order.id === selectedOrderId;
                  const primaryProduct = order.products[0];
                  const productsCount = order.products.reduce((acc, p) => acc + p.quantity, 0);

                  return (
                    <button
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                      className={`w-full text-left rtl:text-right p-4 rounded-2xl border transition-all flex items-center gap-3 relative ${
                        isSelected 
                          ? 'bg-gold-luxe/5 border-gold-luxe shadow-sm' 
                          : 'bg-charcoal-50/50 dark:bg-charcoal-950/20 border-charcoal-100 dark:border-gold-900/5 hover:border-gold-luxe/30'
                      }`}
                    >
                      {/* Thumbnail of first item */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-gold-900/10 flex-shrink-0 relative">
                        <img 
                          src={primaryProduct?.image} 
                          alt={isRtl ? primaryProduct?.nameAr : primaryProduct?.nameEn} 
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info summary */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="text-[11px] font-mono font-bold text-gold-600 dark:text-gold-400">
                            {order.id}
                          </p>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] uppercase tracking-wider font-mono border ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <h4 className="text-xs font-serif font-light text-charcoal-900 dark:text-white mt-1 truncate">
                          {isRtl ? primaryProduct?.nameAr : primaryProduct?.nameEn}
                          {order.products.length > 1 && ` + ${order.products.length - 1} ${isRtl ? 'أخرى' : 'more'}`}
                        </h4>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-[10px] text-charcoal-400 font-mono">
                            {order.createdAt}
                          </p>
                          <p className="text-xs font-bold text-charcoal-900 dark:text-white font-mono">
                            ${(order.totalPrice ?? 0).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Selection accent indicator */}
                      {isSelected && (
                        <div className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'left-2' : 'right-2'} text-gold-luxe`}>
                          {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right column: Interactive Tracker & Receipt Details (span 7) */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedOrder ? (
              <motion.div
                key={selectedOrder.id}
                initial={{ opacity: 0, x: isRtl ? -15 : 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRtl ? 15 : -15 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="space-y-8"
              >
                {/* A. Live Real-Time Tracking Panel */}
                <div className="bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-gold-900/10 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-24 -mt-24 w-60 h-60 bg-gold-luxe/5 rounded-full blur-3xl pointer-events-none" />
                  
                  {/* Tracker Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-charcoal-100 dark:border-gold-900/5">
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-wider text-gold-600 dark:text-gold-400">
                        {isRtl ? 'مستشار تتبع الحجوزات' : 'VIP Concierge Transit Monitor'}
                      </p>
                      <h3 className="text-lg font-serif font-light text-charcoal-900 dark:text-white uppercase tracking-wider mt-1 flex items-center gap-2">
                        <Truck className="w-5 h-5 text-gold-luxe animate-pulse" />
                        {isRtl ? 'تتبع مسار طلبك الفاخر' : 'Real-time Luxury Tracking'}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyOrderId(selectedOrder.id)}
                        className="px-3 py-1.5 bg-charcoal-50 dark:bg-charcoal-950 border border-charcoal-200 dark:border-gold-900/10 text-[10px] font-mono rounded-lg hover:border-gold-luxe/30 text-charcoal-600 dark:text-gold-300 transition-all flex items-center gap-1.5"
                      >
                        {isCopied ? (
                          <span className="text-emerald-500 font-bold">{isRtl ? 'تم النسخ' : 'Copied'}</span>
                        ) : (
                          <>
                            <span>{isRtl ? 'رمز التتبع:' : 'ID:'} {selectedOrder.id}</span>
                            <ExternalLink className="w-3 h-3 text-gold-luxe" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Estimated Delivery Notification */}
                  {selectedOrder.status !== 'Cancelled' && (
                    <div className="mt-6 p-4 rounded-2xl bg-gold-luxe/5 border border-gold-luxe/10 flex items-start gap-3">
                      <Clock className="w-4 h-4 text-gold-luxe mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-xs font-serif font-medium text-charcoal-900 dark:text-gold-100">
                          {selectedOrder.status === 'Delivered' 
                            ? (isRtl ? 'تم التسليم والتحقق يدوياً' : 'Hand-Delivered & Authenticated')
                            : (isRtl ? 'التوصيل المؤمن المتوقع' : 'Insured Delivery Window Estimated')}
                        </h4>
                        <p className="text-[11px] text-charcoal-500 dark:text-gold-200/60 leading-relaxed mt-1">
                          {selectedOrder.status === 'Delivered'
                            ? (isRtl ? `تم استلام الشحنة وإثبات أصالتها بنجاح في تاريخ ${selectedOrder.createdAt}.` : `The order was hand-delivered and checked for quality. Signed on ${selectedOrder.createdAt}.`)
                            : (isRtl 
                                ? 'يتم الشحن في صناديق مفرغة مأمنة تماماً ضد السرقة وتغير الحرارة. التسليم يداً بيد.' 
                                : 'Our secure courier uses pressurized temperature-controlled cases. Signature and photo verification required.')}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Interactive Stepper Visualizer */}
                  <div className="mt-8 relative pl-6 pr-6">
                    {/* Stepper Timeline Axis Connector */}
                    <div className={`absolute top-0 bottom-0 ${isRtl ? 'right-[27px]' : 'left-[27px]'} w-0.5 bg-charcoal-100 dark:bg-gold-900/10`} />

                    {/* Stepper Elements */}
                    <div className="space-y-8">
                      {getTrackingSteps(selectedOrder.status).map((step, idx) => {
                        const StepIcon = step.icon;
                        const isCompleted = step.completed;
                        const isCurrent = 
                          (selectedOrder.status === 'Pending' && idx === 0) ||
                          (selectedOrder.status === 'Preparing' && idx === 1) ||
                          (selectedOrder.status === 'Shipped' && idx === 2) ||
                          (selectedOrder.status === 'Delivered' && idx === 3);

                        return (
                          <div key={idx} className="flex gap-4 relative">
                            {/* Milestone Marker Icon Container */}
                            <div className={`w-8 h-8 rounded-full border flex items-center justify-center relative z-10 transition-all duration-500 ${
                              isCompleted 
                                ? 'bg-gold-luxe border-gold-luxe text-charcoal-950 shadow-md shadow-gold-500/10' 
                                : 'bg-white dark:bg-charcoal-950 border-charcoal-200 dark:border-gold-900/10 text-charcoal-400'
                            }`}>
                              {isCurrent && (
                                <span className="absolute inset-0 rounded-full bg-gold-luxe/40 animate-ping" />
                              )}
                              <StepIcon className="w-4 h-4" />
                            </div>

                            {/* Milestone textual descriptors */}
                            <div className="flex-1 min-w-0 pt-0.5">
                              <h4 className={`text-xs font-serif font-medium tracking-wide uppercase ${
                                isCurrent 
                                  ? 'text-gold-luxe font-semibold' 
                                  : isCompleted 
                                  ? 'text-charcoal-900 dark:text-white' 
                                  : 'text-charcoal-400'
                              }`}>
                                {isRtl ? step.titleAr : step.titleEn}
                              </h4>
                              <p className="text-[11px] text-charcoal-500 dark:text-gold-100/50 mt-0.5">
                                {isRtl ? step.descAr : step.descEn}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* B. Detailed Invoice Receipt View */}
                <div className="bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-gold-900/10 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <div className="flex justify-between items-center pb-4 border-b border-charcoal-100 dark:border-gold-900/5">
                    <h3 className="text-sm font-serif uppercase tracking-wider text-charcoal-900 dark:text-white">
                      {isRtl ? 'تفاصيل فاتورة الحجز الفاخر' : 'Luxury Certificate & Ledger Detail'}
                    </h3>
                    <span className="text-[10px] font-mono text-gold-600 dark:text-gold-400">
                      {selectedOrder.createdAt}
                    </span>
                  </div>

                  {/* List of items inside order */}
                  <div className="divide-y divide-charcoal-100 dark:divide-gold-900/5 py-4">
                    {selectedOrder.products.map((item, idx) => {
                      const name = isRtl ? item.nameAr : item.nameEn;
                      return (
                        <div key={idx} className="flex gap-4 py-4 first:pt-0 last:pb-0 group">
                          {/* Image */}
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-charcoal-50 dark:bg-charcoal-950 border border-charcoal-100 dark:border-gold-900/10 flex-shrink-0">
                            <img src={item.image} alt={name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 flex justify-between items-center">
                            <div>
                              <h4 className="text-xs font-serif font-light text-charcoal-900 dark:text-white truncate">
                                {name}
                              </h4>
                              <p className="text-[10px] text-charcoal-400 font-mono mt-0.5">
                                {isRtl ? 'الكمية:' : 'Qty:'} {item.quantity} × ${(item.price ?? 0).toLocaleString()}
                              </p>
                            </div>
                            <span className="text-xs font-bold text-gold-luxe font-mono">
                              ${((item.price ?? 0) * (item.quantity ?? 0)).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order summary calculations */}
                  <div className="border-t border-charcoal-100 dark:border-gold-900/5 pt-4 space-y-2 font-mono text-xs">
                    <div className="flex justify-between text-charcoal-500">
                      <span>{isRtl ? 'قيمة الحجز الفرعي:' : 'Portfolio Value:'}</span>
                      <span>${(selectedOrder.products?.reduce((acc, p) => acc + ((p.price ?? 0) * (p.quantity ?? 0)), 0) ?? 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-charcoal-500">
                      <span>{isRtl ? 'الشحن والتأمين والمرافقة:' : 'Insured Escort Shipping:'}</span>
                      <span className="text-emerald-500 uppercase font-semibold text-[10px] tracking-wider">
                        {isRtl ? 'مكاني فاخر ومؤمن' : 'Complimentary VIP'}
                      </span>
                    </div>
                    <div className="flex justify-between text-charcoal-900 dark:text-white font-bold pt-3 border-t border-charcoal-100 dark:border-gold-900/10 text-sm">
                      <span>{isRtl ? 'المجموع الكلي للاستثمار:' : 'Grand Total Investment:'}</span>
                      <span className="text-gold-luxe text-base">${(selectedOrder.totalPrice ?? 0).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Delivery details breakdown */}
                  <div className="mt-6 p-5 rounded-2xl bg-charcoal-50/50 dark:bg-charcoal-950/40 border border-charcoal-100 dark:border-gold-900/10 space-y-3 text-xs">
                    <div className="flex justify-between gap-4">
                      <span className="text-charcoal-400 flex-shrink-0">{isRtl ? 'عنوان التوصيل المعتمد:' : 'Consignee Address:'}</span>
                      <span className="text-right text-charcoal-800 dark:text-gold-100/80 truncate font-serif">{safeText(selectedOrder.shippingAddress)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-charcoal-400">{isRtl ? 'الهاتف الخاص:' : 'Consignee Phone:'}</span>
                      <span className="font-mono text-charcoal-800 dark:text-gold-100/80">{safeText(selectedOrder.phone)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-charcoal-400">{isRtl ? 'طريقة الدفع والتأمين:' : 'Escrow Payment:'}</span>
                      <span className="uppercase text-[10px] font-mono tracking-widest text-gold-600 dark:text-gold-400 font-bold">
                        {selectedOrder.paymentStatus === 'paid' ? (isRtl ? 'مدفوع بالكامل مؤمن' : 'PAID & SECURED') : (isRtl ? 'بانتظار التحويل' : 'PENDING BANK WIRE')}
                      </span>
                    </div>
                  </div>

                  {/* Certificate of Authenticity Button */}
                  {selectedOrder.status !== 'cancelled' && (
                    <div className="mt-6 pt-2">
                      <button
                        onClick={() => {
                          if (selectedOrder.certificate) {
                            setIsCertificateModalOpen(true);
                          } else {
                            handleGenerateCertificate();
                          }
                        }}
                        disabled={isGeneratingCertificate}
                        className="w-full py-3 border border-gold-luxe/40 hover:border-gold-luxe bg-gold-luxe/5 hover:bg-gold-luxe/10 text-gold-luxe text-[10px] font-mono font-bold uppercase tracking-widest transition-all rounded-xl flex items-center justify-center gap-2 disabled:opacity-55 cursor-pointer"
                      >
                        {isGeneratingCertificate ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-gold-luxe" />
                            <span>{isRtl ? 'جاري توثيق التشفير الفريد للشهادة...' : 'Generating Cryptographic COA...'}</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>
                              {selectedOrder.certificate 
                                ? (isRtl ? 'استعراض شهادة الأصالة الرقمية' : 'View Digital Certificate')
                                : (isRtl ? 'طلب شهادة الأصالة الرقمية' : 'Request Digital Certificate of Authenticity')}
                            </span>
                          </>
                        )}
                      </button>

                      <AnimatePresence>
                        {toastMessage && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-3 p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl text-center flex items-center justify-center gap-2 text-[11px]"
                          >
                            <AlertCircle className="w-4 h-4 text-amber-400" />
                            <span>{toastMessage}</span>
                          </motion.div>
                        )}
                        {certificateSuccess && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-3 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-center flex items-center justify-center gap-2 text-[11px]"
                          >
                            <Sparkles className="w-4 h-4 animate-bounce text-emerald-400" />
                            <span>
                              {isRtl 
                                ? 'تم التوليد بنجاح! تم حفظ الشهادة الرقمية الموقعة مشفراً لحجوزاتك الاستثنائية.'
                                : 'COA verified and encrypted! A secure cryptographic receipt has been appended to your private vault.'}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="h-[400px] bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-gold-900/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4">
                <ShoppingBag className="w-12 h-12 text-charcoal-300 dark:text-gold-900/40" />
                <h3 className="text-lg font-serif text-charcoal-900 dark:text-white">
                  {isRtl ? 'حدد حجزاً لتتبع مساره الفاخر' : 'Select a Reservation to Begin'}
                </h3>
                <p className="text-xs text-charcoal-400 max-w-sm">
                  {isRtl 
                    ? 'يرجى اختيار حجز من القائمة الجانبية لتتبع تقدم الشحن، وتفاصيل القطع الفاخرة، والشهادات.'
                    : 'Choose an order from the list on the left to track progress, download authenticity certificates, and review invoice particulars.'}
                </p>
                <button 
                  onClick={() => setCurrentView('products')}
                  className="px-6 py-2.5 bg-gold-luxe hover:bg-gold-500 text-charcoal-950 text-[10px] font-mono uppercase tracking-widest rounded-xl transition-all"
                >
                  {isRtl ? 'اكتشف مجموعاتنا' : 'Explore Collections'}
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>
        {isCertificateModalOpen && selectedOrder && (
          <CertificateModal
            order={selectedOrder}
            onClose={() => setIsCertificateModalOpen(false)}
          />
        )}
      </div>

    </div>
  );
};
