import React, { useCallback, useMemo, useReducer, useState } from 'react';

import { useWeb3React } from '@web3-react/core';
import { BigNumber, ethers } from 'ethers';

import { Button, FormControl, FormHelperText, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useAppDispatch } from '@/app/hooks';
import ExternalLink from '@/components/general/Link/ExternalLink';
import LoadingButton from '@/components/general/LoadingButton/LoadingButton';
import SwappingImage from '@/components/general/SwappingImage/SwappingImage';
import NumberInput from '@/components/inputs/NumberInput/NumberInput';
import usePageTranslation from '@/hooks/usePageTranslation';
import { ChainId } from '@/lib/blockchain/common';
import * as ERC20Common from '@/lib/blockchain/erc20';
import {
  AWINO_DAI_PAIR_ADDRESS_MAP,
  AWINO_MASTER_CHEF_ADDRESS_MAP,
  AWINO_USDT_PAIR_ADDRESS_MAP,
} from '@/lib/blockchain/farm-pools';
import IAwinoMasterChef from '@/lib/blockchain/farm-pools/abis/IAwinoMasterChef.json';
import { formatAWI } from '@/lib/formatters';
import { etherscan } from '@/lib/helpers';

import { handleTransactionSubmit } from '../../helpers';
import { useTransaction } from '../../useTransaction';

const Root = styled('div')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: +theme.shape.borderRadius * 6,
  boxShadow: '0px 3px 6px #00000029',
  padding: theme.spacing(10, 6),
  margin: theme.spacing(0, 0, 13),
  backgroundColor: '#12191F',
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
  '.AwiStakeCard-input': {
    width: '100%',
    padding: theme.spacing(3, 3.5, 3, 1),
    '&.Mui-error': {
      outline: `2px solid ${theme.palette.error.light}`,
    },
  },
  '.AwiStakeCard-balance': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing(0, 2, 0),
    margin: theme.spacing(2, 0, 10),
  },
  '.AwiStakeCard-submit': {
    margin: '0 0 0 auto',
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
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(15, 20),
  },
}));

interface Props {
  balance: string;
  updateBalance: (account: string, library: any, chainId: number) => void;
}

export default function StakeCard({ balance, updateBalance }: Props) {
  const t = usePageTranslation();
  const [assetValue, setAssetValue] = useState(null);

  const { isProcessing, isCompleted, isError, isValid, address, setStep } = useTransaction();

  const dispatch = useAppDispatch();
  const { account, library, chainId } = useWeb3React();
  const [loading, setLoading] = useState(false);
  const [approve, setApprove] = useState(false);

  // TODO mocked shared submit logic
  const handleTransaction = useMemo(handleTransactionSubmit, []);
  const handleSubmit = useCallback(async () => {
    if (!(assetValue > 0 && assetValue <= balance)) {
      setStep({ type: 'invalid' });
      return;
    }

    // setExecuting(true);
    // @TODO review.
    // await handleTransaction(balance, setStep, dispatch, t, 'stake-card');

    // @TODO @FIXME quick / temporary implementation
    // Check allowance. If allowance < 'sourceValue', ask approval
    setLoading(true);
    const allowance = BigNumber.from(
      await ERC20Common.allowance(
        AWINO_DAI_PAIR_ADDRESS_MAP[chainId],
        account,
        AWINO_MASTER_CHEF_ADDRESS_MAP[chainId],
        library
      )
    ).toString();

    console.log(allowance, assetValue);

    if (BigNumber.from(allowance).lt(ethers.utils.parseUnits(assetValue, 'ether'))) {
      console.log(`>> Requesting approval for spending: ${ethers.utils.parseUnits(assetValue, 'ether')}`);

      try {
        setApprove(true);
        // Approve
        console.log(`approving...`);
        await ERC20Common.approve(
          AWINO_DAI_PAIR_ADDRESS_MAP[chainId],
          AWINO_MASTER_CHEF_ADDRESS_MAP[chainId],
          ethers.utils.parseUnits(assetValue, 'ether'),
          library
        );
        setApprove(false);
        setLoading(false);

        // setExecuting(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        setApprove(false);

        // setExecuting(false);
      }
    } else {
      setLoading(false);
    }

    console.log({
      allowance,
      masterChef: AWINO_MASTER_CHEF_ADDRESS_MAP[ChainId.TESTNET],
      signer: (await library.getSigner()).getAddress(),
    });

    try {
      setLoading(true);

      // deposit to masterchef
      let rawTx = await new ethers.Contract(
        AWINO_MASTER_CHEF_ADDRESS_MAP[ChainId.TESTNET],
        IAwinoMasterChef,
        await library.getSigner()
      ).populateTransaction.deposit(1, ethers.utils.parseUnits(assetValue, 'ether')); // @TODO find a way to store the pid of each pool. @TODO would be possible to fetch the pids from the subgraph or should be a static map?

      let tx = await library.getSigner().sendTransaction(rawTx);
      await tx.wait(1);
      // setExecuting(false);
      setLoading(false);
      updateBalance(account, library, chainId);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
    // await masterChef.populateTransaction()
  }, [assetValue, balance, setStep, account, chainId, library, updateBalance]);

  const handleAssetValueMax = () => {
    setAssetValue(`${balance}`);
  };

  const handleAssetValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAssetValue(event.target.value);
  };

  return (
    <Root>
      <Typography variant="h7" component="h2" fontWeight={600} mb={5.5}>
        {t('stake-card.title')}
      </Typography>
      <Typography color="text.primary" mb={15}>
        {t('stake-card.description')}
      </Typography>
      <FormControl variant="standard" error={!isValid} fullWidth disabled={isProcessing}>
        <NumberInput
          id="assetValue"
          name="assetValue"
          className="AwiStakeCard-input"
          value={assetValue}
          onChange={handleAssetValueChange}
          aria-describedby="assetValueHelperText"
          startAdornment={<SwappingImage source="awi" target="dai" path="assets" size="small" />}
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
      <Typography className="AwiStakeCard-balance">
        <span>{t('stake-card.available-to-stake')}</span>
        <span>{formatAWI(balance)}</span>
      </Typography>
      <LoadingButton loading={loading} done={isCompleted} className="AwiStakeCard-submit" onClick={handleSubmit}>
        {t(approve ? 'stake-card.approve' : 'stake-card.stake')}
      </LoadingButton>
      {isCompleted && (
        <ExternalLink variant="body-sm" href={etherscan(address)} text={t(`common:common.view-on-etherscan`)} mt={8} />
      )}
      {isError && (
        <Typography color="error" mt={8}>
          {t(`stake-card.error-hint`)}
        </Typography>
      )}
    </Root>
  );
}
