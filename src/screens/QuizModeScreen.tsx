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
          word: data.word,
          translation: data.turkishMeaning || data.translation || '',
          example: data.example || ''
        };
      }) as Word[];

      if (wordList.length > 0) {
        setWords(wordList);
        generateOptions(wordList);
        resetTimer();
      }
    } catch (error) {
      console.error('Error fetching words:', error);
    }
  };

  const resetTimer = () => {
    setTimeLeft(10);
    setTimerActive(true);
  };

  const generateOptions = (wordList: Word[]) => {
    if (wordList.length < 4) return;

    const currentWord = wordList[currentIndex];
    const correctAnswer = currentWord.translation;

    // Diğer kelimeleri al ve karıştır
    const otherWords = wordList.filter((_, index) => index !== currentIndex);
    const shuffledOtherWords = [...otherWords].sort(() => Math.random() - 0.5);

    // Benzersiz yanlış cevapları topla (doğru cevaptan farklı olmalı)
    const wrongAnswers: string[] = [];
    let i = 0;

    // 3 benzersiz yanlış cevap bulana kadar devam et
    while (wrongAnswers.length < 3 && i < shuffledOtherWords.length) {
      const translation = shuffledOtherWords[i].translation;

      // Eğer çeviri doğru cevaptan farklıysa ve henüz eklenmemişse ekle
      if (translation !== correctAnswer && !wrongAnswers.includes(translation)) {
        wrongAnswers.push(translation);
      }

      i++;
    }

    // Eğer yeterli benzersiz yanlış cevap bulunamadıysa, rastgele çeviriler oluştur
    while (wrongAnswers.length < 3) {
      const randomTranslation = `Yanlış Cevap ${wrongAnswers.length + 1}`;
      wrongAnswers.push(randomTranslation);
    }

    // Tüm seçenekleri oluştur (doğru cevap + yanlış cevaplar)
    const allOptions = [...wrongAnswers, correctAnswer];

    // Seçenekleri karıştır
    setOptions(allOptions.sort(() => Math.random() - 0.5));
  };

  const handleAnswer = () => {
    if (selectedAnswer === words[currentIndex].translation) {
      setScore(score + 1);
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

      // YENİ EKLENEN: Şıkları manuel olarak güncelle
      // Yeni indekse göre şıkları oluştur
      if (words && words.length > newIndex) {
        const currentWord = words[newIndex];
        let correctAnswer = currentWord.translation;

        // Doğru cevap boş ise varsayılan bir değer ata
        if (!correctAnswer || correctAnswer.trim() === '') {
          correctAnswer = 'Çeviri bulunamadı';
          currentWord.translation = correctAnswer;
        }

        console.log('Yeni soru için doğru cevap:', correctAnswer);

        // Veritabanındaki diğer kelimelerden yanlış cevaplar oluştur
        const wrongAnswers: string[] = [];

        // Diğer kelimeleri kullan
        const otherWords = words.filter((_word, index) => index !== newIndex);

        // Eğer yeterli kelime varsa, rastgele 3 tanesini seç
        if (otherWords.length >= 3) {
          // Diğer kelimeleri karıştır
          const shuffledWords = [...otherWords].sort(() => Math.random() - 0.5);

          // İlk 3 kelimeyi al
          for (let i = 0; i < 3 && i < shuffledWords.length; i++) {
            const translation = shuffledWords[i].translation;

            // Eğer çeviri doğru cevapla aynı değilse ve daha önce eklenmemişse ekle
            if (translation && translation !== correctAnswer && !wrongAnswers.includes(translation)) {
              wrongAnswers.push(translation);
            }
          }
        }

        // Yeterli yanlış cevap yoksa, yapay cevaplar ekle
        while (wrongAnswers.length < 3) {
          const randomTranslation = `Yanlış Cevap ${wrongAnswers.length + 1}`;
          if (!wrongAnswers.includes(randomTranslation) && randomTranslation !== correctAnswer) {
            wrongAnswers.push(randomTranslation);
          }
        }

        // Tüm seçenekleri oluştur (doğru cevap + yanlış cevaplar)
        const allOptions = [
          correctAnswer,  // Doğru cevap
          ...wrongAnswers  // Yanlış cevaplar
        ];

        // Seçenekleri karıştır
        const newOptions = [...allOptions].sort(() => Math.random() - 0.5);

        // Şıkları ayarla
        setOptions(newOptions);
        console.log('Yeni soru için ayarlanan şıklar:', newOptions);
      }

      resetTimer();
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