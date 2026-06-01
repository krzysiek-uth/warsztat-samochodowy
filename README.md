# Portal Warsztatu Samochodowego

System zarządzania warsztatem samochodowym z możliwością rezerwacji wizyt online, zarządzania klientami i monitorowania stanu napraw.

## O projekcie

Portal umożliwia klientom samodzielną rezerwację wizyt w warsztacie, śledzenie statusu napraw oraz zarządzanie swoim kontem. Właściciele warsztatu otrzymują kompletne narzędzie do zarządzania rezerwacjami, klientami i oferowanymi usługami.

## Główne funkcjonalności

### Dla klientów
- Rezerwacja wizyt z wyborem terminu i usługi
- Śledzenie statusu naprawy w czasie rzeczywistym
- Historia wszystkich wizyt z kosztami i szczegółami
- Upload zdjęć uszkodzeń pojazdu (do 5 plików na wizytę)
- Edycja danych osobowych i informacji o pojeździe
- System wystawiania opinii o warsztacie

### Dla administratorów
- Zarządzanie rezerwacjami ze zmianą statusów
- Dodawanie wycen i kosztów napraw
- Przeglądanie przesłanych zdjęć uszkodzeń
- Zarządzanie bazą klientów
- Katalog dostępnych usług z cenami
- Dashboard ze statystykami warsztatu
- Odpowiadanie na opinie klientów
- Zarządzanie dostępnymi terminami

### Bezpieczeństwo
- Szyfrowanie haseł algorytmem bcrypt
- Sesje użytkowników z bezpiecznymi cookies
- Podział uprawnień (klient / administrator)
- Walidacja danych po stronie frontendu i backendu
- Ograniczenia rozmiaru i typu przesyłanych plików

## Technologie

### Frontend
- React 18 z funkcyjnymi komponentami
- React Router dla nawigacji SPA
- Vite jako narzędzie budowania
- Axios do komunikacji z API
- Context API do zarządzania stanem
- Responsywny interfejs CSS

### Backend
- Node.js z frameworkiem Express 5
- SQLite jako baza danych
- Express-session do zarządzania sesjami
- Multer do obsługi uploadów plików
- CORS dla bezpiecznej komunikacji cross-origin

### Baza danych
System wykorzystuje 6 powiązanych tabel:
- users - dane użytkowników i administratorów
- bookings - rezerwacje wizyt
- services - katalog usług
- booking_images - zdjęcia przesłane przez klientów
- reviews - opinie o warsztacie
- available_slots - dostępne terminy rezerwacji

## Instalacja

### Wymagania wstępne
- Node.js w wersji LTS (https://nodejs.org/)
- Przeglądarka internetowa

### Uruchomienie projektu

1. Zainstaluj zależności:
```bash
npm install
```

2. Uruchom aplikację:
```bash
npm start
```

Aplikacja zostanie uruchomiona pod adresem http://localhost:3000 (frontend) i http://localhost:5000 (backend).

## Struktura projektu


warsztat-samochodowy/
├── src/                    Frontend React
│   ├── components/         Komponenty wielokrotnego użytku
│   ├── pages/              Strony aplikacji
│   ├── context/            Zarządzanie stanem globalnym
│   ├── services/           Komunikacja z API
│   └── styles/             Style CSS
├── server/                 Backend Node.js
│   ├── config/             Konfiguracja bazy danych
│   ├── controllers/        Logika biznesowa
│   ├── middleware/         Middleware (auth, upload)
│   ├── routes/             Endpointy API
│   └── services/           Usługi pomocnicze
├── database/               Baza danych SQLite
└── uploads/                Przesłane zdjęcia


## API

System udostępnia RESTful API z ponad 30 endpointami obejmującymi:

- Autentykację i autoryzację
- Zarządzanie rezerwacjami
- Obsługę użytkowników
- Katalog usług
- System opinii
- Upload i pobieranie zdjęć
- Statystyki dla administratorów

## Konta testowe

Administrator:
- Email: admin@warsztat.pl
- Hasło: admin123