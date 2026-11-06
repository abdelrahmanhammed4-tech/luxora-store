import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { 
  DollarSign, ShoppingBag, Users, TrendingUp, AlertTriangle, 
  CheckCircle2, Clock, Package, Eye, ArrowUpRight, Activity, X, Tag
} from 'lucide-react';

export const Overview: React.FC = () => {
  const { t, language } = useApp();
  const { products, orders, coupons, isLoading } = useAdmin();
  const { users } = useAuth();

  // 1. Core metric calculations
  const nonCancelledOrders = orders.filter(o => o.status !== 'Cancelled');
  const totalRevenue = nonCancelledOrders.reduce((sum, o) => sum + o.price, 0);
  const totalOrdersCount = orders.length;
  
  // Customers count: real registered users with role 'customer'
  const customersCount = users.filter(u => u.role === 'customer' || u.role === 'user').length;
  
  // Luxury net profit estimation: 35% margin on completed transactions
  const netProfit = totalRevenue * 0.35;

  // 2. Order status breakdowns
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const completedOrdersCount = orders.filter(o => o.status === 'Delivered').length;
  const cancelledOrdersCount = orders.filter(o => o.status === 'Cancelled').length;

  // 3. Low stock alerts
  const lowStockProducts = products.filter(p => p.stock < 10);
  const lowStockCount = lowStockProducts.length;

  // 4. Coupons metrics
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter(c => c.active && (c.expiresAt?.toDate() > new Date())).length;
  const expiredCoupons = coupons.filter(c => !c.active || (c.expiresAt?.toDate() < new Date())).length;
  const totalCouponUses = coupons.reduce((sum, c) => sum + c.usedCount, 0);

  // 4. Monthly sales aggregation (real data only)
  const monthlySalesMap: Record<string, number> = {};
  nonCancelledOrders.forEach(order => {
    try {
      const dateObj = new Date(order.date);
      const monthName = dateObj.toLocaleString(language === 'en' ? 'en-US' : 'ar-EG', { month: 'short' });
      monthlySalesMap[monthName] = (monthlySalesMap[monthName] || 0) + order.price;
    } catch (_) {}
  });

  const salesOverviewData = Object.keys(monthlySalesMap).map(month => ({
    name: month,
    sales: monthlySalesMap[month]
  }));

  // 5. Category stock distribution (real data only)
  const categoryCountMap: Record<string, number> = {};
  products.forEach(p => {
    categoryCountMap[p.category] = (categoryCountMap[p.category] || 0) + p.stock;
  });

  const categoryDistributionData = Object.keys(categoryCountMap).map(cat => ({
    name: cat.toUpperCase(),
    value: categoryCountMap[cat]
  }));

  const COLORS = ['#C5A059', '#333333', '#888888', '#E2E8F0'];

  // 6. Recent actions (real activity based on order and stock states)
  const recentActivities = orders.slice(0, 5).map(o => ({
    id: o.id,
    type: 'order',
    title: `Order ${o.id} Placed`,
    desc: `Customer ${o.customerName || 'Patron'} ordered premium pieces totaling $${(o.price ?? 0).toLocaleString()}`,
    time: o.date,
    status: o.status
  }));

  return (
    <div className="space-y-8">
      {/* Premium Key Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: 'Total Revenue', 
            value: `$${(totalRevenue ?? 0).toLocaleString()}`, 
            icon: DollarSign, 
            color: 'text-gold-luxe bg-gold-luxe/10' 
          },
          { 
            label: 'Total Orders', 
            value: totalOrdersCount, 
            icon: ShoppingBag, 
            color: 'text-blue-500 bg-blue-500/10' 
          },
          { 
            label: 'Active Customers', 
            value: customersCount, 
            icon: Users, 
            color: 'text-emerald-500 bg-emerald-500/10' 
          },
          { 
            label: 'Net Profit', 
            value: `$${(netProfit ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 
            icon: TrendingUp, 
            color: 'text-amber-600 bg-amber-600/10' 
          }
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white dark:bg-charcoal-900 p-6 rounded-2xl border border-charcoal-200 dark:border-gold-900/10 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-charcoal-400 dark:text-gold-400/40 text-[10px] uppercase font-mono tracking-wider mb-1">{stat.label}</p>
                  <p className="text-2xl font-serif text-charcoal-900 dark:text-white font-medium">{stat.value}</p>
                </div>
                <div className={`p-2.5 rounded-xl ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Breakdowns and Critical Alerts Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Orders Breakdown Card */}
        <div className="bg-white dark:bg-charcoal-900 p-6 rounded-2xl border border-charcoal-200 dark:border-gold-900/10 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-charcoal-400 dark:text-gold-400/40 text-[10px] uppercase font-mono tracking-wider">Status Tracking</p>
            <div className="flex gap-4">
              <div>
                <span className="block text-xs text-charcoal-500">Pending</span>
                <span className="text-sm font-semibold text-amber-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {pendingOrdersCount}
                </span>
              </div>
              <div className="border-r border-charcoal-100 dark:border-gold-900/10 my-1" />
              <div>
                <span className="block text-xs text-charcoal-500">Completed</span>
                <span className="text-sm font-semibold text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {completedOrdersCount}
                </span>
              </div>
              <div className="border-r border-charcoal-100 dark:border-gold-900/10 my-1" />
              <div>
                <span className="block text-xs text-charcoal-500">Cancelled</span>
                <span className="text-sm font-semibold text-rose-500 flex items-center gap-1">
                  <X className="w-3.5 h-3.5" /> {cancelledOrdersCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Alert Banner */}
        <div className={`bg-white dark:bg-charcoal-900 p-6 rounded-2xl border border-charcoal-200 dark:border-gold-900/10 flex items-center justify-between ${lowStockCount > 0 ? 'border-l-4 border-l-rose-500' : ''}`}>
          <div>
            <p className="text-charcoal-400 dark:text-gold-400/40 text-[10px] uppercase font-mono tracking-wider mb-1">Vault Inventory</p>
            <p className="text-sm font-serif dark:text-white">
              {lowStockCount > 0 
                ? `${lowStockCount} Items Below Threshold` 
                : 'All Heritage Pieces Well Stocked'}
            </p>
          </div>
          <div className={`p-2 rounded-xl ${lowStockCount > 0 ? 'bg-rose-500/15 text-rose-500' : 'bg-emerald-500/15 text-emerald-500'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Global Conversion / Curators */}
        <div className="bg-white dark:bg-charcoal-900 p-6 rounded-2xl border border-charcoal-200 dark:border-gold-900/10 flex items-center justify-between">
          <div>
            <p className="text-charcoal-400 dark:text-gold-400/40 text-[10px] uppercase font-mono tracking-wider mb-1">Operational Curators</p>
            <p className="text-sm font-serif dark:text-white">
              {users.filter(u => u.role === 'admin' || u.role === 'superadmin').length} Authorized Admins
            </p>
          </div>
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
            <Users className="w-5 h-5" />
          </div>
        </div>
        
        {/* Coupons Summary Card */}
        <div className="bg-white dark:bg-charcoal-900 p-6 rounded-2xl border border-charcoal-200 dark:border-gold-900/10 flex items-center justify-between">
          <div>
            <p className="text-charcoal-400 dark:text-gold-400/40 text-[10px] uppercase font-mono tracking-wider mb-1">Coupon Activity</p>
            <p className="text-sm font-serif dark:text-white">
              {totalCouponUses} Uses / {totalCoupons} Coupons
            </p>
          </div>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Tag className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Chart */}
        <div className="bg-white dark:bg-charcoal-900 p-6 rounded-2xl border border-charcoal-200 dark:border-gold-900/10 lg:col-span-2 flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-serif dark:text-white">Revenue Performance</h3>
            <p className="text-xs text-charcoal-400 uppercase font-mono">Dynamic Real-Time Data Only</p>
          </div>
          <div className="flex-1 min-h-0">
            {salesOverviewData.length === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-charcoal-400 font-mono text-xs">
                <ShoppingBag className="w-12 h-12 text-charcoal-200 mb-2" />
                No completed orders registered in database.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesOverviewData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C5A059" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} prefix="$" />
                  <Tooltip />
                  <Area type="monotone" dataKey="sales" stroke="#C5A059" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category Distribution Chart */}
        <div className="bg-white dark:bg-charcoal-900 p-6 rounded-2xl border border-charcoal-200 dark:border-gold-900/10 flex flex-col h-[400px]">
          <div className="mb-4">
            <h3 className="text-lg font-serif dark:text-white">Vault Category Share</h3>
            <p className="text-xs text-charcoal-400 font-mono mt-1">Total stock distribution</p>
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            {categoryDistributionData.length === 0 ? (
              <div className="text-xs font-mono text-charcoal-400 text-center">
                No inventory categories found.
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Visual Legend Inside the Card */}
                <div className="absolute bottom-2 flex justify-center gap-4 w-full">
                  {categoryDistributionData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-1.5 text-[10px] font-mono">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-charcoal-600 dark:text-gold-300">{entry.name} ({entry.value})</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Recent Activities Section */}
      <div className="bg-white dark:bg-charcoal-900 p-8 rounded-2xl border border-charcoal-200 dark:border-gold-900/10">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-4 h-4 text-gold-luxe" />
          <h3 className="text-lg font-serif dark:text-white">Boutique Live Activity Log</h3>
        </div>
        {recentActivities.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-charcoal-400">
            Waiting for live transactions...
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-center justify-between p-4 rounded-xl bg-charcoal-50 dark:bg-charcoal-950 border border-charcoal-100 dark:border-gold-900/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold-luxe/10 flex items-center justify-center text-gold-luxe text-xs font-serif font-bold">
                    LX
                  </div>
                  <div>
                    <p className="text-xs font-medium text-charcoal-900 dark:text-white">{activity.title}</p>
                    <p className="text-[10px] text-charcoal-500 mt-0.5">{activity.desc}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className="text-[10px] font-mono text-charcoal-400">{activity.time}</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-mono ${
                    activity.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                    activity.status === 'Cancelled' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
