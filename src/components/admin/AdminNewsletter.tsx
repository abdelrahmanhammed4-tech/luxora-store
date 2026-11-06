import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Search, Download, Users } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { useToast } from '../../context/ToastContext';

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: any;
}

export const AdminNewsletter: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'newsletter'), orderBy('subscribedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Subscriber[];
      setSubscribers(subs);
      setIsLoading(false);
    }, (err) => {
      console.error(err);
      addToast('Failed to load subscribers.', 'error');
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [addToast]);

  const handleDelete = async (id: string) => {
    // if (!confirm('Are you sure you want to delete this subscriber?')) return;
    try {
      await deleteDoc(doc(db, 'newsletter', id));
      addToast('Subscriber deleted successfully.', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to delete subscriber.', 'error');
    }
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Subscribed At\n"
      + subscribers.map(s => `${s.email},${s.subscribedAt?.toDate().toLocaleString()}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = subscribers.filter(s => s.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-charcoal-900 dark:text-white">Newsletter</h2>
          <p className="text-xs text-charcoal-500 dark:text-gold-400/60 mt-1">Manage your newsletter subscribers.</p>
        </div>
        <div className="text-xs font-mono text-charcoal-400 uppercase tracking-widest bg-charcoal-50 dark:bg-charcoal-950 px-3 py-1.5 rounded-lg border border-charcoal-100 dark:border-gold-900/10">
          {subscribers.length} Subscribers
        </div>
      </div>

      <div className="flex gap-4 items-center bg-white dark:bg-charcoal-900 p-4 rounded-2xl border border-charcoal-200 dark:border-gold-900/10">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
          <input 
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-charcoal-50 dark:bg-charcoal-950 border border-charcoal-200 dark:border-gold-900/10 focus:outline-none focus:border-gold-luxe transition-all dark:text-white"
          />
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 text-xs rounded-xl bg-charcoal-50 dark:bg-charcoal-950 border border-charcoal-200 dark:border-gold-900/10 hover:border-gold-luxe transition-all text-charcoal-700 dark:text-gold-200">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-white dark:bg-charcoal-900 rounded-2xl border border-charcoal-200 dark:border-gold-900/10 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-charcoal-50 dark:bg-charcoal-950 border-b border-charcoal-100 dark:border-gold-900/10 text-[10px] uppercase tracking-wider text-charcoal-500 dark:text-gold-400/60 font-mono">
            <tr>
              <th className="py-4 px-6">Email</th>
              <th className="py-4 px-6">Subscribed At</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100 dark:divide-gold-900/10 text-xs text-charcoal-700 dark:text-white">
            {isLoading ? <tr><td colSpan={3} className="py-8 text-center">Loading...</td></tr> :
             filtered.length === 0 ? <tr><td colSpan={3} className="py-8 text-center">No subscribers found.</td></tr> :
             filtered.map(sub => (
              <tr key={sub.id} className="hover:bg-charcoal-50/50 dark:hover:bg-charcoal-800/20">
                <td className="py-4 px-6 flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gold-luxe" /> {sub.email}
                </td>
                <td className="py-4 px-6">{sub.subscribedAt?.toDate().toLocaleString()}</td>
                <td className="py-4 px-6 text-center">
                  <button onClick={() => handleDelete(sub.id)} className="text-rose-500 hover:text-rose-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
