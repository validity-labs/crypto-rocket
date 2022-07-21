import React, { useCallback, useReducer, useState, useEffect, useMemo } from 'react';

import { useTranslation } from 'next-i18next';

import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

import { Typography, Button, FormControl, FormHelperText } from '@mui/material';
import { styled } from '@mui/material/styles';

import AssetIcons from '@/components/general/AssetIcons/AssetIcons';
import LoadingButton from '@/components/general/LoadingButton/LoadingButton';
import Modal from '@/components/general/Modal/Modal';
import Text from '@/components/general/Text/Text';
import NumberInput from '@/components/inputs/NumberInput/NumberInput';
import usePageTranslation from '@/hooks/usePageTranslation';
import useSnack from '@/hooks/useSnack';
import { ChainId } from '@/lib/blockchain';
import { erc20AbiJson } from '@/lib/blockchain/erc20/abi/erc20';
import { AWINO_MASTER_CHEF_ADDRESS_MAP } from '@/lib/blockchain/farm-pools';
import IAwinoMasterChef from '@/lib/blockchain/farm-pools/abis/IAwinoMasterChef.json';
import { formatAWI, formatLPPair, formatPercent, formatUSD } from '@/lib/formatters';
import { AssetKey, AssetKeyPair } from '@/types/app';

import { FarmDataItem } from './ResultSection';

const Root = styled(Modal)(({ theme }) => ({
  '.AwiStackModal-row': {
    padding: theme.spacing(0, 0, 8.5),
    margin: theme.spacing(0, 0, 10),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  '.AwiStakeModal-amount': {
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
  '.AwiStakeModal-pair': {
    fontWeight: 600,
    color: theme.palette.text.primary,
    textTransform: 'uppercase',
  },
}));

// export interface StakeModalData {
//   pair: AssetKeyPair;
//   // proportion: number;
//   walletAmount: string;
//   walletAmountUSD: string;
//   stakedAmount: string;
// }

interface Props {
  open: boolean;
  close: () => void;
  data: FarmDataItem;
  // info: CollateralInfo;
  callback: (asset: AssetKey) => void;
}

// TODO PROROTYPE
let resError = 0;

type Step = 'initial' | 'confirmation' | 'complete' | 'error';

interface StepState {
  step: Step;
  isProcessing: boolean;
  isCompleted: boolean;
  isError: boolean;
}

const defaultStepState: StepState = {
  step: 'initial',
  isProcessing: false,
  isCompleted: false,
  isError: false,
};

function reducer(_state: StepState, actionType: Step) {
  const newState = {
    ...defaultStepState,
    step: actionType,
  };
  switch (actionType) {
    case 'confirmation':
      return {
        ...newState,
        isProcessing: true,
      };
    case 'complete':
      return {
        ...newState,
        isCompleted: true,
      };
    case 'error':
      return {
        ...newState,
        isError: true,
      };
    default:
      throw new Error('StakeModal step reducer');
  }
}

export default function StakeModal({ open, close, data, callback }: Props) {
  const t = usePageTranslation({ keyPrefix: 'stake-modal' });
  const { t: tRaw } = useTranslation();
  // const [transactionAddress, setTransactionAddress] = useState<string | null>(null);
  const [{ /* step, */ isProcessing, isCompleted, isError }, setStep] = useReducer(reducer, defaultStepState);
  const { id: poolAddress, farmId, pair, /* proportion, */ walletAmount, walletAmountUSD } = data;
  const [amount, setAmount] = useState<string | undefined>();
  const snack = useSnack();

  const { account, library, chainId, connector } = useWeb3React();
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<string>('0');
  const [stakedBalance, setStakedBalance] = useState<string>('0');
  const [approve, setApprove] = useState(false);

  const amountBN = useMemo(() => new BigNumber(amount), [amount]);
  const isValid = amountBN.isGreaterThan(0) && amountBN.isLessThan(walletAmount);

  const updateBalance = useCallback(
    async (acount: string, library: any, chainId: number) => {
      const fetchBalance = async () => {
        const contract = new ethers.Contract(poolAddress, erc20AbiJson, library);
        const balance = await contract.balanceOf(account);
        setBalance(ethers.utils.formatEther(balance.toString()));
      };

      const fetchStakedBalance = async () => {
        const contract = new ethers.Contract(AWINO_MASTER_CHEF_ADDRESS_MAP[ChainId.TESTNET], IAwinoMasterChef, library);
        const balance = await contract.userInfo(farmId, account);
        console.log({ account, balance });
        setStakedBalance(ethers.utils.formatEther(balance.amount.toString()));
      };

      setLoading(true);
      fetchBalance();
      fetchStakedBalance();
      setLoading(false);
    },
    [account, farmId, poolAddress]
  );

  // Set balance
  useEffect(() => {
    updateBalance(account, library, chainId);
  }, [account, library, chainId, updateBalance]);

  const handleSubmit = useCallback(async () => {
    if (!(amountBN.isGreaterThan(0) && amountBN.isLessThan(walletAmount))) {
      return;
    }
    setStep('confirmation');
    snack(t('message.confirm-transaction'), 'info');

    const res = await new Promise<{ error: boolean; msg: string }>((res) =>
      // TODO PROTOTYPE
      setTimeout(() => {
        res({ error: !resError++, msg: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' });
      }, 4000)
    );

    if (res.error) {
      setStep('error');
      snack(t('message.error'), 'error');
    } else {
      // setTransactionAddress(res.msg);

      setStep('complete');
      // callback(pair);
      snack(t('message.success'), 'success');
      close();
    }
  }, [t, snack, close, amountBN, walletAmount]);

  const handleAmountMaxClick = () => {
    setAmount(balance);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setAmount(newValue);
  };

  return (
    <Root
      id="stakeModal"
      title={
        <>
          {t('title')}
          {/* <Text variant="body-xs" highlighted value={formatPercent(proportion)} sx={{ ml: 4.5 }} /> */}
        </>
      }
      open={open}
      close={close}
    >
      <FormControl variant="standard" fullWidth sx={{ mb: 11.5 }}>
        <NumberInput
          id="stakeAmount"
          name="stakeAmount"
          className="AwiStakeModal-amount"
          aria-describedby="stakeAmountHelper"
          disabled={isProcessing}
          inputProps={{
            isAllowed: ({ floatValue }) => floatValue > 0 && floatValue <= walletAmount,
          }}
          placeholder="0"
          value={amount}
          onChange={handleAmountChange}
          endAdornment={
            <Button variant="text" size="small" onClick={handleAmountMaxClick}>
              {tRaw('common.max')}
            </Button>
          }
        />
        <FormHelperText id="stakeAmountHelper" variant="standard" sx={{ mt: 6, color: 'text.primary' }}>
          {t('amount-hint')}
        </FormHelperText>
      </FormControl>
      <div className="AwiStackModal-row">
        <div>
          <Typography variant="body" component="h3" mb={5}>
            {t('wallet-balance')}
          </Typography>
          <div className="Awi-row Awi-between">
            <div className="Awi-row">
              <AssetIcons ids={pair} size="large" />
              <Typography className="AwiStakeModal-pair" sx={{ ml: 7 }}>
                {formatLPPair(pair)}
              </Typography>
            </div>
            <div className="Awi-column">
              <Typography fontWeight="medium" color="text.primary" mb={1}>
                {formatAWI(walletAmount)}
              </Typography>
              <Typography variant="body-xs" fontWeight="medium">
                {formatUSD(new BigNumber(walletAmountUSD))}
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <LoadingButton
        once
        disabled={!isValid}
        loading={isProcessing}
        done={isCompleted}
        variant="outlined"
        color="primary"
        onClick={handleSubmit}
      >
        {t(`submit${isCompleted ? '-done' : ''}`)}
      </LoadingButton>
    </Root>
  );
}
