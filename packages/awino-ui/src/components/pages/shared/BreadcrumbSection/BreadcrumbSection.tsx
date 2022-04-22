import * as React from 'react';

import Link from 'next/link';

import { Typography, Breadcrumbs as MuiBreadcrumbs } from '@mui/material';
import { styled } from '@mui/material/styles';

import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';
import { AssetKey, Breadcrumbs } from '@/types/app';

const Root = styled(Section)(({ theme }) => ({
  padding: 0,
  a: {
    color: theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.text.active,
    },
  },
}));

interface Props {
  items: Breadcrumbs;
  last: Uppercase<AssetKey>;
}

export default function BreadcrumbSection({ items, last }: Props) {
  const t = usePageTranslation();
  return (
    <Root>
      <div role="presentation">
        <MuiBreadcrumbs aria-label="breadcrumb" separator=">">
          {items.map(({ key, url }) => (
            <Typography key={key} component={Link} href={url}>
              {t(`breadcrumb-section.page.${key}`)}
            </Typography>
          ))}
          <Typography>{last}</Typography>
        </MuiBreadcrumbs>
      </div>
    </Root>
  );
}
