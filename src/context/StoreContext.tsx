import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Coupon } from '../types';
import { useAuth } from './AuthContext';
import { mockProducts } from '../mockData';
import { db, saveCartToFirebase, loadCartFromFirebase, deleteCartFromFirebase } from '../lib/firebase';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';

interface StoreContextProps {
  products: Product[];
  favorites: string[];
  cart: { productId: string; quantity: number }[];
  isLoadingCart: boolean;
  appliedCoupon: Coupon | null;
  setAppliedCoupon: (coupon: Coupon | null) => void;
  toggleFavorite: (productId: string) => void;
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  currentView: 'home' | 'products' | 'favorites' | 'product-details' | 'profile' | 'cart' | 'contact' | 'about' | 'story' | 'privacy' | 'terms' | 'shipping' | 'return' | 'warranty' | 'faq';
  setCurrentView: (view: 'home' | 'products' | 'favorites' | 'product-details' | 'profile' | 'cart' | 'contact' | 'about' | 'story' | 'privacy' | 'terms' | 'shipping' | 'return' | 'warranty' | 'faq') => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  quickViewProductId: string | null;
  setQuickViewProductId: (id: string | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (isOpen: boolean) => void;
  pendingAction: (() => void) | null;
  setPendingAction: (action: (() => void) | null) => void;
  categoryFilter: 'all' | 'watches' | 'perfumes';
  setCategoryFilter: (category: 'all' | 'watches' | 'perfumes') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const StoreContext = createContext<StoreContextProps | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<{ productId: string; quantity: number }[]>([]);
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  
  const [currentView, setCurrentView] = useState<'home' | 'products' | 'favorites' | 'product-details' | 'profile' | 'cart' | 'contact' | 'about' | 'story' | 'privacy' | 'terms' | 'shipping' | 'return' | 'warranty' | 'faq'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'watches' | 'perfumes'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync products in real-time with Firestore for public storefront
  useEffect(() => {
    const productsCol = collection(db, 'products');
    const unsubProducts = onSnapshot(productsCol, async (snapshot) => {
      try {
        if (snapshot.empty) {
          if (!localStorage.getItem('luxora_products_seeded') && (user?.role === 'admin' || user?.role === 'superadmin')) {
            localStorage.setItem('luxora_products_seeded', 'true');
            for (const item of mockProducts) {
              await setDoc(doc(db, 'products', item.id), {
                ...item,
                status: item.status || 'active',
                featured: item.featured || false,
                images: item.images || []
              });
            }
          } else {
            setProducts(mockProducts);
          }
        } else {
          localStorage.setItem('luxora_products_seeded', 'true');
          const prodList: Product[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            prodList.push({
              id: docSnap.id,
              ...data
            } as Product);
          });
          setProducts(prodList);
        }
      } catch (err) {
        console.warn("Failed to sync products in StoreContext, using fallback:", err);
        setProducts(mockProducts);
      }
    }, (err) => {
      console.warn("StoreContext products listener fallback:", err.message);
      setProducts(mockProducts);
    });

    return () => unsubProducts();
  }, [user?.role]);

  // Initial load of favorites from local storage
  useEffect(() => {
    const savedFavs = localStorage.getItem('luxora_favs');
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (_) {}
    }
  }, []);

  // Restore or load user cart when user sessions change
  useEffect(() => {
    const restoreCart = async () => {
      setIsLoadingCart(true);
      if (user) {
        try {
          const cloudCart = await loadCartFromFirebase(user.id);
          if (cloudCart) {
            const restoredItems = cloudCart.products.map(p => ({
              productId: p.productId,
              quantity: p.quantity
            }));
            setCart(restoredItems);
            // Note: We only have the code string from cloudCart.promoCode. 
            // We would need to fetch the coupon object again if we wanted to fully restore it.
            // For now, we will handle promo code restoration by just setting it to null
            // as this is a new system.
            setAppliedCoupon(null);
          } else {
            // No cloud cart exists yet, fallback to local storage
            const savedCart = localStorage.getItem('luxora_cart');
            if (savedCart) setCart(JSON.parse(savedCart));
            setAppliedCoupon(null);
          }
        } catch (err) {
          console.error("❌ Failed to restore cart from cloud:", err);
        } finally {
          setIsLoadingCart(false);
        }
      } else {
        // Guest mode
        const savedCart = localStorage.getItem('luxora_cart');
        if (savedCart) {
          try {
            setCart(JSON.parse(savedCart));
          } catch (_) {}
        } else {
          setCart([]);
        }
        setAppliedCoupon(null);
        setIsLoadingCart(false);
      }
    };

    restoreCart();
  }, [user]);

  // Persist Favorites locally
  useEffect(() => {
    localStorage.setItem('luxora_favs', JSON.stringify(favorites));
  }, [favorites]);

  // Persist Guest Cart and Coupon locally
  useEffect(() => {
    localStorage.setItem('luxora_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('luxora_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('luxora_coupon');
    }
  }, [appliedCoupon]);

  // Debounced synchronization of Cart to Firebase Firestore database
  useEffect(() => {
    if (!user || isLoadingCart) return;

    const delayDebounce = setTimeout(async () => {
      const activeProducts = products.length > 0 ? products : mockProducts;
      const resolvedItems = cart.map(item => {
        const product = activeProducts.find(p => p.id === item.productId);
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: product?.price || 0,
          nameEn: product?.nameEn || '',
          nameAr: product?.nameAr || '',
          image: product?.image || '',
          category: product?.category || 'watches'
        };
      }).filter(p => p.price > 0);

      const cartTotal = resolvedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

      await saveCartToFirebase(user.id, {
        products: resolvedItems,
        promoCode: appliedCoupon?.code || null,
        cartTotal
      });
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [cart, appliedCoupon, user, isLoadingCart, products]);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const next = prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId];
      return next;
    });
  };

  const addToCart = (productId: string, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item);
      } else {
        return [...prev, { productId, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart(prev => prev.map(item => item.productId === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    if (user) {
      deleteCartFromFirebase(user.id);
    }
  };

  return (
    <StoreContext.Provider value={{ 
      products,
      favorites, 
      cart, 
      isLoadingCart,
      appliedCoupon,
      setAppliedCoupon,
      toggleFavorite, 
      addToCart, 
      removeFromCart,
      updateCartQuantity,
      clearCart,
      currentView,
      setCurrentView,
      selectedProductId,
      setSelectedProductId,
      quickViewProductId,
      setQuickViewProductId,
      isAuthModalOpen,
      setIsAuthModalOpen,
      pendingAction,
      setPendingAction,
      categoryFilter,
      setCategoryFilter,
      searchQuery,
      setSearchQuery
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};

