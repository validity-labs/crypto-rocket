import React, { useCallback, useState, useEffect, useMemo } from 'react';

import { useTranslation } from 'next-i18next';

import BigNumberJS from 'bignumber.js';
import { ethers, BigNumber as EtherBigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';

import { Typography, Button, FormControl, FormHelperText } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useWeb3 } from '@/app/providers/Web3Provider';
import AssetIcons from '@/components/general/AssetIcons/AssetIcons';
import LoadingButton from '@/components/general/LoadingButton/LoadingButton';
import LoadingText from '@/components/general/LoadingText/LoadingText';
import Modal from '@/components/general/Modal/Modal';
import NumberInput from '@/components/inputs/NumberInput/NumberInput';
import usePageTranslation from '@/hooks/usePageTranslation';
import { useFlow } from '@/hooks/web3/useFlow';
import * as ERC20Common from '@/lib/blockchain/erc20';
import { getBalance } from '@/lib/blockchain/erc20';
import MasterChefV2 from '@/lib/blockchain/farm-pools/abis/MasterChefV2.json';
import { formatAmount, formatAWILP, formatUSD } from '@/lib/formatters';
import { toBigNum } from '@/lib/helpers';
import { Address } from '@/types/app';

import { FarmItem } from './ResultSection';

const Root = styled(Modal)(({ theme }) => ({
  '.AwiStakeModal-row': {
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

interface Props {
  open: boolean;
  close: () => void;
  data: FarmItem;
  callback: (poolAddress: Address) => void;
}

export default function StakeModal({ open, close, data, callback }: Props) {
  const t = usePageTranslation({ keyPrefix: 'stake-modal' });
  const { t: tRaw } = useTranslation();
  const { id: pairId, farmId, label, pair, lpTokenValueUSD } = data;
  const [amount, setAmount] = useState<string | undefined>();

  const { account, library, addressOf } = useWeb3();

  const [isReady, setIsReady] = useState(false);
  const [balance, setBalance] = useState('0');

  const isValid = useMemo(() => {
    const amountBN = new BigNumberJS(amount);
    return amountBN.isGreaterThan(0) && amountBN.isLessThan(balance);
  }, [amount, balance]);

  const balanceUSD = useMemo(() => {
    const balanceBN = new BigNumberJS(balance);
    return balanceBN.times(lpTokenValueUSD);
  }, [balance, lpTokenValueUSD]);

  useEffect(() => {
    const fetchBalance = async () => {
      const newBalance = await getBalance(pairId, account, library);
      setIsReady(true);
      setBalance(formatEther(newBalance));
    };
    fetchBalance();
  }, [pairId, account, library]);

  const { flow, flowState } = useFlow('stake-modal');

  const handleSubmit = useCallback(async () => {
    // check validity
    flow.validate();
    if (!isValid) {
      flow.error();
      return;
    }
    const masterchefAddress = addressOf.masterchef;
    const allowance = (await ERC20Common.allowance(pairId, account, masterchefAddress, library)) as EtherBigNumber;

    const stakeAmount = ethers.utils.parseEther(amount);

    // check allowance
    if (allowance.lt(stakeAmount)) {
      flow.approve();
      try {
        await ERC20Common.approve(pairId, masterchefAddress, stakeAmount, library);
      } catch (error) {
        flow.error();
        console.error(error);
        return;
      }
    }

    // deposit amount
    flow.send();
    try {
      // deposit to masterchef
      let rawTx = await new ethers.Contract(
        masterchefAddress,
        MasterChefV2,
        await library.getSigner()
      ).populateTransaction.deposit(farmId, stakeAmount);

      let tx = await library.getSigner().sendTransaction(rawTx);
      const txReceipt = await tx.wait(1);

      // on complete, show success message, trigger callback and close modal
      flow.complete({ hash: txReceipt.transactionHash });
      callback(farmId);
      close();
    } catch (error) {
      flow.error();
      console.error(error);
    }
  }, [pairId, farmId, callback, flow, amount, close, isValid, addressOf, account, library]);

  const handleAmountMaxClick = () => {
    setAmount(balance);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setAmount(newValue);
  };

  return (
    <Root id="stakeModal" title={t('title')} lock={flowState.processing} open={open} close={close}>
      <FormControl variant="standard" fullWidth sx={{ mb: 11.5 }}>
        <NumberInput
          id="stakeAmount"
          name="stakeAmount"
          className="AwiStakeModal-amount"
          aria-describedby="stakeAmountHelper"
          disabled={flowState.processing}
          inputProps={{
            isAllowed: ({ value }) => {
              const n = toBigNum(value);
              return n.gt(0) && n.lte(balance);
            },
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
      <div className="AwiStakeModal-row">
        <div>
          <Typography variant="body" component="h3" mb={5}>
            {t('wallet-balance')}
          </Typography>
          <div className="Awi-row Awi-between">
            <div className="Awi-row">
              <AssetIcons ids={pair} size="large" />
              <Typography className="AwiStakeModal-pair" sx={{ ml: 7 }}>
                {label}
              </Typography>
            </div>
            <div className="Awi-column">
              <Typography fontWeight="medium" color="text.primary" mb={1}>
                <LoadingText loading={!isReady} text={formatAWILP(formatAmount(balance))} />
              </Typography>
              <Typography variant="body-xs" fontWeight="medium">
                {`~${formatUSD(balanceUSD)}`}
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <LoadingButton
        once
        disabled={!isValid}
        loading={flowState.processing}
        done={flowState.completed}
        variant="outlined"
        color="primary"
        onClick={handleSubmit}
      >
        {t(`submit${flowState.completed ? '-done' : ''}`)}
      </LoadingButton>
    </Root>
  );
}
