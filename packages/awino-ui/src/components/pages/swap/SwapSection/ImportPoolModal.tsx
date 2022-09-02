import React, { memo, useMemo, useState } from 'react';

import { styled } from '@mui/material/styles';

import { LiquidityPair } from '@/app/state/slices/exchange';
import AssetIcon from '@/components/general/AssetIcon/AssetIcon';
import LoadingButton from '@/components/general/LoadingButton/LoadingButton';
import Modal from '@/components/general/Modal/Modal';
import Select, { SelectOptionComponentFC, SelectValueComponentFC } from '@/components/general/Select/Select';
import usePageTranslation from '@/hooks/usePageTranslation';
import { AssetKey } from '@/types/app';

import { AssetInfoMap } from './SwapSection';

const Root = styled(Modal)(({ theme }) => ({
  '.AwiModal-content': {
    gap: theme.spacing(6),
  },
  '.AwiImportPoolModal-submit': {
    alignSelf: 'center',
  },
}));

const SelectTokenValueAndOption: SelectValueComponentFC = memo(function SelectTokenValueAndOption({
  item: { id, label },
}) {
  return (
    <>
      <AssetIcon symbol={id} />
      {label}
    </>
  );
});

export interface ImportPoolModalData {
  assets: AssetInfoMap;
}

export type ImportPoolModalUpdateCallback<T = void> = (payload: any) => T;

interface Props {
  open: boolean;
  close: () => void;
  data: ImportPoolModalData;
  callback: ImportPoolModalUpdateCallback;
  i18nKey: string;
}

export default function ImportPoolModal({ open, close, data, callback, i18nKey }: Props) {
  const t = usePageTranslation({ keyPrefix: i18nKey });

  const { assets } = data;

  const [firstToken, setFirstToken] = useState<AssetKey>(null);
  const [secondToken, setSecondToken] = useState<AssetKey>(null);

  const handleSubmit = () => {
    // fetch pool pair data, or set to initial one
    callback({
      id: `${firstToken}-${secondToken}`,
      pair: [firstToken, secondToken],
      tokens: 0,
      pool: [0, 0],
      share: 0,
    });
    close();
  };

  const items = useMemo(() => {
    return Array.from(assets).reduce((ar, [key, { id, label }]) => {
      ar.set(id, { id, label });
      return ar;
    }, new Map());
  }, [assets]);

  return (
    <Root id="importPoolModal" title={t('title')} titleTooltip={t('title-hint')} open={open} close={close}>
      <Select
        id="importPoolModalFirstToken"
        items={items}
        value={firstToken}
        setValue={setFirstToken}
        label={t('token')}
        placeholder={t('select-token')}
        ValueComponent={SelectTokenValueAndOption}
        OptionComponent={SelectTokenValueAndOption}
      />
      <Select
        id="importPoolModalSecondToken"
        items={items}
        value={secondToken}
        setValue={setSecondToken}
        label={t('token')}
        placeholder={t('select-token')}
        ValueComponent={SelectTokenValueAndOption}
        OptionComponent={SelectTokenValueAndOption}
      />
      <LoadingButton
        variant="outlined"
        size="small"
        once
        className="AwiImportPoolModal-submit"
        // loading={isProcessing}
        // done={isCompleted}
        disabled={!(firstToken && secondToken && firstToken !== secondToken)}
        onClick={handleSubmit}
      >
        {t('import')}
      </LoadingButton>
    </Root>
  );
}
