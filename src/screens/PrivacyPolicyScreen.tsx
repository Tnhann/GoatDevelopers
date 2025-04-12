import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, Card } from 'react-native-paper';

const PrivacyPolicyScreen = () => {
  const theme = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
          Gizlilik Politikası
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
              Veri Toplama ve Kullanım
            </Text>
            <Text style={[styles.text, { color: theme.colors.onBackground }]}>
              GoatDevelopers olarak, kullanıcılarımızın gizliliğine önem veriyoruz. Uygulamamızı kullanırken topladığımız veriler:
            </Text>
            <Text style={[styles.listItem, { color: theme.colors.onBackground }]}>
              • Kullanıcı profili bilgileri (ad, e-posta, profil resmi)
            </Text>
            <Text style={[styles.listItem, { color: theme.colors.onBackground }]}>
              • Öğrenme ilerleme verileri
            </Text>
            <Text style={[styles.listItem, { color: theme.colors.onBackground }]}>
              • Uygulama kullanım istatistikleri
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
              Veri Güvenliği
            </Text>
            <Text style={[styles.text, { color: theme.colors.onBackground }]}>
              Kullanıcı verilerinizin güvenliği bizim için önceliklidir. Verilerinizi korumak için:
            </Text>
            <Text style={[styles.listItem, { color: theme.colors.onBackground }]}>
              • End-to-end şifreleme kullanıyoruz
            </Text>
            <Text style={[styles.listItem, { color: theme.colors.onBackground }]}>
              • Düzenli güvenlik güncellemeleri yapıyoruz
            </Text>
            <Text style={[styles.listItem, { color: theme.colors.onBackground }]}>
              • Verilerinizi üçüncü taraflarla paylaşmıyoruz
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
              Çerezler ve İzleme
            </Text>
            <Text style={[styles.text, { color: theme.colors.onBackground }]}>
              Uygulamamız, kullanıcı deneyimini iyileştirmek için çerezler ve benzer izleme teknolojileri kullanmaktadır. Bu teknolojiler:
            </Text>
            <Text style={[styles.listItem, { color: theme.colors.onBackground }]}>
              • Oturum yönetimi
            </Text>
            <Text style={[styles.listItem, { color: theme.colors.onBackground }]}>
              • Kullanıcı tercihlerini hatırlama
            </Text>
            <Text style={[styles.listItem, { color: theme.colors.onBackground }]}>
              • Performans analizi
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
              Kullanıcı Hakları
            </Text>
            <Text style={[styles.text, { color: theme.colors.onBackground }]}>
              KVKK kapsamında kullanıcılarımızın hakları:
            </Text>
            <Text style={[styles.listItem, { color: theme.colors.onBackground }]}>
              • Verilerinize erişim hakkı
            </Text>
            <Text style={[styles.listItem, { color: theme.colors.onBackground }]}>
              • Verilerinizi düzeltme hakkı
            </Text>
            <Text style={[styles.listItem, { color: theme.colors.onBackground }]}>
              • Verilerinizi silme hakkı
            </Text>
            <Text style={[styles.listItem, { color: theme.colors.onBackground }]}>
              • Veri taşınabilirliği hakkı
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
              İletişim
            </Text>
            <Text style={[styles.text, { color: theme.colors.onBackground }]}>
              Gizlilik politikamızla ilgili sorularınız için:
            </Text>
            <Text style={[styles.text, { color: theme.colors.primary }]}>
              privacy@goatdevelopers.com
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
  listItem: {
    marginLeft: 16,
    marginBottom: 4,
    lineHeight: 22,
  },
});

export default PrivacyPolicyScreen; 