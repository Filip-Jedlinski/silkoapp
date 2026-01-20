# SilkoApp - Prywatna Aplikacja Treningowa PWA

Nowoczesna Progressive Web App do planowania i śledzenia postępu treningu. Aplikacja działa offline i nie wymaga internetu do codziennego użytku.

## 🎯 Główne Cechy

✅ **Offline-ready** - Pełna funkcjonalność bez internetu  
✅ **Instalowalna** - Dodaj do ekranu głównego na smartfonie  
✅ **Responsywna** - Doskonale działa na telefonie i tablecie  
✅ **Szybka** - Załadowuje się w mgnieniu oka  
✅ **Prywatna** - Wszystkie dane przechowywane lokalnie, bez kont  
✅ **Minimalistyczna** - Czysty, nowoczesny interfejs

## 🏗️ Struktura Aplikacji

### 5 Głównych Ekranów

1. **Dzisiaj** 📋
   - Aktualny plan treningowy na dzień
   - Lista ćwiczeń z postępem
   - Szybki dostęp do szczegółów ćwiczenia

2. **Plan Tygodniowy** 📅
   - Przeglądaj 5-dniowy plan
   - Rozwijaj i zwijaj dni
   - Edytuj ćwiczenia i serie

3. **Postęp** 📊
   - Statystyki ukończonych ćwiczeń
   - Postęp po grupach mięśniowych
   - Top lifting records

4. **Jedzenie** 🍗
   - Szybkie posiłki do śledzenia
   - Licznik kalorii i białka
   - Zaznaczaj zjedzone posiłki

5. **Ustawienia** ⚙️
   - Exportuj/importuj dane (JSON)
   - Reset postępu
   - Preferencje aplikacji

## 🚀 Technologia

- **React 19** + TypeScript
- **Tailwind CSS** - Stylowanie
- **Vite** - Build tool
- **PWA** - Progressive Web App
- **localStorage** - Przechowywanie danych
- **Lucide React** - Ikony

## 📦 Predefiniowany Plan Treningowy

Aplikacja zawiera gotowy plan Push/Pull/Legs:

- **Poniedziałek**: Push (Klatka + Ramiona) - 5 ćwiczeń
- **Wtorek**: Pull (Plecy + Biceps) - 5 ćwiczeń
- **Środa**: Cardio & Core - 3 ćwiczenia
- **Czwartek**: Legs - 4 ćwiczenia
- **Piątek**: Push wzmocnienie - 4 ćwiczenia

Każde ćwiczenie zawiera:

- Nazwę i opis
- Serie × powtórzenia
- Domyślny ciężar
- Docelową grupę mięśniową
- Link do tutoriala YouTube

## 💾 Przechowywanie Danych

Wszystkie dane są zapisywane w `localStorage`:

```
silkoapp_training_plan   - Plan treningowy
silkoapp_meals           - Dzisiejsze posiłki
silkoapp_settings        - Preferencje użytkownika
```

## 🎮 Jak Korzystać

### Instalacja (Offline)

1. Otwórz aplikację w przeglądarce
2. Kliknij "Zainstaluj" (Android) lub "Udostępnij → Na ekran główny" (iOS)
3. Aplikacja będzie dostępna offline

### Dziennie

1. Przejdź na ekran "Dzisiaj"
2. Kliknij na ćwiczenie, aby zobaczyć szczegóły
3. Zaznacz jako wykonane ✓
4. Edytuj ciężary jeśli trzeba
5. Śledź postęp na ekranie "Postęp"

## 🛠️ Instalacja i Uruchomienie

### Wymagania

- Node.js 18+
- npm

### Instalacja zależności

```bash
npm install --legacy-peer-deps
```

### Uruchomienie dev serwera

```bash
npm run dev
```

Otwórz [http://localhost:5173](http://localhost:5173) w przeglądarce.

### Build dla produkcji

```bash
npm run build
```

Zbudowana aplikacja będzie w folderze `dist/`.

## 📱 PWA Features

- ✅ Offline mode (Service Worker)
- ✅ Install prompt (Android/iOS)
- ✅ App manifest
- ✅ Splash screen
- ✅ Home screen icon

## 🎨 Design Principles

- **Jasny motyw** (light mode)
- **Minimalistyczny** - bez zbędnych elementów
- **Card-based layout** - karty z delikatnym cieniem
- **Mobile-first** - przede wszystkim telefon
- **Micro-interactions** - subtelne animacje
- **Duże fonty** - łatwe do czytania

---

**Enjoy your training! 💪**

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
