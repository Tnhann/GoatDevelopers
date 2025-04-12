import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import WordListsScreen from '../screens/WordListsScreen';
import ListDetailsScreen from '../screens/ListDetailsScreen';
import QuizModeScreen from '../screens/QuizModeScreen';
import QuizResultsScreen from '../screens/QuizResultsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const WordListsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="WordLists" 
        component={WordListsScreen}
        options={{ title: 'Kelime Listeleri' }}
      />
      <Stack.Screen 
        name="ListDetails" 
        component={ListDetailsScreen}
        options={{ title: 'Liste Detayları' }}
      />
      <Stack.Screen 
        name="QuizMode" 
        component={QuizModeScreen}
        options={{ title: 'Quiz Modu' }}
      />
      <Stack.Screen 
        name="QuizResults" 
        component={QuizResultsScreen}
        options={{ title: 'Quiz Sonuçları' }}
      />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
        },
      }}
    >
      <Tab.Screen
        name="MainTabs"
        component={WordListsStack}
        options={{
          headerShown: false,
          title: 'Listeler',
          tabBarIcon: ({ color, size }) => (
            <Icon name="format-list-bulleted" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Ayarlar',
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator; 