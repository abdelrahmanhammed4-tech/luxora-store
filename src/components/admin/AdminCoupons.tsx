import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Coupon } from '../../types';
import { Plus, Trash2, Edit2, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon> | null>(null);

  useEffect(() => {
    const q = collection(db, 'coupons');
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Coupon));
      setCoupons(data);
    }, (err) => {
      console.warn("AdminCoupons snapshot listener error:", err.message);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon) return;
    
    if (editingCoupon.id) {
        const { id, ...couponData } = editingCoupon;
        await updateDoc(doc(db, 'coupons', id!), couponData as any);
    } else {
        await addDoc(collection(db, 'coupons'), { ...editingCoupon, usedCount: 0 });
    }
    setIsModalOpen(false);
    setEditingCoupon(null);
  };

  const activeCoupons = coupons.filter(c => c.active);
  const expiredCoupons = coupons.filter(c => c.expiresAt?.toDate() < new Date());
  const totalUses = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[ { label: 'Total', value: coupons.length }, { label: 'Active', value: activeCoupons.length }, { label: 'Expired', value: expiredCoupons.length }, { label: 'Total Uses', value: totalUses } ].map((stat, i) => (
          <div key={i} className="p-4 bg-white dark:bg-charcoal-900 rounded-2xl border border-charcoal-200 dark:border-gold-900/10 text-center">
            <p className="text-[10px] uppercase text-charcoal-500">{stat.label}</p>
            <p className="text-xl font-serif font-bold text-charcoal-950 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-serif text-charcoal-900 dark:text-white">Coupon Management</h2>
        <button onClick={() => { setEditingCoupon({ active: true, discountType: 'percentage', discountValue: 0, usageLimit: 100, minimumOrderAmount: 0, code: '' }); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-gold-luxe text-charcoal-950 rounded-xl hover:bg-gold-500 transition-colors text-xs font-bold uppercase">
          <Plus className="w-4 h-4" /> Add Coupon
        </button>
      </div>
      
      <div className="bg-white dark:bg-charcoal-900 rounded-2xl border border-charcoal-200 dark:border-gold-900/10 overflow-hidden">
         <table className="w-full text-xs">
            <thead className="bg-charcoal-50 dark:bg-charcoal-800 text-charcoal-500 uppercase tracking-wider font-mono">
                <tr>
                    <th className="p-4 text-left">Code</th>
                    <th className="p-4 text-left">Discount</th>
                    <th className="p-4 text-left">Min Order</th>
                    <th className="p-4 text-left">Usage</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Actions</th>
                </tr>
            </thead>
            <tbody>
                {coupons.map(coupon => (
                    <tr key={coupon.id} className="border-t border-charcoal-100 dark:border-charcoal-800">
                        <td className="p-4 font-mono font-bold text-charcoal-900 dark:text-white">{coupon.code}</td>
                        <td className="p-4 text-charcoal-600 dark:text-gold-300">{coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}</td>
                        <td className="p-4 text-charcoal-600 dark:text-gold-300">${coupon.minimumOrderAmount}</td>
                        <td className="p-4 text-charcoal-600 dark:text-gold-300">{coupon.usedCount} / {coupon.usageLimit}</td>
                        <td className="p-4"><button onClick={() => updateDoc(doc(db, 'coupons', coupon.id), { active: !coupon.active })} className={`px-2 py-1 rounded-full text-[10px] ${coupon.active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>{coupon.active ? 'Active' : 'Disabled'}</button></td>
                        <td className="p-4 flex gap-2"><button onClick={() => { setEditingCoupon(coupon); setIsModalOpen(true); }}><Edit2 className="w-4 h-4 text-gold-luxe"/></button><button onClick={() => deleteDoc(doc(db, 'coupons', coupon.id))}><Trash2 className="w-4 h-4 text-rose-500"/></button></td>
                    </tr>
                ))}
            </tbody>
         </table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.form initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onSubmit={handleSubmit} className="bg-white dark:bg-charcoal-900 p-6 rounded-3xl w-full max-w-lg space-y-4">
                    <h3 className="font-serif text-lg">{editingCoupon?.id ? 'Edit' : 'Create'} Coupon</h3>
                    <input type="text" placeholder="Code (e.g. SAVE10)" value={editingCoupon?.code || ''} onChange={e => setEditingCoupon({...editingCoupon, code: e.target.value.toUpperCase()})} className="w-full p-2 border rounded-xl" required />
                    <select value={editingCoupon?.discountType} onChange={e => setEditingCoupon({...editingCoupon, discountType: e.target.value as any})} className="w-full p-2 border rounded-xl">
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed</option>
                    </select>
                    <input type="number" placeholder="Value" value={editingCoupon?.discountValue || 0} onChange={e => setEditingCoupon({...editingCoupon, discountValue: Number(e.target.value)})} className="w-full p-2 border rounded-xl" required />
                    <input type="number" placeholder="Minimum Order Amount" value={editingCoupon?.minimumOrderAmount || 0} onChange={e => setEditingCoupon({...editingCoupon, minimumOrderAmount: Number(e.target.value)})} className="w-full p-2 border rounded-xl" required />
                    <input type="number" placeholder="Usage Limit" value={editingCoupon?.usageLimit || 100} onChange={e => setEditingCoupon({...editingCoupon, usageLimit: Number(e.target.value)})} className="w-full p-2 border rounded-xl" required />
                    <div className="flex gap-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="w-full py-2 bg-charcoal-100 rounded-xl">Cancel</button>
                        <button type="submit" className="w-full py-2 bg-gold-luxe rounded-xl text-charcoal-950 font-bold">Save</button>
                    </div>
                </motion.form>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
