import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, Card, Icon } from 'react-native-paper';

const AboutScreen = () => {
  const theme = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
          Uygulama Hakkında
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
              Amacımız
            </Text>
            <Text style={[styles.text, { color: theme.colors.onBackground }]}>
              GoatDevelopers olarak, kullanıcıların yazılım geliştirme becerilerini eğlenceli ve etkileşimli bir şekilde geliştirmelerini sağlamayı hedefliyoruz. Uygulamamız, yeni başlayanlardan ileri seviye geliştiricilere kadar herkesin kullanabileceği bir öğrenme platformudur.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
              Özelliklerimiz
            </Text>
            <View style={styles.featureItem}>
              <Icon source="code-braces" size={24} color={theme.colors.primary} />
              <Text style={[styles.text, { color: theme.colors.onBackground, marginLeft: 8 }]}>
                Gerçek dünya projeleri üzerinde pratik yapma imkanı
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Icon source="lightbulb-on" size={24} color={theme.colors.primary} />
              <Text style={[styles.text, { color: theme.colors.onBackground, marginLeft: 8 }]}>
                Kişiselleştirilmiş öğrenme yolları
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Icon source="chart-line" size={24} color={theme.colors.primary} />
              <Text style={[styles.text, { color: theme.colors.onBackground, marginLeft: 8 }]}>
                Detaylı ilerleme takibi
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Icon source="forum" size={24} color={theme.colors.primary} />
              <Text style={[styles.text, { color: theme.colors.onBackground, marginLeft: 8 }]}>
                Topluluk desteği ve işbirliği
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
              Vizyonumuz
            </Text>
            <Text style={[styles.text, { color: theme.colors.onBackground }]}>
              Teknoloji dünyasında herkesin kendini geliştirebileceği, öğrenme sürecini keyifli hale getiren ve sürekli yenilenen bir platform olmayı hedefliyoruz. Amacımız, yazılım geliştirme sürecini daha erişilebilir ve anlaşılır hale getirmektir.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
              İletişim
            </Text>
            <Text style={[styles.text, { color: theme.colors.onBackground }]}>
              Sorularınız ve önerileriniz için bize ulaşabilirsiniz:
            </Text>
            <Text style={[styles.text, { color: theme.colors.primary }]}>
              info@goatdevelopers.com
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
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  text: {
    marginBottom: 8,
    lineHeight: 22,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
});

export default AboutScreen; 