# Install i18next for Multi-Language Support

Run this command in the Frontend directory:

```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

## What's Been Implemented:

1. **i18n Configuration** (`src/i18n.js`)
   - Configured i18next with English and Gujarati
   - Auto-detects user language
   - Stores preference in localStorage

2. **Translation Files**
   - `src/locales/en/translation.json` - English translations
   - `src/locales/gu/translation.json` - Gujarati translations

3. **Language Switcher Component** (`src/components/LanguageSwitcher.jsx`)
   - Dropdown to switch between English and Gujarati
   - Globe icon for visual clarity
   - Responsive design

4. **Updated Components**
   - Navbar now uses translations
   - Language switcher added to navbar
   - All navigation links are translatable

## How to Use:

1. Install the packages (command above)
2. The language switcher will appear in the navbar
3. Click the dropdown to switch between English (English) and ગુજરાતી (Gujarati)
4. User preference is saved automatically

## Adding More Translations:

To translate more components, use the `useTranslation` hook:

```javascript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return <h1>{t('myKey')}</h1>;
};
```

Then add the translation key to both `en/translation.json` and `gu/translation.json`.
