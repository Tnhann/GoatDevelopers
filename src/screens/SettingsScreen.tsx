<<<<<<< HEAD
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, useTheme, Card, Icon, Switch, List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/AppNavigator';
import { useThemeContext } from '../context/ThemeContext';

type SettingsScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'MainTabs'>;
=======
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Switch, useTheme, List, Card, Icon } from 'react-native-paper';
import { useThemeContext } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/AppNavigator';

type SettingsScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Settings'>;
>>>>>>> 71e0de329ca0e5cd00b6ed2ecb7645aba3f44892

const SettingsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { isDarkMode, toggleTheme } = useThemeContext();
<<<<<<< HEAD
  const [notifications, setNotifications] = React.useState(true);
  const [soundEffects, setSoundEffects] = React.useState(true);
=======
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
    Alert.alert('Gizlilik Politikası', 'Bu özellik yakında eklenecek');
  };
>>>>>>> 71e0de329ca0e5cd00b6ed2ecb7645aba3f44892

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
          Ayarlar
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            <List.Section>
<<<<<<< HEAD
              <List.Item
                title="Karanlık Mod"
                description="Uygulama temasını değiştir"
=======
              <List.Subheader>Tema Ayarları</List.Subheader>
              <List.Item
                title="Koyu Mod"
                description="Uygulamanın görünümünü değiştirir"
>>>>>>> 71e0de329ca0e5cd00b6ed2ecb7645aba3f44892
                left={props => <List.Icon {...props} icon="theme-light-dark" />}
                right={() => (
                  <Switch
                    value={isDarkMode}
                    onValueChange={toggleTheme}
<<<<<<< HEAD
                  />
                )}
              />
=======
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
>>>>>>> 71e0de329ca0e5cd00b6ed2ecb7645aba3f44892
              <List.Item
                title="Bildirimler"
                description="Öğrenme hatırlatmalarını al"
                left={props => <List.Icon {...props} icon="bell" />}
                right={() => (
                  <Switch
                    value={notifications}
                    onValueChange={setNotifications}
<<<<<<< HEAD
=======
                    color={theme.colors.primary}
>>>>>>> 71e0de329ca0e5cd00b6ed2ecb7645aba3f44892
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
<<<<<<< HEAD
=======
                    color={theme.colors.primary}
>>>>>>> 71e0de329ca0e5cd00b6ed2ecb7645aba3f44892
                  />
                )}
              />
            </List.Section>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <List.Section>
<<<<<<< HEAD
              <List.Item
                title="Hesap Ayarları"
                description="Profil bilgilerinizi düzenleyin"
                left={props => <List.Icon {...props} icon="account-cog" />}
                onPress={() => navigation.navigate('MainTabs', { screen: 'Profile' })}
              />
              <List.Item
                title="Dil Ayarları"
                description="Uygulama dilini değiştir"
                left={props => <List.Icon {...props} icon="translate" />}
                onPress={() => {}}
              />
              <List.Item
                title="Veri Yönetimi"
                description="Verilerinizi yedekleyin veya sıfırlayın"
                left={props => <List.Icon {...props} icon="database" />}
                onPress={() => {}}
=======
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
>>>>>>> 71e0de329ca0e5cd00b6ed2ecb7645aba3f44892
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
<<<<<<< HEAD
=======
    elevation: 2,
>>>>>>> 71e0de329ca0e5cd00b6ed2ecb7645aba3f44892
  },
});

export default SettingsScreen; 