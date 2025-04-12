import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { ThemeProvider } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <ThemeProvider>
      <PaperProvider>
        <AppNavigator />
      </PaperProvider>
    </ThemeProvider>
  );
};

export default App;
