import React, { useCallback, useMemo, useState } from 'react';

import { useWeb3React } from '@web3-react/core';
import { BigNumber, ethers } from 'ethers';

import { Box, BoxProps, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useAppDispatch } from '@/app/hooks';
import ExternalLink from '@/components/general/Link/ExternalLink';
import LoadingButton from '@/components/general/LoadingButton/LoadingButton';
import SwappingImage from '@/components/general/SwappingImage/SwappingImage';
import usePageTranslation from '@/hooks/usePageTranslation';
import { ChainId } from '@/lib/blockchain/common';
import { AWINO_MASTER_CHEF_ADDRESS_MAP } from '@/lib/blockchain/farm-pools';
import IAwinoMasterChef from '@/lib/blockchain/farm-pools/abis/IAwinoMasterChef.json';
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
  backgroundColor: theme.palette.background.panel,
  '.AwiUnstakeCard-balance': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: theme.spacing(0, 0, 0, -4),
    ...theme.typography.h5,
    color: theme.palette.text.primary,
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(10, 11),
  },
}));

interface Props extends BoxProps {
  balance: string;
  updateBalance: (account: string, library: any, chainId: number) => void;
}

export default function UnstakeCard({ balance, updateBalance, ...restOfProps }: Props) {
  const t = usePageTranslation();
  const { isProcessing, isCompleted, isError, isValid, address, setStep } = useTransaction();
  const { account, library, chainId } = useWeb3React();

  const dispatch = useAppDispatch();
  const isDisabled = BigNumber.from(ethers.utils.parseUnits(balance, 'ether')).lte(0);
  const [loading, setLoading] = useState(false);

  // TODO mocked shared submit logic
  const handleTransaction = useMemo(handleTransactionSubmit, []);
  const handleSubmit = useCallback(async () => {
    // await handleTransaction(balance, setStep, dispatch, t, 'unstake-card');

    try {
      setLoading(true);
      // deposit to masterchef
      let rawTx = await new ethers.Contract(
        AWINO_MASTER_CHEF_ADDRESS_MAP[ChainId.TESTNET],
        IAwinoMasterChef,
        await library.getSigner()
      ).populateTransaction.withdraw(1, ethers.utils.parseUnits(balance, 'ether')); // @TODO find a way to store the pid of each pool. @TODO would be possible to fetch the pids from the subgraph or should be a static map?

      let tx = await library.getSigner().sendTransaction(rawTx);
      await tx.wait(1);
      setLoading(false);
      updateBalance(account, library, chainId);
      // setExecuting(false);
    } catch (error) {
      console.error(error);
    }
  }, [balance, library, account, chainId, updateBalance]);

  // console.log({ isDisabled });
  return (
    <Root {...restOfProps}>
      <div className="AwiUnstakeCard-balance">
        <SwappingImage source="awi" target="dai" path="assets" />
        <Typography>{formatAWI(balance)}</Typography>
      </div>
      <Typography variant="body-sm" mb={8}>
        {t('unstake-card.subtitle')}
      </Typography>
      <LoadingButton
        once
        loading={loading}
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
