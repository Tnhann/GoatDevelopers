import { db, auth } from '../config/firebase';
import { doc, setDoc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';

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
        updates.listsCreated = (userStatsDoc.data()?.listsCreated || 0) + 1;
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
    console.log('İstatistikler güncellendi:', updates);
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
      return newStats;
    }

    return userStatsDoc.data() as UserStats;
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