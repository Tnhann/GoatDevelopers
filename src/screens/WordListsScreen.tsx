import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Button, useTheme, Icon, FAB, Portal, Modal, TextInput, Snackbar, Menu, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/AppNavigator';
import { collection, getDocs, addDoc, query, where, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { firestore, auth } from '../config/firebase';
import { ensureDefaultWordLists, getUserWordLists } from '../services/defaultWordListService';

type WordListsScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'MainTabs'>;

interface WordList {
  id: string;
  title: string;
  description: string;
  wordCount: number;
  language: string;
  userId: string;
  createdAt: Date;
}

const WordListsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<WordListsScreenNavigationProp>();
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);
  const [newList, setNewList] = useState({
    title: '',
    description: '',
    language: 'english'
  });
  const [editingList, setEditingList] = useState<WordList | null>(null);

  useEffect(() => {
    loadWordLists();
  }, []);

  const loadWordLists = async () => {
    try {
      setLoading(true);
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setError('Kullanıcı girişi yapılmamış');
        setSnackbarVisible(true);
        setLoading(false);
        return;
      }

      // Varsayılan kelime listelerini kontrol et ve ekle
      await ensureDefaultWordLists();

      // Kullanıcının tüm listelerini getir
      const q = query(collection(firestore, 'users', userId, 'wordLists'));
      const querySnapshot = await getDocs(q);

      const lists = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.name,
          description: data.description,
          wordCount: data.wordCount || 0,
          language: data.language || 'english',
          userId: userId,
          createdAt: data.createdAt?.toDate() || new Date(),
          isDefault: data.isDefault || false
        };
      }) as WordList[];

      setWordLists(lists);
    } catch (error) {
      console.error('Error loading word lists:', error);
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

      const listRef = doc(firestore, 'users', userId, 'wordLists', listId);
      await setDoc(listRef, {
        name: newList.title.trim(),
        description: newList.description.trim() || '',
        language: newList.language,
        wordCount: 0,
        createdAt: new Date(),
        isDefault: false
      });

      setNewList({ title: '', description: '', language: 'english' });
      setModalVisible(false);
      loadWordLists();
    } catch (error) {
      console.error('Error creating word list:', error);
      setError('Liste oluşturulurken bir hata oluştu');
      setSnackbarVisible(true);
    }
  };

  const handleDeleteList = async (listId: string) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setError('Kullanıcı girişi yapılmamış');
        setSnackbarVisible(true);
        return;
      }

      // Önce listeyi kontrol et
      const listRef = doc(firestore, 'users', userId, 'wordLists', listId);
      const listDoc = await getDoc(listRef);

      if (!listDoc.exists()) {
        setError('Liste bulunamadı');
        setSnackbarVisible(true);
        return;
      }

      const listData = listDoc.data();
      if (listData.isDefault) {
        setError('Varsayılan listeler silinemez');
        setSnackbarVisible(true);
        return;
      }

      // Önce alt koleksiyonları sil
      const wordsRef = collection(firestore, 'users', userId, 'wordLists', listId, 'words');
      const wordsSnapshot = await getDocs(wordsRef);
      const deletePromises = wordsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Sonra listeyi sil
      await deleteDoc(listRef);

      // Local state'i güncelle
      setWordLists(prevLists => prevLists.filter(list => list.id !== listId));
      setMenuVisible(null);
    } catch (error) {
      console.error('Error deleting word list:', error);
      setError('Liste silinirken bir hata oluştu');
      setSnackbarVisible(true);
    }
  };

  const handleEditList = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId || !editingList) {
        setError('Kullanıcı girişi yapılmamış veya düzenlenecek liste bulunamadı');
        setSnackbarVisible(true);
        return;
      }

      if (!newList.title.trim()) {
        setError('Lütfen bir başlık girin');
        setSnackbarVisible(true);
        return;
      }

      const listRef = doc(firestore, 'users', userId, 'wordLists', editingList.id);
      await setDoc(listRef, {
        name: newList.title,
        description: newList.description,
        language: newList.language
      }, { merge: true });

      setNewList({ title: '', description: '', language: 'english' });
      setEditingList(null);
      setEditModalVisible(false);
      loadWordLists();
    } catch (error) {
      console.error('Error editing word list:', error);
      setError('Liste düzenlenirken bir hata oluştu');
      setSnackbarVisible(true);
    }
  };

  const renderWordList = ({ item }: { item: WordList }) => (
    <Card style={[styles.card, item.isDefault && styles.defaultCard]}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text variant="titleMedium" style={styles.cardTitle}>{item.title}</Text>
          {!item.isDefault && (
            <Menu
              visible={menuVisible === item.id}
              onDismiss={() => setMenuVisible(null)}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  onPress={() => setMenuVisible(item.id)}
                />
              }
            >
              <Menu.Item
                onPress={() => {
                  setMenuVisible(null);
                  // Düzenleme modalini aç
                  setNewList({
                    title: item.title,
                    description: item.description,
                    language: item.language
                  });
                  setEditingList(item);
                  setEditModalVisible(true);
                }}
                title="Düzenle"
                leadingIcon="pencil"
              />
              <Menu.Item
                onPress={() => {
                  setMenuVisible(null);
                  handleDeleteList(item.id);
                }}
                title="Sil"
                leadingIcon="delete"
              />
            </Menu>
          )}
        </View>
        <Text variant="bodyMedium" style={styles.cardDescription}>
          {item.description}
        </Text>
        <Text variant="bodySmall" style={styles.cardInfo}>
          {item.wordCount} kelime
        </Text>
        {item.isDefault && (
          <Text variant="bodySmall" style={styles.defaultBadge}>
            Varsayılan Liste
          </Text>
        )}
      </Card.Content>
      <Card.Actions>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('ListDetails', { listId: item.id })}
        >
          Kelimeleri Gör
        </Button>
      </Card.Actions>
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
        {/* Yeni Liste Oluşturma Modalı */}
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.background }]}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>Yeni Liste Oluştur</Text>
          <TextInput
            label="Liste Başlığı"
            value={newList.title}
            onChangeText={text => setNewList({ ...newList, title: text })}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Açıklama"
            value={newList.description}
            onChangeText={text => setNewList({ ...newList, description: text })}
            mode="outlined"
            style={styles.input}
          />
          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setModalVisible(false)}
              style={styles.modalButton}
            >
              İptal
            </Button>
            <Button
              mode="contained"
              onPress={handleCreateList}
              style={styles.modalButton}
            >
              Oluştur
            </Button>
          </View>
        </Modal>

        {/* Liste Düzenleme Modalı */}
        <Modal
          visible={editModalVisible}
          onDismiss={() => {
            setEditModalVisible(false);
            setEditingList(null);
            setNewList({ title: '', description: '', language: 'english' });
          }}
          contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.background }]}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>Listeyi Düzenle</Text>
          <TextInput
            label="Liste Başlığı"
            value={newList.title}
            onChangeText={text => setNewList({ ...newList, title: text })}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Açıklama"
            value={newList.description}
            onChangeText={text => setNewList({ ...newList, description: text })}
            mode="outlined"
            style={styles.input}
          />
          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => {
                setEditModalVisible(false);
                setEditingList(null);
                setNewList({ title: '', description: '', language: 'english' });
              }}
              style={styles.modalButton}
            >
              İptal
            </Button>
            <Button
              mode="contained"
              onPress={handleEditList}
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
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  defaultCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#6200ee',
  },
  defaultBadge: {
    marginTop: 8,
    color: '#6200ee',
    fontWeight: 'bold',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    flex: 1,
  },
  cardDescription: {
    marginTop: 8,
  },
  cardInfo: {
    marginTop: 8,
    opacity: 0.7,
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

export default WordListsScreen;