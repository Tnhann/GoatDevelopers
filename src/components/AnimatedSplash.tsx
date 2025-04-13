import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Dimensions, StatusBar, Text } from 'react-native';

const { width, height } = Dimensions.get('window');

type AnimatedSplashProps = {
  onAnimationComplete: () => void;
};

const AnimatedSplash: React.FC<AnimatedSplashProps> = ({ onAnimationComplete }) => {
  // Animasyon değerlerini tanımlayalım
  const scaleValue = useRef(new Animated.Value(0.1)).current; // Küçük başlangıç değeri
  const opacityValue = useRef(new Animated.Value(1)).current;
  const loadingBarWidth = useRef(new Animated.Value(0)).current;
  
  // Arka plan rengi animasyonu için
  const bgColorValue = useRef(new Animated.Value(0)).current;
  
  // Logo için optimal boyut hesaplaması - En büyük ölçek
  const logoSize = Math.min(width, height) * 1.1; // Ekrandan bile biraz büyük olsun
  
  // Yükleme çubuğu genişliği
  const barWidth = width * 0.85; // Ekran genişliğinin %85'i

  // Animasyon süreleri - Daha hızlı
  const loadingDuration = 3200; // Yükleme çubuğu dolma süresi (ms)
  const logoScaleDuration = 3000; // Logo büyüme süresi (ms)
  const fadeOutDuration = 800; // Kaybolma süresi (ms)

  useEffect(() => {
    // İlk açılışta StatusBar'ı gizleyelim
    StatusBar.setHidden(true);
    
    // Önce yükleme çubuğunun tamamen dolmasını sağlayalım
    Animated.timing(loadingBarWidth, {
      toValue: 1, // 1 = %100 dolu
      duration: loadingDuration,
      useNativeDriver: false,
    }).start();
    
    // Logo animasyonunu ve çubuk tamamlandıktan sonraki adımları ayarlayalım
    Animated.sequence([
      // Logo küçükten büyüğe animasyonu - yükleme çubuğuyla paralel
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: logoScaleDuration, // Yükleme çubuğundan biraz önce bitsin
        useNativeDriver: true,
      }),
      
      // Çubuğun tamamen dolması için ek bekleme - daha kısa
      Animated.delay(300),
      
      // Logo ve yükleme çubuğunun kaybolması - daha hızlı
      Animated.parallel([
        Animated.timing(opacityValue, {
          toValue: 0,
          duration: fadeOutDuration,
          useNativeDriver: true,
        }),
        Animated.timing(bgColorValue, {
          toValue: 1,
          duration: fadeOutDuration,
          useNativeDriver: false,
        })
      ])
    ]).start(() => {
      // Animasyon tamamlandığında status bar'ı tekrar göster
      StatusBar.setHidden(false);
      // Callback fonksiyonunu çağır
      onAnimationComplete();
    });
    
    // Component unmount olduğunda temizleme işlemi
    return () => {
      StatusBar.setHidden(false);
    };
  }, []);

  // Arka plan rengi interpolasyonu - beyazdan başlayıp uygulamanızın ana rengine doğru değişim
  const backgroundColor = bgColorValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ffffff', '#ffffff'] 
  });

  // Yükleme çubuğunun genişliği için interpolasyon
  const loadingWidth = loadingBarWidth.interpolate({
    inputRange: [0, 1],
    outputRange: [0, barWidth] // 0'dan tam genişliğe
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: opacityValue,
            transform: [
              { scale: scaleValue }, // Sadece ölçeklendirme animasyonu - dönme yok
            ],
          },
        ]}
      >
        <Image
          source={require('../../assets/Logo.png')}
          style={[styles.logo, { width: logoSize, height: logoSize }]}
          resizeMode="contain"
        />

        {/* Yükleme durumu görsel göstergesi (bar) */}
        <View style={styles.loadingBarContainer}>
          <Animated.View 
            style={[
              styles.loadingBar, 
              { 
                width: loadingWidth,
                backgroundColor: '#4A90E2'
              }
            ]} 
          />
        </View>
        
        {/* Yükleniyor yazısı */}
        <Animated.Text style={[styles.loadingText, { opacity: opacityValue }]}>
          Yükleniyor...
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    zIndex: 999,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingHorizontal: 10, // Daha az kenar boşluğu
  },
  logo: {
    maxWidth: '100%',
    maxHeight: '80%', // Ekranın %80'ini kapla
  },
  loadingBarContainer: {
    position: 'absolute',
    bottom: height * 0.15, // Ekranın altından %15 yukarıda
    height: 14, // Daha kalın bar
    width: width * 0.85, // Ekran genişliğinin %85'i
    backgroundColor: '#E0E0E0', // Boş bar rengi
    borderRadius: 7,
    overflow: 'hidden',
  },
  loadingBar: {
    height: '100%',
    width: 0, // Başlangıçta 0, animasyonla değişecek
    borderRadius: 7,
  },
  loadingText: {
    position: 'absolute',
    bottom: height * 0.1, // Yükleme çubuğunun altında
    color: '#555',
    fontSize: 20, // Büyük font
    fontWeight: '600', // Kalın yazı
  }
});

export default AnimatedSplash;