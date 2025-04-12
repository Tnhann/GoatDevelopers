import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme, Card } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/AppNavigator';

type QuizResultsScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'QuizResults'>;

const QuizResultsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<QuizResultsScreenNavigationProp>();
  const route = useRoute();
  const { score, totalQuestions, listId } = route.params as {
    score: number;
    totalQuestions: number;
    listId: string;
  };

  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Card style={styles.resultCard}>
          <Card.Content>
            <Text variant="displayLarge" style={styles.score}>
              {score}/{totalQuestions}
            </Text>
            <Text variant="headlineMedium" style={styles.percentage}>
              %{percentage}
            </Text>
            <Text variant="bodyLarge" style={styles.message}>
              {percentage >= 80
                ? 'Harika! Çok iyi bir sonuç!'
                : percentage >= 60
                ? 'İyi! Daha fazla pratik yapabilirsin.'
                : 'Daha fazla çalışman gerekiyor. Pes etme!'}
            </Text>
          </Card.Content>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('QuizMode', { listId })}
            style={styles.button}
          >
            Tekrar Dene
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('ListDetails', { listId })}
            style={styles.button}
          >
            Listeye Dön
          </Button>
        </View>
      </View>
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
    justifyContent: 'center',
  },
  resultCard: {
    marginBottom: 24,
    alignItems: 'center',
  },
  score: {
    textAlign: 'center',
    marginBottom: 8,
  },
  percentage: {
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    marginBottom: 8,
  },
});

export default QuizResultsScreen; 