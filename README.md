# 🏆 Milyoner Kafası - Eğlenceli Mobil Bilgi Yarışması

<div align="center">

![Milyoner Kafası Logo](public/icon.svg)

[![Flutter](https://img.shields.io/badge/Flutter-3.44.6-02569B?style=for-the-badge&logo=flutter&logoColor=white)](https://flutter.dev)
[![Dart](https://img.shields.io/badge/Dart-3.12.2-0175C2?style=for-the-badge&logo=dart&logoColor=white)](https://dart.dev)
[![Android](https://img.shields.io/badge/Android-APK%20%26%20AAB-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://developer.android.com)
[![Size](https://img.shields.io/badge/Boyut-16.2%20MB-success?style=for-the-badge)](#-boyut-optimizasyonu)
[![Questions](https://img.shields.io/badge/Soru%20Havuzu-1125%2B-F59E0B?style=for-the-badge)](#-1100-soru-havuzu)

**Klasik "Kim Milyoner Olmak İster" formatını esprili sunucular, çılgın jokerler ve 1100'den fazla soruyla modernleştiren mobil bilgi yarışması oyunu.**

[📱 Hemen Telefona İndir (.APK)](#-hemen-telefona-indir-apk) • [🌐 Google Play Store Yükleme](#-google-play-store-da%C4%9F%C4%B1t%C4%B1m%C4%B1) • [✨ Özellikler](#-oyun-%C3%B6zellikleri)

</div>

---

## 📲 Hemen Telefona İndir (.APK)

Doğrudan Android telefonunuza indirip oynamak için aşağıdaki butona tıklayın:

<div align="center">

### 👉 [📥 MilyonerKafasi_Telefon_16MB.apk İndir](https://github.com/akifozev/kocluk-takip/raw/main/MilyonerKafasi_Telefon_16MB.apk) 👈

*(Sadece 16.2 MB - Çevrimdışı / İnternetsiz Çalışır)*

</div>

---

## ✨ Oyun Özellikleri

### 1. 🎙️ 3 Farklı Karakterli Sunucu
- 🤵🏻‍♂️ **Kenan Bey (Karizmatik Usta):** Klasik yarışma ağırlığı, derin bakışlar ve gerilimi artıran replikler (*"Son kararın mı?", "Nefesler tutuldu..."*).
- 🧢 **Kanka Burak (Mahalle Arkadaşı):** Samimi, esprili ve sürekli parayı kırışma hayalleri kuran yol arkadaşı (*"Kanka bence C gibi ama yanarsan karışmam ha!"*).
- 🧐 **Prof. Muzaffer (Ukala Akademisyen):** Bilimsel, rasyonel ve hafif iğneleyici replikler (*"Bilişsel kapasitenizi gösterme sırası sizde"*).

### 2. ⚡ 5 İnteraktif Joker
- 🌓 **%50:50 (Yarı Yarıya):** Yanlış olan 2 şıkkı siler.
- 📞 **Telefon Jokeri:** 3 farklı yapay zeka & arkadaş karakterini arama şansı (*Prof. Bilgin, Kanka Burak veya ChatGPT*).
- 👥 **Seyirci Jokeri:** Seyircilerin oylarını dinamik ve animasyonlu canlı yüzdelik grafiklerle gösterir.
- 🔄 **Soru Değiştir:** Zorlanılan soruyu aynı para basamağında yepyeni bir soruyla değiştirir.
- 🛡️ **Çift Cevap (Ekstra Hak):** O soruda 1 kez hata yapma hakkı tanır (ilk cevap yanlışsa elenmezsiniz).

### 3. 📚 1.100+ Dev Soru Havuzu
- 1'den 15'e kadar her seviyeye özel **75'er soru** (Toplam **1.125 adet soru**).
- **Kategoriler:** Tarih, Coğrafya, Bilim & Doğa, Sinema & Dizi, Popüler Kültür, Spor, Genel Kültür, Sanat, Edebiyat ve Komik/İlginç Bilgiler.
- **Hilesiz & Tamamen Rastgele:** Oyuncuların soruları önceden seçmesi engellenmiştir. Sistem seviyeye uygun soruyu rastgele getirir ve bir oyunda çıkan soru asla tekrarlanmaz.

### 4. 💰 Para Merdiveni ve Barajlar
- **1. Baraj (5. Soru):** 20.000 ₺ (Garanti Ödül)
- **2. Baraj (10. Soru):** 250.000 ₺ (Garanti Ödül)
- **Büyük Ödül (15. Soru):** 10.000.000 ₺
- **Çekilme Hakkı:** İstediğiniz an kazandığınız parayı alıp yarışmadan ayrılabilirsiniz.

---

## ⚡ Boyut Optimizasyonu (16.2 MB)

Oyun ilk başta tüm işlemci mimarilerini bir arada barındıran 147 MB'lık evrensel paketten, aşağıdaki optimizasyonlarla **16.2 MB'a** düşürülmüştür:
1. **ProGuard & R8 Code Shrinking:** Kullanılmayan sınıflar ve Android kaynakları budandı (`isMinifyEnabled = true`, `isShrinkResources = true`).
2. **Mimari Ayrımı (Split-per-ABI):** Modern 64-bit telefonlar için özel derlendi.
3. **Ağır Kütüphaneler Temizlendi:** Sıfır harici medya kütüphanesi ile hafif haptik motoru entegre edildi.

---

## 🌐 Google Play Store Dağıtımı

Uygulama, Google Play Console'un en güncel gereksinimlerine göre hazırlanmıştır:

| Dosya | Boyut | Açıklama |
| :--- | :--- | :--- |
| **`MilyonerKafasi.aab`** | **43.1 MB** | Google Play Console'a yüklenecek imzalı **Android App Bundle**. *(Kullanıcılar indirirken Google Play otomatik olarak ~16 MB indirir)* |
| **`MilyonerKafasi_Telefon_16MB.apk`** | **16.2 MB** | Doğrudan cihaza yüklenebilir imzalı release APK. |
| **`play_store_anahtarlari/`** | - | `upload-keystore.jks` ve `key.properties` imza yedekleri. |

### Play Store İmza Bilgileri
- **Keystore:** `upload-keystore.jks`
- **Alias:** `upload`
- **Şifre:** `MilyonerKafasi2026`
- **Paket Kimliği (Application ID):** `com.milyonerkafasi.milyoner_app`

---

## 💻 Geliştirme & Yerel Kurulum

Projeyi bilgisayarınızda derlemek veya geliştirmek için:

```bash
# Proje dizinine girin
cd milyoner_app

# Bağımlılıkları yükleyin
flutter pub get

# Hata ayıklama modunda çalıştırın
flutter run

# Google Play için App Bundle (.aab) üretin
flutter build appbundle --release

# Cihaz için optimize APK üretin
flutter build apk --release --split-per-abi
```

---

## 📄 Lisans

Bu proje kişisel ve ticari kullanıma uygun açık kaynak olarak geliştirilmiştir.
