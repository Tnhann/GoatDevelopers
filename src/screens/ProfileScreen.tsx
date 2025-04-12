import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, useTheme, Card, Icon, Avatar } from 'react-native-paper';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { MainStackParamList } from '../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ProfileScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'MainTabs'>;

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text 
          size={80} 
          label={user?.email?.charAt(0).toUpperCase() || 'U'} 
          style={styles.avatar}
        />
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Settings')}
            style={styles.button}
            icon="cog"
          >
            Ayarlara Git
          </Button>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Statistics')}
            style={styles.button}
            icon="chart-bar"
          >
            İstatistikleri Görüntüle
          </Button>
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.button}
            icon="logout"
          >
            Çıkış Yap
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#6200ee',
  },
  avatar: {
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  email: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  button: {
    marginVertical: 8,
  },
});

export default ProfileScreen; 