import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme, Appbar, Card, Portal, Dialog, Snackbar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { updateUserStats } from '../services/statsService';
import { auth, firestore } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface Word {
  id: string;
  word: string;
  translation?: string;
  turkishMeaning?: string;
}

interface RouteParams {
  listId: string;
}

const LearningModeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { listId } = route.params as RouteParams;
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isLastWord, setIsLastWord] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWords();
  }, [listId]);

  useEffect(() => {
    if (words.length > 0) {
      setIsLastWord(currentIndex === words.length - 1);
    }
  }, [currentIndex, words.length]);

  const fetchWords = async () => {
    try {
      if (!auth.currentUser) {
        setSnackbarMessage('Kullanıcı girişi yapılmamış');
        setShowSnackbar(true);
        return;
      }

      const wordsRef = collection(firestore, 'users', auth.currentUser.uid, 'wordLists', listId, 'words');
      const querySnapshot = await getDocs(wordsRef);
      const fetchedWords = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          word: data.word,
          translation: data.turkishMeaning || data.translation || '',
          ...data
        };
      }) as Word[];

      if (fetchedWords.length === 0) {
        setSnackbarMessage('Kelime listesi boş');
        setShowSnackbar(true);
        setTimeout(() => {
          navigation.goBack();
        }, 2000);
        return;
      }

      console.log('Fetched words:', fetchedWords); // Debug için
      setWords(fetchedWords);
      setLoading(false);
    } catch (error) {
      console.error('Kelimeler yüklenirken hata oluştu:', error);
      setSnackbarMessage('Kelimeler yüklenirken hata oluştu');
      setShowSnackbar(true);
      setLoading(false);
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

  const handleComplete = async () => {
    try {
      if (!auth.currentUser) {
        setSnackbarMessage('Kullanıcı girişi yapılmamış');
        setShowSnackbar(true);
        return;
      }

      await updateUserStats('wordMode', {
        wordsLearned: words.length
      });

      setShowDialog(true);
    } catch (error) {
      console.error('İstatistikler güncellenirken hata oluştu:', error);
      setSnackbarMessage('İstatistikler güncellenirken hata oluştu');
      setShowSnackbar(true);
    }
  };

  const handleDialogDismiss = () => {
    setShowDialog(false);
    navigation.goBack();
  };

  const getCurrentTranslation = () => {
    const currentWord = words[currentIndex];
    return currentWord?.turkishMeaning || currentWord?.translation || '';
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Öğrenme Modu" />
        </Appbar.Header>
        <View style={[styles.content, styles.centerContent]}>
          <Text>Yükleniyor...</Text>
        </View>
      </View>
    );
  }

  if (words.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Öğrenme Modu" />
        </Appbar.Header>
        <View style={[styles.content, styles.centerContent]}>
          <Text>Kelime listesi bulunamadı</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Öğrenme Modu" />
      </Appbar.Header>

      <View style={styles.content}>
        <Text style={styles.progress}>
          {currentIndex + 1}/{words.length}
        </Text>

        <Card style={styles.wordCard}>
          <Card.Content>
            <Text variant="headlineLarge" style={[styles.word, { color: theme.colors.onBackground }]}>
              {words[currentIndex].word}
            </Text>
          </Card.Content>
        </Card>

        {!showTranslation && (
          <Button
            mode="contained"
            onPress={() => setShowTranslation(true)}
            style={styles.translationButton}
          >
            Çeviriyi Göster
          </Button>
        )}

        {showTranslation && (
          <Card style={styles.translationCard}>
            <Card.Content>
              <Text variant="bodyLarge" style={[styles.translation, { color: theme.colors.onSurfaceVariant }]}>
                {getCurrentTranslation()}
              </Text>
            </Card.Content>
          </Card>
        )}

        <View style={styles.bottomButtons}>
          <Button
            mode="outlined"
            onPress={handlePrevious}
            disabled={currentIndex === 0}
            style={[styles.navigationButton, { borderColor: theme.colors.primary }]}
          >
            Önceki
          </Button>

          <Button
            mode="contained"
            onPress={isLastWord ? handleComplete : handleNext}
            style={[styles.navigationButton, { backgroundColor: theme.colors.primary }]}
          >
            {isLastWord ? 'Tamamla' : 'Sonraki'}
          </Button>
        </View>
      </View>

      <Portal>
        <Dialog visible={showDialog} onDismiss={handleDialogDismiss}>
          <Dialog.Title>Tebrikler!</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Kelime modunu başarıyla tamamladınız. Toplam {words.length} kelime öğrendiniz.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleDialogDismiss}>Tamam</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 24,
  },
  wordCard: {
    marginBottom: 24,
    borderRadius: 12,
    elevation: 2,
  },
  word: {
    fontSize: 32,
    textAlign: 'center',
  },
  translationButton: {
    marginVertical: 16,
    borderRadius: 8,
  },
  translationCard: {
    marginTop: 16,
    borderRadius: 12,
    elevation: 2,
  },
  translation: {
    fontSize: 24,
    textAlign: 'center',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
  },
  navigationButton: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 8,
    paddingVertical: 8,
  },
});

export default LearningModeScreen;