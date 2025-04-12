import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Switch, useTheme, List, Card, Icon } from 'react-native-paper';
import { useThemeContext } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/AppNavigator';

type SettingsScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Settings'>;

const SettingsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  const handleProfilePress = () => {
    // Profil düzenleme sayfasına yönlendirme
    navigation.navigate('ProfileEdit');
  };

  const handleLanguagePress = () => {
    // Dil seçimi modalını aç
    Alert.alert('Dil Seçimi', 'Bu özellik yakında eklenecek');
  };

  const handleAboutPress = () => {
    // Hakkında sayfasına yönlendirme
    navigation.navigate('About');
  };

  const handlePrivacyPress = () => {
    // Gizlilik politikası sayfasına yönlendirme
    navigation.navigate('PrivacyPolicy');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
          Ayarlar
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            <List.Section>
              <List.Subheader>Tema Ayarları</List.Subheader>
              <List.Item
                title="Koyu Mod"
                description="Uygulamanın görünümünü değiştirir"
                left={props => <List.Icon {...props} icon="theme-light-dark" />}
                right={() => (
                  <Switch
                    value={isDarkMode}
                    onValueChange={toggleTheme}
                    color={theme.colors.primary}
                  />
                )}
              />
            </List.Section>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <List.Section>
              <List.Subheader>Bildirimler</List.Subheader>
              <List.Item
                title="Bildirimler"
                description="Öğrenme hatırlatmalarını al"
                left={props => <List.Icon {...props} icon="bell" />}
                right={() => (
                  <Switch
                    value={notifications}
                    onValueChange={setNotifications}
                    color={theme.colors.primary}
                  />
                )}
              />
              <List.Item
                title="Ses Efektleri"
                description="Uygulama seslerini aç/kapat"
                left={props => <List.Icon {...props} icon="volume-high" />}
                right={() => (
                  <Switch
                    value={soundEffects}
                    onValueChange={setSoundEffects}
                    color={theme.colors.primary}
                  />
                )}
              />
            </List.Section>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <List.Section>
              <List.Subheader>Hesap</List.Subheader>
              <List.Item
                title="Profil"
                description="Profil bilgilerinizi düzenleyin"
                left={props => <List.Icon {...props} icon="account" />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                onPress={handleProfilePress}
              />
              <List.Item
                title="Dil"
                description="Uygulama dilini değiştir"
                left={props => <List.Icon {...props} icon="translate" />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                onPress={handleLanguagePress}
              />
            </List.Section>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <List.Section>
              <List.Subheader>Uygulama</List.Subheader>
              <List.Item
                title="Hakkında"
                description="Uygulama bilgileri"
                left={props => <List.Icon {...props} icon="information" />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                onPress={handleAboutPress}
              />
              <List.Item
                title="Gizlilik Politikası"
                description="Gizlilik ayarları"
                left={props => <List.Icon {...props} icon="shield-lock" />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                onPress={handlePrivacyPress}
              />
            </List.Section>
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
});

export default SettingsScreen; 