import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, useTheme, Card, List, Divider, TextInput, Portal, Modal, Switch } from 'react-native-paper';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { MainStackParamList } from '../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useThemeContext } from '../context/ThemeContext';

type SettingsScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'MainTabs'>;

const SettingsScreen = () => {
  const { user, updateDisplayName } = useAuth();
  const theme = useTheme();
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(user?.displayName || '');
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  const handleUpdateDisplayName = async () => {
    try {
      await updateDisplayName(newDisplayName);
      setIsProfileModalVisible(false);
      navigation.navigate('MainTabs', { screen: 'Profile' });
    } catch (error) {
      console.error('Update display name error:', error);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
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

      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
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

      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <List.Section>
            <List.Item
              title="Profil"
              description="Kullanıcı bilgilerinizi düzenleyin"
              left={props => <List.Icon {...props} icon="account" />}
              onPress={() => setIsProfileModalVisible(true)}
            />
            <Divider />
            <List.Item
              title="Dil"
              description="Uygulama dilini değiştirin"
              left={props => <List.Icon {...props} icon="translate" />}
              onPress={() => {
                Alert.alert(
                  'Dil Seçimi',
                  'Uygulama dili değiştirilecek',
                  [
                    {
                      text: 'İptal',
                      style: 'cancel',
                    },
                    {
                      text: 'Tamam',
                      onPress: () => {
                        // Dil değiştirme işlemi
                      },
                    },
                  ],
                );
              }}
            />
            <Divider />
            <List.Item
              title="Gizlilik Politikası"
              description="Gizlilik politikamızı görüntüleyin"
              left={props => <List.Icon {...props} icon="shield-lock" />}
              onPress={() => navigation.navigate('PrivacyPolicy')}
            />
            <Divider />
            <List.Item
              title="Hakkında"
              description="Uygulama hakkında bilgi alın"
              left={props => <List.Icon {...props} icon="information" />}
              onPress={() => navigation.navigate('About')}
            />
          </List.Section>
        </Card.Content>
      </Card>

      <Portal>
        <Modal
          visible={isProfileModalVisible}
          onDismiss={() => setIsProfileModalVisible(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}
        >
          <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
            Profil Bilgileri
          </Text>
          <TextInput
            label="Kullanıcı Adı"
            value={newDisplayName}
            onChangeText={setNewDisplayName}
            style={styles.input}
          />
          <TextInput
            label="E-posta"
            value={user?.email || ''}
            disabled
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={handleUpdateDisplayName}
            style={styles.modalButton}
          >
            Kaydet
          </Button>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  modal: {
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  modalButton: {
    marginTop: 8,
  },
});

export default SettingsScreen; 