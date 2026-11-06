import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Shield, ShieldAlert, Plus, Trash2, Check, X, ShieldCheck, UserCheck, Mail, Lock } from 'lucide-react';
import { User } from '../../types';

export const AdminManagement: React.FC = () => {
  const { user, users, addAdmin, removeAdmin, updateAdminPermissions } = useAuth();
  const { language } = useApp();
  const isRtl = language === 'ar';

  // State for Admin creation form modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'admin' | 'superadmin'>('admin');
  const [newPermissions, setNewPermissions] = useState({
    canAddAdmins: false,
    canRemoveAdmins: false,
    canChangePermissions: false,
    canManageInventory: true
  });

  // State for inline permission editing
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);

  // Security guard check
  if (user?.role !== 'superadmin') {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-gold-900/10 rounded-3xl shadow-xl max-w-lg mx-auto">
        <ShieldAlert className="w-16 h-16 text-rose-500 mb-6 animate-pulse" />
        <h2 className="text-xl font-serif text-charcoal-900 dark:text-gold-100 uppercase tracking-widest mb-3">
          {isRtl ? 'صلاحيات غير كافية' : 'Insufficient Privilege'}
        </h2>
        <p className="text-xs text-charcoal-500 dark:text-gold-400/60 leading-relaxed max-w-sm">
          {isRtl 
            ? 'هذه المنطقة مخصصة حصرياً لكبار المشرفين (Grand Curators). لا يملك حسابك الحالي الصلاحية لعرض هذه الإعدادات.' 
            : 'This sacred vault is restricted strictly to Grand Curators (Super Admins). Your current curatorial status does not authorize viewing.'}
        </p>
      </div>
    );
  }

  // Filter to show only administrative staff (admin and superadmin)
  const adminUsers = users.filter(u => u.role === 'admin' || u.role === 'superadmin');

  const handleAddAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName || !newAdminEmail) return;

    // Call context to persist
    addAdmin(newAdminName, newAdminEmail, newAdminRole, {
      ...newPermissions,
      // If superadmin, force true permissions
      canAddAdmins: newAdminRole === 'superadmin' ? true : newPermissions.canAddAdmins,
      canRemoveAdmins: newAdminRole === 'superadmin' ? true : newPermissions.canRemoveAdmins,
      canChangePermissions: newAdminRole === 'superadmin' ? true : newPermissions.canChangePermissions,
    });

    // Reset state and close modal
    setNewAdminName('');
    setNewAdminEmail('');
    setNewAdminRole('admin');
    setNewPermissions({
      canAddAdmins: false,
      canRemoveAdmins: false,
      canChangePermissions: false,
      canManageInventory: true
    });
    setShowAddModal(false);
  };

  const handleTogglePermission = (adminId: string, permKey: keyof NonNullable<User['permissions']>) => {
    const adminToEdit = users.find(u => u.id === adminId);
    if (!adminToEdit) return;

    const currentPerms = adminToEdit.permissions || {
      canAddAdmins: false,
      canRemoveAdmins: false,
      canChangePermissions: false,
      canManageInventory: true
    };

    updateAdminPermissions(adminId, {
      ...currentPerms,
      [permKey]: !currentPerms[permKey]
    });
  };

  return (
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-charcoal-900 p-8 border border-charcoal-200 dark:border-gold-900/10 rounded-3xl shadow-sm">
        <div>
          <h2 className="text-xl font-serif text-charcoal-900 dark:text-gold-100 uppercase tracking-widest">
            {isRtl ? 'إدارة المشرفين والمديرين' : 'Curator & Admin Registry'}
          </h2>
          <p className="text-xs text-charcoal-500 dark:text-gold-400/60 mt-1">
            {isRtl 
              ? 'بصفتك كبير المشرفين، يمكنك إضافة وتعديل وسحب الصلاحيات من طاقم الإشراف.' 
              : 'As a Grand Curator, authorize or revoke administrative privileges for the House of Luxora.'}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-luxe text-charcoal-950 font-semibold text-xs tracking-widest uppercase rounded-xl hover:opacity-95 active:scale-98 transition-all shadow-md self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>{isRtl ? 'تعيين مدير جديد' : 'Authorize Curator'}</span>
        </button>
      </div>

      {/* Staff Registry Grid / Table */}
      <div className="bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-gold-900/10 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-charcoal-100 dark:border-gold-900/10 bg-charcoal-50/50 dark:bg-charcoal-950/20">
          <span className="text-[10px] font-mono uppercase tracking-widest text-gold-600 dark:text-gold-400/80 font-bold">
            {isRtl ? `المدراء المصرح لهم (${adminUsers.length})` : `Authorized Curators (${adminUsers.length})`}
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-charcoal-100 dark:border-gold-900/10 text-[10px] font-mono uppercase text-charcoal-500 dark:text-gold-400/40">
                <th className="p-6">{isRtl ? 'المشرف' : 'Curator'}</th>
                <th className="p-6">{isRtl ? 'الرتبة' : 'Role'}</th>
                <th className="p-6">{isRtl ? 'الصلاحيات' : 'Privileges'}</th>
                <th className="p-6 text-center">{isRtl ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100 dark:divide-gold-900/5">
              {adminUsers.map(admin => {
                const isMe = admin.id === user.id;
                const isSuper = admin.role === 'superadmin';
                const perms = admin.permissions || {
                  canAddAdmins: false,
                  canRemoveAdmins: false,
                  canChangePermissions: false,
                  canManageInventory: false
                };

                return (
                  <tr key={admin.id} className="hover:bg-charcoal-50/30 dark:hover:bg-charcoal-800/10 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-serif text-sm font-bold border ${
                          isSuper 
                            ? 'bg-gold-luxe/15 border-gold-luxe text-gold-700 dark:text-gold-300' 
                            : 'bg-charcoal-100 border-charcoal-200 dark:bg-charcoal-800 dark:border-gold-900/20 text-charcoal-700 dark:text-gold-300'
                        }`}>
                          {admin.name?.charAt(0).toUpperCase() || 'C'}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-charcoal-900 dark:text-gold-100 flex items-center gap-1.5">
                            {admin.name} {isMe && <span className="text-[9px] bg-gold-luxe/20 text-gold-700 dark:text-gold-300 px-2 py-0.5 rounded-full font-mono font-medium">YOU</span>}
                          </div>
                          <div className="text-[10px] font-mono text-charcoal-500 dark:text-gold-400/60 mt-0.5 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-gold-luxe/50" />
                            <span>{admin.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider border ${
                        isSuper 
                          ? 'bg-gold-luxe/10 border-gold-luxe/35 text-gold-700 dark:text-gold-300' 
                          : 'bg-charcoal-50 border-charcoal-200 dark:bg-charcoal-800/40 dark:border-gold-900/10 text-charcoal-600 dark:text-gold-400/60'
                      }`}>
                        <Shield className="w-3 h-3" />
                        {isSuper ? (isRtl ? 'مشرف أعلى' : 'Grand Curator') : (isRtl ? 'مدير' : 'Curator')}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-wrap gap-2">
                        {/* Add Admins Permission */}
                        <button
                          disabled={isMe || isSuper}
                          onClick={() => handleTogglePermission(admin.id, 'canAddAdmins')}
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-mono font-medium border transition-all flex items-center gap-1 ${
                            perms.canAddAdmins
                              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400'
                              : 'bg-charcoal-50 dark:bg-charcoal-800/40 border-charcoal-200 dark:border-gold-900/5 text-charcoal-400 dark:text-gold-400/20'
                          } ${(!isMe && !isSuper) ? 'hover:scale-105 active:scale-98' : 'cursor-not-allowed'}`}
                        >
                          <Check className={`w-2.5 h-2.5 ${perms.canAddAdmins ? 'opacity-100' : 'opacity-30'}`} />
                          <span>{isRtl ? 'إضافة مشرفين' : 'Add Staff'}</span>
                        </button>

                        {/* Remove Admins Permission */}
                        <button
                          disabled={isMe || isSuper}
                          onClick={() => handleTogglePermission(admin.id, 'canRemoveAdmins')}
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-mono font-medium border transition-all flex items-center gap-1 ${
                            perms.canRemoveAdmins
                              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400'
                              : 'bg-charcoal-50 dark:bg-charcoal-800/40 border-charcoal-200 dark:border-gold-900/5 text-charcoal-400 dark:text-gold-400/20'
                          } ${(!isMe && !isSuper) ? 'hover:scale-105 active:scale-98' : 'cursor-not-allowed'}`}
                        >
                          <Check className={`w-2.5 h-2.5 ${perms.canRemoveAdmins ? 'opacity-100' : 'opacity-30'}`} />
                          <span>{isRtl ? 'سحب صلاحيات' : 'Revoke Staff'}</span>
                        </button>

                        {/* Change Permissions Permission */}
                        <button
                          disabled={isMe || isSuper}
                          onClick={() => handleTogglePermission(admin.id, 'canChangePermissions')}
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-mono font-medium border transition-all flex items-center gap-1 ${
                            perms.canChangePermissions
                              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400'
                              : 'bg-charcoal-50 dark:bg-charcoal-800/40 border-charcoal-200 dark:border-gold-900/5 text-charcoal-400 dark:text-gold-400/20'
                          } ${(!isMe && !isSuper) ? 'hover:scale-105 active:scale-98' : 'cursor-not-allowed'}`}
                        >
                          <Check className={`w-2.5 h-2.5 ${perms.canChangePermissions ? 'opacity-100' : 'opacity-30'}`} />
                          <span>{isRtl ? 'تعديل الأذونات' : 'Manage Perms'}</span>
                        </button>

                        {/* Manage Inventory Permission */}
                        <button
                          disabled={isMe || isSuper}
                          onClick={() => handleTogglePermission(admin.id, 'canManageInventory')}
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-mono font-medium border transition-all flex items-center gap-1 ${
                            perms.canManageInventory
                              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400'
                              : 'bg-charcoal-50 dark:bg-charcoal-800/40 border-charcoal-200 dark:border-gold-900/5 text-charcoal-400 dark:text-gold-400/20'
                          } ${(!isMe && !isSuper) ? 'hover:scale-105 active:scale-98' : 'cursor-not-allowed'}`}
                        >
                          <Check className={`w-2.5 h-2.5 ${perms.canManageInventory ? 'opacity-100' : 'opacity-30'}`} />
                          <span>{isRtl ? 'المخزون' : 'Inventory'}</span>
                        </button>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <button
                        onClick={() => removeAdmin(admin.id)}
                        disabled={isMe || admin.id === 'usr_super'}
                        className={`p-2 rounded-xl border text-rose-500 transition-all ${
                          (isMe || admin.id === 'usr_super')
                            ? 'opacity-30 cursor-not-allowed border-transparent'
                            : 'border-charcoal-100 dark:border-gold-900/5 bg-transparent hover:bg-rose-500/10 hover:border-rose-500/30 active:scale-95'
                        }`}
                        title={isRtl ? 'إلغاء التعيين وسحب صلاحيات الدخول' : 'Revoke administrative credentials'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Authorize Curator Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-charcoal-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-gold-900/15 w-full max-w-lg rounded-3xl p-8 relative shadow-2xl animate-in fade-in zoom-in duration-350">
            {/* Close Button */}
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full border border-charcoal-100 dark:border-gold-900/10 text-charcoal-500 dark:text-gold-400/60 hover:border-gold-luxe hover:text-gold-luxe transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Title */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gold-luxe/15 border border-gold-luxe flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-gold-luxe" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-charcoal-900 dark:text-gold-100 uppercase tracking-wider">
                  {isRtl ? 'تفويض مدير جديد' : 'Authorize New Curator'}
                </h3>
                <p className="text-[10px] text-charcoal-500 dark:text-gold-400/60 font-mono uppercase tracking-wider mt-0.5">
                  {isRtl ? 'لوكسورا هيريتيج' : 'LUXORA HERITAGE SECURITY'}
                </p>
              </div>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddAdminSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono uppercase text-charcoal-500 dark:text-gold-400/60 tracking-wider">
                  {isRtl ? 'اسم المشرف' : 'Curator Noble Name'}
                </label>
                <div className="relative">
                  <UserCheck className="absolute left-3.5 top-3.5 w-4 h-4 text-gold-luxe/50" />
                  <input
                    type="text"
                    required
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    placeholder={isRtl ? 'مثال: فيكتوريا غريس' : 'e.g., Lord Wellington'}
                    className="w-full pl-11 pr-4 py-3 bg-charcoal-50 dark:bg-charcoal-950/40 border border-charcoal-200 dark:border-gold-900/10 rounded-xl text-xs dark:text-gold-100 placeholder-charcoal-400 focus:outline-none focus:border-gold-luxe/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono uppercase text-charcoal-500 dark:text-gold-400/60 tracking-wider">
                  {isRtl ? 'البريد الإلكتروني' : 'Secure Email Address'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gold-luxe/50" />
                  <input
                    type="email"
                    required
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="name@luxora.com"
                    className="w-full pl-11 pr-4 py-3 bg-charcoal-50 dark:bg-charcoal-950/40 border border-charcoal-200 dark:border-gold-900/10 rounded-xl text-xs dark:text-gold-100 placeholder-charcoal-400 focus:outline-none focus:border-gold-luxe/50"
                  />
                </div>
              </div>

              {/* Role Switch */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono uppercase text-charcoal-500 dark:text-gold-400/60 tracking-wider">
                  {isRtl ? 'الرتبة الإشرافية' : 'Curator Hierarchy'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewAdminRole('admin')}
                    className={`py-2.5 rounded-xl border text-xs font-semibold tracking-wide transition-all ${
                      newAdminRole === 'admin'
                        ? 'bg-gold-luxe/15 border-gold-luxe text-gold-700 dark:text-gold-300'
                        : 'border-charcoal-200 dark:border-gold-900/10 bg-transparent hover:border-gold-luxe/40 text-charcoal-500 dark:text-gold-400/60'
                    }`}
                  >
                    {isRtl ? 'مدير عادي (Curator)' : 'Curator'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewAdminRole('superadmin')}
                    className={`py-2.5 rounded-xl border text-xs font-semibold tracking-wide transition-all ${
                      newAdminRole === 'superadmin'
                        ? 'bg-gold-luxe/15 border-gold-luxe text-gold-700 dark:text-gold-300'
                        : 'border-charcoal-200 dark:border-gold-900/10 bg-transparent hover:border-gold-luxe/40 text-charcoal-500 dark:text-gold-400/60'
                    }`}
                  >
                    {isRtl ? 'مدير أعلى (Grand Curator)' : 'Grand Curator'}
                  </button>
                </div>
              </div>

              {/* Permissions list (Only relevant for regular Admin since superadmin gets everything) */}
              {newAdminRole === 'admin' && (
                <div className="p-4 bg-charcoal-50 dark:bg-charcoal-950/40 border border-charcoal-200 dark:border-gold-900/10 rounded-2xl space-y-3">
                  <span className="block text-[10px] font-mono uppercase text-gold-600 dark:text-gold-400/60 tracking-wider">
                    {isRtl ? 'تخصيص صلاحيات البوابة' : 'Assign Port Privileges'}
                  </span>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newPermissions.canAddAdmins}
                        onChange={(e) => setNewPermissions({ ...newPermissions, canAddAdmins: e.target.checked })}
                        className="w-4 h-4 rounded text-gold-500 focus:ring-gold-500/20 border-charcoal-300 bg-transparent"
                      />
                      <span className="text-xs text-charcoal-600 dark:text-gold-400/80">
                        {isRtl ? 'السماح بإضافة مديرين جدد' : 'Authorize adding other Curators'}
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newPermissions.canRemoveAdmins}
                        onChange={(e) => setNewPermissions({ ...newPermissions, canRemoveAdmins: e.target.checked })}
                        className="w-4 h-4 rounded text-gold-500 focus:ring-gold-500/20 border-charcoal-300 bg-transparent"
                      />
                      <span className="text-xs text-charcoal-600 dark:text-gold-400/80">
                        {isRtl ? 'السماح بإلغاء وإقالة المديرين' : 'Authorize revoking other Curators'}
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newPermissions.canChangePermissions}
                        onChange={(e) => setNewPermissions({ ...newPermissions, canChangePermissions: e.target.checked })}
                        className="w-4 h-4 rounded text-gold-500 focus:ring-gold-500/20 border-charcoal-300 bg-transparent"
                      />
                      <span className="text-xs text-charcoal-600 dark:text-gold-400/80">
                        {isRtl ? 'السماح بتعديل الصلاحيات' : 'Authorize tweaking permissions'}
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newPermissions.canManageInventory}
                        onChange={(e) => setNewPermissions({ ...newPermissions, canManageInventory: e.target.checked })}
                        className="w-4 h-4 rounded text-gold-500 focus:ring-gold-500/20 border-charcoal-300 bg-transparent"
                      />
                      <span className="text-xs text-charcoal-600 dark:text-gold-400/80">
                        {isRtl ? 'السماح بمطابقة المخزون والتعديل' : 'Authorize full inventory control'}
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {newAdminRole === 'superadmin' && (
                <div className="p-4 bg-gold-luxe/10 border border-gold-luxe/20 rounded-2xl flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-gold-luxe mt-0.5 shrink-0" />
                  <p className="text-xs text-gold-800 dark:text-gold-200 leading-relaxed">
                    {isRtl 
                      ? 'سينال المشرف الأعلى (Grand Curator) كامل الصلاحيات تلقائياً، بما في ذلك التحكم بالمديرين الآخرين وجميع أقسام لوحة التحكم.' 
                      : 'Grand Curators inherit comprehensive administrative control unconditionally, including admin manipulation and complete dashboard mastery.'}
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-transparent border border-charcoal-200 dark:border-gold-900/10 text-charcoal-600 dark:text-gold-400/60 font-semibold text-xs tracking-widest uppercase rounded-xl hover:bg-charcoal-100 dark:hover:bg-charcoal-800 transition-all"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-gold-500 to-gold-luxe text-charcoal-950 font-semibold text-xs tracking-widest uppercase rounded-xl hover:opacity-95 active:scale-98 transition-all shadow-lg"
                >
                  {isRtl ? 'إرسال التفويض' : 'Issue Mandate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
