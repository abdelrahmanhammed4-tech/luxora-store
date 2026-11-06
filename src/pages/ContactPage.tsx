import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ContactPage: React.FC = () => {
  const { t } = useApp();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white dark:bg-charcoal-950 text-charcoal-900 dark:text-white pt-24 pb-16 px-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Contact Us</h1>
          <p className="text-gold-luxe uppercase tracking-widest text-sm">We are here to assist you</p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Form */}
          <div className="bg-charcoal-50 dark:bg-charcoal-900 p-8 rounded-2xl">
            <h2 className="text-2xl font-serif mb-6">Send a Message</h2>
            <form className="space-y-4">
              <input type="text" placeholder="Name" className="w-full p-4 rounded-xl bg-white dark:bg-charcoal-950 border border-charcoal-200 dark:border-charcoal-700" />
              <input type="email" placeholder="Email" className="w-full p-4 rounded-xl bg-white dark:bg-charcoal-950 border border-charcoal-200 dark:border-charcoal-700" />
              <input type="tel" placeholder="Phone" className="w-full p-4 rounded-xl bg-white dark:bg-charcoal-950 border border-charcoal-200 dark:border-charcoal-700" />
              <textarea placeholder="Message" rows={4} className="w-full p-4 rounded-xl bg-white dark:bg-charcoal-950 border border-charcoal-200 dark:border-charcoal-700"></textarea>
              <button type="submit" className="w-full bg-gold-luxe text-white p-4 rounded-xl hover:bg-gold-600 transition-colors">Send</button>
            </form>
          </div>

          {/* Cards */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-charcoal-50 dark:bg-charcoal-900 p-6 rounded-2xl">
                <Phone className="text-gold-luxe" />
                <div>
                    <h4 className="font-medium">Phone</h4>
                    <p className="text-sm text-charcoal-500">+20 1203178981</p>
                </div>
            </div>
            <div className="flex items-center gap-4 bg-charcoal-50 dark:bg-charcoal-900 p-6 rounded-2xl">
                <Mail className="text-gold-luxe" />
                <div>
                    <h4 className="font-medium">Email</h4>
                    <p className="text-sm text-charcoal-500">support@luxora.com</p>
                </div>
            </div>
            <div className="flex items-center gap-4 bg-charcoal-50 dark:bg-charcoal-900 p-6 rounded-2xl">
                <Clock className="text-gold-luxe" />
                <div>
                    <h4 className="font-medium">Working Hours</h4>
                    <p className="text-sm text-charcoal-500">Sunday - Thursday | 10:00 AM - 8:00 PM</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
