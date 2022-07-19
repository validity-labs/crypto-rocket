import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { TFunction, useTranslation } from 'next-i18next';

import { useDispatch } from 'react-redux';

import BigNumberJS from 'bignumber.js';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { debounce } from 'lodash';

import { Button, FormControl, FormLabel, Slider, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { ECR20_TOKEN_DECIMALS } from '@/app/constants';
import { useWeb3 } from '@/app/providers/Web3Provider';
import { showMessage } from '@/app/state/slices/app';
import { UserLiquidityPair } from '@/app/state/slices/exchange';
import AssetIcon from '@/components/general/AssetIcon/AssetIcon';
import AssetIcons from '@/components/general/AssetIcons/AssetIcons';
import LabelValue from '@/components/general/LabelValue/LabelValue';
import LoadingButton from '@/components/general/LoadingButton/LoadingButton';
import LoadingText from '@/components/general/LoadingText/LoadingText';
import Modal from '@/components/general/Modal/Modal';
// import Switch from '@/components/general/Switch/Switch';
import NumberInput from '@/components/inputs/NumberInput/NumberInput';
import usePageTranslation from '@/hooks/usePageTranslation';
import { AWINO_ROUTER_MAP, FACTORY_ADDRESS_MAP, quoteRemoveLiquidity, removeLiquidity } from '@/lib/blockchain';
import { formatAmount, formatPercent } from '@/lib/formatters';
import { percentOf, toBigNum } from '@/lib/helpers';
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
  '.AwiRemoveLiquidityModal-poolTokens': {
    '.AwiLabelValue-label, .AwiLabelValue-value': {
      ...theme.typography['body-lg'],
      color: theme.palette.text.active,
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
  '.AwiRemoveLiquidityModal-amount': {
    padding: theme.spacing(11, 7, 9, 23),
    borderRadius: theme.spacing(7),
    input: {
      fontSize: '3.125rem' /* 50px */,
      lineHeight: '3.125rem' /* 50px */,
      fontWeight: 700,
      textAlign: 'center',
      '&::placeholder': {
        color: theme.palette.text.secondary,
      },
    },
    button: {
      borderRadius: theme.spacing(2),
      ...theme.typography['body-sm'],
      fontWeight: 500,
      color: theme.palette.text.secondary,
      '&:hover': {
        color: theme.palette.text.active,
      },
    },
  },
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
  // collectAs: boolean;
  percent: number;
}) => T;

interface Props {
  open: boolean;
  close: () => void;
  data: UserLiquidityPair;
  callback: RemoveLiquidityModalUpdateCallback;
  i18nKey: string;
}
const percentageList = [25, 50, 75, 100];

interface Values {
  amount: BigNumberJS;
  percent: number;
}

export default function RemoveLiquidityModal({ open, close, data: item, callback, i18nKey }: Props) {
  const t = usePageTranslation({ keyPrefix: i18nKey });
  const { t: tRaw } = useTranslation();
  // const [collectAs, setCollectAs] = useState(false);
  const { account, library: provider, chainId } = useWeb3();
  const dispatch = useDispatch();
  const [values, setValues] = useState<Values>(() => ({ amount: toBigNum(0), percent: 0 }));
  const [inputs, setInputs] = useState<Values>(() => ({ amount: toBigNum(0), percent: 0 }));

  const [quoteLoading, setQuoteLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quotes, setQuotes] = useState(() => ({
    // liquidity: toBigNum(0),
    out0: 0,
    out1: 0,
  }));

  const { factoryAddress, routerAddress } = useMemo(
    () => ({
      factoryAddress: FACTORY_ADDRESS_MAP[chainId],
      routerAddress: AWINO_ROUTER_MAP[chainId],
    }),
    [chainId]
  );

  const { token0, token1 } = useMemo(() => ({ token0: item.token0, token1: item.token1 }), [item]);

  useEffect(() => {
    let active = true;
    (async () => {
      const [liquidity, Aout, Bout] = await quoteRemoveLiquidity(
        token0.id,
        token1.id,
        factoryAddress,
        values.amount.toNumber(),
        provider
      );
      if (!active) {
        return;
      }
      setQuotes({
        // liquidity,
        out0: Aout,
        out1: Bout,
      });
      setQuoteLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [token0.id, token1.id, values, provider, factoryAddress]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    let hasError = false;
    try {
      await removeLiquidity(
        token0.id,
        token1.id,
        parseUnits(values.amount.toString(), ECR20_TOKEN_DECIMALS).toString(),
        parseUnits(quotes.out0.toString(), token0.decimals).toString(),
        parseUnits(quotes.out1.toString(), token1.decimals).toString(),
        routerAddress,
        account,
        provider.getSigner(),
        factoryAddress
      );
      dispatch(showMessage({ message: 'Liquidity removed.' }));
    } catch (error) {
      hasError = true;
      dispatch(showMessage({ message: 'Removing liquidity failed.', alertProps: { severity: 'error' } }));
    }

    setIsSubmitting(false);
    if (hasError) {
      /* TODO trigger pair data refresh using callback */
      // callback({ id: item.id, /* collectAs, */ percent });
      close();
    }
  };

  const balance = useMemo(() => {
    return toBigNum(formatUnits(item.balance, ECR20_TOKEN_DECIMALS).toString());
  }, [item.balance]);

  const handleValuesDebounce = useRef(
    debounce((newValues: Values) => {
      setValues(newValues);
    }, 50)
  ).current;

  const handlePercentInputChange = useCallback(
    (event: Event) => {
      const newValue = +(event as unknown as React.ChangeEvent<HTMLInputElement>).target.value;
      const newValues = {
        amount: percentOf(balance, newValue),
        percent: newValue,
      };
      setQuoteLoading(true);
      setInputs(newValues);
      handleValuesDebounce(newValues);
    },
    [setInputs, handleValuesDebounce, balance]
  );

  const handleAmountInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = toBigNum(+event.target.value);
      const newValues = { amount: newValue, percent: newValue.times(100).div(balance).toNumber() };
      setQuoteLoading(true);
      setInputs(newValues);
      handleValuesDebounce(newValues);
    },
    [setInputs, handleValuesDebounce, balance]
  );

  const handlePercentClick = useCallback(
    (_event: React.MouseEvent<HTMLElement>, newPercent: number) => {
      const newValues = {
        amount: percentOf(balance, newPercent),
        percent: newPercent,
      };

      setInputs(newValues);
      setValues(newValues);
    },
    [setInputs, setValues, balance]
  );

  const handleMaxClick = useCallback(() => {
    const newValues = {
      amount: balance,
      percent: 100,
    };

    setInputs(newValues);
    setValues(newValues);
  }, [setInputs, setValues, balance]);

  const isRemovable = inputs.amount.gt(0);
  return (
    <Root
      id="removeLiquidityModal"
      title={t('title')}
      titleTooltip={t('title-hint')}
      open={open}
      close={isSubmitting ? () => {} : close}
    >
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

      <FormControl variant="standard" fullWidth>
        <NumberInput
          id="stakeAmount"
          name="stakeAmount"
          className="AwiRemoveLiquidityModal-amount"
          aria-describedby="stakeAmountHelper"
          // disabled={isProcessing}
          inputProps={{
            isAllowed: ({ floatValue }) => floatValue > 0 && toBigNum(floatValue).lte(balance),
          }}
          placeholder="0"
          value={inputs.amount.toString()}
          onChange={handleAmountInputChange}
          endAdornment={
            <Button variant="text" size="small" onClick={handleMaxClick}>
              {tRaw('common.max')}
            </Button>
          }
        />
        {/* <FormHelperText id="stakeAmountHelper" variant="standard" sx={{ mt: 6, color: 'text.primary' }}>
          {t('amount-hint')}
        </FormHelperText> */}
      </FormControl>

      <FormControl fullWidth>
        <FormLabel id="awiRemoveLiquidityModalPercentLabel">{t('amount')}</FormLabel>
        <div className="AwiRemoveLiquidityModal-subPanel">
          <div className="Awi-row Awi-between">
            <Typography
              variant="h2"
              component="p"
              sx={{ color: inputs.percent === 0 ? 'text.secondary' : 'text.primary' }}
            >
              {formatPercent(inputs.percent)}
            </Typography>
            <div className="AwiRemoveLiquidityModal-percentage">
              <PercentShortcuts onChange={handlePercentClick} t={t} />
            </div>
          </div>
          <Slider
            aria-labelledby="awiRemoveLiquidityModalPercentLabel"
            size="medium"
            value={inputs.percent}
            min={0}
            max={100}
            onChange={handlePercentInputChange}
            valueLabelDisplay="auto"
          />
        </div>
      </FormControl>
      <div className="AwiRemoveLiquidityModal-subPanel">
        <LabelValue
          id="pooledA"
          value={
            <span className="Awi-row Awi-end">
              <LoadingText loading={quoteLoading} text={formatAmount(quotes.out0, { decimalPlaces: 6 })} />
              <AssetIcon symbol={token0.symbol} />
            </span>
          }
          labelProps={{ children: t('pooled', { v: token0.symbol }) }}
        />
        <LabelValue
          id="pooledB"
          value={
            <span className="Awi-row Awi-end">
              <LoadingText loading={quoteLoading} text={formatAmount(quotes.out1, { decimalPlaces: 6 })} />
              <AssetIcon symbol={token1.symbol} />
            </span>
          }
          labelProps={{ children: t('pooled', { v: token1.symbol }) }}
        />
      </div>
      {/* <div className="AwiRemoveLiquidityModal-toggle">
        <FormControlLabel
          // sx={{ ml: 0 }}
          control={
            <Switch checked={collectAs} setChecked={setCollectAs} sx={{ mr: 4.5 }} title={t('collect-as-weth')} />
          }
          labelPlacement="start"
          label={t(`collect-as-weth`) as string}
        />
      </div> */}
      <LoadingButton
        variant="outlined"
        color="error"
        size="small"
        once
        loading={isSubmitting}
        className="AwiRemoveLiquidityModal-submit"
        disabled={!isRemovable || quoteLoading || isSubmitting}
        onClick={handleSubmit}
      >
        {t(isRemovable ? 'submit' : 'submit-prompt')}
      </LoadingButton>
    </Root>
  );
}
