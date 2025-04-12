import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, useTheme, Card, Icon, Switch, List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/AppNavigator';
import { useThemeContext } from '../context/ThemeContext';

type SettingsScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'MainTabs'>;

const SettingsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const [notifications, setNotifications] = React.useState(true);
  const [soundEffects, setSoundEffects] = React.useState(true);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
          Ayarlar
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            <List.Section>
              <List.Item
                title="Karanlık Mod"
                description="Uygulama temasını değiştir"
                left={props => <List.Icon {...props} icon="theme-light-dark" />}
                right={() => (
                  <Switch
                    value={isDarkMode}
                    onValueChange={toggleTheme}
                  />
                )}
              />
              <List.Item
                title="Bildirimler"
                description="Öğrenme hatırlatmalarını al"
                left={props => <List.Icon {...props} icon="bell" />}
                right={() => (
                  <Switch
                    value={notifications}
                    onValueChange={setNotifications}
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
                  />
                )}
              />
            </List.Section>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <List.Section>
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
  },
});

export default SettingsScreen; 