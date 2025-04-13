import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, useTheme, Button, Icon, Portal, Dialog, Snackbar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { updateUserStats } from '../services/statsService';
import { auth } from '../config/firebase';

const { width } = Dimensions.get('window');

const WordLearningScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { list } = route.params as { list: any };
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isLastWord, setIsLastWord] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    setIsLastWord(currentIndex === list.words.length - 1);
  }, [currentIndex, list.words.length]);

  const handleNext = () => {
    if (currentIndex < list.words.length - 1) {
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
        wordsLearned: list.words.length
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

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={styles.progress}>
          {currentIndex + 1}/{list.words.length}
        </Text>

        <View style={styles.wordContainer}>
          <Text variant="headlineLarge" style={[styles.word, { color: theme.colors.onBackground }]}>
            {list.words[currentIndex].word}
          </Text>
        </View>

        <Button
          mode="contained"
          onPress={() => setShowTranslation(true)}
          style={styles.translationButton}
          labelStyle={styles.translationButtonText}
        >
          Çeviriyi Göster
        </Button>

        {showTranslation && (
          <Text variant="bodyLarge" style={[styles.translation, { color: theme.colors.onSurfaceVariant }]}>
            {list.words[currentIndex].translation}
          </Text>
        )}

        <View style={styles.bottomButtons}>
          <Button
            mode="outlined"
            onPress={handlePrevious}
            disabled={currentIndex === 0}
            style={[styles.navigationButton, { borderColor: theme.colors.primary }]}
            labelStyle={{ color: theme.colors.primary }}
          >
            Önceki
          </Button>

          {isLastWord ? (
            <Button
              mode="contained"
              onPress={handleComplete}
              style={[styles.navigationButton, { backgroundColor: theme.colors.primary }]}
              labelStyle={{ color: theme.colors.onPrimary }}
            >
              Tamamla
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={handleNext}
              style={[styles.navigationButton, { backgroundColor: theme.colors.primary }]}
              labelStyle={{ color: theme.colors.onPrimary }}
            >
              Sonraki
            </Button>
          )}
        </View>
      </View>

      <Portal>
        <Dialog visible={showDialog} onDismiss={handleDialogDismiss}>
          <Dialog.Title>Tebrikler!</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Kelime modunu başarıyla tamamladınız. Toplam {list.words.length} kelime öğrendiniz.
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
  progress: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 24,
  },
  wordContainer: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 20,
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
  translationButtonText: {
    fontSize: 16,
    padding: 8,
  },
  translation: {
    textAlign: 'center',
    fontSize: 24,
    marginTop: 16,
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

export default WordLearningScreen; 