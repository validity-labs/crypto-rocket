import React, { useCallback, useEffect, useState } from 'react';

import { useWeb3React } from '@web3-react/core';
import clsx from 'clsx';

import { Button, FormControl, FormLabel, Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { styled } from '@mui/material/styles';

import Label from '@/components/general/Label/Label';
import LabelValue from '@/components/general/LabelValue/LabelValue';
import Loader from '@/components/general/Loader/Loader';
import LoadingButton from '@/components/general/LoadingButton/LoadingButton';
import ExpandIcon from '@/components/icons/ExpandIcon';
import usePageTranslation from '@/hooks/usePageTranslation';
import {
  addLiquidity,
  AWINO_ROUTER_MAP,
  ChainId,
  FACTORY_ADDRESS_MAP,
  getReserves,
  quoteAddLiquidity,
  useAllowance,
  useTokenBalance,
} from '@/lib/blockchain';
import { formatAmount, formatPercent } from '@/lib/formatters';
import { AssetKey, ID } from '@/types/app';

import AssetIcons from './AssetIcons';
import AssetModal, { AssetModalData, AssetModalUpdateCallback } from './AssetModal';
import NumberInput from './NumberInput';
import { AssetInfoMap } from './SwapSection';

const Root = styled('div')(({ theme }) => ({
  '.AwiLiquidityPanel-source, .AwiLiquidityPanel-target': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: '100%',
  },
  '.AwiLiquidityPanel-source': {
    padding: theme.spacing(11, 8, 12),
  },
  '.AwiLiquidityPanel-target': {
    position: 'relative',
    borderRadius: +theme.shape.borderRadius * 6,
    padding: theme.spacing(11, 8, 12),
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 64,
      height: 64,
      background: 'url(/images/icons/add-icon.svg) no-repeat',
    },
    '&.Awi-active': {
      backgroundColor: 'rgba(0, 255, 186, 0.04)',
    },
  },
  '.AwiLiquidityPanel-sourceAmountLabel, .AwiLiquidityPanel-targetAmountLabel': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: theme.spacing(0, 0, 3),
    ...theme.typography.body,
  },

  '.AwiLiquidityPanel-percentage': {
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
  '.AwiLiquidityPanel-assetToggle': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    minHeight: 58,
    minWidth: 240,
    padding: theme.spacing(1, 6, 1),
    margin: theme.spacing(0, 'auto', 3),
    ...theme.typography['body-md'],
    color: theme.palette.text.primary,
    // img: {
    //   width: 50,
    //   height: 50,
    //   marginRight: theme.spacing(4),
    // },
    '.AwiLiquidityPanel-assetToggleIcon': {
      fontSize: '32px',
      color: theme.palette.text.secondary,
      marginLeft: theme.spacing(4),
      path: {
        fill: 'currentColor !important',
      },
    },
    '&:hover': {
      backgroundColor: theme.palette.background.transparent,
    },
    '&.Mui-focusVisible': {
      outline: `2px solid ${theme.palette.success.light}`,
      outlineOffset: -2,
    },
  },
  [theme.breakpoints.up('md')]: {
    '.AwiLiquidityPanel-source': {
      padding: theme.spacing(11, 22, 12, 8),
      paddingRight: theme.spacing(22),
    },
    '.AwiLiquidityPanel-target': {
      padding: theme.spacing(11, 8, 12, 22),
      '&:before': {
        position: 'absolute',
        top: '50%',
        left: 0,
      },
    },
  },
}));

const percentageList = [25, 50, 75, 100];

interface TabPanelProps {
  id: ID;
  children?: React.ReactNode;
  index: number;
  value: number;
  loading: boolean;
  assets: AssetInfoMap;
}

const LiquidityPanel = (props: TabPanelProps) => {
  const t = usePageTranslation();
  // const dispatch = useAppDispatch();
  const { id, value, index, assets, loading, ...other } = props;

  const [executing, setExecuting] = useState(false);
  const [sourceAsset, setSourceAsset] = useState<AssetKey | ''>('');
  const [sourceValue, setSourceValue] = useState(null);
  const [targetAsset, setTargetAsset] = useState<AssetKey | ''>('');
  const [targetValue, setTargetValue] = useState(null);
  const [canExecute, setCanExecute] = useState(false);
  const [assetModal, setAssetModal] = useState<AssetModalData | null>(null);

  const { account, library } = useWeb3React();
  const sourceMaxValue = useTokenBalance(assets.get(sourceAsset)?.address, assets.get(sourceAsset)?.decimals, account);
  const allowance = useAllowance(assets.get(sourceAsset)?.address, account, AWINO_ROUTER_MAP[ChainId.TESTNET]);
  const [hasEnoughAllowance, setHasEnoughAllowance] = useState(false);

  // Stores the current reserves in the liquidity pool between coin1 and coin2
  const [reserves, setReserves] = React.useState(['0.0', '0.0']);

  // Stores the user's balance of liquidity tokens for the current pair
  const [liquidityTokens, setLiquidityTokens] = React.useState('');

  // Used when getting a quote of liquidity
  const [liquidityOut, setLiquidityOut] = React.useState([0, 0, 0]);

  useEffect(() => {
    if (targetAsset) setTargetValue(sourceValue || 0 * 2);
  }, [sourceValue, targetAsset]);

  useEffect(() => {
    setCanExecute(sourceAsset && targetAsset && sourceValue && targetValue && sourceAsset !== targetAsset);
  }, [sourceAsset, targetAsset, sourceValue, targetValue]);

  /**
   * Check if the 'allowance' for the 'Router' contract is enough. Set the flag accordingly.
   */
  useEffect(() => {
    if (allowance && sourceValue && Number(allowance) >= Number(sourceValue)) {
      setHasEnoughAllowance(true);
    } else {
      setHasEnoughAllowance(false);
    }
  }, [allowance, sourceValue]);

  /**
   * sets target value
   */
  useEffect(() => {
    if (sourceValue && sourceValue > 0 && reserves.length > 0) {
      console.log({ reserves });
      console.log(`>> TargetValue: ${sourceValue} * (${+reserves[1]} / ${+reserves[0]})}`);
      setTargetValue(sourceValue * (+reserves[1] / +reserves[0]));
    }
  }, [sourceValue, reserves]);

  /**
   * Set pool reserves and LP tokens
   */
  useEffect(() => {
    console.log(
      'Trying to get reserves between:\n' + assets.get(sourceAsset)?.address + '\n' + assets.get(targetAsset)?.address
    );

    if (assets.get(sourceAsset)?.address && assets.get(targetAsset)?.address && account) {
      getReserves(
        assets.get(sourceAsset)?.address,
        assets.get(targetAsset)?.address,
        FACTORY_ADDRESS_MAP[ChainId.TESTNET],
        library,
        account
      ).then((data) => {
        console.log(data);
        setReserves([data[0], data[1]]);
        setLiquidityTokens(data[2]);
      });
    }
  }, [assets, sourceAsset, targetAsset, library, account]);

  /**
   * Get liquidity quote.
   */
  useEffect(() => {
    if (canExecute) {
      console.log('Trying to preview the liquidity deployment');

      quoteAddLiquidity(
        assets.get(sourceAsset)?.address,
        assets.get(targetAsset)?.address,
        sourceValue,
        targetValue,
        FACTORY_ADDRESS_MAP[ChainId.TESTNET],
        library
      ).then((data) => {
        console.log(data);
        console.log('TokenA in: ', data[0]);
        console.log('TokenB in: ', data[1]);
        console.log('Liquidity out: ', data[2]);

        setLiquidityOut([data[0], data[1], data[2]]);
      });
    }
  }, [assets, sourceAsset, targetAsset, sourceValue, targetValue, library, canExecute]);

  const handleExecute = useCallback(async () => {
    if (sourceAsset && targetAsset && sourceValue && targetValue && sourceAsset !== targetAsset) {
      setExecuting(true);

      try {
        await addLiquidity(
          assets.get(sourceAsset)?.address,
          assets.get(targetAsset)?.address,
          sourceValue,
          targetValue,
          '0',
          '0',
          AWINO_ROUTER_MAP[ChainId.TESTNET],
          account,
          library
        );

        // If the transaction was successful, we clear to input to make sure the user doesn't accidental redo the transfer
        setSourceValue(null);
        setTargetValue(null);
        setExecuting(false);
        setCanExecute(false);
      } catch (error) {
        setExecuting(false);
        console.error(error);
      }
    }
  }, [assets, sourceAsset, targetAsset, sourceValue, targetValue, account, library]);

  const validateSourceValue = useCallback(
    (newValue) => {
      return newValue >= 0 && newValue <= sourceMaxValue;
    },
    [sourceMaxValue]
  );

  const handleSourceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSourceValue(event.target.value);
  };

  const handleTargetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetValue(event.target.value);
  };

  const handlePercentClick = (event: React.MouseEvent<HTMLElement>, newPercent: number) => {
    setSourceValue(`${(+newPercent / 100) * parseFloat(sourceMaxValue)}`);
  };

  const handleSourceAssetModalToggle = () => {
    setAssetModal({
      currentAsset: sourceAsset as AssetKey,
      type: 'source',
      assets, //: new Map(Array.from(assets).filter(([id]) => id !== targetAsset)),
    });
  };

  const handleTargetAssetModalToggle = () => {
    setAssetModal({
      currentAsset: targetAsset as AssetKey,
      type: 'target',
      assets, //: new Map(Array.from(assets).filter(([id]) => id !== sourceAsset)),
    });
  };

  const handleAssetModalUpdate: AssetModalUpdateCallback = (type, payload) => {
    if (type === 'source') {
      setSourceAsset(payload as AssetKey);
    } else {
      setTargetAsset(payload as AssetKey);
    }
  };

  return (
    <>
      <Root
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${id}-${index}`}
        aria-labelledby={`tab-${id}-${index}`}
        {...other}
      >
        <div className="AwiSwapSection-header">
          <Label>{t(`swap-section.liquidity.prompt`)}</Label>
          <div className="AwiLiquidityPanel-aside Awi-row">
            <LoadingButton color="primary" onClick={handleExecute} disabled={!canExecute} loading={executing}>
              {t('swap-section.liquidity.execute')}
            </LoadingButton>
          </div>
        </div>
        <div>
          <div className="AwiSwapSection-subPanel">
            <Grid container>
              <Grid item xs={12} md={6}>
                <div className="AwiLiquidityPanel-source">
                  <Button
                    variant="text"
                    className="AwiLiquidityPanel-assetToggle"
                    startIcon={
                      loading ? (
                        <Loader progressProps={{ size: 20 }} />
                      ) : (
                        sourceAsset && <AssetIcons ids={sourceAsset} size="large" />
                      )
                    }
                    disabled={executing}
                    endIcon={<ExpandIcon className="AwiLiquidityPanel-assetToggleIcon" />}
                    onClick={handleSourceAssetModalToggle}
                  >
                    <>
                      {sourceAsset
                        ? assets.get(sourceAsset)
                            .label /*  new Map(Array.from(assets).filter((f) => f[0] !== targetAsset)).get(sourceAsset).label */
                        : t('swap-section.swap.choose-token')}
                    </>
                  </Button>
                  <FormControl variant="standard" fullWidth disabled={loading || executing || !sourceAsset}>
                    <FormLabel htmlFor="sourceValue" className="AwiLiquidityPanel-sourceAmountLabel">
                      <span>{t('swap-section.swap.you-pay')}</span>
                      {sourceAsset && sourceMaxValue && (
                        <span>
                          {t('swap-section.swap.max-of-asset', {
                            value: sourceMaxValue,
                            asset: assets.get(sourceAsset).label,
                          })}
                        </span>
                      )}
                    </FormLabel>
                    <NumberInput
                      id="sourceValue"
                      name="sourceValue"
                      inputProps={{
                        isAllowed: (value) => validateSourceValue(value.floatValue),
                      }}
                      value={sourceValue}
                      onChange={handleSourceChange}
                    />
                  </FormControl>
                  <div className="AwiLiquidityPanel-percentage">
                    <ToggleButtonGroup
                      size="small"
                      exclusive
                      onChange={handlePercentClick}
                      aria-label={t(`swap-section.swap.trading-type-hint`)}
                    >
                      {percentageList.map((percent) => (
                        <ToggleButton size="small" key={percent} value={percent}>
                          {formatPercent(percent)}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div className={clsx('AwiLiquidityPanel-target', { 'Awi-active': canExecute })}>
                  <Button
                    variant="text"
                    className="AwiLiquidityPanel-assetToggle"
                    startIcon={
                      loading ? (
                        <Loader progressProps={{ size: 20 }} />
                      ) : (
                        targetAsset && <AssetIcons ids={targetAsset} size="large" />
                      )
                    }
                    disabled={executing}
                    endIcon={<ExpandIcon className="AwiLiquidityPanel-assetToggleIcon" />}
                    onClick={handleTargetAssetModalToggle}
                  >
                    <>
                      {targetAsset
                        ? assets.get(targetAsset)
                            .label /*  new Map(Array.from(assets).filter((f) => f[0] !== targetAsset)).get(targetAsset).label */
                        : t('common:common.select-token')}
                    </>
                  </Button>
                  <FormControl variant="standard" fullWidth disabled={true}>
                    <FormLabel htmlFor="targetValue" className="AwiLiquidityPanel-targetAmountLabel">
                      <span>{t(`swap-section.swap.${canExecute ? 'you-receive-estimated' : 'you-receive'}`)}</span>
                    </FormLabel>
                    <NumberInput
                      id="targetValue"
                      name="targetValue"
                      value={targetValue}
                      onChange={handleTargetChange}
                    />
                  </FormControl>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </Root>
      {!!assetModal && (
        <AssetModal
          open={!!assetModal}
          close={() => setAssetModal(null)}
          data={assetModal}
          callback={handleAssetModalUpdate}
          i18nKey="asset-swap-modal"
        />
      )}
    </>
  );
};

export default LiquidityPanel;
