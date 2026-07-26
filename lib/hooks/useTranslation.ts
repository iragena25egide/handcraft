import { useAppSelector } from '../store/hooks';
import { translations, LanguageCode } from '../i18n';

export const useTranslation = () => {
  const currentLang = useAppSelector((state) => state.language.currentLang) as LanguageCode;
  
  // Fallback to english if something goes wrong with state
  const t = translations[currentLang] || translations.en;
  
  return { t, currentLang };
};
