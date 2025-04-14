# Vocaboo - Kelime Öğrenme Uygulaması

<div align="center">
  <img src="assets/logo3.png" alt="Vocaboo Logo" width="200"/>
</div>

## 📱 Uygulama Hakkında

Vocaboo, kelime öğrenmeyi daha etkili ve eğlenceli hale getiren bir mobil uygulamadır. Kullanıcılar kendi kelime listelerini oluşturabilir, hazır kelime listelerini kullanabilir ve çeşitli öğrenme modları ile kelime bilgilerini geliştirebilirler.

## ✨ Özellikler

### 📚 Kelime Listeleri
- **Hazır Kelime Listeleri**: Uygulamada İngilizce öğrenmek için hazır kelime listeleri bulunmaktadır.
- **Özel Listeler Oluşturma**: Kullanıcılar kendi kelime listelerini oluşturabilir ve düzenleyebilir.
- **Liste Yönetimi**: Listeleri düzenleme, silme ve paylaşma özellikleri.

### 🎮 Öğrenme Modları
- **Quiz Modu**: Kelime bilgisini test etmek için çoktan seçmeli sorular.
- **Öğrenme Modu**: Kelimeleri adım adım öğrenmek için tasarlanmış interaktif mod.

### 📊 İstatistikler
- **İlerleme Takibi**: Kullanıcılar öğrenme ilerlemelerini takip edebilir.
- **Performans Analizi**: Quiz sonuçları ve öğrenme performansı hakkında detaylı istatistikler.

### 🔄 Senkronizasyon
- **Bulut Depolama**: Kelime listeleri ve ilerleme Firebase ile bulut üzerinde saklanır.
- **Çoklu Cihaz Desteği**: Farklı cihazlarda aynı hesapla erişim imkanı.

## 🚀 Başlangıç

### Gereksinimler
- Node.js (v14 veya üzeri)
- npm veya yarn
- Expo CLI
- Mobil cihaz veya emülatör

### Kurulum

1. Repoyu klonlayın:
```bash
git clone https://github.com/Tnhann/GoatDevelopers.git
cd GoatDevelopers
```

2. Bağımlılıkları yükleyin:
```bash
npm install
# veya
yarn install
```

3. Uygulamayı başlatın:
```bash
npx expo start
```

4. Expo Go uygulamasını mobil cihazınıza indirin ve QR kodu tarayarak uygulamayı çalıştırın.

## 📱 Kullanım Kılavuzu

### 🔐 Hesap Oluşturma ve Giriş
1. Uygulama açıldığında giriş ekranı görüntülenir.
2. Yeni kullanıcılar "Hesap Oluştur" butonuna tıklayarak kayıt olabilir.
3. Mevcut kullanıcılar e-posta ve şifreleriyle giriş yapabilir.
4. Şifrenizi unuttuysanız "Şifremi Unuttum" seçeneğini kullanabilirsiniz.

### 📋 Ana Ekran
- Ana ekranda toplam kelime ve liste sayınızı görebilirsiniz.
- Günün kelimesi özelliği ile her gün yeni bir kelime öğrenebilirsiniz.
- Alt menüden diğer ekranlara hızlıca erişebilirsiniz.

### 📝 Kelime Listeleri
1. "Kelime Listeleri" sekmesine gidin.
2. "+" butonuna tıklayarak yeni liste oluşturun.
3. Mevcut listelere tıklayarak içeriğini görüntüleyin.
4. Liste detay ekranında kelime ekleyebilir, düzenleyebilir veya silebilirsiniz.

### 🎯 Quiz Modu
1. Bir kelime listesi seçin veya rastgele liste ile başlayın.
2. Çoktan seçmeli sorulara cevap verin.
3. Quiz sonunda performansınızı gösteren bir özet görüntülenir.

### 📖 Öğrenme Modu
1. Öğrenmek istediğiniz kelime listesini seçin.
2. Kelimeleri tek tek inceleyin ve öğrenin.
3. İlerlemeniz otomatik olarak kaydedilir.

### 📊 İstatistikler
- "İstatistikler" sekmesinde öğrenme performansınızı görüntüleyin.
- Doğru/yanlış cevap oranları, tamamlanan quizler ve öğrenilen kelimeler hakkında bilgi alın.

### ⚙️ Ayarlar
- Profil bilgilerinizi düzenleyin.
- Uygulama dilini değiştirin.
- Bildirim tercihlerinizi ayarlayın.

## 🛠️ Teknik Detaylar

### Kullanılan Teknolojiler
- **Frontend**: React Native, Expo
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **State Yönetimi**: React Context API
- **UI Kütüphanesi**: React Native Paper

### Proje Yapısı
- `/src`: Kaynak kodları
  - `/components`: Yeniden kullanılabilir bileşenler
  - `/screens`: Uygulama ekranları
  - `/navigation`: Navigasyon yapılandırması
  - `/services`: Firebase ve diğer servisler
  - `/hooks`: Özel React hook'ları
  - `/context`: Context API tanımlamaları
  - `/types`: TypeScript tip tanımlamaları

## 📜 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

## 👥 Katkıda Bulunanlar

- [Tunahan](https://github.com/Tnhann)
- [Ömer](https://github.com/omerfarukose)

## 📞 İletişim

Sorularınız veya geri bildirimleriniz için [issues](https://github.com/Tnhann/GoatDevelopers/issues) bölümünü kullanabilirsiniz.

---

<div align="center">
  <p>Vocaboo ile kelime öğrenmeyi keyifli hale getirin! 🚀</p>
</div>