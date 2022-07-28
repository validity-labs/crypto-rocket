import React, { useCallback, useState, useEffect, useMemo } from 'react';

import { useTranslation } from 'next-i18next';

import BigNumberJS from 'bignumber.js';
import { ethers, BigNumber as EtherBigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';

import { Typography, Button, FormControl, FormHelperText } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useWeb3 } from '@/app/providers/Web3Provider';
import AssetIcons from '@/components/general/AssetIcons/AssetIcons';
import LabelValue from '@/components/general/LabelValue/LabelValue';
import LoadingButton from '@/components/general/LoadingButton/LoadingButton';
import LoadingText from '@/components/general/LoadingText/LoadingText';
import Modal from '@/components/general/Modal/Modal';
import NumberInput from '@/components/inputs/NumberInput/NumberInput';
import usePageTranslation from '@/hooks/usePageTranslation';
import { useFlow } from '@/hooks/web3/useFlow';
import * as ERC20Common from '@/lib/blockchain/erc20';
import { getBalance } from '@/lib/blockchain/erc20';
import MasterChefV2 from '@/lib/blockchain/farm-pools/abis/MasterChefV2.json';
import { getPendingRewards } from '@/lib/blockchain/farm-pools/helpers';
import { formatAmount, formatAWILP, formatUSD } from '@/lib/formatters';
import { toBigNum } from '@/lib/helpers';
import { Address } from '@/types/app';

import { FarmItem } from './ResultSection';

const Root = styled(Modal)(({ theme }) => ({
  '.AwiHarvestModal-row': {
    padding: theme.spacing(0, 0, 8.5),
    margin: theme.spacing(0, 0, 10),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '.AwiLabelValue-root': {
      justifyContent: 'space-between',
      '.AwiLabelValue-value': {
        textAlign: 'right',
      },
    },
  },
}));

interface Props {
  open: boolean;
  close: () => void;
  data: FarmItem;
  callback: (poolAddress: Address) => void;
}

export default function HarvestModal({ open, close, data, callback }: Props) {
  const t = usePageTranslation({ keyPrefix: 'harvest-modal' });
  const { farmId } = data;

  const { account, library, addressOf } = useWeb3();
  const { flow, flowState } = useFlow('harvest-modal');

  const [isReady, setIsReady] = useState(false);
  const [pendingReward, setPendingReward] = useState('0');

  useEffect(() => {
    const fetchBalance = async () => {
      const newBalance = await getPendingRewards(farmId, addressOf.masterchef, account, library);
      setIsReady(true);
      setPendingReward(formatEther(newBalance));
    };
    fetchBalance();
  }, [farmId, addressOf, account, library]);

  const handleSubmit = useCallback(async () => {
    const masterchefAddress = addressOf.masterchef;

    // deposit amount
    flow.send();
    try {
      // deposit to masterchef
      let rawTx = await new ethers.Contract(
        masterchefAddress,
        MasterChefV2,
        await library.getSigner()
      ).populateTransaction.deposit(farmId, 0);

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
  }, [farmId, callback, flow, close, addressOf, library]);

  return (
    <Root id="harvestModal" title={t('title')} lock={flowState.processing} open={open} close={close}>
      <div className="AwiHarvestModal-row">
        <LabelValue
          id="distribution"
          value={<LoadingText loading={!isReady} text={formatAmount(pendingReward)} />}
          labelProps={{ children: t('pending-rewards') }}
        />
      </div>
      <LoadingButton
        once
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
