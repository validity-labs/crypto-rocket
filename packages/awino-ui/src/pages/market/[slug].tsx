import React, { useState } from 'react';

import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import BigNumber from 'bignumber.js';

import { setPageI18nNamespace } from '@/app/state/slices/app';
import storeWrapper from '@/app/store';
import Seo from '@/components/layout/Seo/Seo';
import DetailSection from '@/components/pages/market-details/DetailSection/DetailSection';
import TimelineSection from '@/components/pages/market-details/TimelineSection/TimelineSection';
import TitleSection from '@/components/pages/market-details/TitleSection/TitleSection';
import BreadcrumbSection from '@/components/pages/shared/BreadcrumbSection/BreadcrumbSection';
import { marketInfo, marketTypeInfo } from '@/fixtures/market';
import usePageTranslation from '@/hooks/usePageTranslation';
import { AssetKey, Breadcrumbs, MarketType, MarketInfo, MarketTypeInfo } from '@/types/app';

interface Props {
  slug: AssetKey;
}

const breadcrumbs: Breadcrumbs = [
  {
    key: 'market',
    url: '/market',
  },
];

const MarketDetailsPage: NextPage<Props> = ({ slug }) => {
  const t = usePageTranslation();
  const [selectedType, setSelectedType] = useState<MarketType>('supply');
  const [asset] = useState(() => slug.toUpperCase() as Uppercase<AssetKey>);
  return (
    <>
      <Seo title={t('page.title', { asset })} description={t('page.description', { asset })} />
      <BreadcrumbSection items={breadcrumbs} last={asset} />
      <TitleSection asset={slug} />
      <TimelineSection type={selectedType} info={marketTypeInfo} setType={setSelectedType} />
      <DetailSection asset={asset} info={marketInfo} />
    </>
  );
};

export const getServerSideProps = storeWrapper.getServerSideProps((store) => async ({ locale, params }) => {
  const ns = 'market-details';
  await store.dispatch(setPageI18nNamespace(ns));
  // const {
  //   locale,
  //   params: { slug },
  // } = props;
  // const [common, article] = await getDataFor('', { slug, locale });

  // if (!article) {
  //   return {
  //     notFound: true,
  //   };
  // }

  return {
    props: {
      slug: params.slug,
      ...(await serverSideTranslations(locale, ['common', ns])),
    },
  };
});

export default MarketDetailsPage;
