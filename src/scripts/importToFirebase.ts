import { importWordsFromJSON } from '../services/wordService';
import words from '../data/oxfordWords.json';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyDBDW6bpDkpi_VoqHOunMvt9zm_yPs_Y3g",
  authDomain: "goatdevelopersmobile.firebaseapp.com",
  databaseURL: "https://goatdevelopersmobile-default-rtdb.firebaseio.com",
  projectId: "goatdevelopersmobile",
  storageBucket: "goatdevelopersmobile.firebasestorage.app",
  messagingSenderId: "692699347598",
  appId: "1:692699347598:web:c2648265fbbc46f18727df",
  measurementId: "G-J9C59DDGBJ"
};

// Türkçe anlamlar için örnek veri
const turkishMeanings: { [key: string]: string } = {
  "ability": "yetenek, kabiliyet",
  "about": "hakkında, yaklaşık",
  "above": "üstünde, yukarıda",
  "accept": "kabul etmek",
  "accident": "kaza",
  "achieve": "başarmak",
  "across": "karşısında, boyunca",
  "act": "hareket etmek, davranmak",
  "active": "aktif, etkin",
  "activity": "faaliyet, aktivite"
  // Diğer kelimelerin Türkçe anlamlarını buraya ekleyebilirsiniz
};

const importToFirebase = async () => {
  try {
    // Firebase'i başlat
    console.log('Firebase başlatılıyor...');
    const app = initializeApp(firebaseConfig);
    console.log('Firebase başlatıldı!');

    // Kelimeleri temizle ve formatla
    const formattedWords = words.words.map(word => ({
      word: word.word.replace(/[.#$\[\]]/g, ''), // Geçersiz karakterleri temizle
      meaning: word.meaning,
      turkishMeaning: turkishMeanings[word.word] || 'Türkçe anlamı bulunamadı',
      level: word.level,
      example: word.example || ''
    }));

    console.log('Kelimeler Firebase\'e yükleniyor...');
    await importWordsFromJSON(formattedWords);
    console.log('Kelimeler başarıyla Firebase\'e yüklendi!');
  } catch (error) {
    console.error('Firebase\'e yükleme sırasında hata oluştu:', error);
  }
};

importToFirebase(); 