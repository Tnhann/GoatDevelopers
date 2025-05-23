import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import { Image, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../hooks/useAuth';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import WordListsScreen from '../screens/WordListsScreen';
import ListDetailsScreen from '../screens/ListDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import QuizModeScreen from '../screens/QuizModeScreen';
import LearningModeScreen from '../screens/LearningModeScreen';
import QuizResultsScreen from '../screens/QuizResultsScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';
import AboutScreen from '../screens/AboutScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainStackParamList = {
  MainTabs: { screen: 'Home' | 'WordLists' | 'Profile' };
  ListDetails: { listId: string };
  QuizMode: { listId: string };
  QuizResults: {
    score: number;
    totalQuestions: number;
    listId: string;
  };
  LearningMode: { listId: string };
  Settings: undefined;
  Statistics: undefined;
  ProfileEdit: undefined;
  About: undefined;
  PrivacyPolicy: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  WordLists: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const AuthNavigator = () => {
  const theme = useTheme();

  return (
    <AuthStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} options={{ title: 'Giriş' }} />
      <AuthStack.Screen name="Register" component={RegisterScreen} options={{ title: 'Kayıt Ol' }} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Şifremi Unuttum' }} />
    </AuthStack.Navigator>
  );
};

const MainTabs = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Ana Ekran',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="WordLists"
        component={WordListsScreen as React.ComponentType<any>}
        options={{
          title: 'Kelime Listeleri',
          tabBarIcon: ({ color, size }) => (
            <Icon name="book" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const MainNavigator = () => {
  const theme = useTheme();

  return (
    <MainStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
      }}
    >
      <MainStack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="ListDetails"
        component={ListDetailsScreen}
        options={{ title: 'Kelime Listesi' }}
      />
      <MainStack.Screen
        name="QuizMode"
        component={QuizModeScreen}
        options={{ title: 'Quiz Modu' }}
      />
      <MainStack.Screen
        name="QuizResults"
        component={QuizResultsScreen}
        options={{ title: 'Quiz Sonuçları' }}
      />
      <MainStack.Screen
        name="LearningMode"
        component={LearningModeScreen}
        options={{ title: 'Öğrenme Modu' }}
      />
      <MainStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Ayarlar' }}
      />
      <MainStack.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{ title: 'İstatistikler' }}
      />
      <MainStack.Screen
        name="ProfileEdit"
        component={ProfileEditScreen}
        options={{ title: 'Profili Düzenle' }}
      />
      <MainStack.Screen
        name="About"
        component={AboutScreen}
        options={{ title: 'Hakkında' }}
      />
      <MainStack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{ title: 'Gizlilik Politikası' }}
      />
    </MainStack.Navigator>
  );
};

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogo: {
    width: 120,
    height: 40,
  },
});

export default AppNavigator;