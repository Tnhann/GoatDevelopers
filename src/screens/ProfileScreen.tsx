import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, useTheme, Card, Icon, Avatar, Divider, List } from 'react-native-paper';
import { useAuth } from '../hooks/useAuth';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MainStackParamList } from '../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ProfileScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'MainTabs'>;

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [displayName, setDisplayName] = useState('');

  // Ekran her odaklandığında kullanıcı bilgilerini güncelle
  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        setDisplayName(user.displayName || '');
      }
    }, [user])
  );

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Avatar.Text 
          size={100} 
          label={displayName ? getInitials(displayName) : user?.email?.charAt(0).toUpperCase() || 'U'} 
          style={styles.avatar}
        />
        <Text style={[styles.name, { color: theme.colors.onPrimary }]}>
          {displayName || 'Kullanıcı Adı'}
        </Text>
        <Text style={[styles.email, { color: theme.colors.onPrimary }]}>
          {user?.email}
        </Text>
      </View>

      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <List.Section>
            <List.Item
              title="İstatistikler"
              description="Liste ve görev istatistiklerinizi görüntüleyin"
              left={props => <List.Icon {...props} icon="chart-bar" />}
              onPress={() => navigation.navigate('Statistics')}
            />
            <Divider />
            <List.Item
              title="Ayarlar"
              description="Uygulama ayarlarınızı yönetin"
              left={props => <List.Icon {...props} icon="cog" />}
              onPress={() => navigation.navigate('Settings')}
            />
          </List.Section>
        </Card.Content>
      </Card>

      <View style={styles.logoutContainer}>
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          icon="logout"
        >
          Çıkış Yap
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  avatar: {
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    opacity: 0.8,
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  logoutContainer: {
    padding: 16,
    marginTop: 8,
  },
  logoutButton: {
    borderColor: '#ff4444',
  },
});

export default ProfileScreen; 