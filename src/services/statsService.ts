import { db, auth } from '../config/firebase';
import { doc, setDoc, updateDoc, getDoc, serverTimestamp, collection, getDocs } from 'firebase/firestore';

interface UserStats {
  completedWordModes: number;
  completedQuizzes: number;
  listsCreated: number;
  dailyStreak: number;
  lastActivityDate: string;
  totalWordsLearned: number;
  totalQuizzesTaken: number;
  totalTimeSpent: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

const defaultStats: UserStats = {
  completedWordModes: 0,
  completedQuizzes: 0,
  listsCreated: 0,
  dailyStreak: 0,
  lastActivityDate: new Date().toISOString(),
  totalWordsLearned: 0,
  totalQuizzesTaken: 0,
  totalTimeSpent: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  userId: ''
};

export const initializeUserStats = async () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('Kullanıcı girişi yapılmamış');
  }

  try {
    const userStatsRef = doc(db, 'userStats', user.uid);
    const userStatsDoc = await getDoc(userStatsRef);

    if (!userStatsDoc.exists()) {
      const newStats = { ...defaultStats, userId: user.uid };
      await setDoc(userStatsRef, newStats);
      console.log('Yeni kullanıcı istatistikleri oluşturuldu:', newStats);
    }
  } catch (error) {
    console.error('İstatistik başlatma hatası:', error);
    throw error;
  }
};

export const updateUserStats = async (type: 'wordMode' | 'quiz' | 'list', additionalData?: { wordsLearned?: number; timeSpent?: number }) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('Kullanıcı girişi yapılmamış');
  }

  try {
    const userStatsRef = doc(db, 'userStats', user.uid);
    const userStatsDoc = await getDoc(userStatsRef);

    if (!userStatsDoc.exists()) {
      const newStats = { ...defaultStats, userId: user.uid };
      await setDoc(userStatsRef, newStats);
    }

    const updates: Partial<UserStats> = {
      updatedAt: new Date().toISOString(),
      userId: user.uid
    };

    switch (type) {
      case 'wordMode':
        updates.completedWordModes = (userStatsDoc.data()?.completedWordModes || 0) + 1;
        updates.totalWordsLearned = (userStatsDoc.data()?.totalWordsLearned || 0) + (additionalData?.wordsLearned || 0);
        updates.totalTimeSpent = (userStatsDoc.data()?.totalTimeSpent || 0) + (additionalData?.timeSpent || 0);
        break;
      case 'quiz':
        updates.completedQuizzes = (userStatsDoc.data()?.completedQuizzes || 0) + 1;
        updates.totalQuizzesTaken = (userStatsDoc.data()?.totalQuizzesTaken || 0) + 1;
        updates.totalTimeSpent = (userStatsDoc.data()?.totalTimeSpent || 0) + (additionalData?.timeSpent || 0);
        break;
      case 'list':
        const currentListCount = userStatsDoc.data()?.listsCreated || 0;
        updates.listsCreated = currentListCount + 1;
        console.log('Liste sayısı artırılıyor:', currentListCount, '->', currentListCount + 1);
        break;
    }

    // Günlük streak kontrolü
    const lastActivity = new Date(userStatsDoc.data()?.lastActivityDate || new Date());
    const today = new Date();
    const isConsecutiveDay = lastActivity.toDateString() === new Date(today.setDate(today.getDate() - 1)).toDateString();

    if (isConsecutiveDay) {
      updates.dailyStreak = (userStatsDoc.data()?.dailyStreak || 0) + 1;
    } else {
      updates.dailyStreak = 1;
    }
    updates.lastActivityDate = new Date().toISOString();

    await updateDoc(userStatsRef, updates);
    console.log('İstatistikler güncellendi:', JSON.stringify(updates));
  } catch (error) {
    console.error('İstatistik güncelleme hatası:', error);
    throw error;
  }
};

export const getUserStats = async (): Promise<UserStats> => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('Kullanıcı girişi yapılmamış');
  }

  try {
    const userStatsRef = doc(db, 'userStats', user.uid);
    const userStatsDoc = await getDoc(userStatsRef);

    if (!userStatsDoc.exists()) {
      const newStats = { ...defaultStats, userId: user.uid };
      await setDoc(userStatsRef, newStats);
      console.log('Yeni kullanıcı istatistikleri oluşturuldu:', newStats);
      return newStats;
    }

    const stats = userStatsDoc.data() as UserStats;
    console.log('Kullanıcı istatistikleri alındı:', stats);
    return stats;
  } catch (error) {
    console.error('İstatistik getirme hatası:', error);
    throw error;
  }
};

export const updateQuizStats = async (score: number, totalQuestions: number, timeSpent: number) => {
  const user = auth.currentUser;
  if (!user) {
    console.error('Kullanıcı girişi yapılmamış');
    throw new Error('Kullanıcı girişi yapılmamış');
  }

  try {
    if (score / totalQuestions > 0.5) {
      console.log('Quiz başarılı, istatistikler güncelleniyor');
      await updateUserStats('quiz', { timeSpent });
      console.log('Quiz istatistikleri başarıyla güncellendi');
    } else {
      console.log('Quiz başarısız, istatistikler güncellenmedi');
    }
  } catch (error) {
    console.error('Quiz istatistikleri güncellenirken hata oluştu:', error);
    throw error;
  }
};

export const decrementListCount = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.error('Kullanıcı girişi yapılmamış');
    throw new Error('Kullanıcı girişi yapılmamış');
  }

  try {
    const userStatsRef = doc(db, 'userStats', user.uid);
    const userStatsDoc = await getDoc(userStatsRef);

    if (!userStatsDoc.exists()) {
      console.error('Kullanıcı istatistikleri bulunamadı');
      return;
    }

    const currentListCount = userStatsDoc.data()?.listsCreated || 0;

    // Liste sayısı 0'dan büyükse azalt
    if (currentListCount > 0) {
      const newCount = currentListCount - 1;
      await updateDoc(userStatsRef, {
        listsCreated: newCount,
        updatedAt: new Date().toISOString()
      });
      console.log('Liste sayısı azaltılıyor:', currentListCount, '->', newCount);
    }
  } catch (error) {
    console.error('Liste sayısı azaltılırken hata oluştu:', error);
    throw error;
  }
};

// Manuel olarak liste sayısını ayarlamak için fonksiyon
export const setListCount = async (count: number) => {
  const user = auth.currentUser;
  if (!user) {
    console.error('Kullanıcı girişi yapılmamış');
    throw new Error('Kullanıcı girişi yapılmamış');
  }

  try {
    const userStatsRef = doc(db, 'userStats', user.uid);
    const userStatsDoc = await getDoc(userStatsRef);

    if (!userStatsDoc.exists()) {
      console.error('Kullanıcı istatistikleri bulunamadı');
      return;
    }

    await updateDoc(userStatsRef, {
      listsCreated: count,
      updatedAt: new Date().toISOString()
    });
    console.log('Liste sayısı manuel olarak ayarlandı:', count);
    return true;
  } catch (error) {
    console.error('Liste sayısı ayarlanırken hata oluştu:', error);
    throw error;
  }
};

// Toplam kelime sayısını güncelleyen fonksiyon
export const updateTotalWordsCount = async (count: number) => {
  const user = auth.currentUser;
  if (!user) {
    console.error('Kullanıcı girişi yapılmamış');
    throw new Error('Kullanıcı girişi yapılmamış');
  }

  try {
    const userStatsRef = doc(db, 'userStats', user.uid);
    const userStatsDoc = await getDoc(userStatsRef);

    if (!userStatsDoc.exists()) {
      console.error('Kullanıcı istatistikleri bulunamadı');
      return;
    }

    await updateDoc(userStatsRef, {
      totalWordsLearned: count,
      updatedAt: new Date().toISOString()
    });
    console.log('Toplam kelime sayısı güncellendi:', count);
    return true;
  } catch (error) {
    console.error('Toplam kelime sayısı güncellenirken hata oluştu:', error);
    throw error;
  }
};

// Gerçek liste sayısını ve toplam kelime sayısını hesaplayıp istatistikleri güncelleyen fonksiyon
export const updateListCountBasedOnActualLists = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.error('Kullanıcı girişi yapılmamış');
    throw new Error('Kullanıcı girişi yapılmamış');
  }

  try {
    // Kullanıcının tüm listelerini al
    const listsRef = collection(db, 'users', user.uid, 'wordLists');
    const listsSnapshot = await getDocs(listsRef);

    // Varsayılan olmayan listeleri say ve tüm kelimeleri topla
    let nonDefaultListCount = 0;
    let totalWordsCount = 0;

    // Önce tüm listeleri işle
    const listProcessPromises = [];

    listsSnapshot.forEach(listDoc => {
      const listData = listDoc.data();

      // Varsayılan olmayan listeleri say
      if (!listData.isDefault) {
        nonDefaultListCount++;
      }

      // Her listenin kelimelerini al ve say
      const wordsPromise = async () => {
        const wordsRef = collection(db, 'users', user.uid, 'wordLists', listDoc.id, 'words');
        const wordsSnapshot = await getDocs(wordsRef);
        const wordCount = wordsSnapshot.size;
        console.log(`Liste ${listDoc.id} için ${wordCount} kelime bulundu`);
        return wordCount;
      };

      listProcessPromises.push(wordsPromise());
    });

    // Tüm listelerin kelimelerini topla
    const wordCounts = await Promise.all(listProcessPromises);
    totalWordsCount = wordCounts.reduce((total, count) => total + count, 0);

    // İstatistikleri güncelle - liste sayısı
    await setListCount(nonDefaultListCount);
    console.log('Liste sayısı gerçek liste sayısına göre güncellendi:', nonDefaultListCount);

    // İstatistikleri güncelle - toplam kelime sayısı
    await updateTotalWordsCount(totalWordsCount);
    console.log('Toplam kelime sayısı güncellendi:', totalWordsCount);

    return { listCount: nonDefaultListCount, wordCount: totalWordsCount };
  } catch (error) {
    console.error('İstatistikler güncellenirken hata oluştu:', error);
    throw error;
  }
};