import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Shield, User, Mail, ChevronDown } from 'lucide-react';

export const AdminUserManagement: React.FC = () => {
  const { users, updateUserRole } = useAuth();
  const { language } = useApp();
  const isRtl = language === 'ar';

  const handleRoleToggle = (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    updateUserRole(userId, newRole);
  };

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <div>
        <h2 className="text-2xl font-serif text-charcoal-900 dark:text-white">
          {isRtl ? 'إدارة المستخدمين' : 'User Role Management'}
        </h2>
        <p className="text-xs text-charcoal-500 dark:text-gold-400/60 mt-1">
          {isRtl ? 'تحكم في صلاحيات المستخدمين وتغيير أدوارهم.' : 'Manage user roles and administrative access.'}
        </p>
      </div>

      <div className="bg-white dark:bg-charcoal-900 rounded-2xl border border-charcoal-200 dark:border-gold-900/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right">
            <thead className="bg-charcoal-50 dark:bg-charcoal-950 border-b border-charcoal-100 dark:border-gold-900/10 text-[10px] uppercase tracking-wider text-charcoal-500 dark:text-gold-400/60 font-mono">
              <tr>
                <th className="py-4 px-6">{isRtl ? 'المستخدم' : 'User'}</th>
                <th className="py-4 px-6">{isRtl ? 'البريد الإلكتروني' : 'Email'}</th>
                <th className="py-4 px-6">{isRtl ? 'الدور الحالي' : 'Current Role'}</th>
                <th className="py-4 px-6 text-right rtl:text-left">{isRtl ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100 dark:divide-gold-900/10 text-xs text-charcoal-700 dark:text-gold-100/90">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-charcoal-50/50 dark:hover:bg-charcoal-800/20 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold-400/10 text-gold-luxe border border-gold-luxe/25 flex items-center justify-center font-serif text-sm">
                        {user.name?.[0] || 'U'}
                      </div>
                      <span className="font-serif font-medium text-charcoal-900 dark:text-white">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-charcoal-500 dark:text-gold-400/60">{user.email}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] uppercase font-mono tracking-wider border ${
                      user.role === 'admin' || user.role === 'superadmin'
                        ? 'bg-gold-luxe/10 text-gold-luxe border-gold-luxe/20'
                        : 'bg-charcoal-100 text-charcoal-600 border-charcoal-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right rtl:text-left">
                    {user.role !== 'superadmin' && (
                      <button
                        onClick={() => handleRoleToggle(user.id, user.role)}
                        className="text-[10px] uppercase tracking-wider font-mono px-3 py-1.5 rounded-lg border border-charcoal-200 dark:border-gold-900/20 hover:bg-gold-luxe/10 transition-all text-charcoal-600 dark:text-gold-400"
                      >
                        {user.role === 'admin' ? (isRtl ? 'إلغاء الإدارة' : 'Make User') : (isRtl ? 'تعيين كمدير' : 'Make Admin')}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
