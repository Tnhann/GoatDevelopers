import fs from 'fs';
import path from 'path';

interface WordData {
  text: string;
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
}

interface PageData {
  page: number;
  words: WordData[];
}

interface PDFResult {
  filename: string;
  page_data: PageData[];
}

interface PDFData {
  results: PDFResult[];
}

const convertWordsToJSON = () => {
  try {
    // Words.txt dosyasını oku ve JSON olarak parse et
    const wordsText = fs.readFileSync(path.join(__dirname, '../../Words.txt'), 'utf-8');
    const pdfData: PDFData = JSON.parse(wordsText);

    const words: any[] = [];
    let currentWord = '';
    let currentMeaning = '';
    let currentLevel = '';

    // Her sayfadaki kelimeleri işle
    pdfData.results[0].page_data.forEach(page => {
      // Kelimeleri y koordinatına göre grupla (aynı satırdaki kelimeler)
      const lines: { [key: number]: WordData[] } = {};
      
      page.words.forEach(word => {
        const y = Math.round(word.ymin / 10) * 10; // Yuvarlama yaparak yakın satırları grupla
        if (!lines[y]) {
          lines[y] = [];
        }
        lines[y].push(word);
      });

      // Her satırı işle
      Object.values(lines).forEach(lineWords => {
        // Satırı soldan sağa sırala
        lineWords.sort((a, b) => a.xmin - b.xmin);
        
        // Satırdaki kelimeleri birleştir
        const lineText = lineWords.map(w => w.text).join(' ');

        // Kelime ve anlamı ayır
        if (lineText.match(/^[A-Za-z]+/)) {
          // Bu bir kelime satırı
          const parts = lineText.split(/\s+/);
          currentWord = parts[0];
          
          // Seviye bilgisini bul (B2, C1 gibi)
          const levelMatch = lineText.match(/\b([ABC][12])\b/);
          currentLevel = levelMatch ? levelMatch[1] : 'A1';
          
          // Anlamı bul
          currentMeaning = parts.slice(1).join(' ').replace(/\b([ABC][12])\b/, '').trim();
        }

        // Kelimeyi listeye ekle
        if (currentWord && currentMeaning) {
          words.push({
            word: currentWord,
            meaning: currentMeaning,
            level: currentLevel,
            example: '' // Örnek cümle eklemek isterseniz buraya ekleyebilirsiniz
          });
          
          // Geçici değişkenleri temizle
          currentWord = '';
          currentMeaning = '';
          currentLevel = '';
        }
      });
    });

    // JSON dosyasına kaydet
    const jsonOutput = {
      words: words
    };

    fs.writeFileSync(
      path.join(__dirname, '../data/oxfordWords.json'),
      JSON.stringify(jsonOutput, null, 2)
    );

    console.log('Kelimeler başarıyla JSON formatına dönüştürüldü!');
    console.log(`Toplam ${words.length} kelime işlendi.`);
  } catch (error) {
    console.error('Dönüştürme sırasında hata oluştu:', error);
  }
};

convertWordsToJSON(); 