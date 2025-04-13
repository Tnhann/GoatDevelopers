import { ref, get, set, child } from 'firebase/database';
import { realtimeDb } from '../config/firebase';
import { auth } from '../config/firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../config/firebase';

// Kelime listesi tipi
export interface WordList {
  id: string;
  name: string;
  description: string;
  words: Word[];
  isDefault?: boolean;
}

// Kelime tipi
export interface Word {
  id: string;
  word: string;
  meaning: string;
  turkishMeaning: string;
  example?: string;
  level?: string;
}

// Data klasöründeki JSON dosyalarından varsayılan kelime listelerini al
export const fetchDefaultWordLists = async (): Promise<WordList[]> => {
  try {
    // JSON dosyalarını import et - Sadece 30 kelimelik listeler
    const basicEnglish = require('../../data/basic_english.json');
    const travelEnglish = require('../../data/travel_english.json');
    const businessEnglish = require('../../data/business_english.json');
    const educationEnglish = require('../../data/education_english.json');
    const dailyConversationEnglish = require('../../data/daily_conversation_english.json');

    // WordList formatına dönüştür
    const defaultLists: WordList[] = [
      {
        id: 'default-basic-english',
        name: basicEnglish.name,
        description: basicEnglish.description,
        words: basicEnglish.words.map((word: any) => ({
          id: word.id,
          word: word.word,
          meaning: word.meaning,
          turkishMeaning: word.turkishMeaning,
          example: word.example,
          level: word.level
        })),
        isDefault: true
      },
      {
        id: 'default-travel-english',
        name: travelEnglish.name,
        description: travelEnglish.description,
        words: travelEnglish.words.map((word: any) => ({
          id: word.id,
          word: word.word,
          meaning: word.meaning,
          turkishMeaning: word.turkishMeaning,
          example: word.example,
          level: word.level
        })),
        isDefault: true
      },
      {
        id: 'default-business-english',
        name: businessEnglish.name,
        description: businessEnglish.description,
        words: businessEnglish.words.map((word: any) => ({
          id: word.id,
          word: word.word,
          meaning: word.meaning,
          turkishMeaning: word.turkishMeaning,
          example: word.example,
          level: word.level
        })),
        isDefault: true
      },
      {
        id: 'default-education-english',
        name: educationEnglish.name,
        description: educationEnglish.description,
        words: educationEnglish.words.map((word: any) => ({
          id: word.id,
          word: word.word,
          meaning: word.meaning,
          turkishMeaning: word.turkishMeaning,
          example: word.example,
          level: word.level
        })),
        isDefault: true
      },
      {
        id: 'default-daily-conversation-english',
        name: dailyConversationEnglish.name,
        description: dailyConversationEnglish.description,
        words: dailyConversationEnglish.words.map((word: any) => ({
          id: word.id,
          word: word.word,
          meaning: word.meaning,
          turkishMeaning: word.turkishMeaning,
          example: word.example,
          level: word.level
        })),
        isDefault: true
      }
    ];

    return defaultLists;
  } catch (error) {
    console.error('Error fetching default word lists:', error);
    return [];
  }
};

// Kullanıcının kelime listelerini kontrol et ve varsayılan listeleri ekle
export const ensureDefaultWordLists = async (): Promise<void> => {
  try {
    // Kullanıcı oturum açmış mı kontrol et
    const user = auth.currentUser;
    if (!user) {
      console.log('User not logged in');
      return;
    }

    // Varsayılan kelime listelerini al
    const defaultLists = await fetchDefaultWordLists();
    if (defaultLists.length === 0) {
      console.log('No default word lists found');
      return;
    }

    // Kullanıcının kelime listelerini kontrol et
    const userListsRef = collection(firestore, 'users', user.uid, 'wordLists');
    const userListsSnapshot = await getDocs(userListsRef);

    // Kullanıcının mevcut listelerini al
    const existingLists = userListsSnapshot.docs.map(doc => doc.id);

    // Her varsayılan liste için
    for (const defaultList of defaultLists) {
      // Kullanıcıda bu liste var mı kontrol et
      if (!existingLists.includes(defaultList.id)) {
        // Yoksa ekle
        await setDoc(doc(firestore, 'users', user.uid, 'wordLists', defaultList.id), {
          name: defaultList.name,
          description: defaultList.description,
          isDefault: true,
          createdAt: new Date()
        });

        // Listedeki kelimeleri ekle
        for (const word of defaultList.words) {
          await setDoc(doc(firestore, 'users', user.uid, 'wordLists', defaultList.id, 'words', word.id), {
            word: word.word,
            meaning: word.meaning,
            turkishMeaning: word.turkishMeaning,
            example: word.example || '',
            level: word.level || 'beginner'
          });
        }

        console.log(`Added default word list: ${defaultList.name}`);
      }
    }

    console.log('Default word lists check completed');
  } catch (error) {
    console.error('Error ensuring default word lists:', error);
  }
};

// Kullanıcının kelime listelerini getir
export const getUserWordLists = async (): Promise<WordList[]> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return [];
    }

    const userListsRef = collection(firestore, 'users', user.uid, 'wordLists');
    const userListsSnapshot = await getDocs(userListsRef);

    const lists: WordList[] = [];

    for (const listDoc of userListsSnapshot.docs) {
      const listData = listDoc.data();

      // Listedeki kelimeleri al
      const wordsRef = collection(firestore, 'users', user.uid, 'wordLists', listDoc.id, 'words');
      const wordsSnapshot = await getDocs(wordsRef);

      const words: Word[] = wordsSnapshot.docs.map(wordDoc => {
        const wordData = wordDoc.data();
        return {
          id: wordDoc.id,
          word: wordData.word,
          meaning: wordData.meaning,
          turkishMeaning: wordData.turkishMeaning,
          example: wordData.example,
          level: wordData.level
        };
      });

      lists.push({
        id: listDoc.id,
        name: listData.name,
        description: listData.description,
        isDefault: listData.isDefault || false,
        words
      });
    }

    return lists;
  } catch (error) {
    console.error('Error getting user word lists:', error);
    return [];
  }
};
