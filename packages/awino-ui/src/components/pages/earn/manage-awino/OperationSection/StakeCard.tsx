import React, { useCallback, useMemo, useState } from 'react';

import { Button, FormControl, FormHelperText, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useAppDispatch } from '@/app/hooks';
import ExternalLink from '@/components/general/Link/ExternalLink';
import LoadingButton from '@/components/general/LoadingButton/LoadingButton';
import NumberInput from '@/components/inputs/NumberInput/NumberInput';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatPercent, formatCurrency, formatUSD } from '@/lib/formatters';
import { etherscan } from '@/lib/helpers';

import { handleTransactionSubmit } from '../../helpers';
import { useTransaction } from '../../useTransaction';

const Root = styled('div')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: +theme.shape.borderRadius * 6,
  boxShadow: '0px 3px 6px #00000029',
  margin: theme.spacing(0, 0, 13),
  backgroundColor: theme.palette.background.darker,
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: +theme.shape.borderRadius * 6,
    background: ['rgb(0,255,235)', 'linear-gradient(120deg, rgba(0,255,235,1) 0%, rgba(0,230,62,1) 50%)'],
    zIndex: -1,
  },
  '.AwiStakeCard-header': {
    padding: theme.spacing(8, 6, 6),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  '.AwiStakeCard-headerTop': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  '.AwiStakeCard-content': {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(6, 6, 11),
  },
  '.AwiStakeCard-apr': {
    position: 'relative',
    top: -8,
    padding: theme.spacing(3, 3, 1.5),
    borderRadius: +theme.shape.borderRadius * 2,
    backgroundColor: theme.palette.background.transparent,
    span: {
      ...theme.typography.body,
      fontWeight: 600,
    },
  },
  '.AwiStakeCard-walletBalance': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: theme.spacing(7.5),
  },
  '.AwiStakeCard-walletBalanceValue': {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    textAlign: 'end',
    flexWrap: 'wrap',
    overflow: 'visible',
    span: {
      whiteSpace: 'nowrap',
    },
  },
  '.AwiStakeCard-input': {
    width: '100%',
    padding: theme.spacing(3, 3.5, 3),
    img: {
      marginRight: theme.spacing(2),
    },
    '&.Mui-error': {
      outline: `2px solid ${theme.palette.error.light}`,
    },
  },
  '.AwiStakeCard-submit': {
    margin: theme.spacing(10, 0, 0, 'auto'),
  },
  '.AwiStakeCard-max': {
    padding: theme.spacing(1, 3),
    border: `1px solid ${theme.palette.text.secondary}`,
    ...theme.typography['body-sm'],
    color: theme.palette.text.secondary,
    '&:hover': {
      borderWidth: 1,
      color: theme.palette.text.primary,
    },
  },
  '.AwiStakeCard-text': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(8, 0, 0),
  },
}));

export interface StakeData {
  apr: number;
  balance: {
    awi: number;
    usd: number;
  };
}
interface Props {
  data: StakeData;
}

export default function StakeCard({ data }: Props) {
  const t = usePageTranslation();
  const [assetValue, setAssetValue] = useState(null);

  const { isProcessing, isCompleted, isError, isValid, address, setStep } = useTransaction();

  const dispatch = useAppDispatch();

  const { apr, balance } = data;

  // TODO mocked shared submit logic
  const handleTransaction = useMemo(handleTransactionSubmit, []);
  const handleSubmit = useCallback(async () => {
    if (!(assetValue > 0 && assetValue <= balance.awi)) {
      setStep({ type: 'invalid' });
      return;
    }
    await handleTransaction(balance.awi, setStep, dispatch, t, 'stake-card');
  }, [assetValue, balance, setStep, dispatch, t, handleTransaction]);

  const handleAssetValueMax = () => {
    setAssetValue(`${balance.awi}`);
  };

  const handleAssetValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAssetValue(event.target.value);
  };

  return (
    <Root>
      <div className="AwiStakeCard-header">
        <div className="AwiStakeCard-headerTop">
          <Typography variant="h7" component="h2" fontWeight={600} color="text.active">
            {t('stake-card.title')}
          </Typography>
          <Typography variant="body-xs" color="text.primary" className="AwiStakeCard-apr">
            {t('common:common.apr')}&nbsp;
            <span>{formatPercent(apr)}</span>
          </Typography>
        </div>
        <Typography color="text.primary" mt={3}>
          {t('stake-card.description')}
        </Typography>
      </div>
      <div className="AwiStakeCard-content">
        <div className="AwiStakeCard-walletBalance">
          <Typography color="text.primary" fontWeight={500} mb={3}>
            {t('stake-card.wallet-balance')}
          </Typography>
          <Typography className="AwiStakeCard-walletBalanceValue">
            <Typography component="span" fontWeight={500} color="text.primary">
              {formatCurrency(balance.awi, 'AWI')}
            </Typography>
            <Typography variant="body-sm" component="span">
              {formatUSD(balance.usd)}
            </Typography>
          </Typography>
        </div>
        <FormControl variant="standard" error={!isValid} fullWidth disabled={isProcessing}>
          <NumberInput
            id="assetValue"
            name="assetValue"
            className="AwiStakeCard-input"
            value={assetValue}
            onChange={handleAssetValueChange}
            aria-describedby="assetValueHelperText"
            startAdornment={<img src={`/images/assets/awi.svg`} alt="" width={30} height={30} />}
            endAdornment={
              <Button variant="outlined" onClick={handleAssetValueMax} className="AwiStakeCard-max">
                {t('common:common.max')}
              </Button>
            }
          />
          {!isValid && (
            <FormHelperText id="assetValueHelperText" className="aria">
              {t('stake-card.invalid-input')}
            </FormHelperText>
          )}
        </FormControl>
        <LoadingButton
          variant="outlined"
          fullWidth
          loading={isProcessing}
          done={isCompleted}
          className="AwiStakeCard-submit"
          onClick={handleSubmit}
        >
          {t('stake-card.submit')}
        </LoadingButton>
        {isCompleted && (
          <ExternalLink
            variant="body-sm"
            className="AwiStakeCard-text"
            href={etherscan(address)}
            text={t(`common:common.view-on-etherscan`)}
          />
        )}
        {isError && (
          <Typography color="error" className="AwiStakeCard-text">
            {t(`stake-card.error-hint`)}
          </Typography>
        )}
      </div>
    </Root>
  );
}
