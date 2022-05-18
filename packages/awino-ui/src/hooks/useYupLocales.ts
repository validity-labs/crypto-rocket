import { useEffect } from 'react';

import { useTranslation } from 'next-i18next';

import { setLocale } from 'yup';

/**
 * on language change set correct translation for yup common validation messages
 */
function useYupLocales() {
  const {
    t,
    i18n: { language },
  } = useTranslation('yup');
  useEffect(() => {
    setLocale({
      mixed: {
        required: t('required'),
      },
      string: {
        email: t('valid.email'),
      },
    });
  }, [language, t]);

  return;
}

export default useYupLocales;
