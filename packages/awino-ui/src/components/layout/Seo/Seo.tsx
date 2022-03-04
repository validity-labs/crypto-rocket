import * as React from 'react';

import { useTranslation } from 'next-i18next';

import { NextSeo, NextSeoProps } from 'next-seo';

import { useApp } from '@/context/AppContext';

export type I18nPageNamespace =
  | 'root'
  | 'about'
  | 'causes'
  | 'cause'
  | 'error'
  | 'register'
  | 'verify'
  | 'verified'
  | 'login'
  | 'reset'
  | 'reseted'
  | 'onboarding'
  | 'careers'
  | 'blog'
  | 'blog-article'
  | 'trainings'
  | 'services-platform-development'
  | 'services-nft-events'
  | 'services-smart-contract-development'
  | 'services-forensic-services'
  | 'products-kyc-and-aml'
  | 'products-liquidation'
  | 'products-forensics'
  | 'non-custodian-wallet' // also product
  | 'ventures';

interface Props extends NextSeoProps {
  ns?: I18nPageNamespace;
  title?: string;
  description?: string;
}

export default function Seo({ ns, title, description, ...restOfProps }: Props) {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const { defaultOGImage } = useApp();

  let newTitle = title;
  let newDescription = description;
  if (ns) {
    newTitle = t('page.title', 'MISSING_SEO', { ns });
    newDescription = t('page.description', 'MISSING_SEO', { ns });
  }

  const siteTitle = t('app.name', { ns: 'common' });
  const metaTitle = `${newTitle} | ${siteTitle}`;
  const metaDescription = newDescription || t('app.description', { ns: 'common' });
  const { openGraph, ...restOfNextSeoProps } = restOfProps;

  const openGraphImages = defaultOGImage
    ? [
        {
          url: defaultOGImage,
          width: 1200,
          height: 630,
          alt: siteTitle,
        },
      ]
    : [];

  return (
    <NextSeo
      title={metaTitle}
      description={metaDescription}
      openGraph={{
        title: metaTitle,
        description: metaDescription,
        site_name: siteTitle,
        locale: language,
        images: openGraphImages,
        ...openGraph,
      }}
      {...restOfNextSeoProps}
    />
  );
}
