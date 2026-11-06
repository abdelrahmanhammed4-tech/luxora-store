import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAdmin } from '../../context/AdminContext';
import { AlertTriangle, Plus, Minus, Check } from 'lucide-react';
import { Product } from '../../types';

export const AdminInventory: React.FC = () => {
  const { t, language } = useApp();
  const { products, reconcileInventory, isLoading } = useAdmin();
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Initialize local products when database loads
  useEffect(() => {
    if (products.length > 0) {
      setLocalProducts(products);
    }
  }, [products]);

  const adjustStockLocal = (id: string, amount: number) => {
    setLocalProducts(prev => prev.map(p => {
      if (p.id === id) {
        const nextStock = Math.max(0, p.stock + amount);
        return { ...p, stock: nextStock };
      }
      return p;
    }));
  };

  const handleSaveStock = async () => {
    try {
      // Find only modified products to reconcile or send all
      await reconcileInventory(localProducts);
      setSuccessMsg('Sanctuary inventory stocks reconciled successfully in Firestore!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      alert('Reconciliation failed: ' + err);
    }
  };

  // Compute live stock metrics for warning banners
  const lowStockItems = localProducts.filter(p => p.stock < 10);
  const totalDepletedItems = localProducts.filter(p => p.stock === 0).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-charcoal-900 dark:text-white">{t.inventory}</h2>
          <p className="text-xs text-charcoal-500 dark:text-gold-400/60 mt-1">Directly reconcile product volumes, and inspect low stock alert signals.</p>
        </div>
        <button 
          onClick={handleSaveStock}
          disabled={isLoading || localProducts.length === 0}
          className="px-5 py-3 bg-gold-luxe hover:bg-gold-500 text-charcoal-950 disabled:opacity-50 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5"
        >
          <Check className="w-4 h-4" /> Save Reconciliation
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl font-medium tracking-wide">
          ✨ {successMsg}
        </div>
      )}

      {/* Critical Stock Alerts Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/25 rounded-2xl p-6 flex gap-4 items-start">
          <div className="p-2.5 bg-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400 flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-serif font-medium text-amber-800 dark:text-amber-300">Sanctuary Volume Advisory</h4>
            <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-1 leading-relaxed">
              {lowStockItems.length > 0 ? (
                <span>
                  The following items are running below the luxury threshold of 10 units: <strong>{lowStockItems.map(p => p.nameEn).slice(0, 3).join(', ')}</strong>. Consider placing immediate restock requests.
                </span>
              ) : (
                <span>All exquisite items currently exceed the minimum reserve threshold. No advisory required.</span>
              )}
            </p>
          </div>
        </div>

        <div className="bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/25 rounded-2xl p-6 flex gap-4 items-start">
          <div className="p-2.5 bg-rose-500/20 rounded-xl text-rose-600 dark:text-rose-400 flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-serif font-medium text-rose-800 dark:text-rose-300">Absolute Stock Depletion Warning</h4>
            <p className="text-xs text-rose-700/80 dark:text-rose-400/80 mt-1 leading-relaxed">
              {totalDepletedItems > 0 ? (
                <span>
                  Critical warning: <strong>{totalDepletedItems} piece(s)</strong> are completely out of stock. Client order pipelines for these assets are currently inactive.
                </span>
              ) : (
                <span>Zero fully-depleted items detected in current collection vaults. Excellent!</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Inventory Reconcile Table */}
      <div className="bg-white dark:bg-charcoal-900 rounded-2xl border border-charcoal-200 dark:border-gold-900/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 text-center text-xs font-mono tracking-widest text-charcoal-400">
              COMMUNING WITH ARCHIVE CORES...
            </div>
          ) : (
            <table className="w-full text-left rtl:text-right">
              <thead className="bg-charcoal-50 dark:bg-charcoal-950 border-b border-charcoal-100 dark:border-gold-900/10 text-[10px] uppercase tracking-wider text-charcoal-500 dark:text-gold-400/60 font-mono">
                <tr>
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-6">Original Count</th>
                  <th className="py-4 px-6">Reconciliation Actions</th>
                  <th className="py-4 px-6">Target Level Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100 dark:divide-gold-900/10 text-xs text-charcoal-900 dark:text-white">
                {localProducts.map(product => {
                  const originalProduct = products.find(p => p.id === product.id);
                  const isModified = originalProduct && originalProduct.stock !== product.stock;
                  
                  return (
                    <tr key={product.id} className="hover:bg-charcoal-50/50 dark:hover:bg-charcoal-800/20 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-charcoal-100 dark:bg-charcoal-950 border border-charcoal-200 dark:border-gold-900/10 flex-shrink-0">
                            <img src={product.image} alt={product.nameEn} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-serif font-medium text-charcoal-900 dark:text-white">
                              {language === 'en' ? product.nameEn : product.nameAr}
                              {isModified && (
                                <span className="ml-2 text-[9px] uppercase font-mono px-1.5 py-0.5 bg-amber-500/10 text-amber-500 rounded">
                                  Unsaved Changes
                                </span>
                              )}
                            </p>
                            <p className="text-[10px] text-charcoal-600 dark:text-gold-400/40 font-mono uppercase">{product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono font-bold text-charcoal-900 dark:text-white">
                        <span className={isModified ? "text-gold-luxe" : ""}>{product.stock} units</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => adjustStockLocal(product.id, -1)}
                            className="p-1.5 border border-charcoal-200 dark:border-gold-900/20 hover:border-gold-luxe rounded-lg hover:bg-gold-luxe/10 text-charcoal-600 dark:text-gold-300 transition-colors"
                            title="Decrease Stock"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => adjustStockLocal(product.id, 1)}
                            className="p-1.5 border border-charcoal-200 dark:border-gold-900/20 hover:border-gold-luxe rounded-lg hover:bg-gold-luxe/10 text-charcoal-600 dark:text-gold-300 transition-colors"
                            title="Increase Stock"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {product.stock === 0 ? (
                          <span className="px-2.5 py-1 rounded-full text-[9px] uppercase font-mono tracking-wider bg-rose-400/10 text-rose-500 border border-rose-500/20">
                            Depleted
                          </span>
                        ) : product.stock < 10 ? (
                          <span className="px-2.5 py-1 rounded-full text-[9px] uppercase font-mono tracking-wider bg-amber-400/10 text-amber-500 border border-amber-500/20 font-bold">
                            Low Reserve
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[9px] uppercase font-mono tracking-wider bg-emerald-400/10 text-emerald-500 border border-emerald-500/20">
                            Optimal Vault Level
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
