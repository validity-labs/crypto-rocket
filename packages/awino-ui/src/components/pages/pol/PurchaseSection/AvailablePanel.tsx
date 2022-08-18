import * as React from 'react';

import { styled } from '@mui/material/styles';

import AssetAmount from '@/components/general/AssetAmount/AssetAmount';
import Label from '@/components/general/Label/Label';
import usePageTranslation from '@/hooks/usePageTranslation';

import Panel from '../../../general/Panel/Panel';

import { PolPurchaseData } from './PurchaseSection';

const Root = styled(Panel)(({ theme }) => ({
  '.AwiPanel-content': {
    padding: theme.spacing(8, 16, 6),
  },
  '.AwiAvailablePanel-asset': {
    marginTop: theme.spacing(4),
  },
}));

interface Props {
  data: PolPurchaseData;
}

export default function AvailablePanel({ data }: Props) {
  const t = usePageTranslation();
  const { source, maxSource, maxSourceInUSD } = data;

  return (
    <Root>
      <Label component="h2" className="Awi-golden">
        {t(`purchase-section.buyable`, { from: source })}
      </Label>
      <AssetAmount
        asset={source}
        value={maxSource}
        altAsset={'usd'}
        altValue={maxSourceInUSD}
        className="AwiAvailablePanel-asset"
      />
    </Root>
  );
}
