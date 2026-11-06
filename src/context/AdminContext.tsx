import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc, runTransaction, increment } from 'firebase/firestore';
import { Product, Order, Coupon } from '../types';
import { mockProducts } from '../mockData';
import { useAuth } from './AuthContext';

interface AdminContextProps {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  isLoading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  editProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  removeCertificate: (orderId: string) => Promise<void>;
  updateOrderStatus: (id: string, status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled') => Promise<void>;
  adjustStock: (id: string, amount: number) => Promise<void>;
  reconcileInventory: (adjustedProducts: Product[]) => Promise<void>;
  incrementCouponUsage: (id: string) => Promise<void>;
  decrementStockTransaction: (items: { productId: string, quantity: number }[]) => Promise<void>;
}

const AdminContext = createContext<AdminContextProps | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const isAdminUser = user?.role === 'admin' || user?.role === 'superadmin';

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [couponsLoaded, setCouponsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync products in real-time
  useEffect(() => {
    const productsCol = collection(db, 'products');
    const unsubProducts = onSnapshot(productsCol, async (snapshot) => {
      try {
        if (snapshot.empty) {
          if (!localStorage.getItem('luxora_products_seeded') && isAdminUser) {
            localStorage.setItem('luxora_products_seeded', 'true');
            console.log("Seeding empty products collection with mockProducts...");
            // Seed products
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
            setProductsLoaded(true);
          }
        } else {
          localStorage.setItem('luxora_products_seeded', 'true');
          const prodList: Product[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            prodList.push({
              id: doc.id,
              ...data
            } as Product);
          });
          setProducts(prodList);
          setProductsLoaded(true);
        }
      } catch (err: any) {
        console.warn("Failed to fetch products:", err);
        setProducts(mockProducts);
        setProductsLoaded(true);
      }
    }, (err) => {
      console.warn("Products snapshot listener fallback:", err.message);
      setProducts(mockProducts);
      setProductsLoaded(true);
    });

    return () => unsubProducts();
  }, [isAdminUser]);

  // Sync orders in real-time (admin only)
  useEffect(() => {
    if (!isAdminUser) {
      setOrders([]);
      setOrdersLoaded(true);
      return;
    }

    setOrdersLoaded(false);
    const ordersCol = collection(db, 'orders');
    const unsubOrders = onSnapshot(ordersCol, (snapshot) => {
      try {
        const orderList: Order[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          orderList.push({
            id: doc.id,
            customerId: data.customerId || '',
            customerName: data.customerName || "",
            customerEmail: data.customerEmail || "",
            products: Array.isArray(data.products) ? data.products.map(p => `${p.nameEn} (${p.quantity})`).join(', ') : (data.products || ""),
            originalProducts: Array.isArray(data.products) ? data.products : undefined,
            price: Number(data.totalPrice || data.price) || 0,
            totalPrice: Number(data.totalPrice || data.price) || 0,
            status: data.status || 'Pending',
            payment: data.payment || "Paid (Card)",
            shipping: data.shipping || "Express Courier",
            date: data.date || data.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
            paymentStatus: data.paymentStatus || 'unpaid',
            shippingAddress: data.shippingAddress || 'N/A',
            phone: data.phone || 'N/A',
            createdAt: data.createdAt || new Date().toISOString(),
            certificate: data.certificate
          } as Order);
        });
        // Sort orders by createdAt descending
        orderList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(orderList);
        setOrdersLoaded(true);
      } catch (err: any) {
        console.error("Failed to fetch orders:", err);
        setError(err.message || "Failed to load orders from database.");
        setOrdersLoaded(true);
      }
    }, (err) => {
      console.warn("Orders snapshot listener restricted or offline:", err.message);
      setOrdersLoaded(true);
    });

    return () => unsubOrders();
  }, [isAdminUser]);

  // Sync coupons in real-time (admin only)
  useEffect(() => {
    if (!isAdminUser) {
      setCoupons([]);
      setCouponsLoaded(true);
      return;
    }

    setCouponsLoaded(false);
    const couponsCol = collection(db, 'coupons');
    const unsubCoupons = onSnapshot(couponsCol, (snapshot) => {
      try {
        const couponList: Coupon[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          couponList.push({
            id: doc.id,
            ...data
          } as Coupon);
        });
        setCoupons(couponList);
        setCouponsLoaded(true);
      } catch (err: any) {
        console.error("Failed to fetch coupons:", err);
        setError(err.message || "Failed to load coupons from database.");
        setCouponsLoaded(true);
      }
    }, (err) => {
      console.warn("Coupons snapshot listener restricted or offline:", err.message);
      setCouponsLoaded(true);
    });

    return () => unsubCoupons();
  }, [isAdminUser]);

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const newId = `p-${Date.now()}`;
      await setDoc(doc(db, 'products', newId), {
        ...productData,
        id: newId
      });
    } catch (err: any) {
      console.error("Error adding product:", err);
      throw err;
    }
  };

  const editProduct = async (id: string, productData: Partial<Product>) => {
    try {
      await updateDoc(doc(db, 'products', id), productData);
    } catch (err: any) {
      console.error("Error editing product:", err);
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err: any) {
      console.error("Error deleting product:", err);
      throw err;
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      console.log("💎 [AdminContext] Attempting to delete order:", id);
      await deleteDoc(doc(db, 'orders', id));
      console.log("💎 [AdminContext] Successfully deleted order:", id);
    } catch (err: any) {
      console.error("Error deleting order:", err);
      throw err;
    }
  };

  const removeCertificate = async (orderId: string) => {
    try {
      console.log("💎 [AdminContext] Attempting to remove certificate from order:", orderId);
      await updateDoc(doc(db, 'orders', orderId), {
        certificate: null
      });
      console.log("💎 [AdminContext] Successfully removed certificate from order:", orderId);
    } catch (err: any) {
      console.error("Error removing certificate:", err);
      throw err;
    }
  };

  const updateOrderStatus = async (id: string, status: 'Pending' | 'Preparing' | 'Shipped' | 'Delivered' | 'Cancelled') => {
    try {
      await updateDoc(doc(db, 'orders', id), { status });
    } catch (err: any) {
      console.error("Error updating order status:", err);
      throw err;
    }
  };

  const adjustStock = async (id: string, amount: number) => {
    try {
      const prod = products.find(p => p.id === id);
      if (prod) {
        const nextStock = Math.max(0, prod.stock + amount);
        await updateDoc(doc(db, 'products', id), { stock: nextStock });
      }
    } catch (err: any) {
      console.error("Error adjusting stock:", err);
      throw err;
    }
  };

  const reconcileInventory = async (adjustedProducts: Product[]) => {
    try {
      for (const p of adjustedProducts) {
        await updateDoc(doc(db, 'products', p.id), { stock: p.stock });
      }
    } catch (err: any) {
      console.error("Error reconciling inventory:", err);
      throw err;
    }
  };

  const incrementCouponUsage = async (id: string) => {
    try {
      await updateDoc(doc(db, 'coupons', id), { usedCount: increment(1) });
    } catch (err: any) {
      console.warn("Could not increment coupon usage:", err);
    }
  };

  // const decrementStockTransaction = async (items: { productId: string, quantity: number }[]) => {
  //   try {
  //     await runTransaction(db, async (transaction) => {
  //       // 1. Check all items first
  //       for (const item of items) {
  //         const prodRef = doc(db, 'products', item.productId);
  //         const prodDoc = await transaction.get(prodRef);
  //         if (!prodDoc.exists()) {
  //           throw new Error(`Product ${item.productId} not found`);
  //         }
  //         const data = prodDoc.data();
  //         if ((data.stock || 0) < item.quantity) {
  //           throw new Error(`Insufficient stock for ${data.nameEn || item.productId}`);
  //         }
  //       }
  //       // 2. Perform updates
  //       for (const item of items) {
  //         const prodRef = doc(db, 'products', item.productId);
  //         const prodDoc = await transaction.get(prodRef);
  //         const data = prodDoc.data();
  //         transaction.update(prodRef, { stock: (data.stock || 0) - item.quantity });
  //       }
  //     });
  //   } catch (err: any) {
  //     console.error("Transaction failed:", err);
  //     throw err;
  //   }
  // };

  const decrementStockTransaction = async (
  items: { productId: string; quantity: number }[]
) => {
  try {
    await runTransaction(db, async (transaction) => {

      const productsData: {
        ref: any;
        stock: number;
      }[] = [];

      // اقرأ كل المنتجات أولاً
      for (const item of items) {
        const ref = doc(db, "products", item.productId);
        const snap = await transaction.get(ref);

        if (!snap.exists()) {
          throw new Error("Product not found");
        }

        const data = snap.data();

        if ((data.stock || 0) < item.quantity) {
          throw new Error(
            `Insufficient stock for ${data.nameEn || item.productId}`
          );
        }

        productsData.push({
          ref,
          stock: data.stock || 0,
        });
      }

      // بعد انتهاء كل الـ Reads ابدأ الـ Writes
      for (let i = 0; i < items.length; i++) {
        transaction.update(productsData[i].ref, {
          stock: productsData[i].stock - items[i].quantity,
        });
      }
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

  const isLoading = !productsLoaded || !ordersLoaded || !couponsLoaded;

  return (
    <AdminContext.Provider value={{
      products,
      orders,
      coupons,
      isLoading,
      error,
      addProduct,
      editProduct,
      deleteProduct,
      deleteOrder,
      removeCertificate,
      updateOrderStatus,
      adjustStock,
      reconcileInventory,
      incrementCouponUsage,
      decrementStockTransaction
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within an AdminProvider');
  return context;
};
