import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Package, ShoppingCart, Users, UserCheck, BarChart3, Box, Settings, LogOut, Shield, X, Tag, ShieldCheck, Mail } from 'lucide-react';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const AdminSidebar: React.FC<Props> = ({ activeTab, setActiveTab, isMobileOpen, onMobileClose }) => {
  const { t } = useApp();
  const { user, logout } = useAuth();
  
  const items = [
    { id: 'overview', icon: LayoutDashboard },
    { id: 'manageProducts', icon: Package },
    { id: 'manageOrders', icon: ShoppingCart },
    { id: 'manageCustomers', icon: Users },
    { id: 'manageUsers', icon: UserCheck },
    { id: 'certificates', icon: ShieldCheck },
    { id: 'analytics', icon: BarChart3 },
    { id: 'inventory', icon: Box },
    { id: 'coupons', icon: Tag },
    { id: 'newsletter', icon: Mail },
    { id: 'settings', icon: Settings },
  ];

  if (user?.role === 'superadmin') {
    items.push({ id: 'adminManagement', icon: Shield });
  }

  const sidebarContent = (isCollapsed = false) => (
    <div className="h-full flex flex-col justify-between p-6 bg-white dark:bg-charcoal-900 overflow-y-auto">
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className={`font-serif text-charcoal-900 dark:text-gold-100 ${isCollapsed ? 'text-sm text-center truncate' : 'text-xl'}`}>
              {isCollapsed ? 'LX' : t.appName}
            </h2>
            {!isCollapsed && (
              <span className="text-[9px] font-mono tracking-widest text-gold-600 uppercase">
                {user?.role === 'superadmin' ? 'Grand Curator' : 'Curator Portal'}
              </span>
            )}
          </div>
          {onMobileClose && (
            <button onClick={onMobileClose} className="md:hidden p-1.5 text-charcoal-500 hover:text-charcoal-900 dark:text-gold-300">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <nav className="space-y-2">
          {items.map(item => {
            const Icon = item.icon;
            const label = item.id === 'adminManagement' ? 'Curators' : (t[item.id as keyof typeof t] || item.id);
            return (
              <button 
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onMobileClose) onMobileClose();
                }}
                title={isCollapsed ? label : undefined}
                className={`flex items-center gap-3 w-full p-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all min-h-[44px] ${
                  activeTab === item.id 
                    ? 'bg-gold-luxe/15 text-gold-luxe border border-gold-luxe/25' 
                    : 'text-charcoal-600 dark:text-gold-400/60 border border-transparent hover:bg-charcoal-100 dark:hover:bg-charcoal-800'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <Icon className="w-4 h-4 text-gold-luxe/80 flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{label}</span>}
              </button>
            );
          })}
        </nav>
      </div>
      <button 
        onClick={() => logout()}
        title={isCollapsed ? t.logout : undefined}
        className={`flex items-center gap-3 text-rose-500 text-xs font-semibold uppercase tracking-wider p-3 w-full hover:bg-rose-500/10 rounded-xl transition-all min-h-[44px] ${isCollapsed ? 'justify-center' : ''}`}
      >
        <LogOut className="w-4 h-4 flex-shrink-0" /> {!isCollapsed && <span>{t.logout}</span>}
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-64 border-r border-charcoal-200 dark:border-gold-900/10 h-screen sticky top-0 flex-shrink-0">
        {sidebarContent(false)}
      </aside>

      {/* Tablet Collapsible Sidebar */}
      <aside className="hidden md:block lg:hidden w-20 border-r border-charcoal-200 dark:border-gold-900/10 h-screen sticky top-0 flex-shrink-0">
        {sidebarContent(true)}
      </aside>

      {/* Mobile Slide-out Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onMobileClose} />
          <div className="relative w-72 bg-white dark:bg-charcoal-900 h-full shadow-2xl z-10 flex flex-col">
            {sidebarContent(false)}
          </div>
        </div>
      )}
    </>
  );
};
