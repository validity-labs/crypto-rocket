import React from 'react';

import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { setPageI18nNamespace } from '@/app/state/slices/app';
import storeWrapper from '@/app/store';
// import Seo from '@/components/layout/Seo/Seo';
import AssetSection from '@/components/pages/earn/deposit-details/AssetSection/AssetSection';

interface Props {
  slug: string;
}
const EarnDepositDetailsPage: NextPage<Props> = ({ slug }) => {
  console.log(slug);
  return (
    <>
      {/* <Seo
        title={item.title}
        description={item.excerpt}
        openGraph={{
          url: `${BASE_DOMAIN}/blog/${item.slug}`,
          images: openGraphImages,
          article: {
            tags: [item.category.title],
          },
        }}
      /> */}
      <AssetSection />
    </>
  );
};

export const getServerSideProps = storeWrapper.getServerSideProps((store) => async ({ locale, params }) => {
  const ns = 'earn-deposit-details';
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

export default EarnDepositDetailsPage;
