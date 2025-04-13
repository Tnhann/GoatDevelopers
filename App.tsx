import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { ThemeProvider } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import AnimatedSplash from './src/components/AnimatedSplash';
import * as SplashScreen from 'expo-splash-screen';

// Splash screen'in otomatik gizlenmesini engelliyoruz
SplashScreen.preventAutoHideAsync().catch(() => {
  /* Hatayı yoksay */
});

// Uygulama kaynaklarının yüklendiğini simüle eden fonksiyon
const loadAppResources = async () => {
  // Gerçek uygulamanızda burada:
  // - Fontları yükleyebilirsiniz
  // - Depolanan kullanıcı verilerini çekebilirsiniz
  // - API'den gerekli verileri alabilirsiniz
  // - İlk konfigurasyon verilerini hazırlayabilirsiniz
  
  // Kaynakların yüklenmesini simüle etmek için 3.5 saniye bekleyelim
  // Daha hızlı bir yükleme süresi
  return new Promise<void>(resolve => {
    setTimeout(resolve, 3500);
  });
};

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [splashAnimationComplete, setSplashAnimationComplete] = useState(false);

  // Uygulama başlangıç hazırlıkları
  useEffect(() => {
    async function prepare() {
      try {
        // Uygulama kaynaklarını yükleyin
        await loadAppResources();
      } catch (e) {
        console.warn('Hazırlık aşamasında hata:', e);
      } finally {
        // Uygulama hazır olduğunda
        setAppIsReady(true);
        
        // Sistem splash screen'ini gizle
        try {
          await SplashScreen.hideAsync();
        } catch (e) {
          console.warn('Splash screen gizlenirken hata:', e);
        }
      }
    }

    prepare();
  }, []);

  // Özel splash animasyonu tamamlandığında çağrılacak fonksiyon
  const handleAnimationComplete = useCallback(() => {
    setSplashAnimationComplete(true);
  }, []);

  // Uygulama henüz yüklenmedi ise boş bir görünüm döndür
  if (!appIsReady) {
    return null;
  }

  return (
    <ThemeProvider>
      <PaperProvider>
        <View style={styles.container}>
          <AppNavigator />
          {!splashAnimationComplete && (
            <AnimatedSplash onAnimationComplete={handleAnimationComplete} />
          )}
        </View>
      </PaperProvider>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // iOS ve Android'de farklı güvenli alan davranışlarını düzeltmek için
    ...(Platform.OS === 'ios' 
      ? { paddingTop: 0 } 
      : {}
    )
  }
});

export default App;