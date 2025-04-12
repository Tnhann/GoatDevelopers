import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme, Appbar, Card } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Word {
  id: string;
  word: string;
  translation: string;
  example: string;
}

const LearningModeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { listId } = route.params as { listId: string };

  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);

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
    } catch (error) {
      console.error('Error fetching words:', error);
    }
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowTranslation(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowTranslation(false);
    }
  };

  const currentWord = words[currentIndex];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Öğrenme Modu" />
      </Appbar.Header>

      <View style={styles.content}>
        <Card style={styles.progressCard}>
          <Card.Content>
            <Text variant="titleLarge">
              {currentIndex + 1}/{words.length}
            </Text>
          </Card.Content>
        </Card>

        {currentWord && (
          <Card style={styles.wordCard}>
            <Card.Content>
              <Text variant="headlineMedium" style={styles.word}>
                {currentWord.word}
              </Text>

              {showTranslation ? (
                <>
                  <Text variant="titleLarge" style={styles.translation}>
                    {currentWord.translation}
                  </Text>
                  <Text variant="bodyMedium" style={styles.example}>
                    {currentWord.example}
                  </Text>
                </>
              ) : (
                <Button
                  mode="contained"
                  onPress={() => setShowTranslation(true)}
                  style={styles.showButton}
                >
                  Çeviriyi Göster
                </Button>
              )}
            </Card.Content>
          </Card>
        )}

        <View style={styles.navigationButtons}>
          <Button
            mode="outlined"
            onPress={handlePrevious}
            disabled={currentIndex === 0}
            style={styles.navButton}
          >
            Önceki
          </Button>
          <Button
            mode="contained"
            onPress={handleNext}
            disabled={currentIndex === words.length - 1}
            style={styles.navButton}
          >
            Sonraki
          </Button>
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
  progressCard: {
    marginBottom: 16,
  },
  wordCard: {
    flex: 1,
    marginBottom: 16,
  },
  word: {
    textAlign: 'center',
    marginBottom: 24,
  },
  translation: {
    textAlign: 'center',
    marginBottom: 16,
  },
  example: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  showButton: {
    marginTop: 24,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default LearningModeScreen; 