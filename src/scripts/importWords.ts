import { importWordsFromJSON } from '../services/wordService';
import words from '../data/oxfordWords.json';

const importWords = async () => {
  try {
    await importWordsFromJSON(words.words);
    console.log('Kelimeler başarıyla yüklendi!');
  } catch (error) {
    console.error('Kelimeler yüklenirken hata oluştu:', error);
  }
};

importWords(); 