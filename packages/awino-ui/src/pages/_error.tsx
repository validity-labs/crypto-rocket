import React from 'react';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { setPageI18nNamespace } from '@/app/state/slices/app';
import storeWrapper from '@/app/store';
import Seo from '@/components/layout/Seo/Seo';
import InfoSection from '@/components/pages/error/InfoSection';

interface Props {
  statusCode?: number;
}

const ErrorPage = ({ statusCode }: Props) => {
  return (
    <>
      <Seo />
      <InfoSection statusCode={statusCode} />
    </>
  );
};

export const getServerSideProps = storeWrapper.getServerSideProps((store) => async ({ res, err, locale }: any) => {
  const ns = 'error';
  await store.dispatch(setPageI18nNamespace(ns));
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

  return {
    props: {
      statusCode,
      ...(await serverSideTranslations(locale, ['common', ns])),
    },
  };
});

export default ErrorPage;
