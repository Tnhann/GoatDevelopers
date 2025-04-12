import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, Card, Icon } from 'react-native-paper';
import { useAuth } from '../hooks/useAuth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

const StatisticsScreen = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [stats, setStats] = React.useState({
    totalWords: 0,
    masteredWords: 0,
    learningWords: 0,
    listsCreated: 0,
    dailyStreak: 0,
  });

  React.useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        // Kelime listelerini getir
        const listsQuery = query(
          collection(db, 'wordLists'),
          where('userId', '==', user.uid)
        );
        const listsSnapshot = await getDocs(listsQuery);
        const lists = listsSnapshot.docs.map(doc => doc.data());

        // İstatistikleri hesapla
        const totalWords = lists.reduce((acc, list) => acc + (list.words?.length || 0), 0);
        const masteredWords = lists.reduce((acc, list) => 
          acc + (list.words?.filter((word: any) => word.mastered)?.length || 0), 0
        );

        setStats({
          totalWords,
          masteredWords,
          learningWords: totalWords - masteredWords,
          listsCreated: lists.length,
          dailyStreak: 0, // Bu değer kullanıcının günlük aktivitesine göre hesaplanacak
        });
      } catch (error) {
        console.error('İstatistikler yüklenirken hata oluştu:', error);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
          İstatistikler
        </Text>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Card.Content>
              <Icon source="book" size={40} color={theme.colors.primary} />
              <Text variant="headlineLarge" style={[styles.statNumber, { color: theme.colors.primary }]}>
                {stats.totalWords}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Toplam Kelime
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <Icon source="check-circle" size={40} color={theme.colors.primary} />
              <Text variant="headlineLarge" style={[styles.statNumber, { color: theme.colors.primary }]}>
                {stats.masteredWords}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Öğrenilen Kelime
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <Icon source="book-open-page-variant" size={40} color={theme.colors.primary} />
              <Text variant="headlineLarge" style={[styles.statNumber, { color: theme.colors.primary }]}>
                {stats.learningWords}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Öğrenilen Kelime
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <Icon source="format-list-bulleted" size={40} color={theme.colors.primary} />
              <Text variant="headlineLarge" style={[styles.statNumber, { color: theme.colors.primary }]}>
                {stats.listsCreated}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Oluşturulan Liste
              </Text>
            </Card.Content>
          </Card>
        </View>

        <Card style={styles.streakCard}>
          <Card.Content>
            <View style={styles.streakHeader}>
              <Icon source="fire" size={40} color={theme.colors.error} />
              <Text variant="headlineMedium" style={[styles.streakTitle, { color: theme.colors.error }]}>
                Günlük Seri
              </Text>
            </View>
            <Text variant="displayLarge" style={[styles.streakNumber, { color: theme.colors.error }]}>
              {stats.dailyStreak}
            </Text>
            <Text variant="bodyMedium" style={styles.streakSubtitle}>
              Gün
            </Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 24,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    marginBottom: 16,
  },
  statNumber: {
    marginTop: 8,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  statLabel: {
    textAlign: 'center',
  },
  streakCard: {
    marginBottom: 16,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  streakTitle: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
  streakNumber: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  streakSubtitle: {
    textAlign: 'center',
    marginTop: 8,
  },
});

export default StatisticsScreen; 