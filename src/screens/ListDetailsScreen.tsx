import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Button, useTheme, Icon, FAB, Portal, Modal, TextInput, Snackbar, Appbar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/AppNavigator';
import { collection, getDocs, addDoc, query, where, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

type ListDetailsScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'ListDetails'>;

interface Word {
  id: string;
  word: string;
  translation: string;
  example: string;
}

interface WordList {
  id: string;
  title: string;
  description: string;
  wordCount: number;
  language: string;
  userId: string;
}

const ListDetailsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<ListDetailsScreenNavigationProp>();
  const route = useRoute();
  const { listId } = route.params as { listId: string };
  
  const [wordList, setWordList] = useState<WordList | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [newWord, setNewWord] = useState({
    word: '',
    translation: '',
    example: ''
  });

  useEffect(() => {
    fetchWordList();
    fetchWords();
  }, [listId]);

  const fetchWordList = async () => {
    try {
      const docRef = doc(db, 'wordLists', listId);
      const docSnap = await getDocs(collection(db, 'wordLists'));
      const list = docSnap.docs.find(doc => doc.id === listId)?.data() as WordList;
      setWordList(list);
    } catch (error) {
      console.error('Error fetching word list:', error);
      setError('Liste yüklenirken bir hata oluştu');
      setSnackbarVisible(true);
    }
  };

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
      setError('Kelimeler yüklenirken bir hata oluştu');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWord = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setError('Kullanıcı girişi yapılmamış');
        setSnackbarVisible(true);
        return;
      }

      if (!newWord.word.trim() || !newWord.translation.trim()) {
        setError('Lütfen kelime ve çevirisini girin');
        setSnackbarVisible(true);
        return;
      }

      const wordsRef = collection(db, 'wordLists', listId, 'words');
      await addDoc(wordsRef, {
        ...newWord,
        createdAt: new Date()
      });
      setNewWord({ word: '', translation: '', example: '' });
      setModalVisible(false);
      fetchWords();
    } catch (error) {
      console.error('Error adding word:', error);
      setError('Kelime eklenirken bir hata oluştu');
      setSnackbarVisible(true);
    }
  };

  const handleDeleteWord = async (wordId: string) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setError('Kullanıcı girişi yapılmamış');
        setSnackbarVisible(true);
        return;
      }

      await deleteDoc(doc(db, 'wordLists', listId, 'words', wordId));
      fetchWords();
    } catch (error) {
      console.error('Error deleting word:', error);
      setError('Kelime silinirken bir hata oluştu');
      setSnackbarVisible(true);
    }
  };

  const renderWord = ({ item }: { item: Word }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.wordHeader}>
          <Text variant="titleMedium">{item.word}</Text>
          <Text variant="bodyMedium" style={styles.translation}>{item.translation}</Text>
        </View>
        {item.example && (
          <Text variant="bodySmall" style={styles.example}>{item.example}</Text>
        )}
      </Card.Content>
    </Card>
  );

  const renderHeader = () => (
    <View>
      <View style={styles.statsContainer}>
        <Card style={styles.statsCard}>
          <Card.Content>
            <Text variant="titleLarge">{words.length}</Text>
            <Text variant="bodyMedium">Toplam Kelime</Text>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.modeButtons}>
        <Button
          mode="contained"
          icon="play"
          onPress={() => navigation.navigate('QuizMode', { listId })}
          style={styles.modeButton}
        >
          Quiz Modu
        </Button>
        <Button
          mode="contained"
          icon="book"
          onPress={() => navigation.navigate('LearningMode', { listId })}
          style={styles.modeButton}
        >
          Öğrenme Modu
        </Button>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={wordList?.title || 'Kelime Listesi'} />
      </Appbar.Header>

      <FlatList
        data={words}
        renderItem={renderWord}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={renderHeader}
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setModalVisible(true)}
      />

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.background }]}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>Yeni Kelime Ekle</Text>
          <TextInput
            label="Kelime"
            value={newWord.word}
            onChangeText={text => setNewWord({ ...newWord, word: text })}
            style={styles.input}
          />
          <TextInput
            label="Çeviri"
            value={newWord.translation}
            onChangeText={text => setNewWord({ ...newWord, translation: text })}
            style={styles.input}
          />
          <TextInput
            label="Örnek Cümle"
            value={newWord.example}
            onChangeText={text => setNewWord({ ...newWord, example: text })}
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={handleAddWord}
            style={styles.addButton}
          >
            Ekle
          </Button>
        </Modal>
      </Portal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: 'Tamam',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {error}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  statsContainer: {
    marginBottom: 16,
  },
  statsCard: {
    alignItems: 'center',
  },
  modeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  modeButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  card: {
    marginBottom: 16,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  translation: {
    color: '#666',
  },
  example: {
    fontStyle: 'italic',
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modal: {
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  addButton: {
    marginTop: 16,
  },
});

export default ListDetailsScreen; 