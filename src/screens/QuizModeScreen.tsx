import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme, Appbar, Card, RadioButton, ProgressBar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/AppNavigator';
import { collection, getDocs } from 'firebase/firestore';
import { firestore, auth } from '../config/firebase';

type QuizModeScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'QuizMode'>;

interface Word {
  id: string;
  word: string;
  translation: string;
  turkishMeaning?: string;
  example: string;
}

const QuizModeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<QuizModeScreenNavigationProp>();
  const route = useRoute();
  const { listId } = route.params as { listId: string };

  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    fetchWords();
  }, [listId]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
    return () => clearInterval(timer);
  }, [timeLeft, timerActive]);

  const handleTimeUp = () => {
    setTimerActive(false);
    setShowResult(true);

    // Doğru cevabı göster
    console.log('Süre doldu, doğru cevap:', words[currentIndex].translation);

    setTimeout(() => {
      handleNext();
    }, 2000);
  };

  const fetchWords = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const wordsRef = collection(firestore, 'users', userId, 'wordLists', listId, 'words');
      const querySnapshot = await getDocs(wordsRef);
      const wordList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          word: data.word || '',
          translation: data.turkishMeaning || data.translation || 'Çeviri bulunamadı',
          example: data.example || ''
        };
      }) as Word[];

      console.log('Fetched words:', wordList);

      if (wordList.length > 0) {
        // Boş kelime veya çevirisi olan kelimeleri filtrele
        const validWords = wordList.filter(word =>
          word.word && word.word.trim() !== '' &&
          word.translation && word.translation !== 'Çeviri bulunamadı'
        );

        console.log('Valid words for quiz:', validWords);

        if (validWords.length > 0) {
          setWords(validWords);

          // Şıkları oluşturmadan önce kısa bir bekleme ekleyelim
          setTimeout(async () => {
            // İlk soru için şıkları oluştur
            await generateOptions(validWords, 0); // İlk soru için index 0 olarak belirt
            console.log('Options generated for first question');
            resetTimer();
          }, 100);
        } else {
          console.error('No valid words found for quiz');
          // Kullanıcıya bildirim gösterilebilir
        }
      }
    } catch (error) {
      console.error('Error fetching words:', error);
    }
  };

  const resetTimer = () => {
    setTimeLeft(10);
    setTimerActive(true);
  };

  const generateOptions = async (wordList: Word[], questionIndex: number = currentIndex) => {
    console.log('generateOptions called with wordList length:', wordList.length);

    if (wordList.length < 1) {
      console.error('Word list is empty or too small');
      return;
    }

    const currentWord = wordList[questionIndex];
    console.log('Current word:', currentWord, 'questionIndex:', questionIndex);

    if (!currentWord) {
      console.error('Current word is undefined, questionIndex:', questionIndex);
      return;
    }

    const correctAnswer = currentWord.translation;
    console.log('Correct answer:', correctAnswer);

    // Diğer kelimeleri al ve karıştır
    const otherWords = wordList.filter((_, index) => index !== questionIndex);
    console.log('Other words count:', otherWords.length);

    // Yanlış cevaplar için dizi
    const wrongAnswers: string[] = [];

    // Eğer başka kelimeler varsa, onları kullan
    if (otherWords.length > 0) {
      const shuffledOtherWords = [...otherWords].sort(() => Math.random() - 0.5);

      // Mevcut diğer kelimelerden yanlış cevaplar oluştur
      let i = 0;
      while (wrongAnswers.length < 3 && i < shuffledOtherWords.length) {
        const translation = shuffledOtherWords[i].translation;

        if (translation && translation !== correctAnswer && !wrongAnswers.includes(translation)) {
          wrongAnswers.push(translation);
        }
        i++;
      }
    }

    // Yeterli yanlış cevap yoksa, veritabanından rastgele kelimeler kullan
    // Önce tüm veritabanındaki kelimeleri almaya çalış
    if (wrongAnswers.length < 3) {
      try {
        const userId = auth.currentUser?.uid;
        if (userId) {
          // Tüm listeleri al
          const listsRef = collection(firestore, 'users', userId, 'wordLists');
          const listsSnapshot = await getDocs(listsRef);

          // Rastgele kelimeler için havuz oluştur
          const allWords: string[] = [];

          // Her listeden kelimeleri topla
          for (const listDoc of listsSnapshot.docs) {
            const wordsRef = collection(firestore, 'users', userId, 'wordLists', listDoc.id, 'words');
            const wordsSnapshot = await getDocs(wordsRef);

            wordsSnapshot.forEach(wordDoc => {
              const wordData = wordDoc.data();
              const translation = wordData.turkishMeaning || wordData.translation;

              // Geçerli bir çeviri varsa ve doğru cevap değilse ve zaten eklenmemişse
              if (translation &&
                  translation !== correctAnswer &&
                  !wrongAnswers.includes(translation) &&
                  !allWords.includes(translation)) {
                allWords.push(translation);
              }
            });
          }

          console.log(`Veritabanından ${allWords.length} kelime bulundu`);

          // Rastgele kelimeler seç
          if (allWords.length > 0) {
            // Kelimeleri karıştır
            const shuffledWords = [...allWords].sort(() => Math.random() - 0.5);

            // Gereken sayıda kelime ekle
            for (let i = 0; i < shuffledWords.length && wrongAnswers.length < 3; i++) {
              wrongAnswers.push(shuffledWords[i]);
            }
          }
        }
      } catch (error) {
        console.error('Veritabanından kelimeler alınırken hata oluştu:', error);
      }
    }

    // Hala yeterli yanlış cevap yoksa, son çare olarak yapay cevaplar ekle
    while (wrongAnswers.length < 3) {
      const randomTranslation = `Seçenek ${wrongAnswers.length + 1}`;
      if (!wrongAnswers.includes(randomTranslation) && randomTranslation !== correctAnswer) {
        wrongAnswers.push(randomTranslation);
      }
    }

    // Tüm seçenekleri oluştur (doğru cevap + yanlış cevaplar)
    const allOptions = [
      ...wrongAnswers,
      correctAnswer  // Doğru cevabı da ekle
    ];

    // Seçenekleri karıştır
    const shuffledOptions = [...allOptions].sort(() => Math.random() - 0.5);
    console.log('Generated options:', shuffledOptions);

    // Şıkları ayarla
    setOptions(shuffledOptions);
  };

  const handleAnswer = () => {
    // Doğru cevabı kontrol et
    const currentWord = words[currentIndex];
    const correctAnswer = currentWord.translation;

    console.log('Seçilen cevap:', selectedAnswer);
    console.log('Doğru cevap:', correctAnswer);

    if (selectedAnswer === correctAnswer) {
      setScore(score + 1);
      console.log('Doğru cevap verildi! Yeni skor:', score + 1);
    } else {
      console.log('Yanlış cevap verildi. Skor değişmedi:', score);
    }

    setShowResult(true);
    setTimerActive(false);
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setSelectedAnswer(null);
      setShowResult(false);

      // Şıkları güncelle
      console.log('Moving to next question, index:', newIndex);

      // Kısa bir bekleme ekleyerek şıkların oluşturulmasını sağla
      setTimeout(async () => {
        if (words && words.length > newIndex) {
          console.log('Generating options for next question, index:', newIndex);
          await generateOptions(words, newIndex);
        }
        resetTimer();
      }, 100);
    } else {
      navigation.navigate('QuizResults', {
        score,
        totalQuestions: words.length,
        listId
      });
    }
  };

  const currentWord = words[currentIndex];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Quiz Modu" />
      </Appbar.Header>

      <View style={styles.content}>
        <Card style={styles.scoreCard}>
          <Card.Content>
            <Text variant="titleLarge">Skor: {score}/{words.length}</Text>
            <ProgressBar
              progress={timeLeft / 10}
              color={theme.colors.primary}
              style={styles.timer}
            />
            <Text variant="bodyMedium" style={styles.timerText}>
              Kalan Süre: {timeLeft} saniye
            </Text>
          </Card.Content>
        </Card>

        {currentWord && (
          <Card style={styles.questionCard}>
            <Card.Content>
              <Text variant="headlineMedium" style={styles.question}>
                {currentWord.word}
              </Text>
              <Text variant="bodyMedium" style={styles.example}>
                {currentWord.example}
              </Text>

              <View style={styles.options}>
                {options.map((option, index) => (
                  <RadioButton.Item
                    key={index}
                    label={option}
                    value={option}
                    status={selectedAnswer === option ? 'checked' : 'unchecked'}
                    onPress={() => setSelectedAnswer(option)}
                    disabled={showResult}
                  />
                ))}
              </View>

              {showResult && (
                <Text
                  variant="bodyLarge"
                  style={[
                    styles.result,
                    {
                      color:
                        selectedAnswer === currentWord.translation
                          ? 'green'
                          : 'red',
                    },
                  ]}
                >
                  {selectedAnswer === currentWord.translation
                    ? 'Doğru!'
                    : `Yanlış! Doğru cevap: ${currentWord.translation}`}
                </Text>
              )}
            </Card.Content>
          </Card>
        )}

        <View style={styles.buttons}>
          {!showResult ? (
            <Button
              mode="contained"
              onPress={handleAnswer}
              disabled={!selectedAnswer}
            >
              Cevapla
            </Button>
          ) : (
            <Button mode="contained" onPress={handleNext}>
              {currentIndex < words.length - 1 ? 'Sonraki Soru' : 'Sonuçları Gör'}
            </Button>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  scoreCard: {
    marginBottom: 16,
  },
  questionCard: {
    marginBottom: 16,
  },
  question: {
    marginBottom: 8,
    textAlign: 'center',
  },
  example: {
    marginBottom: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  options: {
    marginTop: 16,
  },
  result: {
    marginTop: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttons: {
    marginTop: 16,
  },
  timer: {
    marginTop: 8,
    height: 8,
  },
  timerText: {
    marginTop: 4,
    textAlign: 'center',
  },
});

export default QuizModeScreen;