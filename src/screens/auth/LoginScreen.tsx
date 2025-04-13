import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, useTheme, ActivityIndicator, Snackbar, Icon } from 'react-native-paper';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AppNavigator';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const getErrorMessage = (error: any) => {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Geçersiz email adresi.';
      case 'auth/user-disabled':
        return 'Bu hesap devre dışı bırakılmış.';
      case 'auth/user-not-found':
        return 'Bu email adresiyle kayıtlı kullanıcı bulunamadı.';
      case 'auth/wrong-password':
        return 'Hatalı şifre.';
      case 'auth/too-many-requests':
        return 'Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin.';
      default:
        return 'Bir hata oluştu. Lütfen tekrar deneyin.';
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Lütfen tüm alanları doldurun.');
      setSnackbarVisible(true);
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // useAuth hook'u otomatik olarak Main ekranına yönlendirecek
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Icon
            source="book-open-page-variant"
            size={80}
            color={theme.colors.primary}
          />
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
            Hoş Geldiniz
          </Text>
          <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Öğrenmeye devam etmek için giriş yapın
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="E-posta"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            left={<TextInput.Icon icon="email" />}
            error={!!(error && !email.trim())}
          />

          <TextInput
            label="Şifre"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            mode="outlined"
            secureTextEntry
            left={<TextInput.Icon icon="lock" />}
            error={!!(error && !password.trim())}
          />

          <Button
            mode="text"
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPasswordButton}
          >
            Şifremi Unuttum?
          </Button>

          <Button
            mode="contained"
            onPress={handleLogin}
            style={[styles.loginButton, { backgroundColor: theme.colors.primary }]}
            loading={loading}
          >
            Giriş Yap
          </Button>

          <View style={styles.registerContainer}>
            <Text style={{ color: theme.colors.onSurfaceVariant }}>
              Hesabınız yok mu?
            </Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Register')}
            >
              Kayıt Ol
            </Button>
          </View>
        </View>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: 'Kapat',
          onPress: () => setSnackbarVisible(false),
        }}
        duration={3000}
      >
        {error}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  input: {
    marginBottom: 8,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 24,
  },

  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
});

export default LoginScreen;