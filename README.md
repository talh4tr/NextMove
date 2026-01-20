# NextMove AI

NextMove AI, flört ve randevu konuşmalarını analiz eden ve kullanıcıya bir sonraki hamleyi net şekilde söyleyen bir AI asistandır.

## MVP Akışı

1. **Splash**: Logo + slogan.
2. **Onboarding**: Kullanıcı karakterini seçer (lokal saklanır).
3. **Konuşma Girişi**: WhatsApp / Instagram konuşması yapıştırılır ve analiz edilir.
4. **Analiz Sonucu**: İlgi yüzdesi, tespit ve öneri sunulur.
5. **Mesaj Önerisi**: Dengeli / Daha Mesafeli / Daha Net tonu ile tek bir mesaj önerisi alınır.

## Kurulum

```bash
npm install
```

## Çalıştırma

```bash
npm run start
```

## Ortam Değişkenleri

AI çağrıları backend üzerinden yönetilir ve API key frontend'e yazılmaz.

```bash
EXPO_PUBLIC_API_BASE_URL=https://your-api.example.com
```

## Backend API Beklentisi

MVP için iki endpoint yeterlidir:

- `POST /analyze`
  - Body: `{ "character": "Dengeli & Düşünen", "conversation": "..." }`
  - Response:
    ```json
    {
      "interestScore": 72,
      "trend": "Yükseliş",
      "detection": "Mesajlar net ama tempo biraz hızlı.",
      "recommendation": {
        "timing": "Akşam 20:00 civarı",
        "nextStep": "Kısa ve net bir soru ile ilerle"
      }
    }
    ```

- `POST /suggest`
  - Body: `{ "character": "Dengeli & Düşünen", "tone": "Dengeli", "conversation": "..." }`
  - Response:
    ```json
    {
      "tone": "Dengeli",
      "message": "Bugün biraz yoğundum ama merak ettim, günün nasıl geçti?"
    }
    ```

## Geliştirme Notları

- UI metinleri ve marka dili brief'e göre düzenlendi.
- Prompt'lar backend'de tutulmalı ve karakter seçimi prompt'a parametre olarak eklenmeli.
- State management için Context kullanıldı, karakter AsyncStorage ile saklanıyor.
- İleride i18n altyapısı (örn. i18next) eklenerek çoklu dil desteği sağlanabilir.
- Proje büyüdükçe daha sıkı lint kuralları ve unit testler (örn. Jest + React Native Testing Library) önerilir.

