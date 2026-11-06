import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAdmin } from '../../context/AdminContext';
import { Search, Eye, RefreshCw, Check, X, ShoppingBag, Plus, Sparkles, Trash2 } from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { t } = useApp();
  const { orders, products, updateOrderStatus, addProduct, deleteOrder } = useAdmin();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pending' | 'Completed' | 'Cancelled'>('all');
  
  // Custom manual order states
  const [isAddingOrder, setIsAddingOrder] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [shippingMethod, setShippingMethod] = useState('Express Courier');

  const handleDeleteOrder = async () => {
    if (orderToDelete) {
      await deleteOrder(orderToDelete);
      setOrderToDelete(null);
    }
  };

  const filtered = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    
    let matchesStatus = false;
    if (statusFilter === 'all') {
      matchesStatus = true;
    } else if (statusFilter === 'Pending') {
      matchesStatus = o.status === 'Pending';
    } else if (statusFilter === 'Completed') {
      matchesStatus = o.status === 'Delivered' || o.status === 'Completed';
    } else if (statusFilter === 'Cancelled') {
      matchesStatus = o.status === 'Cancelled';
    }
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    const generatedId = `LXR-${Math.floor(100000 + Math.random() * 900000)}`;
    const price = product.price * quantity;

    try {
      // Import db and setDoc dynamically or use simple Firestore setDoc
      const { db } = await import('../../lib/firebase');
      const { doc, setDoc } = await import('firebase/firestore');

      await setDoc(doc(db, 'orders', generatedId), {
        id: generatedId,
        customerId: '',
        customerName,
        customerEmail,
        products: [{
          productId: product.id,
          nameEn: product.nameEn,
          nameAr: product.nameAr,
          price: product.price,
          quantity: quantity,
          image: product.image
        }],
        totalPrice: price,
        price: price,
        status: 'Pending',
        paymentStatus: 'paid',
        payment: 'Paid (Card)',
        shippingAddress: 'N/A',
        shipping: shippingMethod,
        phone: 'N/A',
        createdAt: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0]
      });

      setIsAddingOrder(false);
      // Reset form
      setCustomerName('');
      setCustomerEmail('');
      setSelectedProductId('');
      setQuantity(1);
    } catch (err) {
      alert("Failed to create order: " + err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif text-charcoal-900 dark:text-white">{t.manageOrders}</h2>
          <p className="text-xs text-charcoal-500 dark:text-gold-400/60 mt-1 font-mono uppercase tracking-wider">
            {orders.length} REAL ORDERS REGISTERED
          </p>
        </div>
        <button 
          onClick={() => setIsAddingOrder(true)}
          className="flex items-center gap-2 px-5 py-3 bg-gold-luxe hover:bg-gold-500 text-charcoal-950 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Test Order
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-charcoal-900 p-4 rounded-2xl border border-charcoal-200 dark:border-gold-900/10">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
          <input 
            type="text"
            placeholder="Search Order ID or Customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-charcoal-50 dark:bg-charcoal-950 border border-charcoal-200 dark:border-gold-900/10 focus:outline-none focus:border-gold-luxe transition-all dark:text-white"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          {(['all', 'Pending', 'Completed', 'Cancelled'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-[11px] uppercase tracking-wider border transition-all ${
                statusFilter === status 
                  ? 'bg-gold-luxe text-charcoal-950 border-gold-luxe font-medium'
                  : 'border-charcoal-200 dark:border-gold-900/10 text-charcoal-600 dark:text-gold-400/60 hover:border-gold-luxe/40'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Add Custom Test Order Modal */}
      {isAddingOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-gold-900/15 p-8 rounded-3xl w-full max-w-md shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-charcoal-100 dark:border-gold-900/10">
              <h3 className="text-xl font-serif text-charcoal-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-luxe animate-pulse" />
                Create Boutique Order
              </h3>
              <button onClick={() => setIsAddingOrder(false)} className="p-1 hover:text-rose-500 transition-colors dark:text-gold-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-charcoal-500 mb-1">Patron Name</label>
                <input 
                  type="text" 
                  value={customerName} 
                  onChange={e => setCustomerName(e.target.value)} 
                  required 
                  placeholder="e.g. Alistair Sterling" 
                  className="w-full p-2.5 text-xs rounded-lg border border-charcoal-200 dark:border-gold-900/15 dark:bg-charcoal-950 dark:text-white" 
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-charcoal-500 mb-1">Patron Email</label>
                <input 
                  type="email" 
                  value={customerEmail} 
                  onChange={e => setCustomerEmail(e.target.value)} 
                  required 
                  placeholder="patron@luxora.com" 
                  className="w-full p-2.5 text-xs rounded-lg border border-charcoal-200 dark:border-gold-900/15 dark:bg-charcoal-950 dark:text-white" 
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-charcoal-500 mb-1">Select Piece</label>
                <select 
                  value={selectedProductId} 
                  onChange={e => setSelectedProductId(e.target.value)} 
                  required 
                  className="w-full p-2.5 text-xs rounded-lg border border-charcoal-200 dark:border-gold-900/15 dark:bg-charcoal-950 dark:text-white"
                >
                  <option value="">-- Choose Heritage Piece --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.nameEn} - ${(p.price ?? 0).toLocaleString()}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-charcoal-500 mb-1">Quantity</label>
                  <input 
                    type="number" 
                    min={1} 
                    value={quantity} 
                    onChange={e => setQuantity(Number(e.target.value))} 
                    required 
                    className="w-full p-2.5 text-xs rounded-lg border border-charcoal-200 dark:border-gold-900/15 dark:bg-charcoal-950 dark:text-white" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-charcoal-500 mb-1">Shipping</label>
                  <select 
                    value={shippingMethod} 
                    onChange={e => setShippingMethod(e.target.value)} 
                    className="w-full p-2.5 text-xs rounded-lg border border-charcoal-200 dark:border-gold-900/15 dark:bg-charcoal-950 dark:text-white"
                  >
                    <option value="Express Courier">Express Courier</option>
                    <option value="VIP Delivery">VIP Delivery</option>
                    <option value="Standard Mail">Standard Mail</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full py-3 bg-gold-luxe hover:bg-gold-500 text-charcoal-950 rounded-xl text-xs font-semibold uppercase tracking-widest transition-colors mt-6">
                Fulfill Order
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-gold-900/15 p-8 rounded-3xl w-full max-w-sm shadow-2xl space-y-6">
            <h3 className="text-xl font-serif text-charcoal-900 dark:text-white">Delete this order?</h3>
            <p className="text-sm text-charcoal-500 dark:text-gold-400/60">This action will permanently delete this order.</p>
            <div className="flex gap-4">
              <button onClick={() => setOrderToDelete(null)} className="flex-1 py-3 border border-charcoal-200 dark:border-gold-900/20 rounded-xl text-xs font-semibold uppercase tracking-widest text-charcoal-600 dark:text-gold-300 transition-colors">
                Cancel
              </button>
              <button onClick={handleDeleteOrder} className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold uppercase tracking-widest transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table Container */}
      <div className="bg-white dark:bg-charcoal-900 rounded-2xl border border-charcoal-200 dark:border-gold-900/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {orders.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-charcoal-100 dark:bg-charcoal-950 rounded-full flex items-center justify-center text-charcoal-400">
                <ShoppingBag className="w-8 h-8 text-gold-luxe" />
              </div>
              <div>
                <p className="text-sm font-serif font-semibold text-charcoal-900 dark:text-white">0 Orders Registered</p>
                <p className="text-xs text-charcoal-500 max-w-xs mt-1">No customers have placed real orders yet. Use "Create Test Order" above to seed a real-time order.</p>
              </div>
            </div>
          ) : (
            <table className="w-full text-left rtl:text-right">
              <thead className="bg-charcoal-50 dark:bg-charcoal-950 border-b border-charcoal-100 dark:border-gold-900/10 text-[10px] uppercase tracking-wider text-charcoal-500 dark:text-gold-400/60 font-mono">
                <tr>
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Patron</th>
                  <th className="py-4 px-6">Assets</th>
                  <th className="py-4 px-6">Investment</th>
                  <th className="py-4 px-6">Transit Status</th>
                  <th className="py-4 px-6">Luxe Method</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-right rtl:text-left">Fulfillment Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100 dark:divide-gold-900/10 text-xs text-charcoal-700 dark:text-white">
                {filtered.map(order => (
                  <tr key={order.id} className="hover:bg-charcoal-50/50 dark:hover:bg-charcoal-800/20 transition-colors">
                    <td className="py-4 px-6 font-mono font-semibold text-gold-luxe">{order.id}</td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-serif font-medium text-charcoal-900 dark:text-white">{order.customerName}</p>
                        <p className="text-[10px] text-charcoal-600 dark:text-gold-400/40">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 max-w-xs truncate text-charcoal-900 dark:text-white" 
                        title={Array.isArray(order.products) ? order.products.map((p: any) => p.nameEn).join(', ') : order.products}>
                      {Array.isArray(order.products) ? order.products.map((p: any) => p.nameEn).join(', ') : order.products}
                    </td>
                    <td className="py-4 px-6 font-semibold font-mono text-charcoal-900 dark:text-white">${(order.totalPrice ?? 0).toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                        className={`px-2.5 py-1 rounded-full text-[9px] uppercase font-mono tracking-wider border bg-transparent ${
                          order.status === 'Delivered' 
                            ? 'text-emerald-500 border-emerald-500/20' 
                            : order.status === 'Pending'
                            ? 'text-amber-500 border-amber-500/20'
                            : order.status === 'Cancelled'
                            ? 'text-rose-500 border-rose-500/20'
                            : 'text-blue-500 border-blue-500/20'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-[10px] font-mono uppercase text-charcoal-700 dark:text-gold-400/60">
                      <div>{order.payment}</div>
                      <div className="text-[9px] text-charcoal-400">{order.shipping}</div>
                    </td>
                    <td className="py-4 px-6 font-mono text-charcoal-700 dark:text-gold-400/40">{order.date}</td>
                    <td className="py-4 px-6 text-right rtl:text-left">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setOrderToDelete(order.id)} className="p-2 text-charcoal-400 hover:text-rose-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
