import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { Facebook, Instagram, Linkedin, Twitter, MessageCircle } from 'lucide-react';
import { db, isFirebaseEnabled } from '../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export const Footer: React.FC = () => {
  const { t } = useApp();
  const { setCurrentView } = useStore();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!isFirebaseEnabled) {
      addToast('Newsletter is currently unavailable.', 'error');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const emailRef = doc(db, 'newsletter', email.toLowerCase());
      const emailSnap = await getDoc(emailRef);

      if (emailSnap.exists()) {
        setError('You are already subscribed.');
      } else {
        await setDoc(emailRef, {
          email: email.toLowerCase(),
          subscribedAt: serverTimestamp()
        });
        addToast('Thank you for joining the LUXORA Newsletter.', 'success');
        setEmail('');
      }
    } catch (err) {
      console.error(err);
      addToast('An error occurred. Please try again later.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-charcoal-50 dark:bg-charcoal-950 border-t border-charcoal-200 dark:border-charcoal-800 text-charcoal-900 dark:text-white py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
        
        {/* Company */}
        <div className="space-y-4">
          <h4 className="font-serif text-lg font-medium mb-4">Company</h4>
          <ul className="space-y-2 text-charcoal-600 dark:text-charcoal-400">
            <li><button onClick={() => setCurrentView('about')} className="hover:text-gold-luxe">About Us</button></li>
            <li><button onClick={() => setCurrentView('contact')} className="hover:text-gold-luxe">Contact Us</button></li>
            <li><button onClick={() => setCurrentView('story')} className="hover:text-gold-luxe">Our Story</button></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className="space-y-4">
          <h4 className="font-serif text-lg font-medium mb-4">Customer Service</h4>
          <ul className="space-y-2 text-charcoal-600 dark:text-charcoal-400">
            <li><button onClick={() => setCurrentView('shipping')} className="hover:text-gold-luxe">Shipping Policy</button></li>
            <li><button onClick={() => setCurrentView('return')} className="hover:text-gold-luxe">Returns</button></li>
            <li><button onClick={() => setCurrentView('warranty')} className="hover:text-gold-luxe">Warranty</button></li>
            <li><button onClick={() => setCurrentView('faq')} className="hover:text-gold-luxe">FAQ</button></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-4 text-charcoal-600 dark:text-charcoal-400">
          <h4 className="font-serif text-lg font-medium text-charcoal-900 dark:text-white mb-4">Contact</h4>
          <p>Phone: +20 1203178981</p>
          <p>Email: support@luxora.com</p>
          <a href="https://wa.me/201203178981" target="_blank" className="flex items-center gap-2 hover:text-gold-luxe"><MessageCircle size={16}/> WhatsApp</a>
          <p className="mt-4">Sunday - Thursday<br/>10:00 AM - 8:00 PM</p>
        </div>

        {/* Social */}
        <div className="space-y-4">
          <h4 className="font-serif text-lg font-medium mb-4">Newsletter</h4>
          <form onSubmit={handleSubscribe} className="space-y-2">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email" 
              className="w-full p-3 rounded-lg bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-700" 
            />
            {error && <p className="text-red-500 text-[10px]">{error}</p>}
            <button type="submit" disabled={isLoading} className="w-full p-3 rounded-lg bg-gold-luxe text-white font-medium hover:bg-gold-600 transition-colors disabled:opacity-50">
              {isLoading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          <div className="flex gap-4 mt-6">
            <Facebook className="cursor-pointer hover:text-gold-luxe" size={20}/>
            <Instagram className="cursor-pointer hover:text-gold-luxe" size={20}/>
            <Twitter className="cursor-pointer hover:text-gold-luxe" size={20}/>
            <Linkedin className="cursor-pointer hover:text-gold-luxe" size={20}/>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-charcoal-200 dark:border-charcoal-800 text-center text-xs text-charcoal-500">
        © LUXORA 2026. All Rights Reserved.
      </div>
    </footer>
  );
};
