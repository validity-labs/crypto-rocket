import React, { useCallback, useMemo } from 'react';

import { Box, BoxProps, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useAppDispatch } from '@/app/hooks';
import ExternalLink from '@/components/general/Link/ExternalLink';
import LoadingButton from '@/components/general/LoadingButton/LoadingButton';
import SwappingImage from '@/components/general/SwappingImage/SwappingImage';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatAWI } from '@/lib/formatters';
import { etherscan } from '@/lib/helpers';

import { handleTransactionSubmit } from '../../helpers';
import { useTransaction } from '../../useTransaction';

const Root = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(10, 6),
  border: `1px solid rgba(0, 230, 62, 1)`,
  borderRadius: +theme.shape.borderRadius * 6,
  '.AwiUnstakeCard-balance': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: theme.spacing(0, 0, 0, -4),
    ...theme.typography.h5,
    color: theme.palette.text.primary,
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(10, 20),
  },
}));

interface Props extends BoxProps {
  balance: number;
}

export default function UnstakeCard({ balance, ...restOfProps }: Props) {
  const t = usePageTranslation();
  const { isProcessing, isCompleted, isError, isValid, address, setStep } = useTransaction();

  const dispatch = useAppDispatch();

  // TODO mocked shared submit logic
  const handleTransaction = useMemo(handleTransactionSubmit, []);
  const handleSubmit = useCallback(async () => {
    await handleTransaction(balance, setStep, dispatch, t, 'unstake-card');
  }, [balance, setStep, dispatch, t, handleTransaction]);

  const isDisabled = balance <= 0;

  return (
    <Root {...restOfProps}>
      <div className="AwiUnstakeCard-balance">
        <SwappingImage source="awi" target="usdt" path="assets" />
        <Typography>{formatAWI(balance)}</Typography>
      </div>
      <Typography variant="body-sm" mb={8}>
        {t('unstake-card.subtitle')}
      </Typography>
      <LoadingButton
        once
        loading={isProcessing}
        done={isCompleted}
        disabled={!isValid || isDisabled}
        size="small"
        onClick={handleSubmit}
        variant="outlined"
      >
        {t('unstake-card.submit')}
      </LoadingButton>
      {isCompleted && (
        <ExternalLink variant="body-sm" href={etherscan(address)} text={t(`common:common.view-on-etherscan`)} mt={8} />
      )}
      {isError && (
        <Typography color="error" mt={8}>
          {t(`vest-card.error-hint`)}
        </Typography>
      )}
    </Root>
  );
}
