import React, { useCallback, useEffect, useState } from 'react';

import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import clsx from 'clsx';
import { ethers } from 'ethers';

import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import Label from '@/components/general/Label/Label';
import LabelValue from '@/components/general/LabelValue/LabelValue';
import Loader from '@/components/general/Loader/Loader';
import LoadingButton from '@/components/general/LoadingButton/LoadingButton';
import ExpandIcon from '@/components/icons/ExpandIcon';
import GearIcon from '@/components/icons/GearIcon';
import ReloadIcon from '@/components/icons/ReloadIcon';
import SwapIcon from '@/components/icons/SwapIcon';
import usePageTranslation from '@/hooks/usePageTranslation';
import { ChainId } from '@/lib/blockchain/common';
import { useTokenBalance, useAllowance } from '@/lib/blockchain/erc20';
import * as ERC20Common from '@/lib/blockchain/erc20/utils';
import { useAmountOut, useSwapInfo } from '@/lib/blockchain/exchange';
import { AWINO_ROUTER_MAP } from '@/lib/blockchain/exchange';
import { swapTokens } from '@/lib/blockchain/exchange/helpers';
import { formatAmount, formatPercent } from '@/lib/formatters';
import { AssetKey, ID } from '@/types/app';

import AssetIcons from './AssetIcons';
import AssetModal, { AssetModalData, AssetModalUpdateCallback } from './AssetModal';
import NumberInput from './NumberInput';
import SettingsModal, { SettingsModalData, SettingsModalUpdateCallback } from './SettingsModal';
import { AssetInfoMap } from './SwapSection';

const Root = styled('div')(({ theme }) => ({
  '.AwiSwapPanel-info': {
    width: '100%',
    padding: theme.spacing(0, 10),
    '.AwiSwapPanel-infoLabelValue': {
      display: 'flex',
      justifyContent: 'space-between',
      margin: theme.spacing(0, 0, 3),
      '.AwiLabelValue-value': {
        textAlign: 'end',
      },
      '.AwiLabelValue-label, .AwiLabelValue-value': {
        fontSize: '0.875rem' /* 14px */,
        fontWeight: 400,
        color: theme.palette.text.secondary,
      },
    },
  },
  '.AwiSwapPanel-source, .AwiSwapPanel-target': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: '100%',
  },
  '.AwiSwapPanel-source': {
    padding: theme.spacing(11, 8, 12),
  },
  '.AwiSwapPanel-target': {
    position: 'relative',
    borderRadius: +theme.shape.borderRadius * 6,
    padding: theme.spacing(11, 8, 12),

    '&.Awi-active': {
      backgroundColor: 'rgba(0, 255, 186, 0.04)',
    },
  },
  '.AwiSwapPanel-switch': {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1,
    svg: {
      fontSize: 62,
    },
  },
  '.AwiSwapPanel-sourceAmountLabel, .AwiSwapPanel-targetAmountLabel': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: theme.spacing(0, 0, 3),
    ...theme.typography.body,
  },
  '.AwiSwapPanel-sourceAmountMax': {
    padding: theme.spacing(1, 3),
    border: `1px solid ${theme.palette.text.secondary}`,
    ...theme.typography['body-sm'],
    color: theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.text.primary,
      ...theme.mixins.border.active,
    },
  },

  '.AwiSwapPanel-help': {
    position: 'static',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    margin: theme.spacing(2, 0, 3),
    ...theme.typography.body,
  },
  '.AwiSwapPanel-percentage': {
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
  '.AwiSwapPanel-slippageTolerance': {
    width: '100%',
    margin: theme.spacing(2, 0, 0),
    '&.Awi-row': {
      justifyContent: 'space-between',
    },
  },
  '.AwiSwapPanel-assetToggle': {
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
    '.AwiSwapPanel-assetToggleIcon': {
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
  '.AwiSwapPanel-sourcePriceLabel': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: theme.spacing(12.5, 0, 3),
    ...theme.typography.body,
    '.MuiIconButton-root': {
      padding: 4,
      margin: theme.spacing(0, 0, 0, 1),
      '&:hover, &.Mui-focusVisible': {
        color: theme.palette.text.active,
      },
      svg: {
        fontSize: '16px',
      },
    },
  },
  [theme.breakpoints.up('md')]: {
    '.AwiSwapPanel-source': {
      padding: theme.spacing(11, 22, 12, 8),
      paddingRight: theme.spacing(22),
    },
    '.AwiSwapPanel-target': {
      padding: theme.spacing(11, 8, 12, 22),
    },
    '.AwiSwapPanel-switch': {
      top: '110px',
      left: 0,
      transform: 'translate(-50%, 0)',
    },
  },
}));

const percentageList = [25, 50, 75, 100];

type TypeKeys = 'market' | 'limit';

interface TabPanelProps {
  id: ID;
  children?: React.ReactNode;
  index: number;
  value: number;
  loading: boolean;
  assets: AssetInfoMap;
}

const SwapPanel = (props: TabPanelProps) => {
  const t = usePageTranslation();
  // const dispatch = useAppDispatch();
  const { id, value, index, assets, loading, ...other } = props;

  const [type, setType] = useState<TypeKeys>('market');
  const [executing, setExecuting] = useState(false);
  const [sourceAsset, setSourceAsset] = useState<AssetKey | ''>('');
  const [sourceValue, setSourceValue] = useState(null);
  const [targetAsset, setTargetAsset] = useState<AssetKey | ''>('');

  const [canExecute, setCanExecute] = useState(false);
  const [settingsModal, setSettingsModal] = useState<SettingsModalData | null>(null);
  const [assetModal, setAssetModal] = useState<AssetModalData | null>(null);
  const [slippageTolerance, setSlippageTolerance] = useState(0.3);
  const [sourcePriceValue, setSourcePriceValue] = useState(null);
  const { account, library, chainId, connector } = useWeb3React();
  const sourceMaxValue = useTokenBalance(assets.get(sourceAsset)?.address, assets.get(sourceAsset)?.decimals, account);
  const targetMaxValue = useTokenBalance(assets.get(targetAsset)?.address, assets.get(targetAsset)?.decimals, account);
  const targetValue = useAmountOut(
    assets.get(sourceAsset)?.address,
    assets.get(targetAsset)?.address,
    sourceValue,
    AWINO_ROUTER_MAP[ChainId.TESTNET]
  );

  const allowance = useAllowance(assets.get(sourceAsset)?.address, account, AWINO_ROUTER_MAP[ChainId.TESTNET]);
  const [hasEnoughAllowance, setHasEnoughAllowance] = useState(false);

  const info = useSwapInfo(
    assets.get(sourceAsset)?.address,
    assets.get(targetAsset)?.address,
    sourceValue,
    AWINO_ROUTER_MAP[ChainId.TESTNET]
  );
  const handleType = (event: React.MouseEvent<HTMLElement>, newType: TypeKeys) => {
    setType(newType);
    // setCanExecute((prev) => !prev);
  };

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
   * Checks if the the 'Router' contract has enough permissions to transfer tokens
   * on behalf of the user. If not, call 'approve', otherwise perform the 'swap'.
   */
  const handleExecute = useCallback(async () => {
    if (sourceAsset && targetAsset && sourceValue && targetValue && sourceAsset !== targetAsset) {
      const { address, decimals } = assets.get(sourceAsset);
      const signer = await library.getSigner();
      setExecuting(true);

      // Check allowance
      if (!hasEnoughAllowance) {
        console.log(`>> Requesting approval for spending: ${ethers.utils.parseUnits(sourceValue, decimals)}`);

        try {
          // Approve
          await ERC20Common.approve(
            address,
            AWINO_ROUTER_MAP[chainId],
            ethers.utils.parseUnits(sourceValue, decimals),
            library
          );
          setHasEnoughAllowance(true);
        } catch (error) {
          console.error(`Approval from ${account} to ${AWINO_ROUTER_MAP[chainId]} failed.`);
          console.error(error);
        }
      }

      // Execute swap
      try {
        // @TODO 'slippageTolerance' is not used. Adjust calculations based on
        // the selected slippageTolerance.
        await swapTokens(
          assets.get(sourceAsset).address,
          assets.get(targetAsset).address,
          sourceValue,
          AWINO_ROUTER_MAP[ChainId.TESTNET],
          await signer.getAddress(),
          signer
        );

        setExecuting(false);
        setCanExecute(false);
        setSourceValue(0);
      } catch (error) {
        console.log(error);
        setExecuting(false);
      }
    }
  }, [sourceAsset, targetAsset, sourceValue, targetValue, assets, chainId, hasEnoughAllowance, account, library]);

  const validateSourceValue = useCallback(
    (newValue) => {
      return newValue >= 0 && newValue <= sourceMaxValue;
    },
    [sourceMaxValue]
  );

  const handleSourceMax = () => {
    if (validateSourceValue(sourceMaxValue)) {
      setSourceValue(`${sourceMaxValue}`);
    }
  };

  const handleSourceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSourceValue(event.target.value);
  };

  const handleSourcePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSourcePriceValue(event.target.value);
  };

  const handleSourcePriceRefresh = () => {
    console.log('handleSourcePriceRefresh');
  };

  const handlePercentClick = (event: React.MouseEvent<HTMLElement>, newPercent: number) => {
    setSourceValue(`${(+newPercent / 100) * parseFloat(sourceMaxValue)}`);
  };

  // const handleTargetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setTargetValue(event.target.value);
  // };

  const handleSettingsModalToggle = () => {
    setSettingsModal({
      slippageTolerance,
      transactionDeadline: 20,
    });
  };

  const handleSettingsUpdate: SettingsModalUpdateCallback<Promise<void>> = (type, payload) => {
    return new Promise((res) => {
      setSlippageTolerance(payload);
      res();
    });
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

  /**
   * Switch source / target assets
   */
  const handleSwitch = () => {
    const tSourceAsset = sourceAsset;
    setSourceAsset(targetAsset);
    setTargetAsset(tSourceAsset);
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
          <div className="Awi-row">
            <Label>{t(`swap-section.swap.prompt`)}</Label>
            <ToggleButtonGroup
              value={type}
              exclusive
              onChange={handleType}
              aria-label={t(`swap-section.swap.trading-type-hint`)}
            >
              <ToggleButton value="market">{t(`swap-section.swap.market`)}</ToggleButton>
              <ToggleButton value="limit">{t(`swap-section.swap.limit`)}</ToggleButton>
            </ToggleButtonGroup>
          </div>
          <div className="AwiSwapPanel-aside Awi-row">
            <Button variant="outlined" size="small" onClick={handleSettingsModalToggle}>
              <GearIcon />
            </Button>
            <LoadingButton color="primary" onClick={handleExecute} disabled={!canExecute} loading={executing}>
              {hasEnoughAllowance ? t('swap-section.swap.execute') : t('swap-section.swap.approve')}
            </LoadingButton>
          </div>
        </div>
        <div>
          <div className="AwiSwapSection-subPanel">
            <Grid container>
              <Grid item xs={12} md={6}>
                <div className="AwiSwapPanel-source">
                  <Button
                    variant="text"
                    className="AwiSwapPanel-assetToggle"
                    startIcon={
                      loading ? (
                        <Loader progressProps={{ size: 20 }} />
                      ) : (
                        sourceAsset && <AssetIcons ids={sourceAsset} size="large" />
                      )
                    }
                    disabled={executing}
                    endIcon={<ExpandIcon className="AwiSwapPanel-assetToggleIcon" />}
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
                    <FormLabel htmlFor="sourceValue" className="AwiSwapPanel-sourceAmountLabel">
                      <span>{t('swap-section.swap.you-pay')}</span>
                      {sourceAsset && sourceMaxValue && (
                        <span>
                          {t('swap-section.swap.max-of-asset', {
                            value: new BigNumber(sourceMaxValue).toFixed(3),
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
                      endAdornment={
                        <Button variant="outlined" onClick={handleSourceMax} className="AwiSwapPanel-sourceAmountMax">
                          {t('swap-section.swap.max')}
                        </Button>
                      }
                    />
                  </FormControl>
                  <div className="AwiSwapPanel-percentage">
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
                  {type === 'limit' && (
                    <FormControl variant="standard" fullWidth disabled={loading || executing || !sourceAsset}>
                      <FormLabel htmlFor="sourcePriceValue" className="AwiSwapPanel-sourcePriceLabel">
                        {t('swap-section.swap.price')}
                        <IconButton onClick={handleSourcePriceRefresh}>
                          <ReloadIcon />
                        </IconButton>
                      </FormLabel>
                      <NumberInput
                        id="sourcePriceValue"
                        name="sourcePriceValue"
                        value={sourcePriceValue}
                        onChange={handleSourcePriceChange}
                      />
                    </FormControl>
                  )}
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div className={clsx('AwiSwapPanel-target', { 'Awi-active': canExecute })}>
                  <IconButton color="primary" size="small" className="AwiSwapPanel-switch" onClick={handleSwitch}>
                    <SwapIcon />
                  </IconButton>
                  <Button
                    variant="text"
                    className="AwiSwapPanel-assetToggle"
                    startIcon={
                      loading ? (
                        <Loader progressProps={{ size: 20 }} />
                      ) : (
                        targetAsset && <AssetIcons ids={targetAsset} size="large" />
                      )
                    }
                    disabled={executing}
                    endIcon={<ExpandIcon className="AwiSwapPanel-assetToggleIcon" />}
                    onClick={handleTargetAssetModalToggle}
                  >
                    <>
                      {targetAsset
                        ? assets.get(targetAsset)
                            .label /*  new Map(Array.from(assets).filter((f) => f[0] !== targetAsset)).get(targetAsset).label */
                        : t('common:common.select-token')}
                    </>
                  </Button>
                  <FormControl variant="standard" fullWidth disabled={true /* loading || !targetAsset */}>
                    <FormLabel htmlFor="targetValue" className="AwiSwapPanel-targetAmountLabel">
                      <span>{t(`swap-section.swap.${canExecute ? 'you-receive-estimated' : 'you-receive'}`)}</span>
                      {targetAsset && targetMaxValue && (
                        <span>
                          {t('swap-section.swap.max-of-asset', {
                            value: new BigNumber(targetMaxValue).toFixed(3),
                            asset: assets.get(targetAsset).label,
                          })}
                        </span>
                      )}
                    </FormLabel>
                    <NumberInput
                      id="targetValue"
                      name="targetValue"
                      value={targetValue} /* onChange={handleTargetChange} */
                    />
                    {/* <FormHelperText className="AwiSwapPanel-help">
                      <span>{t('swap-section.swap.price')}</span>
                      {canExecute && (
                        <span>
                          {t('swap-section.swap.ratio-per', {
                            value: targetValue,
                            target: assets.get(targetAsset as AssetKey).label,
                            source: assets.get(sourceAsset as AssetKey).label,
                          })}
                        </span>
                      )}
                    </FormHelperText> */}
                  </FormControl>
                  {type === 'market' && (
                    <Typography
                      variant="body-sm"
                      color="text.primary"
                      className="AwiSwapPanel-slippageTolerance Awi-row"
                    >
                      <span>{t('swap-section.swap.slippage-tolerance')}</span>
                      <span>{formatPercent(slippageTolerance)}</span>
                    </Typography>
                  )}
                </div>
              </Grid>
            </Grid>
          </div>
          {canExecute && info && (
            <Grid container mt={13}>
              <Grid item xs={false} md={6}></Grid>
              <Grid item xs={12} md={6}>
                <div className="AwiSwapPanel-info">
                  <LabelValue
                    id="minimumReceived"
                    className="AwiSwapPanel-infoLabelValue"
                    value={formatAmount(Number(info.amountOut), {
                      postfix: assets.get(targetAsset as AssetKey).label,
                    })}
                    labelProps={{
                      children: t('swap-section.swap.minimum-received.title'),
                      tooltip: t('swap-section.swap.minimum-received.hint'),
                    }}
                  />
                  <LabelValue
                    id="priceImpact"
                    className="AwiSwapPanel-infoLabelValue"
                    sx={{ '&.label-value .value': { color: 'success.main' } }}
                    value={`< ${info.priceImpact} %`}
                    labelProps={{
                      children: t('swap-section.swap.price-impact.title'),
                      tooltip: t('swap-section.swap.price-impact.hint'),
                    }}
                  />
                  <LabelValue
                    id="liquidityProviderFee"
                    className="AwiSwapPanel-infoLabelValue"
                    value={`${info.liquidityProviderFee} %`}
                    labelProps={{
                      children: t('swap-section.swap.liquidity-provider-fee.title'),
                      tooltip: t('swap-section.swap.liquidity-provider-fee.hint'),
                    }}
                  />
                  <LabelValue
                    id="route"
                    className="AwiSwapPanel-infoLabelValue"
                    value={`${info.route.join(' -> ')}`}
                    labelProps={{
                      children: t('swap-section.swap.route.title'),
                      tooltip: t('swap-section.swap.route.hint'),
                    }}
                  />
                </div>
              </Grid>
            </Grid>
          )}
        </div>
      </Root>
      {!!settingsModal && (
        <SettingsModal
          open={!!settingsModal}
          close={() => setSettingsModal(null)}
          data={settingsModal}
          updateCallback={handleSettingsUpdate}
        />
      )}
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

export default SwapPanel;
