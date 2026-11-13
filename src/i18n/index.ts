import { useCallback } from 'react';
import type { Language, LocalizedText } from '../data/types';
import { useMissionStore } from '../store/useMissionStore';

/** Language is part of the persisted mission design, so every screen agrees. */
export function useLang(): Language {
  return useMissionStore((state) => state.choices.language);
}

export function useT(): (ar: string, en: string) => string {
  const lang = useLang();
  return useCallback((ar: string, en: string) => (lang === 'ar' ? ar : en), [lang]);
}

export function useL(): (text: LocalizedText) => string {
  const lang = useLang();
  return useCallback((text: LocalizedText) => text[lang], [lang]);
}

export const dirOf = (lang: Language): 'rtl' | 'ltr' => (lang === 'ar' ? 'rtl' : 'ltr');

export const localeOf = (lang: Language): string => (lang === 'ar' ? 'ar' : 'en');
