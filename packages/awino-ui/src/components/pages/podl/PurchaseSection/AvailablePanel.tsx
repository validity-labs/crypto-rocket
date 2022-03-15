import * as React from 'react';

import { styled } from '@mui/material/styles';

import AssetAmount from '@/components/general/AssetAmount/AssetAmount';
import Label from '@/components/general/Label/Label';
import usePageTranslation from '@/hooks/usePageTranslation';

import Panel from '../../../general/Panel/Panel';

import { PodlPurchaseData } from './PurchaseSection';

const Root = styled(Panel)(({ theme }) => ({
  '.content': {
    padding: theme.spacing(8, 16, 6),
  },
  '.asset': {
    marginTop: theme.spacing(4),
  },
}));

interface Props {
  data: PodlPurchaseData;
}

export default function AvailablePanel({ data }: Props) {
  const t = usePageTranslation();
  const { source, sourceLabel, maxSource, maxSourceInUSD } = data;

  return (
    <Root>
      <div className="content">
        <Label component="h2">{t(`purchase-section.buyable`, { from: sourceLabel })}</Label>
        <AssetAmount asset={source} value={maxSource} altAsset={'usd'} altValue={maxSourceInUSD} className="asset" />
      </div>
    </Root>
  );
}
