import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Button, useTheme, Icon, FAB, Portal, Modal, TextInput, Snackbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/AppNavigator';
import { collection, getDocs, addDoc, query, where, doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

type WordListsScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'MainTabs'>;

interface WordList {
  id: string;
  title: string;
  description: string;
  wordCount: number;
  language: string;
  userId: string;
}

const WordListsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<WordListsScreenNavigationProp>();
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [newList, setNewList] = useState({
    title: '',
    description: '',
    language: 'english'
  });

  useEffect(() => {
    checkAndCreateSampleList();
  }, []);

  const checkAndCreateSampleList = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setError('Kullanıcı girişi yapılmamış');
        setSnackbarVisible(true);
        return;
      }

      // Kullanıcının listelerini kontrol et
      const q = query(collection(db, 'wordLists'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      // Eğer kullanıcının hiç listesi yoksa örnek liste oluştur
      if (querySnapshot.empty) {
        // Benzersiz bir liste ID'si oluştur
        const listId = `list_${userId}_${Date.now()}`;
        
        const sampleList = {
          title: 'İngilizce Kelimeler',
          description: 'Günlük kullanılan İngilizce kelimeler',
          language: 'english',
          userId: userId,
          wordCount: 3,
          createdAt: new Date()
        };

        const listRef = doc(db, 'wordLists', listId);
        await setDoc(listRef, sampleList);

        const wordsRef = collection(db, 'wordLists', listId, 'words');
        
        const sampleWords = [
          {
            word: 'Hello',
            translation: 'Merhaba',
            example: 'Hello, how are you?',
            createdAt: new Date()
          },
          {
            word: 'Goodbye',
            translation: 'Hoşçakal',
            example: 'Goodbye, see you tomorrow!',
            createdAt: new Date()
          },
          {
            word: 'Thank you',
            translation: 'Teşekkür ederim',
            example: 'Thank you for your help.',
            createdAt: new Date()
          }
        ];

        for (const word of sampleWords) {
          await addDoc(wordsRef, word);
        }
      }

      // Listeleri getir
      const lists = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WordList[];
      setWordLists(lists);
    } catch (error) {
      console.error('Error checking/creating sample list:', error);
      setError('Listeler yüklenirken bir hata oluştu');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setError('Kullanıcı girişi yapılmamış');
        setSnackbarVisible(true);
        return;
      }

      if (!newList.title.trim()) {
        setError('Lütfen bir başlık girin');
        setSnackbarVisible(true);
        return;
      }

      // Benzersiz bir liste ID'si oluştur
      const listId = `list_${userId}_${Date.now()}`;
      
      const listRef = doc(db, 'wordLists', listId);
      await setDoc(listRef, {
        ...newList,
        userId,
        wordCount: 0,
        createdAt: new Date()
      });

      setNewList({ title: '', description: '', language: 'english' });
      setModalVisible(false);
      checkAndCreateSampleList();
    } catch (error) {
      console.error('Error creating word list:', error);
      setError('Liste oluşturulurken bir hata oluştu');
      setSnackbarVisible(true);
    }
  };

  const renderWordList = ({ item }: { item: WordList }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Icon source="book" size={24} color={theme.colors.primary} />
          <Text variant="titleMedium" style={styles.cardTitle}>{item.title}</Text>
        </View>
        <Text variant="bodyMedium" style={styles.description}>{item.description}</Text>
        <View style={styles.cardFooter}>
          <Text variant="bodySmall" style={styles.metaInfo}>
            {item.wordCount} kelime • {item.language}
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('ListDetails', { listId: item.id })}
          >
            Detaylar
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={wordLists}
        renderItem={renderWordList}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
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
          <Text variant="headlineSmall" style={styles.modalTitle}>Yeni Liste Oluştur</Text>
          <TextInput
            label="Başlık"
            value={newList.title}
            onChangeText={text => setNewList({ ...newList, title: text })}
            style={styles.input}
          />
          <TextInput
            label="Açıklama"
            value={newList.description}
            onChangeText={text => setNewList({ ...newList, description: text })}
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={handleCreateList}
            style={styles.addButton}
          >
            Oluştur
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
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    marginLeft: 8,
    flex: 1,
  },
  description: {
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaInfo: {
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

export default WordListsScreen; 