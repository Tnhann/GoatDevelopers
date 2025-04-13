import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, useTheme, IconButton, ActivityIndicator, Snackbar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface Word {
  word: string;
  translation: string;
  example: string;
}

const AddWordsScreen = () => {
  const theme = useTheme();
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [example, setExample] = useState('');
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const handleAddWord = () => {
    if (!word.trim() || !translation.trim()) {
      setError('Word and translation are required');
      setSnackbarVisible(true);
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setWords([...words, { word, translation, example }]);
      setWord('');
      setTranslation('');
      setExample('');
      setLoading(false);
    }, 500);
  };

  const handleRemoveWord = (index: number) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newWords = words.filter((_, i) => i !== index);
      setWords(newWords);
      setLoading(false);
    }, 500);
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
          Add New Words
        </Text>

        <TextInput
          label="Word"
          value={word}
          onChangeText={setWord}
          style={styles.input}
          mode="outlined"
          error={!!(error && !word.trim())}
        />

        <TextInput
          label="Translation"
          value={translation}
          onChangeText={setTranslation}
          style={styles.input}
          mode="outlined"
          error={!!(error && !translation.trim())}
        />

        <TextInput
          label="Example Sentence (Optional)"
          value={example}
          onChangeText={setExample}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={3}
        />

        <Button
          mode="contained"
          onPress={handleAddWord}
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          loading={loading}
        >
          Add Word
        </Button>

        <View style={styles.wordsList}>
          {words.map((item, index) => (
            <View key={index} style={[styles.wordItem, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.wordContent}>
                <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
                  {item.word}
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                  {item.translation}
                </Text>
                {item.example && (
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, fontStyle: 'italic' }}>
                    {item.example}
                  </Text>
                )}
              </View>
              <IconButton
                icon="delete"
                size={24}
                onPress={() => handleRemoveWord(index)}
                iconColor={theme.colors.error}
              />
            </View>
          ))}
        </View>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: 'Dismiss',
          onPress: () => setSnackbarVisible(false),
        }}
        duration={3000}
      >
        {error}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 24,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
  },
  addButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  wordsList: {
    gap: 12,
  },
  wordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    elevation: 2,
  },
  wordContent: {
    flex: 1,
    gap: 4,
  },
});

export default AddWordsScreen; 