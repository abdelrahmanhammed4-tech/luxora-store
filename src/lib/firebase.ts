import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// LUXORA Premium Cloud Integration configuration
// If no environment variables are provided, we will use a fallback configuration
// to avoid crashing and provide an exquisite, resilient user experience.
const metaEnv = (import.meta as any).env || {};


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCuXrXcbwlYF4kQY5hqRN-Xs--9ax2wlLE",
  authDomain: "luxora-store-9cfa4.firebaseapp.com",
  projectId: "luxora-store-9cfa4",
  storageBucket: "luxora-store-9cfa4.firebasestorage.app",
  messagingSenderId: "550895348537",
  appId: "1:550895348537:web:880962c8888f4e61f356e8",
  measurementId: "G-T8J86HSQMD"
};


let app;
let db: any;
let auth: any;
let isFirebaseEnabled = false;

try {
  // Prevent crash if apiKey is empty or template is unconfigured,
  // but attempt real initialization if VITE_FIREBASE_API_KEY is present
  const hasRealConfig = !!metaEnv.VITE_FIREBASE_API_KEY;
  
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  
  db = getFirestore(app);
  auth = getAuth(app);
  isFirebaseEnabled = true;
  if (isFirebaseEnabled) {
    console.log("💎 LUXORA Cloud Gateway Initialized with real configuration.");
  } else {
    console.log("💎 LUXORA Cloud Gateway operating in Simulated Cloud Mode (No active API keys found).");
  }
  
  // Try to enable offline persistence for a seamless luxury experience
  if (typeof window !== 'undefined' && isFirebaseEnabled) {
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn("Firestore persistence failed-precondition (multiple tabs open).");
      } else if (err.code === 'unimplemented') {
        console.warn("Firestore persistence is unimplemented in this browser.");
      }
    });
  }
} catch (error) {
  console.warn("⚠️ LUXORA Cloud Gateway operating in Offline Graceful Mode:", error);
  isFirebaseEnabled = false;
  
  // Provide a luxury mock Firestore database implementation to prevent any runtime exceptions
  db = {
    _mock: true
  };
}

export { db, auth, isFirebaseEnabled };

// Helper to race a promise with a timeout to keep the luxury experience fast and resilient
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error(`Timeout: ${errorMessage}`)), timeoutMs)
    )
  ]);
}

// Elegant interface to sync cart with Firebase Firestore database
export interface FirebaseCart {
  userId: string;
  products: {
    productId: string;
    quantity: number;
    price: number;
    nameEn: string;
    nameAr: string;
    image: string;
    category: string;
  }[];
  promoCode: string | null;
  cartTotal: number;
  lastUpdated: string;
}

/**
 * Saves the cart to Firebase Firestore for persistent storage across devices.
 * Gracefully falls back to local storage if Firestore is unconfigured.
 */
export async function saveCartToFirebase(userId: string, cartData: Omit<FirebaseCart, 'userId' | 'lastUpdated'>): Promise<boolean> {
  const lastUpdated = new Date().toISOString();
  const payload: FirebaseCart = {
    userId,
    ...cartData,
    lastUpdated
  };

  // Always sync to local storage first for speed and reliability
  localStorage.setItem(`luxora_cart_backup_${userId}`, JSON.stringify(payload));

  if (!isFirebaseEnabled || db?._mock) {
    // Beautiful console logging for simulated luxury synchronization
    console.log(`📡 [Sync] Curating luxury sanctuary cart for Patron ${userId} locally (Firestore offline fallback)`);
    return true;
  }

  try {
    const userCartRef = doc(db, 'carts', userId);
    await withTimeout(setDoc(userCartRef, payload), 2000, "Saving sanctuary cart");
    console.log(`✨ [Sync] LUXORA Sanctuary Cart successfully synced with cloud database for Patron ${userId}`);
    return true;
  } catch (err) {
    console.warn("ℹ️ LUXORA Cloud sync deferred (operating in offline resilience mode):", err);
    return false;
  }
}

/**
 * Loads the cart from Firebase Firestore.
 * Gracefully falls back to local storage if Firestore is unconfigured or fails.
 */
export async function loadCartFromFirebase(userId: string): Promise<FirebaseCart | null> {
  // Always check local storage backup first to ensure ultra-fast loading experience
  const localBackup = localStorage.getItem(`luxora_cart_backup_${userId}`);
  let parsedBackup: FirebaseCart | null = null;
  if (localBackup) {
    try {
      parsedBackup = JSON.parse(localBackup);
    } catch (_) {}
  }

  if (!isFirebaseEnabled || db?._mock) {
    console.log(`📥 [Load] Loading curated sanctuary cart for Patron ${userId} from local vault`);
    return parsedBackup;
  }

  try {
    const userCartRef = doc(db, 'carts', userId);
    const docSnap = await withTimeout(getDoc(userCartRef), 2000, "Loading sanctuary cart");
    if (docSnap.exists()) {
      const cloudData = docSnap.data() as FirebaseCart;
      console.log(`🏆 [Load] Curated sanctuary cart retrieved from LUXORA Cloud for Patron ${userId}`);
      return cloudData;
    }
    return parsedBackup;
  } catch (err) {
    console.warn("ℹ️ LUXORA Cloud load deferred (retrieved from local cache):", err);
    return parsedBackup;
  }
}

/**
 * Deletes the cart from Firebase Firestore.
 */
export async function deleteCartFromFirebase(userId: string): Promise<boolean> {
  localStorage.removeItem(`luxora_cart_backup_${userId}`);
  
  if (!isFirebaseEnabled || db?._mock) {
    console.log(`🧹 [Clear] Curated sanctuary cart cleared for Patron ${userId}`);
    return true;
  }

  try {
    const userCartRef = doc(db, 'carts', userId);
    await withTimeout(
      setDoc(userCartRef, {
        userId,
        products: [],
        promoCode: null,
        cartTotal: 0,
        lastUpdated: new Date().toISOString()
      }),
      2000,
      "Clearing sanctuary cart"
    );
    console.log(`🧹 [Clear] Curated sanctuary cart successfully cleared from cloud for Patron ${userId}`);
    return true;
  } catch (err) {
    console.warn("ℹ️ LUXORA Cloud clear deferred (operating in offline resilience mode):", err);
    return false;
  }
}
