import { useCallback, useEffect, useState } from 'react';

import { useWeb3React } from '@web3-react/core';
import { ethers, BigNumber } from 'ethers';

import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import { Box, Collapse, Fade, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useAppDispatch } from '@/app/hooks';
import { extendLiquidity } from '@/app/state/slices/exchange';
import AssetIcon from '@/components/general/AssetIcon/AssetIcon';
import LabelValue from '@/components/general/LabelValue/LabelValue';
import LoadingText from '@/components/general/LoadingText/LoadingText';
import ExpandIcon from '@/components/icons/ExpandIcon';
import AssetIcons from '@/components/pages/swap/SwapSection/AssetIcons';
import { LiquidityPair, LiquidityExtended, TokenExtended } from '@/hooks/subgraphs/exchange/useUserLiquidityPairs';
import usePageTranslation from '@/hooks/usePageTranslation';
import { getBalance, getTotalSupply } from '@/lib/blockchain';
import { erc20AbiJson } from '@/lib/blockchain/erc20/abi/erc20';
import { formatPercent, formatUnits } from '@/lib/formatters';
import { percentageFor, stopPropagation } from '@/lib/helpers';

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
  item: LiquidityPair;
  onRemove: (item: LiquidityPair) => void;
}

export default function LiquidityCard({ item, onRemove /* ,onHarvest, onStake, onUnstake */ }: Props) {
  const t = usePageTranslation({ keyPrefix: 'swap-section.liquidity' });
  const { account, library } = useWeb3React();
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);
  const handleDetailsToggle = useCallback(
    () => setIsDetailExpanded((prevIsDetailExpanded) => !prevIsDetailExpanded),
    []
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    const prepareInfo = async () => {
      console.log('fetch additional pair info', item, isDetailExpanded);

      const { id: pairId, token0, token1, balance } = item;

      const totalSupply = await getTotalSupply(pairId, account, library);

      // const contract = new ethers.Contract(pairId, erc20AbiJson, library);
      // const totalSupply = await contract.totalSupply();
      // const token0Balance = await getBalance(token0.id, account, library);
      // const token1Balance = await getBalance(token1.id, account, library);

      dispatch(
        extendLiquidity({
          id: item.id,
          data: {
            // token0: {
            //   reserve: reserve0,
            //   // balance: token0Balance.toString(),
            //   // balanceFormatted: formatUnits(token0Balance, token0.decimals),
            // },
            // token1: {
            //   reserve: reserve1,
            //   // balance: token1Balance.toString(),
            //   // balanceFormatted: formatUnits(token1Balance, token1.decimals),
            // },
            share: percentageFor(BigNumber.from(balance), totalSupply).toString(),
          },
        })
      );
    };

    if (isDetailExpanded && !item.extended) {
      prepareInfo();
    }
  }, [isDetailExpanded, item, dispatch, library, account]);

  const handleRemove = () => {
    onRemove(item);
  };

  const { token0, token1 } = item;
  return (
    <Fade in appear>
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
                value={<LoadingText loading={!item.extended} text={formatPercent((item as LiquidityExtended).share)} />}
                labelProps={{ children: t('pool-share') }}
              />
            </Box>
            <Box sx={{ alignSelf: 'flex-start' }}>
              <IconButton
                disabled={!item.extended}
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
