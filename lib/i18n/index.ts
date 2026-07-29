import { en } from './en';
import { rw } from './rw';

export const translations = {
  en,
  rw,
};

export type LanguageCode = keyof typeof translations;
export type Translations = typeof en;
