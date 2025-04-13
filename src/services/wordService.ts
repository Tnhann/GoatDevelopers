import { getDatabase, ref, set, get, child } from 'firebase/database';
import { Word } from '../types/word';

const db = getDatabase();

export const addWord = async (word: Word) => {
  const cleanWord = word.word.replace(/[.#$\[\]]/g, '');
  await set(ref(db, `words/${cleanWord}`), {
    word: cleanWord,
    meaning: word.meaning,
    turkishMeaning: word.turkishMeaning,
    level: word.level,
    example: word.example
  });
};

export const getWord = async (word: string): Promise<Word | null> => {
  const cleanWord = word.replace(/[.#$\[\]]/g, '');
  const snapshot = await get(child(ref(db), `words/${cleanWord}`));
  return snapshot.exists() ? snapshot.val() : null;
};

export const getAllWords = async (): Promise<Word[]> => {
  const db = getDatabase();
  const wordsRef = ref(db, 'words');
  const snapshot = await get(wordsRef);
  return snapshot.val() ? Object.values(snapshot.val()) : [];
};

export const importWordsFromJSON = async (words: Word[]) => {
  const batch: { [key: string]: Word } = {};
  
  words.forEach(word => {
    const cleanWord = word.word.replace(/[.#$\[\]]/g, '');
    batch[cleanWord] = {
      word: cleanWord,
      meaning: word.meaning,
      turkishMeaning: word.turkishMeaning,
      level: word.level,
      example: word.example
    };
  });

  await set(ref(db, 'words'), batch);
}; 