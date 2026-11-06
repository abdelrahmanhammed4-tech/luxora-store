import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import { Search, UserCheck, ShieldAlert, Sparkles, UserX } from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const { t } = useApp();
  const { users } = useAuth();
  const { orders } = useAdmin();
  const [search, setSearch] = useState('');

  // Correlate registered users with their real orders in Firestore
  const customers = users
    .filter(u => u.role === 'customer' || u.role === 'user' || !u.role)
    .map(u => {
      const userOrders = orders.filter(o => o.customerEmail.toLowerCase() === u.email.toLowerCase() && o.status !== 'Cancelled');
      const purchaseHistory = userOrders.map(o => o.products).join(', ') || 'No purchases yet';
      const orderCount = userOrders.length;

      return {
        id: u.id,
        name: u.name || 'Exclusive Patron',
        email: u.email,
        phone: 'Exclusive Registry',
        purchaseHistory,
        orderCount,
        status: 'Active' as const
      };
    });

  const filtered = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif text-charcoal-900 dark:text-white">{t.manageCustomers}</h2>
        <p className="text-xs text-charcoal-500 dark:text-gold-400/60 mt-1">Nurture client relationships, check total patronage value, and manage status.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-charcoal-900 p-4 rounded-2xl border border-charcoal-200 dark:border-gold-900/10">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
          <input 
            type="text"
            placeholder="Search Customer Name or Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-charcoal-50 dark:bg-charcoal-950 border border-charcoal-200 dark:border-gold-900/10 focus:outline-none focus:border-gold-luxe transition-all dark:text-white"
          />
        </div>
        <div className="text-xs font-mono text-charcoal-400 uppercase tracking-widest bg-charcoal-50 dark:bg-charcoal-950 px-3 py-1.5 rounded-lg border border-charcoal-100 dark:border-gold-900/10">
          {filtered.length} Patrons Registered
        </div>
      </div>

      <div className="bg-white dark:bg-charcoal-900 rounded-2xl border border-charcoal-200 dark:border-gold-900/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-charcoal-50 dark:bg-charcoal-950 rounded-full flex items-center justify-center text-charcoal-400">
                <UserX className="w-8 h-8 text-gold-luxe" />
              </div>
              <div>
                <p className="text-sm font-serif font-semibold text-charcoal-900 dark:text-white">No customers registered yet</p>
                <p className="text-xs text-charcoal-500 max-w-xs mt-1">When clients sign up on the main storefront or log in, their profiles will populate here dynamically.</p>
              </div>
            </div>
          ) : (
            <table className="w-full text-left rtl:text-right">
              <thead className="bg-charcoal-50 dark:bg-charcoal-950 border-b border-charcoal-100 dark:border-gold-900/10 text-[10px] uppercase tracking-wider text-charcoal-500 dark:text-gold-400/60 font-mono">
                <tr>
                  <th className="py-4 px-6">Patron</th>
                  <th className="py-4 px-6">Access Group</th>
                  <th className="py-4 px-6">Purchase Ledger</th>
                  <th className="py-4 px-6 text-center">Active Orders</th>
                  <th className="py-4 px-6">Sanctuary Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100 dark:divide-gold-900/10 text-xs text-charcoal-700 dark:text-white">
                {filtered.map(customer => (
                  <tr key={customer.id} className="hover:bg-charcoal-50/50 dark:hover:bg-charcoal-800/20 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gold-400/10 text-gold-luxe border border-gold-luxe/25 flex items-center justify-center font-serif text-sm">
                          {customer.name[0]}
                        </div>
                        <div>
                          <p className="font-serif font-medium text-charcoal-900 dark:text-white">{customer.name}</p>
                          <p className="text-[10px] text-charcoal-600 dark:text-gold-400/40">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-[10px] text-charcoal-600 dark:text-gold-400/60 uppercase">EXCLUSIVE_MEMBER</td>
                    <td className="py-4 px-6 max-w-xs truncate text-charcoal-900 dark:text-white" title={customer.purchaseHistory}>{customer.purchaseHistory}</td>
                    <td className="py-4 px-6 font-semibold font-mono text-center text-charcoal-900 dark:text-white">{customer.orderCount}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full text-[9px] uppercase font-mono tracking-wider border bg-emerald-400/10 text-emerald-500 border-emerald-500/20">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
