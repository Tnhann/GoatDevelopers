import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, useTheme, Card, Icon, ActivityIndicator } from 'react-native-paper';
import { getUserStats } from '../services/statsService';
import { auth } from '../config/firebase';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.4;

const StatisticsScreen = () => {
  const theme = useTheme();
  const [stats, setStats] = useState({
    completedWordModes: 0,
    completedQuizzes: 0,
    listsCreated: 0,
    dailyStreak: 0,
    totalWordsLearned: 0,
    totalQuizzesTaken: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!auth.currentUser) {
          setError('Kullanıcı girişi yapılmamış');
          setLoading(false);
          return;
        }

        const userStats = await getUserStats();
        setStats({
          completedWordModes: userStats.completedWordModes || 0,
          completedQuizzes: userStats.completedQuizzes || 0,
          listsCreated: userStats.listsCreated || 0,
          dailyStreak: userStats.dailyStreak || 0,
          totalWordsLearned: userStats.totalWordsLearned || 0,
          totalQuizzesTaken: userStats.totalQuizzesTaken || 0,
        });
        setLoading(false);
      } catch (error) {
        console.error('İstatistikler yüklenirken hata oluştu:', error);
        setError('İstatistikler yüklenirken hata oluştu');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text variant="bodyLarge" style={{ color: theme.colors.error }}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
          İstatistikler
        </Text>

        <View style={styles.statsGrid}>
          <Card style={[styles.statCard, { width: CARD_WIDTH }]}>
            <Card.Content style={styles.cardContent}>
              <Icon source="book" size={24} color={theme.colors.primary} />
              <Text variant="headlineLarge" style={[styles.statNumber, { color: theme.colors.primary }]}>
                {stats.totalWordsLearned}
              </Text>
              <Text variant="bodyMedium" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                Toplam Kelime
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.statCard, { width: CARD_WIDTH }]}>
            <Card.Content style={styles.cardContent}>
              <Icon source="format-list-bulleted" size={24} color={theme.colors.primary} />
              <Text variant="headlineLarge" style={[styles.statNumber, { color: theme.colors.primary }]}>
                {stats.listsCreated}
              </Text>
              <Text variant="bodyMedium" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                Oluşturulan Liste
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.statCard, { width: CARD_WIDTH }]}>
            <Card.Content style={styles.cardContent}>
              <Icon source="book-check" size={24} color={theme.colors.primary} />
              <Text variant="headlineLarge" style={[styles.statNumber, { color: theme.colors.primary }]}>
                {stats.completedWordModes}
              </Text>
              <Text variant="bodyMedium" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                Tamamlanan Kelime Modu
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.statCard, { width: CARD_WIDTH }]}>
            <Card.Content style={styles.cardContent}>
              <Icon source="help-circle" size={24} color={theme.colors.primary} />
              <Text variant="headlineLarge" style={[styles.statNumber, { color: theme.colors.primary }]}>
                {stats.completedQuizzes}
              </Text>
              <Text variant="bodyMedium" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                Başarılı Quiz
              </Text>
            </Card.Content>
          </Card>
        </View>

        <Card style={styles.streakCard}>
          <Card.Content>
            <View style={styles.streakHeader}>
              <Icon source="fire" size={32} color={theme.colors.error} />
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  statCard: {
    marginBottom: 16,
    alignItems: 'center',
    width: CARD_WIDTH,
    elevation: 2,
    borderRadius: 12,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    width: '100%',
  },
  statNumber: {
    marginTop: 8,
    marginBottom: 4,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 22,
  },
  statLabel: {
    textAlign: 'center',
    fontSize: 12,
    width: '100%',
    lineHeight: 16,
  },
  streakCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
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