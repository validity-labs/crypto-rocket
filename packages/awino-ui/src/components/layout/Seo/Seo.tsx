import { useTranslation } from 'next-i18next';
import { NextSeo, NextSeoProps } from 'next-seo';

import { BASE_DOMAIN } from '@/app/constants';
import { useAppSelector } from '@/app/hooks';

// import { useApp } from '@/context/AppContext';

interface Props extends NextSeoProps {
  // ns?: I18nPageNamespace;
  title?: string;
  description?: string;
  keywords?: string;
}

export default function Seo({ title, description, keywords, ...restOfProps }: Props) {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  const ns = useAppSelector((state) => state.app.ns);
  let newTitle = title || t('page.title', '', { ns });
  let newDescription = description || t('page.description', '', { ns });
  let newKeywords = keywords || t('page.keywords', '', { ns });

  const siteTitle = t('app.name', { ns: 'common' });
  const metaTitle = `${newTitle} | ${siteTitle}`;
  const metaDescription = newDescription || t('app.description', { ns: 'common' });
  const metaKeywords = newKeywords || t('app.keywords', { ns: 'common' });
  const { openGraph, ...restOfNextSeoProps } = restOfProps;

  return (
    <NextSeo
      title={metaTitle}
      description={metaDescription}
      additionalMetaTags={[
        {
          name: 'keywords',
          content: metaKeywords || '',
        },
      ]}
      openGraph={{
        title: metaTitle,
        description: metaDescription,
        site_name: siteTitle,
        locale: language,
        images: [
          {
            url: `${BASE_DOMAIN}/images/share.jpg`,
            width: 1200,
            height: 630,
            alt: siteTitle,
          },
        ],
        ...openGraph,
      }}
      {...restOfNextSeoProps}
    />
  );
}
