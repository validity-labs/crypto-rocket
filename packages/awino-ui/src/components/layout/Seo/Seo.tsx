import { useTranslation } from 'next-i18next';
import { NextSeo, NextSeoProps } from 'next-seo';

import { useAppSelector } from '@/app/hooks';

// import { useApp } from '@/context/AppContext';

interface Props extends NextSeoProps {
  // ns?: I18nPageNamespace;
  title?: string;
  description?: string;
}

export default function Seo({ title, description, ...restOfProps }: Props) {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  // const { defaultOGImage } = useApp();

  const ns = useAppSelector((state) => state.app.ns);

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

  // const openGraphImages = defaultOGImage
  //   ? [
  //       {
  //         url: defaultOGImage,
  //         width: 1200,
  //         height: 630,
  //         alt: siteTitle,
  //       },
  //     ]
  //   : [];

  return (
    <NextSeo
      title={metaTitle}
      description={metaDescription}
      openGraph={{
        title: metaTitle,
        description: metaDescription,
        site_name: siteTitle,
        locale: language,
        // images: openGraphImages,
        ...openGraph,
      }}
      {...restOfNextSeoProps}
    />
  );
}
