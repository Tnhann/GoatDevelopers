import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Dimensions, StatusBar, Text, Easing } from 'react-native';

const { width, height } = Dimensions.get('window');

type AnimatedSplashProps = {
  onAnimationComplete: () => void;
};

const AnimatedSplash: React.FC<AnimatedSplashProps> = ({ onAnimationComplete }) => {
  // Animasyon değerlerini tanımlayalım
  const scaleValue = useRef(new Animated.Value(0.1)).current; // Küçük başlangıç değeri
  const opacityValue = useRef(new Animated.Value(1)).current;
  const loadingBarWidth = useRef(new Animated.Value(0)).current;
  // Nabız efekti kaldırıldı

  // Arka plan rengi animasyonu için
  const bgColorValue = useRef(new Animated.Value(0)).current;

  // Logo için optimal boyut hesaplaması - En büyük ölçek
  const logoSize = Math.min(width, height) * 0.9; // Ekranın %90'i kadar

  // Yükleme çubuğu genişliği
  const barWidth = width * 0.85; // Ekran genişliğinin %85'i

  // Animasyon süreleri - Daha hızlı
  const loadingDuration = 3000; // Yükleme çubuğu dolma süresi (ms)
  const logoScaleDuration = 2800; // Logo büyüme süresi (ms)
  const fadeOutDuration = 800; // Kaybolma süresi (ms)
  useEffect(() => {
    // İlk açılışta StatusBar'ı gizleyelim
    StatusBar.setHidden(true);

    // Önce yükleme çubuğunun tamamen dolmasını sağlayalım
    Animated.timing(loadingBarWidth, {
      toValue: 1, // 1 = %100 dolu
      duration: loadingDuration,
      easing: Easing.inOut(Easing.cubic), // Daha akıcı bir hareket
      useNativeDriver: false,
    }).start();

    // Nabız efekti kaldırıldı

    // Logo animasyonunu ve çubuk tamamlandıktan sonraki adımları ayarlayalım
    Animated.sequence([
      // Logo küçükten büyüğe animasyonu - yükleme çubuğuyla paralel
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: logoScaleDuration,
        easing: Easing.out(Easing.back(1.5)), // Biraz sıçrama efekti
        useNativeDriver: true,
      }),

      // Çubuğun tamamen dolması için ek bekleme - daha kısa
      Animated.delay(200),

      // Logo ve yükleme çubuğunun kaybolması - daha hızlı
      Animated.parallel([
        Animated.timing(opacityValue, {
          toValue: 0,
          duration: fadeOutDuration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(bgColorValue, {
          toValue: 1,
          duration: fadeOutDuration,
          easing: Easing.out(Easing.cubic),
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
              { scale: scaleValue }
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

          {/* Yükleme yüzdesi */}
          <Animated.Text style={styles.loadingPercentage}>
            {loadingBarWidth.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%']
            })}
          </Animated.Text>
        </View>

        {/* Yükleniyor yazısı */}
        <Animated.Text style={[styles.loadingText, { opacity: opacityValue }]}>
          Vocaboo yükleniyor...
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
    paddingHorizontal: 10,
  },
  logo: {
    maxWidth: '100%',
    maxHeight: '80%',
  },
  loadingBarContainer: {
    position: 'absolute',
    bottom: height * 0.25, // Resme daha yakın olması için yukarı taşındı
    height: 16, // Daha kalın bar
    width: width * 0.85,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
    flexDirection: 'row', // Yükleme yüzdesi için
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: 0,
    borderRadius: 8,
  },
  loadingPercentage: {
    color: '#333',
    fontSize: 12,
    fontWeight: 'bold',
    zIndex: 1, // Yükleme çubuğunun üzerinde görünmesi için
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  loadingText: {
    position: 'absolute',
    bottom: height * 0.2, // Yükleme çubuğuyla uyumlu olması için yukarı taşındı
    color: '#333',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  }
});

export default AnimatedSplash;