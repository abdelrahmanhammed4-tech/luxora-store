import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const CookieConsent: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('luxora_cookie_consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('luxora_cookie_consent', 'accepted');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-charcoal-950 text-white p-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-charcoal-800"
        >
          <p className="text-sm">We use cookies to enhance your experience. By continuing to browse, you agree to our use of cookies.</p>
          <div className="flex gap-4">
            <button onClick={accept} className="px-6 py-2 bg-gold-luxe text-white rounded-lg hover:bg-gold-600 transition-colors">Accept</button>
            <button onClick={() => setShow(false)} className="px-6 py-2 bg-charcoal-800 rounded-lg hover:bg-charcoal-700 transition-colors">Reject</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
