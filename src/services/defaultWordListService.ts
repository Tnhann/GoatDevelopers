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

// Varsayılan kelime listelerini yerel olarak tanımla
export const fetchDefaultWordLists = async (): Promise<WordList[]> => {
  try {
    // Realtime Database'e erişim izni olmadığı için varsayılan listeleri burada tanımlıyoruz
    const defaultLists: WordList[] = [
      {
        id: 'default-english-basics',
        name: 'Temel İngilizce Kelimeler',
        description: 'Günlük hayatta sık kullanılan temel İngilizce kelimeler',
        words: [
          {
            id: 'word1',
            word: 'Hello',
            meaning: 'A greeting',
            turkishMeaning: 'Merhaba',
            example: 'Hello, how are you today?',
            level: 'beginner'
          },
          {
            id: 'word2',
            word: 'Goodbye',
            meaning: 'A farewell',
            turkishMeaning: 'Hoşçakal',
            example: 'Goodbye, see you tomorrow!',
            level: 'beginner'
          },
          {
            id: 'word3',
            word: 'Thank you',
            meaning: 'Expression of gratitude',
            turkishMeaning: 'Teşekkür ederim',
            example: 'Thank you for your help.',
            level: 'beginner'
          },
          {
            id: 'word4',
            word: 'Please',
            meaning: 'Used to make a request more polite',
            turkishMeaning: 'Lütfen',
            example: 'Please pass me the salt.',
            level: 'beginner'
          },
          {
            id: 'word5',
            word: 'Sorry',
            meaning: 'Used to express regret or apologize',
            turkishMeaning: 'Üzgünüm',
            example: "I'm sorry for being late.",
            level: 'beginner'
          }
        ],
        isDefault: true
      },
      {
        id: 'default-english-travel',
        name: 'Seyahat İçin İngilizce',
        description: 'Seyahat ederken kullanışlı olabilecek İngilizce kelimeler',
        words: [
          {
            id: 'word1',
            word: 'Airport',
            meaning: 'A place where aircraft take off and land',
            turkishMeaning: 'Havalimanı',
            example: 'We need to be at the airport two hours before the flight.',
            level: 'beginner'
          },
          {
            id: 'word2',
            word: 'Passport',
            meaning: 'An official document that identifies you as a citizen of a country',
            turkishMeaning: 'Pasaport',
            example: "Don't forget to bring your passport.",
            level: 'beginner'
          },
          {
            id: 'word3',
            word: 'Hotel',
            meaning: 'A place that provides accommodation and meals',
            turkishMeaning: 'Otel',
            example: "We're staying at a hotel near the beach.",
            level: 'beginner'
          },
          {
            id: 'word4',
            word: 'Ticket',
            meaning: 'A piece of paper that shows you have paid to enter or travel',
            turkishMeaning: 'Bilet',
            example: "I've already bought the train tickets.",
            level: 'beginner'
          },
          {
            id: 'word5',
            word: 'Reservation',
            meaning: 'An arrangement to have something kept for you',
            turkishMeaning: 'Rezervasyon',
            example: 'Do you have a reservation for dinner?',
            level: 'intermediate'
          }
        ],
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
