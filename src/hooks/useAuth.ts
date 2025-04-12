import { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { User, updateProfile } from 'firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Kullanıcı bilgilerini güncelle
        setUser({
          ...user,
          displayName: user.displayName || user.email?.split('@')[0] || 'Kullanıcı'
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await auth.signOut();
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

  return { user, loading, logout, updateDisplayName };
}; 