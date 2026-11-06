import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { auth, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, onSnapshot } from 'firebase/firestore';

interface AuthContextProps {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<void>;
  loginAsGuest: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  addAdmin: (name: string, email: string, role: 'admin' | 'superadmin', permissions: User['permissions']) => Promise<void>;
  removeAdmin: (id: string) => Promise<void>;
  updateAdminPermissions: (id: string, permissions: User['permissions']) => Promise<void>;
  updateUserRole: (id: string, role: 'customer' | 'admin' | 'superadmin') => Promise<void>;
  isLoadingAuth: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Initialize and load users database & current session
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('💎 [Auth] onAuthStateChanged:', firebaseUser ? `User: ${firebaseUser.uid}` : 'Logged Out');

      if (firebaseUser) {
        let role = 'customer';
        let name = firebaseUser.displayName || 'Patron';
        let permissions = null;
        const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@luxora.com';
        const isSuperAdminEmail = firebaseUser.email === adminEmail || firebaseUser.email === 'abdelrahmanhammed608@gmail.com';

        // Check local profile cache first
        const cachedProfileStr = localStorage.getItem(`luxora_profile_${firebaseUser.uid}`);
        if (cachedProfileStr) {
          try {
            const cached = JSON.parse(cachedProfileStr);
            role = cached.role || role;
            name = cached.name || name;
            permissions = cached.permissions || permissions;
          } catch (_) {}
        }

        if (isSuperAdminEmail) {
          role = 'superadmin';
          permissions = {
            canAddAdmins: true,
            canRemoveAdmins: true,
            canChangePermissions: true,
            canManageInventory: true
          };
        }

        try {
          console.log('💎 [Auth] Fetching Firestore profile for:', firebaseUser.uid);
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            role = isSuperAdminEmail ? 'superadmin' : (data.role || 'customer');
            name = data.name || name;
            permissions = isSuperAdminEmail ? permissions : (data.permissions || null);
            console.log('💎 [Auth] Firestore profile loaded successfully for:', firebaseUser.uid);
            localStorage.setItem(`luxora_profile_${firebaseUser.uid}`, JSON.stringify({ role, name, permissions }));
          } else {
            console.log('💎 [Auth] No Firestore profile found, seeding for:', firebaseUser.uid);
            if (isSuperAdminEmail) {
              await setDoc(doc(db, 'users', firebaseUser.uid), {
                email: firebaseUser.email,
                name: 'Super Curator',
                role: 'superadmin',
                permissions,
                createdAt: new Date().toISOString()
              });
            } else {
              await setDoc(doc(db, 'users', firebaseUser.uid), {
                email: firebaseUser.email,
                name,
                role: 'customer',
                createdAt: new Date().toISOString()
              });
            }
            localStorage.setItem(`luxora_profile_${firebaseUser.uid}`, JSON.stringify({ role, name, permissions }));
          }
        } catch (e: any) {
          console.warn("💎 [Auth] Firestore profile sync operating in local mode for:", firebaseUser.uid, e?.message || e);
          localStorage.setItem(`luxora_profile_${firebaseUser.uid}`, JSON.stringify({ role, name, permissions }));
        }
        
        const userData = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: name,
          role: role as any,
          permissions
        };
        console.log('💎 [Auth] Updating UserContext with user:', userData);
        console.log('💎 [Auth] App status: Authenticated');
        setUser(userData);
      } else {
        console.log('💎 [Auth] Clearing UserContext');
        console.log('💎 [Auth] App status: Guest');
        setUser(null);
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log('💎 [Auth] AuthContext updated, current user:', user);
  }, [user]);

  // Sync users list in real-time from Firestore (admin only)
  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      setUsers([]);
      return;
    }

    const usersColRef = collection(db, 'users');
    const unsubscribeUsers = onSnapshot(usersColRef, (snapshot) => {
      const usersList: User[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        usersList.push({
          id: doc.id,
          name: data.name || 'Patron',
          email: data.email || '',
          role: data.role || 'customer',
          permissions: data.permissions || null
        });
      });
      // Sort users by name
      usersList.sort((a, b) => a.name.localeCompare(b.name));
      setUsers(usersList);
    }, (error) => {
      console.warn("Real-time users fetch failed/operating offline:", error);
    });

    return () => unsubscribeUsers();
  }, [user]);

  const login = async (email: string, password: string) => {
    setIsLoadingAuth(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      console.log('💎 [Auth] Firebase sign in SUCCESS for:', firebaseUser.uid);
      
      // Fetch user role from Firestore
      let role = 'customer';
      let name = firebaseUser.displayName || 'Patron';
      let permissions = null;
      
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@luxora.com';
      const isSuperAdminEmail = firebaseUser.email === adminEmail || firebaseUser.email === 'abdelrahmanhammed608@gmail.com';

      // Check local cache
      const cachedProfileStr = localStorage.getItem(`luxora_profile_${firebaseUser.uid}`);
      if (cachedProfileStr) {
        try {
          const cached = JSON.parse(cachedProfileStr);
          role = cached.role || role;
          name = cached.name || name;
          permissions = cached.permissions || permissions;
        } catch (_) {}
      }

      if (isSuperAdminEmail) {
        role = 'superadmin';
        permissions = {
          canAddAdmins: true,
          canRemoveAdmins: true,
          canChangePermissions: true,
          canManageInventory: true
        };
      }

      try {
        console.log('💎 [Auth] Fetching Firestore profile for login:', firebaseUser.uid);
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          role = isSuperAdminEmail ? 'superadmin' : (userData?.role || 'customer');
          name = userData?.name || name;
          permissions = isSuperAdminEmail ? permissions : (userData?.permissions || null);
          console.log('💎 [Auth] Firestore profile loaded successfully for login:', firebaseUser.uid);
          localStorage.setItem(`luxora_profile_${firebaseUser.uid}`, JSON.stringify({ role, name, permissions }));
        } else {
          console.log('💎 [Auth] No Firestore profile found, seeding for login:', firebaseUser.uid);
          if (isSuperAdminEmail) {
            // Auto create
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              email: firebaseUser.email,
              name: 'Super Curator',
              role: 'superadmin',
              permissions,
              createdAt: new Date().toISOString()
            });
          }
          localStorage.setItem(`luxora_profile_${firebaseUser.uid}`, JSON.stringify({ role, name, permissions }));
        }
      } catch (e: any) {
        console.warn("💎 [Auth] Firestore profile fetch operating in local mode for login:", firebaseUser.uid, e?.message || e);
        localStorage.setItem(`luxora_profile_${firebaseUser.uid}`, JSON.stringify({ role, name, permissions }));
      }
      
      const userData = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: name,
        role: role as any,
        permissions
      };
      console.log('💎 [Auth] Updating UserContext after login with user:', userData);
      setUser(userData);
    } catch (error) {
      console.warn('💎 [Auth] Firebase sign in error:', error);
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const loginAsGuest = () => {
    setUser({
      id: 'guest',
      email: 'guest@luxora.com',
      name: 'Guest Patron',
      role: 'customer',
    });
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoadingAuth(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      localStorage.setItem(`luxora_profile_${userCredential.user.uid}`, JSON.stringify({
        role: 'customer',
        name,
        permissions: null
      }));

      // Create user document in Firestore if permitted
      try {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: email,
          name: name,
          role: 'customer',
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn("Could not save user profile to Firestore (using local storage fallback):", err);
      }

      setUser({
        id: userCredential.user.uid,
        email: userCredential.user.email || '',
        name: name,
        role: 'customer',
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logout = async () => {
    setIsLoadingAuth(true);
    await signOut(auth);
    setUser(null);
    setIsLoadingAuth(false);
  };

  const resetPassword = async (email: string) => {
    // Implement password reset if needed
  };

  const addAdmin = async (name: string, email: string, role: 'admin' | 'superadmin', permissions: User['permissions']) => {
    try {
      // Find if there is an existing user with this email
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        await setDoc(doc(db, 'users', existingUser.id), {
          role,
          permissions
        }, { merge: true });
      } else {
        // Pre-create placeholder user using a random ID
        const tempId = 'pre_' + Math.random().toString(36).substr(2, 9);
        await setDoc(doc(db, 'users', tempId), {
          email,
          name,
          role,
          permissions,
          createdAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error("Failed to add admin:", err);
      throw err;
    }
  };

  const removeAdmin = async (id: string) => {
    try {
      await setDoc(doc(db, 'users', id), {
        role: 'customer',
        permissions: null
      }, { merge: true });
    } catch (err) {
      console.error("Failed to remove admin:", err);
      throw err;
    }
  };

  const updateAdminPermissions = async (id: string, permissions: User['permissions']) => {
    try {
      await setDoc(doc(db, 'users', id), {
        permissions
      }, { merge: true });
    } catch (err) {
      console.error("Failed to update admin permissions:", err);
      throw err;
    }
  };

  const updateUserRole = async (userId: string, role: 'customer' | 'admin' | 'superadmin') => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role
      });
    } catch (err) {
      console.error("Failed to update user role:", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        login,
        loginAsGuest,
        register,
        logout,
        resetPassword,
        addAdmin,
        removeAdmin,
        updateAdminPermissions,
        updateUserRole,
        isLoadingAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
