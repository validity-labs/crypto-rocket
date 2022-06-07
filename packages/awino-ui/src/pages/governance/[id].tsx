import React, { useEffect, useState } from 'react';

import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { setPageI18nNamespace } from '@/app/state/slices/app';
import storeWrapper from '@/app/store';
import Loader from '@/components/general/Loader/Loader';
import Seo from '@/components/layout/Seo/Seo';
import DetailSection from '@/components/pages/governance-details/DetailSection/DetailSection';
import TitleSection from '@/components/pages/governance-details/TitleSection/TitleSection';
import { governanceProposals } from '@/fixtures/governance';
import usePageTranslation from '@/hooks/usePageTranslation';
import { sleep } from '@/lib/helpers';
import { ProposalItem } from '@/types/app';

interface Props {
  id: number;
}

const GovernanceDetailsPage: NextPage<Props> = ({ id }) => {
  const t = usePageTranslation();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<ProposalItem | null>(null);

  useEffect(() => {
    (async () => {
      await sleep(2);
      // console.log(
      //   'useEffect',
      //   governanceProposals.find((f) => f.id === +id)
      // );
      setItem(governanceProposals.find((f) => f.id === +id));
      setLoading(false);
    })();
  }, [id]);

  // console.log(
  //   id,
  //   item,
  //   governanceProposals,
  //   governanceProposals.find((f) => f.id === id)
  // );
  return (
    <>
      <Seo title={t('page.title' /* { asset }*/)} description={t('page.description' /* { asset }*/)} />

      <TitleSection loading={loading} proposal={item} />
      <DetailSection loading={loading} proposal={item} />
      {/* <BreadcrumbSection items={breadcrumbs} last={id} /> */}
      {/*
      <TitleSection asset={slug} />
      <TimelineSection type={selectedType} info={marketTypeInfo} setType={setSelectedType} />
      <DetailSection asset={asset} info={marketInfo} /> */}
    </>
  );
};

export const getServerSideProps = storeWrapper.getServerSideProps((store) => async ({ locale, params }) => {
  const ns = 'governance-details';
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
      id: +params.id,
      ...(await serverSideTranslations(locale, ['common', ns])),
    },
  };
});

export default GovernanceDetailsPage;
