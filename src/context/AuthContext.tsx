import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '../config/firebase';
import { User, updateProfile, signOut } from 'firebase/auth';
import { ensureDefaultWordLists } from '../services/defaultWordListService';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  updateDisplayName: (displayName: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  updateDisplayName: async () => {},
});

export { AuthContext };

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Kullanıcı bilgilerini güncelle
        setUser({
          ...user,
          displayName: user.displayName || user.email?.split('@')[0] || 'Kullanıcı'
        });
        
        // Varsayılan kelime listelerini kontrol et ve ekle
        try {
          await ensureDefaultWordLists();
        } catch (error) {
          console.error('Error ensuring default word lists:', error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateDisplayName = async (displayName: string) => {
    try {
      if (!auth.currentUser) throw new Error('No user logged in');
      
      // Önce yerel state'i güncelle
      setUser(prevUser => {
        if (!prevUser) return null;
        return { ...prevUser, displayName };
      });
      
      // Sonra Firebase'i güncelle
      await updateProfile(auth.currentUser, { displayName });
      
      // Firebase güncellemesi başarılı olduktan sonra state'i tekrar güncelle
      setUser(prevUser => {
        if (!prevUser) return null;
        return { ...prevUser, displayName };
      });
    } catch (error) {
      console.error('Update display name error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    logout,
    updateDisplayName,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
