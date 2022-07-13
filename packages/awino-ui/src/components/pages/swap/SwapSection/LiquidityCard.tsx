import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { createSelector } from '@reduxjs/toolkit';
import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'ethers';

import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import { Box, Collapse, Fade, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  LiquidityPair,
  updateLiquidityPair,
  updateUserLiquidityPair,
  UserLiquidityPair,
} from '@/app/state/slices/exchange';
import AssetIcon from '@/components/general/AssetIcon/AssetIcon';
import LabelValue from '@/components/general/LabelValue/LabelValue';
import LoadingText from '@/components/general/LoadingText/LoadingText';
import ExpandIcon from '@/components/icons/ExpandIcon';
import AssetIcons from '@/components/pages/swap/SwapSection/AssetIcons';
import usePageTranslation from '@/hooks/usePageTranslation';
import { getTotalSupply } from '@/lib/blockchain';
import { formatPercent } from '@/lib/formatters';
import { percentageFor, stopPropagation } from '@/lib/helpers';
import { Address } from '@/types/app';

const Root = styled('div')(({ theme }) => ({
  borderRadius: theme.spacing(8),
  boxShadow: '0px 3px 6px #00000029',
  padding: theme.spacing(0, 8),
  backgroundColor: theme.palette.background.transparent,
  margin: theme.spacing(0, 0, 6),
  '.AwiLiquidityCard-summary': {
    padding: theme.spacing(3.5, 0, 3),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
  },
  '.AwiLiquidityCard-details': {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3, 0, 8, 3.5),
  },
  '.AwiLiquidityCard-pair': {
    fontWeight: 500,
    color: theme.palette.text.primary,
    textTransform: 'uppercase',
  },
  '.AwiLabelValue-root': {
    width: '100%',
    maxWidth: 600,
    gap: theme.spacing(4),
  },
  '.AwiLabelValue-label': {
    flex: 1,
    margin: theme.spacing(0, 4, 0, 0),
    ...theme.typography['body-ms'],
    fontWeight: 500,
    color: theme.palette.text.secondary,
  },
  '.AwiLabelValue-value': {
    flex: 1,
    ...theme.typography['body-ms'],
    fontWeight: 500,
    img: {
      marginLeft: theme.spacing(2),
    },
  },
  [theme.breakpoints.up('sm')]: {
    '.AwiLabelValue-root': {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  },
  [theme.breakpoints.up('md')]: {
    '.AwiLiquidityCard-details': {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing(3, 0, 8, 13.5),
    },
  },
}));

interface Props {
  id: Address;
  onRemove: (item: LiquidityPair) => void;
}

const selectLiquidityPair = (id) =>
  createSelector(
    (state) => state.exchange.liquidityPairs.entities[id],
    (state) => state.exchange.userLiquidityPairs.entities[id],
    (liquidityPair, userLiquidityPair) => ({
      ...liquidityPair,
      ...userLiquidityPair,
    })
  );

function LiquidityCard({ id, onRemove /* ,onHarvest, onStake, onUnstake */ }: Props) {
  const t = usePageTranslation({ keyPrefix: 'swap-section.liquidity' });

  const { account, library } = useWeb3React();

  const dispatch = useAppDispatch();
  const itemSelector = useMemo(() => selectLiquidityPair(id), [id]);
  const item: UserLiquidityPair = useAppSelector(itemSelector);

  const [isDetailExpanded, setIsDetailExpanded] = useState(false);
  const handleDetailsToggle = useCallback(
    () => setIsDetailExpanded((prevIsDetailExpanded) => !prevIsDetailExpanded),
    []
  );

  const handleRemove = useCallback(() => {
    onRemove(item);
  }, [item, onRemove]);

  useEffect(() => {
    const prepareInfo = async () => {
      const totalSupply = await getTotalSupply(id, account, library);

      dispatch(
        updateLiquidityPair({
          id,
          data: {
            totalSupply: totalSupply.toString(),
          },
        })
      );
      dispatch(
        updateUserLiquidityPair({
          id,
          data: {
            share: percentageFor(BigNumber.from(item.balance), totalSupply).toString(),
          },
        })
      );
    };

    if (isDetailExpanded && item && !item.share) {
      prepareInfo();
    }
  }, [isDetailExpanded, item, id, dispatch, library, account]);

  const { token0, token1 } = item;
  const isExtended = item && item.share;

  // useEffect(() => {
  //   console.log('LiquidityCard mount');
  // }, []);
  // console.log('LiquidityCard render', id);

  return (
    <Fade in={!!item} appear>
      <Root>
        <div className="AwiLiquidityCard-summary" onClick={handleDetailsToggle}>
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
              className="AwiLiquidityCard-pair"
            >{`${token0.symbol}/${token1.symbol}`}</Typography>
          </div>
          <IconButton color="primary" onClick={stopPropagation(handleDetailsToggle)}>
            {<ExpandIcon fontSize="medium" sx={{ transform: `rotate(${isDetailExpanded ? 180 : 0}deg)` }} />}
          </IconButton>
        </div>
        <Collapse in={isDetailExpanded}>
          <div className="AwiLiquidityCard-details">
            <Box className="Awi-column" sx={{ flex: 1, gap: 5 }}>
              <LabelValue id="tokens" value={item.balanceFormatted} labelProps={{ children: t('your-pool-tokens') }} />
              <LabelValue
                id="pooledA"
                value={
                  <span className="Awi-row Awi-vStart">
                    {token0.reserve}
                    <AssetIcon symbol={token0.symbol} size="small" />
                  </span>
                }
                labelProps={{ children: t('pooled', { v: token0.symbol }) }}
              />
              <LabelValue
                id="pooledB"
                value={
                  <span className="Awi-row Awi-vStart">
                    {token1.reserve}
                    <AssetIcon symbol={token1.symbol} size="small" />
                  </span>
                }
                labelProps={{ children: t('pooled', { v: token1.symbol }) }}
              />
              <LabelValue
                id="poolShare"
                value={<LoadingText loading={!isExtended} text={formatPercent(item.share)} />}
                labelProps={{ children: t('pool-share') }}
              />
            </Box>
            <Box sx={{ alignSelf: 'flex-start' }}>
              <IconButton
                disabled={!isExtended}
                color="primary"
                title={t('remove-pool')}
                onClick={stopPropagation(handleRemove)}
              >
                {<RemoveCircleOutlineRoundedIcon />}
              </IconButton>
            </Box>
          </div>
        </Collapse>
      </Root>
    </Fade>
  );
}

export default memo(LiquidityCard);
