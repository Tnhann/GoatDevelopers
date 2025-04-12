import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme, Appbar, Card, RadioButton } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Word {
  id: string;
  word: string;
  translation: string;
  example: string;
}

const QuizModeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { listId } = route.params as { listId: string };

  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    fetchWords();
  }, [listId]);

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
    } catch (error) {
      console.error('Error fetching words:', error);
    }
  };

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
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      generateOptions(words);
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
        )}
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
  },
});

export default QuizModeScreen; 