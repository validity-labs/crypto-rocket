import React, { memo, useCallback, useMemo, useState } from 'react';

import { TFunction } from 'next-i18next';

import { BigNumber } from 'ethers';

import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import AssetIcon from '@/components/general/AssetIcon/AssetIcon';
import AssetIcons from '@/components/general/AssetIcons/AssetIcons';
import LabelValue from '@/components/general/LabelValue/LabelValue';
import LoadingButton from '@/components/general/LoadingButton/LoadingButton';
import Modal from '@/components/general/Modal/Modal';
import Switch from '@/components/general/Switch/Switch';
import { LiquidityPair, TokenExtended } from '@/hooks/subgraphs/exchange/useUserLiquidityPairs';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatPercent, formatUnits } from '@/lib/formatters';
import { percentOf } from '@/lib/helpers';
import { Address } from '@/types/app';

import { AssetInfoMap } from './SwapSection';

const Root = styled(Modal)(({ theme }) => ({
  '.AwiModal-content': {
    gap: theme.spacing(6),
  },
  '.AwiRemoveLiquidityModal-pair': {
    fontWeight: 600,
    color: theme.palette.text.primary,
    textTransform: 'uppercase',
  },
  '.AwiRemoveLiquidityModal-subPanel': {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(6),
    padding: theme.spacing(6),
    borderRadius: +theme.shape.borderRadius * 2,
    backgroundColor: theme.palette.background.transparent,
  },
  '.AwiLabelValue-root': {
    gap: theme.spacing(4),
  },
  '.AwiLabelValue-label': {
    margin: theme.spacing(0, 4, 0, 0),
    ...theme.typography['body-ms'],
    fontWeight: 500,
    color: theme.palette.text.secondary,
  },
  '.AwiLabelValue-value': {
    // flex: 1,
    // flexGrow: 0,
    ...theme.typography['body-ms'],
    fontWeight: 500,
    img: {
      marginLeft: theme.spacing(2),
    },
  },
  '.AwiRemoveLiquidityModal-toggle': {
    margin: theme.spacing(4.5, 0, 7.5),
    padding: theme.spacing(0, 6),
    '.MuiFormControlLabel-root': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      fontWeight: 500,
    },
  },
  '.AwiRemoveLiquidityModal-percentage': {
    alignSelf: 'flex-start',
    margin: theme.spacing(2, 0, 0),
    '.MuiToggleButtonGroup-root': {
      flexWrap: 'wrap',
      gap: theme.spacing(2),
      background: 'none',
    },
    '.MuiToggleButton-root': {
      padding: theme.spacing(2, 4, 1.5),
      ...theme.typography['body-sm'],
      backgroundColor: theme.palette.background.transparent,
      whiteSpace: 'nowrap',
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  },
  // '.MuiFormLabel-root': {
  //   marginBottom: theme.spacing(1),
  //   ...theme.typography.body,
  //   color: theme.palette.text.secondary,
  // },
  // '.MuiFormControlLabel-label': {
  //   ...theme.typography['body-ms'],
  //   fontWeight: 500,
  //   color: theme.palette.text.secondary,
  // },
  [theme.breakpoints.up('sm')]: {
    '.AwiLabelValue-root': {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  },
}));

interface PercentShortcutsProps {
  onChange: (event: React.MouseEvent<HTMLElement>, newPercent: number) => void;
  t: TFunction;
}

const PercentShortcuts = memo(function PercentShortcuts({ onChange, t }: PercentShortcutsProps) {
  return (
    <ToggleButtonGroup size="small" exclusive onChange={onChange} aria-label={t(`percent-toggle-hint`)}>
      {percentageList.map((percent) => (
        <ToggleButton size="small" key={percent} value={percent}>
          {percent !== 100 ? formatPercent(percent) : t('max')}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
});

export interface RemoveLiquidityModalData {
  assets: AssetInfoMap;
}

export type RemoveLiquidityModalUpdateCallback<T = void> = (payload: {
  id: Address;
  collectAs: boolean;
  percent: number;
}) => T;

interface Props {
  open: boolean;
  close: () => void;
  data: LiquidityPair;
  callback: RemoveLiquidityModalUpdateCallback;
  i18nKey: string;
}
const percentageList = [25, 50, 75, 100];
export default function RemoveLiquidityModal({ open, close, data: item, callback, i18nKey }: Props) {
  const t = usePageTranslation({ keyPrefix: i18nKey });
  const [collectAs, setCollectAs] = useState(false);
  const [percent, setPercent] = useState(0);

  const handleSubmit = () => {
    //   // fetch pool pair data, or set to initial one
    callback({ id: item.id, collectAs, percent });
    close();
  };

  const handlePercentClick = useCallback(
    (event: React.MouseEvent<HTMLElement>, newPercent: number) => {
      setPercent(newPercent);
    },
    [setPercent]
  );

  const handlePercentChange = useCallback(
    (event: Event, value: number | number[], activeThumb: number): void => {
      setPercent(value as number);
    },
    [setPercent]
  );

  const token0 = item.token0 as TokenExtended;
  const token1 = item.token1 as TokenExtended;
  return (
    <Root id="removeLiquidityModal" title={t('title')} titleTooltip={t('title-hint')} open={open} close={close}>
      <div className="Awi-row">
        <AssetIcons
          ids={[token0.symbol, token1.symbol]}
          size="medium"
          // @ts-expect-error
          component="div"
          sx={{ display: 'inline-block' }}
        />
        <Typography
          variant="body-ms"
          className="AwiRemoveLiquidityModal-pair"
        >{`${token0.symbol}/${token1.symbol}`}</Typography>
      </div>
      <FormControl fullWidth>
        <FormLabel id="awiRemoveLiquidityModalPercentLabel">{t('amount')}</FormLabel>
        <div className="AwiRemoveLiquidityModal-subPanel">
          <div className="Awi-row Awi-between">
            <Typography variant="h2" component="p" sx={{ color: percent === 0 ? 'text.secondary' : 'text.primary' }}>
              {formatPercent(percent)}
            </Typography>
            <div className="AwiRemoveLiquidityModal-percentage">
              <PercentShortcuts onChange={handlePercentClick} t={t} />
            </div>
          </div>
          <Slider
            aria-labelledby="awiRemoveLiquidityModalPercentLabel"
            size="medium"
            value={percent}
            min={0}
            max={100}
            onChange={handlePercentChange}
            valueLabelDisplay="auto"
          />
        </div>
      </FormControl>
      <div className="AwiRemoveLiquidityModal-subPanel">
        <LabelValue
          id="pooledA"
          value={
            <span className="Awi-row Awi-end">
              {formatUnits(percentOf(BigNumber.from(token0.balance), percent), token0.decimals)}
              <AssetIcon symbol={token0.symbol} />
            </span>
          }
          labelProps={{ children: t('pooled', { v: token0.symbol }) }}
        />
        <LabelValue
          id="pooledB"
          value={
            <span className="Awi-row Awi-end">
              {formatUnits(percentOf(BigNumber.from(token1.balance), percent), token1.decimals)}
              <AssetIcon symbol={token1.symbol} />
            </span>
          }
          labelProps={{ children: t('pooled', { v: token0.symbol }) }}
        />
      </div>
      <div className="AwiRemoveLiquidityModal-toggle">
        <FormControlLabel
          // sx={{ ml: 0 }}
          control={
            <Switch checked={collectAs} setChecked={setCollectAs} sx={{ mr: 4.5 }} title={t('collect-as-weth')} />
          }
          labelPlacement="start"
          label={t(`collect-as-weth`) as string}
        />
      </div>
      <LoadingButton
        variant="outlined"
        color="error"
        size="small"
        once
        className="AwiRemoveLiquidityModal-submit"
        // loading={isProcessing}
        // done={isCompleted}
        disabled={!percent}
        onClick={handleSubmit}
      >
        {t(percent ? 'submit' : 'submit-prompt')}
      </LoadingButton>
    </Root>
  );
}
