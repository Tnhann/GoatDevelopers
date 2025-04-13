import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Button, useTheme, Icon, FAB, Portal, Modal, TextInput, Snackbar, Appbar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/AppNavigator';
import { collection, getDocs, addDoc, query, where, doc, deleteDoc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore, auth } from '../config/firebase';

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
  isDefault?: boolean;
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
  const [error, setError] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [newWord, setNewWord] = useState({
    word: '',
    translation: '',
    example: ''
  });
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    checkListOwnership();
  }, [listId]);

  const checkListOwnership = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setError('Oturumunuz sonlanmış. Lütfen tekrar giriş yapın.');
        setSnackbarVisible(true);
        return;
      }

      const listRef = doc(firestore, 'users', userId, 'wordLists', listId);
      const listDoc = await getDoc(listRef);

      if (!listDoc.exists()) {
        setError('Liste bulunamadı.');
        setSnackbarVisible(true);
        return;
      }

      const listData = listDoc.data();
      // Kullanıcının kendi listesi olduğu için her zaman erişim var
      setIsOwner(!listData.isDefault); // Varsayılan listeleri düzenleyemez

      // Listeyi getir
      fetchWords();

      // Liste bilgilerini ayarla
      setWordList({
        id: listId,
        title: listData.name,
        description: listData.description,
        wordCount: listData.wordCount || 0,
        language: listData.language || 'english',
        userId: userId,
        isDefault: listData.isDefault || false
      });
    } catch (error) {
      console.error('Error checking list ownership:', error);
      setError('Liste bilgileri alınırken bir hata oluştu.');
      setSnackbarVisible(true);
    }
  };

  // Kelime sayısını güncelleme fonksiyonu
  const updateWordCount = async (count: number) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      // Liste belgesini güncelle
      const listRef = doc(firestore, 'users', userId, 'wordLists', listId);
      await updateDoc(listRef, {
        wordCount: count
      });

      // Yerel state'i güncelle
      if (wordList) {
        setWordList({
          ...wordList,
          wordCount: count
        });
      }

      console.log(`Kelime sayısı güncellendi: ${count}`);
    } catch (error) {
      console.error('Error updating word count:', error);
    }
  };

  const fetchWords = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const wordsRef = collection(firestore, 'users', userId, 'wordLists', listId, 'words');
      const querySnapshot = await getDocs(wordsRef);

      const wordsList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          word: data.word,
          translation: data.turkishMeaning || data.translation,
          example: data.example || ''
        };
      }) as Word[];

      setWords(wordsList);

      // Kelime sayısını güncelle
      await updateWordCount(wordsList.length);
    } catch (error) {
      console.error('Error fetching words:', error);
      setError('Kelimeler yüklenirken bir hata oluştu');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWord = async () => {
    if (!newWord.word.trim() || !newWord.translation.trim()) {
      setError('Lütfen kelime ve çevirisini girin.');
      setSnackbarVisible(true);
      return;
    }

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setError('Oturumunuz sonlanmış. Lütfen tekrar giriş yapın.');
        setSnackbarVisible(true);
        return;
      }

      // Varsayılan listeye kelime eklenemez
      if (wordList?.isDefault) {
        setError('Varsayılan listelere kelime eklenemez.');
        setSnackbarVisible(true);
        return;
      }

      const listRef = doc(firestore, 'users', userId, 'wordLists', listId);
      const listDoc = await getDoc(listRef);

      if (!listDoc.exists()) {
        setError('Liste bulunamadı.');
        setSnackbarVisible(true);
        return;
      }

      const wordsRef = collection(firestore, 'users', userId, 'wordLists', listId, 'words');
      // Yeni kelimeyi ekle
      await addDoc(wordsRef, {
        word: newWord.word.trim(),
        turkishMeaning: newWord.translation.trim(),
        example: newWord.example.trim(),
        createdAt: new Date()
      });

      // Formu sıfırla ve modalı kapat
      setNewWord({ word: '', translation: '', example: '' });
      setModalVisible(false);

      // Kelimeleri yeniden yükle
      await fetchWords();

      // Kelime sayısını doğrudan güncelle
      if (words.length > 0) {
        await updateWordCount(words.length);
      }
    } catch (error) {
      console.error('Error adding word:', error);
      setError('Kelime eklenirken bir hata oluştu.');
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

      // Varsayılan listeden kelime silinemez
      if (wordList?.isDefault) {
        setError('Varsayılan listelerden kelime silinemez.');
        setSnackbarVisible(true);
        return;
      }

      // Kelimeyi sil
      await deleteDoc(doc(firestore, 'users', userId, 'wordLists', listId, 'words', wordId));

      // Kelimeleri yeniden yükle
      await fetchWords();

      // Kelime sayısını doğrudan güncelle
      await updateWordCount(words.length);
    } catch (error) {
      console.error('Error deleting word:', error);
      setError('Kelime silinirken bir hata oluştu');
      setSnackbarVisible(true);
    }
  };

  // Düzenleme için state'ler
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);

  // Kelime düzenleme fonksiyonu
  const handleEditWord = async () => {
    if (!editingWord) return;

    if (!newWord.word.trim() || !newWord.translation.trim()) {
      setError('Lütfen kelime ve çevirisini girin.');
      setSnackbarVisible(true);
      return;
    }

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setError('Oturumunuz sonlanmış. Lütfen tekrar giriş yapın.');
        setSnackbarVisible(true);
        return;
      }

      // Varsayılan listedeki kelimeler düzenlenemez
      if (wordList?.isDefault) {
        setError('Varsayılan listelerdeki kelimeler düzenlenemez.');
        setSnackbarVisible(true);
        return;
      }

      // Kelimeyi güncelle
      const wordRef = doc(firestore, 'users', userId, 'wordLists', listId, 'words', editingWord.id);
      await setDoc(wordRef, {
        word: newWord.word.trim(),
        turkishMeaning: newWord.translation.trim(),
        example: newWord.example.trim(),
        updatedAt: new Date()
      }, { merge: true });

      // Formu sıfırla ve modalı kapat
      setNewWord({ word: '', translation: '', example: '' });
      setEditingWord(null);
      setEditModalVisible(false);

      // Kelimeleri yeniden yükle
      await fetchWords();

      // Kelime sayısını doğrudan güncelle
      await updateWordCount(words.length);
    } catch (error) {
      console.error('Error editing word:', error);
      setError('Kelime düzenlenirken bir hata oluştu.');
      setSnackbarVisible(true);
    }
  };

  const renderWord = ({ item }: { item: Word }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.wordHeader}>
          <Text variant="titleMedium">{item.word}</Text>
          <Text variant="bodyMedium" style={styles.translation}>{item.translation}</Text>

          {isOwner && (
            <View style={styles.actionButtons}>
              <Button
                icon="pencil"
                mode="text"
                compact
                onPress={() => {
                  setEditingWord(item);
                  setNewWord({
                    word: item.word,
                    translation: item.translation,
                    example: item.example
                  });
                  setEditModalVisible(true);
                }}
              />
              <Button
                icon="delete"
                mode="text"
                compact
                onPress={() => handleDeleteWord(item.id)}
              />
            </View>
          )}
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

      {isOwner && (
        <FAB
          icon="plus"
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={() => setModalVisible(true)}
        />
      )}

      <Portal>
        {/* Yeni Kelime Ekleme Modalı */}
        <Modal
          visible={modalVisible}
          onDismiss={() => {
            setModalVisible(false);
            setNewWord({ word: '', translation: '', example: '' });
          }}
          contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.background }]}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>Yeni Kelime Ekle</Text>
          <TextInput
            label="Kelime"
            value={newWord.word}
            onChangeText={text => setNewWord({ ...newWord, word: text })}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Çeviri"
            value={newWord.translation}
            onChangeText={text => setNewWord({ ...newWord, translation: text })}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Örnek Cümle"
            value={newWord.example}
            onChangeText={text => setNewWord({ ...newWord, example: text })}
            mode="outlined"
            style={styles.input}
            multiline
          />
          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => {
                setModalVisible(false);
                setNewWord({ word: '', translation: '', example: '' });
              }}
              style={styles.modalButton}
            >
              İptal
            </Button>
            <Button
              mode="contained"
              onPress={handleAddWord}
              style={styles.modalButton}
            >
              Ekle
            </Button>
          </View>
        </Modal>

        {/* Kelime Düzenleme Modalı */}
        <Modal
          visible={editModalVisible}
          onDismiss={() => {
            setEditModalVisible(false);
            setEditingWord(null);
            setNewWord({ word: '', translation: '', example: '' });
          }}
          contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.background }]}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>Kelimeyi Düzenle</Text>
          <TextInput
            label="Kelime"
            value={newWord.word}
            onChangeText={text => setNewWord({ ...newWord, word: text })}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Çeviri"
            value={newWord.translation}
            onChangeText={text => setNewWord({ ...newWord, translation: text })}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Örnek Cümle"
            value={newWord.example}
            onChangeText={text => setNewWord({ ...newWord, example: text })}
            mode="outlined"
            style={styles.input}
            multiline
          />
          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => {
                setEditModalVisible(false);
                setEditingWord(null);
                setNewWord({ word: '', translation: '', example: '' });
              }}
              style={styles.modalButton}
            >
              İptal
            </Button>
            <Button
              mode="contained"
              onPress={handleEditWord}
              style={styles.modalButton}
            >
              Kaydet
            </Button>
          </View>
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
    flex: 1,
    marginHorizontal: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  modalButton: {
    marginLeft: 8,
  },
});

export default ListDetailsScreen;