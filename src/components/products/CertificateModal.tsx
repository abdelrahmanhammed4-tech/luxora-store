import React from 'react';
import { X, Download, ShieldCheck } from 'lucide-react';
import jsPDF from 'jspdf';
import { Order } from '../../types';

interface Props {
  order: Order;
  onClose: () => void;
}

export const CertificateModal: React.FC<Props> = ({ order, onClose }) => {
    if (!order.certificate) {
      return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-gold-900/15 p-8 rounded-3xl w-full max-w-sm shadow-2xl space-y-6">
            <h3 className="text-xl font-serif text-charcoal-900 dark:text-white">Certificate</h3>
            <p className="text-sm text-charcoal-500 dark:text-gold-400/60">This order has no issued certificate.</p>
            <button onClick={onClose} className="w-full py-3 border border-charcoal-200 dark:border-gold-900/20 rounded-xl text-xs font-semibold uppercase tracking-widest text-charcoal-600 dark:text-gold-300">Close</button>
          </div>
        </div>
      );
    }

    const downloadPDF = () => {
      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.text(`LUXORA - Certificate of Authenticity`, 20, 20);
      doc.setFont("helvetica", "normal");
      doc.text(`Certificate ID: ${order.certificate?.certificateId}`, 20, 30);
      doc.text(`Order ID: ${order.id}`, 20, 40);
      doc.text(`Customer: ${order.customerName}`, 20, 50);
      doc.text(`Verification Code: ${order.certificate?.verificationCode}`, 20, 60);
      doc.save(`Luxora-Certificate-${order.certificate?.certificateId}.pdf`);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-gold-900/15 p-8 rounded-3xl w-full max-w-lg shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-charcoal-100 dark:border-gold-900/10">
              <h3 className="text-xl font-serif text-charcoal-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gold-luxe" />
                Digital Certificate
              </h3>
              <button onClick={onClose} className="p-1 hover:text-rose-500 transition-colors dark:text-gold-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm text-charcoal-700 dark:text-gold-400/80">
                <div className="flex gap-4 items-center mb-4">
                  <img src={order.originalProducts?.[0]?.image || 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=600'} alt={order.originalProducts?.[0]?.nameEn || 'Product'} className="w-16 h-16 rounded-lg object-cover" />
                  <div>
                    <p><strong>Product:</strong> {order.originalProducts?.[0]?.nameEn || 'N/A'}</p>
                    <p><strong>Quantity:</strong> {order.originalProducts?.[0]?.quantity || 'N/A'}</p>
                  </div>
                </div>
                <p><strong>Certificate ID:</strong> {order.certificate.certificateId}</p>
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Customer:</strong> {order.customerName}</p>
                <p><strong>Verification Code:</strong> {order.certificate.verificationCode}</p>
                <p><strong>Issued At:</strong> {new Date(order.certificate.issuedAt).toLocaleDateString()}</p>
                <p><strong>Status:</strong> Authenticated</p>
            </div>
            <div className="flex gap-4">
              <button onClick={downloadPDF} className="flex-1 py-3 bg-gold-luxe hover:bg-gold-500 text-charcoal-950 rounded-xl text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Download PDF
              </button>
              <button onClick={onClose} className="flex-1 py-3 border border-charcoal-200 dark:border-gold-900/20 rounded-xl text-xs font-semibold uppercase tracking-widest text-charcoal-600 dark:text-gold-300">Close</button>
            </div>
          </div>
        </div>
    );
};
