import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Button, useTheme, Card, Icon, Divider, ActivityIndicator, Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/AppNavigator';
import { firestore, auth } from '../config/firebase';
import { collection, getDocs, query, limit, where } from 'firebase/firestore';

type HomeScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'MainTabs'>;

const HomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [userName, setUserName] = useState<string>('');
  const [totalWords, setTotalWords] = useState<number>(0);
  const [totalLists, setTotalLists] = useState<number>(0);
  const [dailyWord, setDailyWord] = useState<{word: string, translation: string, example: string} | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const currentUser = auth.currentUser;
        if (currentUser) {
          // Kullanıcı adını ayarla
          setUserName(currentUser.displayName || currentUser.email?.split('@')[0] || 'Kullanıcı');

          // Kelime listelerini say
          const listsRef = collection(firestore, 'users', currentUser.uid, 'wordLists');
          const listsSnapshot = await getDocs(listsRef);
          setTotalLists(listsSnapshot.size);

          // Toplam kelime sayısını hesapla
          let wordCount = 0;
          for (const listDoc of listsSnapshot.docs) {
            const wordsRef = collection(firestore, 'users', currentUser.uid, 'wordLists', listDoc.id, 'words');
            const wordsSnapshot = await getDocs(wordsRef);
            wordCount += wordsSnapshot.size;
          }
          setTotalWords(wordCount);

          // Günün kelimesini al
          if (wordCount > 0) {
            // Rastgele bir liste seç
            const randomListIndex = Math.floor(Math.random() * listsSnapshot.size);
            const randomListDoc = listsSnapshot.docs[randomListIndex];

            // Seçilen listeden rastgele bir kelime al
            const wordsRef = collection(firestore, 'users', currentUser.uid, 'wordLists', randomListDoc.id, 'words');
            const wordsSnapshot = await getDocs(wordsRef);

            if (wordsSnapshot.size > 0) {
              const randomWordIndex = Math.floor(Math.random() * wordsSnapshot.size);
              const randomWordDoc = wordsSnapshot.docs[randomWordIndex];
              const wordData = randomWordDoc.data();

              setDailyWord({
                word: wordData.word || '',
                translation: wordData.turkishMeaning || wordData.translation || '',
                example: wordData.example || ''
              });
            }
          }
        }
      } catch (error) {
        console.error('Kullanıcı verileri alınırken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16 }}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Başlık ve Logo */}
        <View style={styles.header}>
          <Icon
            source="book-open-page-variant"
            size={80}
            color={theme.colors.primary}
          />
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
            Vocaboo
          </Text>
          <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Merhaba, {userName}! Kelime öğrenmeye devam edelim.
          </Text>
        </View>

        {/* İstatistikler */}
        <Surface style={styles.statsContainer} elevation={2}>
          <View style={styles.statItem}>
            <Icon source="format-list-bulleted" size={24} color={theme.colors.primary} />
            <Text variant="titleLarge" style={styles.statValue}>{totalLists}</Text>
            <Text variant="bodySmall">Liste</Text>
          </View>

          <Divider style={styles.statDivider} />

          <View style={styles.statItem}>
            <Icon source="book-alphabet" size={24} color={theme.colors.primary} />
            <Text variant="titleLarge" style={styles.statValue}>{totalWords}</Text>
            <Text variant="bodySmall">Kelime</Text>
          </View>
        </Surface>

        {/* Günün Kelimesi */}
        {dailyWord && (
          <Card style={styles.dailyWordCard}>
            <Card.Content>
              <View style={styles.dailyWordHeader}>
                <Icon source="star" size={24} color={theme.colors.primary} />
                <Text variant="titleMedium" style={styles.dailyWordTitle}>Günün Kelimesi</Text>
              </View>
              <Divider style={{ marginVertical: 8 }} />
              <Text variant="headlineSmall" style={styles.dailyWord}>{dailyWord.word}</Text>
              <Text variant="titleMedium" style={styles.dailyWordTranslation}>{dailyWord.translation}</Text>
              {dailyWord.example && (
                <Text variant="bodyMedium" style={styles.dailyWordExample}>"{dailyWord.example}"</Text>
              )}
            </Card.Content>
          </Card>
        )}

        {/* Hızlı Erişim Kartları */}
        <Text variant="titleMedium" style={styles.sectionTitle}>Hızlı Erişim</Text>
        <View style={styles.cardsContainer}>
          <Card style={styles.card}>
            <Card.Content>
              <Icon source="book" size={40} color={theme.colors.primary} />
              <Text variant="titleMedium" style={styles.cardTitle}>Kelime Listeleri</Text>
              <Text variant="bodyMedium" style={styles.cardText}>
                Kelime listelerinizi görüntüleyin ve yönetin
              </Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('MainTabs', { screen: 'WordLists' })}
                style={styles.cardButton}
              >
                Listelere Git
              </Button>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Icon source="plus" size={40} color={theme.colors.primary} />
              <Text variant="titleMedium" style={styles.cardTitle}>Yeni Liste</Text>
              <Text variant="bodyMedium" style={styles.cardText}>
                Yeni bir kelime listesi oluşturun
              </Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('MainTabs', { screen: 'WordLists' })}
                style={styles.cardButton}
              >
                Liste Oluştur
              </Button>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Icon source="gamepad-variant" size={40} color={theme.colors.primary} />
              <Text variant="titleMedium" style={styles.cardTitle}>Quiz Modu</Text>
              <Text variant="bodyMedium" style={styles.cardText}>
                Bilgilerinizi test edin ve puan kazanın
              </Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('MainTabs', { screen: 'WordLists' })}
                style={styles.cardButton}
              >
                Quiz Başlat
              </Button>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Icon source="chart-bar" size={40} color={theme.colors.primary} />
              <Text variant="titleMedium" style={styles.cardTitle}>İstatistikler</Text>
              <Text variant="bodyMedium" style={styles.cardText}>
                İlerlemenizi takip edin ve başarılarınızı görün
              </Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('MainTabs', { screen: 'Statistics' })}
                style={styles.cardButton}
              >
                İstatistikleri Gör
              </Button>
            </Card.Content>
          </Card>
        </View>
      </View>
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
    padding: 16,
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statDivider: {
    height: '70%',
    width: 1,
  },
  dailyWordCard: {
    marginBottom: 24,
    borderRadius: 12,
  },
  dailyWordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dailyWordTitle: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
  dailyWord: {
    marginTop: 8,
    fontWeight: 'bold',
  },
  dailyWordTranslation: {
    marginTop: 4,
    marginBottom: 8,
  },
  dailyWordExample: {
    fontStyle: 'italic',
    marginTop: 8,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  cardTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  cardText: {
    marginBottom: 16,
  },
  cardButton: {
    marginTop: 8,
    borderRadius: 8,
  },
});

export default HomeScreen;