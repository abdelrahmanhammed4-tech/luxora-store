import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useApp } from '../../context/AppContext';
import { Search, Eye, FileText, Trash2 } from 'lucide-react';
import { CertificateModal } from '../products/CertificateModal';

export const AdminCertificates: React.FC = () => {
  const { orders, isLoading, removeCertificate } = useAdmin();
  const { language, t } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'issued' | 'notIssued'>('all');
  const [selectedCert, setSelectedCert] = useState<any>(null);
  const [orderForPdf, setOrderForPdf] = useState<any>(null);
  const isRtl = language === 'ar';

  if (isLoading) return <div className="text-white">Loading...</div>;

  const certificates = orders.filter(o => o.certificate).map(o => ({
    ...o.certificate!,
    orderId: o.id,
    customerName: o.customerName,
    productName: o.originalProducts && o.originalProducts.length > 0 ? o.originalProducts[0]?.nameEn : 'N/A',
    // We need the full order object for the CertificateModal
    fullOrder: o 
  }));

  const filtered = certificates.filter(c => {
    const matchesSearch = c.orderId.toLowerCase().includes(search.toLowerCase()) || 
                          c.certificateId.toLowerCase().includes(search.toLowerCase()) || 
                          c.customerName.toLowerCase().includes(search.toLowerCase());
    
    let matchesFilter = true;
    if (filter === 'issued') matchesFilter = c.issued;
    if (filter === 'notIssued') matchesFilter = !c.issued;
    
    return matchesSearch && matchesFilter;
  });

  // const handleDelete = async (orderId: string) => {
  //   console.log("💎 [AdminCertificates] handleDelete called for orderId:", orderId);
  //   if (confirm('Are you sure you want to remove this certificate?')) {
  //     try {
  //       console.log("💎 [AdminCertificates] Confirmed removal, calling removeCertificate...");
  //       await removeCertificate(orderId);
  //       console.log("💎 [AdminCertificates] Successfully called removeCertificate");
  //     } catch (err) {
  //       alert('Failed to remove certificate');
  //       console.error("💎 [AdminCertificates] Error removing certificate:", err);
  //     }
  //   } else {
  //     console.log("💎 [AdminCertificates] Removal cancelled by user");
  //   }
  // };

  const handleDelete = async (orderId: string) => {
  console.log("💎 [AdminCertificates] handleDelete called for orderId:", orderId);

  try {
    await removeCertificate(orderId);
    console.log("💎 [AdminCertificates] Certificate removed successfully");
  } catch (err) {
    console.error("💎 [AdminCertificates] Error removing certificate:", err);
    alert("Failed to remove certificate");
  }
};

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif text-charcoal-900 dark:text-white">
            {isRtl ? 'شهادات الأصالة' : 'Certificates of Authenticity'}
          </h2>
          <p className="text-xs text-charcoal-500 dark:text-gold-400/60 mt-1 font-mono uppercase tracking-wider">
            {certificates.length} {isRtl ? 'شهادة صادرة' : 'CERTIFICATES ISSUED'}
          </p>
        </div>
      </div>
      
      {/* ... (keep header and stats grid same) */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-charcoal-900 p-6 rounded-2xl border border-charcoal-200 dark:border-gold-900/10">
          <p className="text-[10px] text-charcoal-500 uppercase font-mono tracking-widest">{isRtl ? 'إجمالي الشهادات' : 'Total Certificates'}</p>
          <p className="text-2xl font-serif mt-2">{certificates.length}</p>
        </div>
        <div className="bg-white dark:bg-charcoal-900 p-6 rounded-2xl border border-charcoal-200 dark:border-gold-900/10">
          <p className="text-[10px] text-charcoal-500 uppercase font-mono tracking-widest">{isRtl ? 'صادرة اليوم' : 'Issued Today'}</p>
          <p className="text-2xl font-serif mt-2">
            {certificates.filter(c => c.issuedAt.startsWith(new Date().toISOString().split('T')[0])).length}
          </p>
        </div>
        <div className="bg-white dark:bg-charcoal-900 p-6 rounded-2xl border border-charcoal-200 dark:border-gold-900/10">
          <p className="text-[10px] text-charcoal-500 uppercase font-mono tracking-widest">{isRtl ? 'إجمالي التنزيلات' : 'Total Downloads'}</p>
          <p className="text-2xl font-serif mt-2">{certificates.filter(c => c.pdfGenerated).length}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-charcoal-900 rounded-2xl border border-charcoal-200 dark:border-gold-900/10 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-charcoal-100 dark:border-gold-900/10 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
                <input 
                    type="text"
                    placeholder={isRtl ? 'بحث...' : 'Search ID or Customer...'}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-charcoal-50 dark:bg-charcoal-950 border border-charcoal-200 dark:border-gold-900/10 focus:outline-none focus:border-gold-luxe transition-all dark:text-white"
                />
            </div>
            <div className="flex gap-2">
                {(['all', 'issued', 'notIssued'] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-[11px] uppercase tracking-wider border transition-all ${filter === f ? 'bg-gold-luxe text-charcoal-950' : 'border-charcoal-200'}`}>
                        {f}
                    </button>
                ))}
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-charcoal-50 dark:bg-charcoal-950 text-[10px] uppercase text-charcoal-500 font-mono">
              <tr>
                <th className="py-4 px-6">Certificate ID</th>
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-6">Issue Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Verification</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100 dark:divide-gold-900/10 text-xs text-charcoal-700 dark:text-white">
                {filtered.map(c => (
                    <tr key={c.certificateId} className="hover:bg-charcoal-50/50 transition-colors">
                        <td className="py-4 px-6 font-mono font-semibold text-gold-luxe">{c.certificateId}</td>
                        <td className="py-4 px-6">{c.orderId}</td>
                        <td className="py-4 px-6">{c.customerName}</td>
                        <td className="py-4 px-6">{c.productName}</td>
                        <td className="py-4 px-6">{new Date(c.issuedAt).toLocaleDateString()}</td>
                        <td className="py-4 px-6">{c.issued ? 'Issued' : 'Pending'}</td>
                        <td className="py-4 px-6 font-mono">{c.verificationCode}</td>
                        <td className="py-4 px-6 text-right">
                            <button onClick={() => setSelectedCert(c)} className="p-2 text-charcoal-400 hover:text-gold-luxe"><Eye className="w-4 h-4" /></button>
                            <button onClick={() => setOrderForPdf(c.fullOrder)} className="p-2 text-charcoal-400 hover:text-gold-luxe"><FileText className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(c.orderId)} className="p-2 text-charcoal-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </td>
                    </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Simple Details Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedCert(null)}>
            <div className="bg-white dark:bg-charcoal-900 p-8 rounded-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-serif mb-4">Certificate Details</h3>
                <pre className="text-xs bg-charcoal-50 dark:bg-charcoal-950 p-4 rounded-lg overflow-auto">
                    {JSON.stringify(selectedCert, null, 2)}
                </pre>
                <button onClick={() => setSelectedCert(null)} className="mt-4 w-full bg-gold-luxe py-2 rounded-xl">Close</button>
            </div>
        </div>
      )}
      
      {/* PDF Modal */}
      {orderForPdf && (
        <CertificateModal order={orderForPdf} onClose={() => setOrderForPdf(null)} />
      )}
    </div>
  );
};
