import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
<<<<<<< HEAD
import { Text, Button, useTheme, Appbar, Card, RadioButton } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

=======
import { Text, Button, useTheme, Appbar, Card, RadioButton, ProgressBar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/AppNavigator';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

type QuizModeScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'QuizMode'>;

>>>>>>> 71e0de329ca0e5cd00b6ed2ecb7645aba3f44892
interface Word {
  id: string;
  word: string;
  translation: string;
  example: string;
}

const QuizModeScreen = () => {
  const theme = useTheme();
<<<<<<< HEAD
  const navigation = useNavigation();
=======
  const navigation = useNavigation<QuizModeScreenNavigationProp>();
>>>>>>> 71e0de329ca0e5cd00b6ed2ecb7645aba3f44892
  const route = useRoute();
  const { listId } = route.params as { listId: string };

  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
<<<<<<< HEAD
=======
  const [timeLeft, setTimeLeft] = useState(10);
  const [timerActive, setTimerActive] = useState(true);
>>>>>>> 71e0de329ca0e5cd00b6ed2ecb7645aba3f44892

  useEffect(() => {
    fetchWords();
  }, [listId]);

<<<<<<< HEAD
=======
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
    // Zaman dolduğunda otomatik olarak bir sonraki soruya geç
    setTimeout(() => {
      handleNext();
    }, 2000);
  };

>>>>>>> 71e0de329ca0e5cd00b6ed2ecb7645aba3f44892
  const fetchWords = async () => {
    try {
      const wordsRef = collection(db, 'wordLists', listId, 'words');
      const querySnapshot = await getDocs(wordsRef);
      const wordList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Word[];
      setWords(wordList);
      generateOptions(wordList);
<<<<<<< HEAD
=======
      resetTimer();
>>>>>>> 71e0de329ca0e5cd00b6ed2ecb7645aba3f44892
    } catch (error) {
      console.error('Error fetching words:', error);
    }
  };

<<<<<<< HEAD
=======
  const resetTimer = () => {
    setTimeLeft(10);
    setTimerActive(true);
  };

>>>>>>> 71e0de329ca0e5cd00b6ed2ecb7645aba3f44892
  const generateOptions = (wordList: Word[]) => {
    if (wordList.length < 4) return;
    
    const currentWord = wordList[currentIndex];
    const otherWords = wordList.filter((_, index) => index !== currentIndex);
    const randomWords = otherWords
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(word => word.translation);
    
    const allOptions = [...randomWords, currentWord.translation];
    setOptions(allOptions.sort(() => Math.random() - 0.5));
  };

  const handleAnswer = () => {
    if (selectedAnswer === words[currentIndex].translation) {
      setScore(score + 1);
    }
    setShowResult(true);
<<<<<<< HEAD
=======
    setTimerActive(false);
>>>>>>> 71e0de329ca0e5cd00b6ed2ecb7645aba3f44892
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      generateOptions(words);
<<<<<<< HEAD
=======
      resetTimer();
    } else {
      // Quiz bitti, sonuçları göster
      navigation.navigate('QuizResults', { 
        score, 
        totalQuestions: words.length,
        listId 
      });
>>>>>>> 71e0de329ca0e5cd00b6ed2ecb7645aba3f44892
    }
  };

  const currentWord = words[currentIndex];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Quiz Modu" />
<<<<<<< HEAD
      </Appbar.Header>

      <View style={styles.content}>
        <Card style={styles.scoreCard}>
          <Card.Content>
            <Text variant="titleLarge">Skor: {score}/{words.length}</Text>
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

              <View style={styles.buttonContainer}>
                {!showResult ? (
                  <Button
                    mode="contained"
                    onPress={handleAnswer}
                    disabled={!selectedAnswer}
                  >
                    Cevapla
                  </Button>
                ) : (
                  <Button
                    mode="contained"
                    onPress={handleNext}
                    disabled={currentIndex === words.length - 1}
                  >
                    {currentIndex === words.length - 1 ? 'Quiz Bitti' : 'Sonraki'}
                  </Button>
                )}
              </View>
            </Card.Content>
          </Card>
=======
        <Appbar.Action icon="timer" />
        <Text style={styles.timer}>{timeLeft}s</Text>
      </Appbar.Header>

      <View style={styles.progressContainer}>
        <ProgressBar 
          progress={timeLeft / 10} 
          color={timeLeft > 3 ? theme.colors.primary : theme.colors.error}
          style={styles.progressBar}
        />
      </View>

      <View style={styles.content}>
        <Card style={styles.questionCard}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.question}>
              {currentWord?.word}
            </Text>
          </Card.Content>
        </Card>

        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <Card
              key={index}
              style={[
                styles.optionCard,
                showResult && {
                  backgroundColor: option === words[currentIndex].translation
                    ? theme.colors.primaryContainer
                    : selectedAnswer === option
                    ? theme.colors.errorContainer
                    : undefined
                }
              ]}
              onPress={() => !showResult && setSelectedAnswer(option)}
            >
              <Card.Content>
                <Text variant="bodyLarge">{option}</Text>
              </Card.Content>
            </Card>
          ))}
        </View>

        {!showResult && selectedAnswer && (
          <Button
            mode="contained"
            onPress={handleAnswer}
            style={styles.submitButton}
          >
            Cevapla
          </Button>
        )}

        {showResult && (
          <Button
            mode="contained"
            onPress={handleNext}
            style={styles.nextButton}
          >
            {currentIndex < words.length - 1 ? 'Sonraki Soru' : 'Sonuçları Gör'}
          </Button>
>>>>>>> 71e0de329ca0e5cd00b6ed2ecb7645aba3f44892
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
<<<<<<< HEAD
=======
  progressContainer: {
    padding: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  timer: {
    marginRight: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
>>>>>>> 71e0de329ca0e5cd00b6ed2ecb7645aba3f44892
  content: {
    flex: 1,
    padding: 16,
  },
<<<<<<< HEAD
  scoreCard: {
    marginBottom: 16,
  },
  questionCard: {
    flex: 1,
  },
  question: {
    textAlign: 'center',
    marginBottom: 16,
  },
  example: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 24,
  },
  options: {
    marginBottom: 24,
  },
  result: {
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 'auto',
=======
  questionCard: {
    marginBottom: 24,
  },
  question: {
    textAlign: 'center',
    marginVertical: 16,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 24,
  },
  nextButton: {
    marginTop: 24,
>>>>>>> 71e0de329ca0e5cd00b6ed2ecb7645aba3f44892
  },
});

export default QuizModeScreen; 