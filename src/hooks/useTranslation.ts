'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/translations';

type TranslationKey = keyof typeof translations.en;

export function useTranslation() {
  const { language } = useLanguage();
  
  const t = (key: TranslationKey | string): string => {
    const langTranslations = translations[language] as Record<string, string>;
    return langTranslations[key as string] || key;
  };
  
  return { t };
}
