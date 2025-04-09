import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from 'sonner-native';

import HomeScreen from "./screens/HomeScreen";
import AuthScreen from "./screens/AuthScreen";
import WordListsScreen from "./screens/WordListsScreen";
import CreateListScreen from "./screens/CreateListScreen";
import LearningModeScreen from "./screens/LearningModeScreen";
import QuizModeScreen from "./screens/QuizModeScreen";
import ProgressScreen from "./screens/ProgressScreen";
import SearchScreen from "./screens/SearchScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ProfileScreen from "./screens/ProfileScreen";

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator 
      initialRouteName="Auth"
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#007AFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="WordLists" component={WordListsScreen} options={{ title: 'My Word Lists' }} />
      <Stack.Screen name="CreateList" component={CreateListScreen} options={{ title: 'Create New List' }} />
      <Stack.Screen name="LearningMode" component={LearningModeScreen} options={{ title: 'Learn' }} />
      <Stack.Screen name="QuizMode" component={QuizModeScreen} options={{ title: 'Quiz' }} />
      <Stack.Screen name="Progress" component={ProgressScreen} options={{ title: 'My Progress' }} />
      <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider style={styles.container}>
      <Toaster />
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});