import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, useTheme, ActivityIndicator, Snackbar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { updateUserStats } from '../services/statsService';

const CreateListScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [listName, setListName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const handleCreateList = async () => {
    if (!listName.trim()) {
      setError('List name is required');
      setSnackbarVisible(true);
      return;
    }

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const listsRef = collection(db, 'wordLists');
      await addDoc(listsRef, {
        name: listName.trim(),
        userId,
        createdAt: new Date(),
        words: [],
      });

      // İstatistikleri güncelle
      await updateUserStats('list');

      navigation.goBack();
    } catch (error) {
      console.error('Liste oluşturulurken hata oluştu:', error);
    }
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
          Create New List
        </Text>

        <TextInput
          label="List Name"
          value={listName}
          onChangeText={setListName}
          style={styles.input}
          mode="outlined"
          error={!!(error && !listName.trim())}
        />

        <TextInput
          label="Description (Optional)"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={3}
        />

        <View style={styles.section}>
          <Text variant="titleMedium" style={{ color: theme.colors.onBackground, marginBottom: 16 }}>
            List Settings
          </Text>
          <View style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
              Public List
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Anyone can view and use this list
            </Text>
          </View>
          <View style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
              Auto-Translate
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Automatically translate words to your target language
            </Text>
          </View>
        </View>

        <Button
          mode="contained"
          onPress={handleCreateList}
          style={[styles.createButton, { backgroundColor: theme.colors.primary }]}
          loading={loading}
        >
          Create List
        </Button>
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
  section: {
    marginBottom: 24,
  },
  settingItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  createButton: {
    marginTop: 8,
  },
});

export default CreateListScreen; 