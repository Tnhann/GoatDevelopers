import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, useTheme, Card, Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/AppNavigator';

type HomeScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'MainTabs'>;

const HomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
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
            Kelime öğrenme yolculuğunuza hoş geldiniz
          </Text>
        </View>

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
        </View>
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
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    marginBottom: 16,
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
  },
});

export default HomeScreen;