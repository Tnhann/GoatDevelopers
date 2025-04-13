import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4B7BEC',
    secondary: '#3D9970',
    accent: '#FF9F43',
    background: '#F7F9FC',
    text: '#2D3748',
    gray: '#A0AEC0',
    darkBackground: '#1A202C',
  },
  roundness: 8,
};

export const darkTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    background: '#1A202C',
    text: '#F7F9FC',
  },
}; 