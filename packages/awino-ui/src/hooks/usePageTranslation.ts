import { useTranslation } from 'next-i18next';

import { UseTranslationOptions } from 'react-i18next';

import { useAppSelector } from '../app/hooks';
/**
 * Hook to use page namespace while using translation method.
 * getServerSideProps should define ns prop inside props.
 */
export default function usePageTranslation(options?: UseTranslationOptions<string>) {
  const ns = useAppSelector((state) => state.app.ns);
  const { t } = useTranslation(ns, options);

  return t;
}
