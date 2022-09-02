import DateFnsAdapter from '@date-io/date-fns';
import defaultLocale from 'date-fns/locale/en-US';
type Locale = typeof defaultLocale;

import { Language } from '@/types/app';

const dateIO = new DateFnsAdapter();

// Track loaded date-fns locale files, so it is loaded only once
const locales: Record<Language, Locale | undefined> = {
  // de: undefined,
  en: undefined,
};

/**
 * Change date-io locale on app langauge change, with dynamic import
 * of language other than english (en-US)
 * @param language - language to change locale file to
 * @returns
 */
export const changeDateIOLocale = (language: Language) => {
  const loadLanguage = async () => {
    if (!locales[language]) {
      switch (language) {
        case 'en':
          locales.en = defaultLocale;
          break;
        // case 'de':
        //   locales.de = await (await import(`date-fns/locale/de`)).default;
        //   break;
      }
    }
  };
  return loadLanguage().then(() => {
    dateIO.locale = locales[language];
  });
};

export default dateIO;
