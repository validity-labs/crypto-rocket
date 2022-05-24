import React /* , { useEffect, useState } */ from 'react';

import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { setPageI18nNamespace } from '@/app/state/slices/app';
import storeWrapper from '@/app/store';
import Seo from '@/components/layout/Seo/Seo';
import ResultSection from '@/components/pages/earn/farms/ResultSection/ResultSection';
// import { sleep } from '@/lib/helpers';

const FarmsPage: NextPage = () => {
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   (async () => {
  //     await sleep(2);
  //     setLoading(false);
  //   })();
  // }, []);

  return (
    <>
      <Seo />
      <ResultSection />
    </>
  );
};

export const getServerSideProps = storeWrapper.getServerSideProps((store) => async ({ locale }) => {
  const ns = 'earn-farms';
  await store.dispatch(setPageI18nNamespace(ns));

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'yup', ns])),
    },
  };
});

export default FarmsPage;
