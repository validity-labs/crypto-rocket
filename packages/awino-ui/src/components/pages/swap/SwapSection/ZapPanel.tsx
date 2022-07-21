import React, { useCallback, useEffect, useMemo, useState } from 'react';

import clsx from 'clsx';
import { ethers } from 'ethers';

import { Button, FormControl, FormLabel, Grid, IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useWeb3 } from '@/app/providers/Web3Provider';
import Label from '@/components/general/Label/Label';
import Loader from '@/components/general/Loader/Loader';
import LoadingButton from '@/components/general/LoadingButton/LoadingButton';
import LoadingText from '@/components/general/LoadingText/LoadingText';
import ExpandIcon from '@/components/icons/ExpandIcon';
import ZapIcon from '@/components/icons/ZapIcon';
import usePageTranslation from '@/hooks/usePageTranslation';
import {
  AWINO_ROUTER_MAP,
  useAllowance,
  useAmountOut,
  useSwapInfo,
  useTokenBalance,
  useTokenBalanceDynamic,
} from '@/lib/blockchain';
import * as ERC20Common from '@/lib/blockchain/erc20/utils';
import { zapTokens } from '@/lib/blockchain/exchange/zap-helpers';
import { formatAmount, formatPercent } from '@/lib/formatters';
import { toBigNum } from '@/lib/helpers';
import { AssetKey, ID, PairedAssetKey } from '@/types/app';

import AssetIcons from './AssetIcons';
import AssetModal, { AssetModalData, AssetModalUpdateCallback } from './AssetModal';
import NumberInput from './NumberInput';
import { AssetInfoMap } from './SwapSection';

const Root = styled('div')(({ theme }) => ({
  '.AwiSwapPanel-source, .AwiSwapPanel-target': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
  '.AwiZapPanel-switch': {
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
  [theme.breakpoints.up('md')]: {
    '.AwiSwapPanel-source': {
      padding: theme.spacing(11, 22, 12, 8),
      paddingRight: theme.spacing(22),
    },
    '.AwiSwapPanel-target': {
      padding: theme.spacing(11, 8, 12, 22),
    },
    '.AwiZapPanel-switch': {
      top: '110px',
      left: 0,
      transform: 'translate(-50%, 0)',
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
  // sourceAssets: AssetInfoMap;
  // targetAssets: AssetInfoMap;
}

const ZapPanel = (props: TabPanelProps) => {
  const t = usePageTranslation();
  const { id, value, index, assets, /* sourceAssets, targetAssets,  */ loading, ...other } = props;

  const [executing, setExecuting] = useState(false);
  const [sourceAsset, setSourceAsset] = useState<AssetKey | ''>('');
  const [sourceValue, setSourceValue] = useState(null);
  const [targetAsset, setTargetAsset] = useState<PairedAssetKey | ''>('');
  const [canExecute, setCanExecute] = useState(false);
  const [assetModal, setAssetModal] = useState<AssetModalData | null>(null);

  const { account, library, chainId } = useWeb3();
  const routerAddress = useMemo(() => AWINO_ROUTER_MAP[chainId], [chainId]);

  const source = useMemo(() => assets.get(sourceAsset), [sourceAsset, assets]);
  const target = useMemo(() => assets.get(targetAsset), [targetAsset, assets]);

  const sourceMaxValue = useTokenBalanceDynamic(source?.address, source?.decimals, account);

  const targetMaxValue = useTokenBalanceDynamic(target?.address, target?.decimals, account);

  const targetValue = useAmountOut(source?.address, target?.address, sourceValue, routerAddress);

  const allowance = useAllowance(source?.address, account, routerAddress);
  const [hasEnoughAllowance, setHasEnoughAllowance] = useState(false);

  // const info = useSwapInfo(source?.address, target?.address, sourceValue, routerAddress);

  useEffect(() => {
    setCanExecute(
      sourceAsset &&
        targetAsset &&
        sourceValue &&
        targetValue &&
        sourceAsset !== targetAsset &&
        toBigNum(sourceValue).gt(0) &&
        toBigNum(targetValue).gt(0)
    );
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
      const { address, decimals } = source;
      const signer = await library.getSigner();
      setExecuting(true);

      // Check allowance
      if (!hasEnoughAllowance) {
        console.log(`>> Requesting approval for spending: ${ethers.utils.parseUnits(sourceValue, decimals)}`);

        try {
          // Approve
          await ERC20Common.approve(address, routerAddress, ethers.utils.parseUnits(sourceValue, decimals), library);
          setHasEnoughAllowance(true);
        } catch (error) {
          console.error(`Approval from ${account} to ${routerAddress} failed.`);
          console.error(error);
        }
      }

      // Execute swap
      try {
        // @TODO 'slippageTolerance' is not used. Adjust calculations based on
        // the selected slippageTolerance.
        await zapTokens(source.address, target.address, sourceValue, routerAddress, await signer.getAddress(), signer);

        setExecuting(false);
        setCanExecute(false);
        setSourceValue(0);
      } catch (error) {
        console.log(error);
        setExecuting(false);
      }
    }
  }, [
    sourceAsset,
    targetAsset,
    sourceValue,
    targetValue,
    target,
    source,
    routerAddress,
    hasEnoughAllowance,
    account,
    library,
  ]);

  const validateSourceValue = useCallback(
    (newValue) => {
      return newValue >= 0 && newValue <= sourceMaxValue;
    },
    [sourceMaxValue]
  );

  const handleSourceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSourceValue(event.target.value);
  };

  const handlePercentClick = (event: React.MouseEvent<HTMLElement>, newPercent: number) => {
    setSourceValue(`${(+newPercent / 100) * parseFloat(sourceMaxValue)}`);
  };

  const handleSourceAssetModalToggle = () => {
    setAssetModal({
      currentAsset: sourceAsset as AssetKey,
      type: 'source',
      assets: assets, //: new Map(Array.from(assets).filter(([id]) => id !== targetAsset)),
    });
  };

  const handleTargetAssetModalToggle = () => {
    setAssetModal({
      currentAsset: targetAsset as AssetKey,
      type: 'target',
      assets: assets, //: new Map(Array.from(assets).filter(([id]) => id !== sourceAsset)),
    });
  };

  const handleAssetModalUpdate: AssetModalUpdateCallback = (type, payload) => {
    if (type === 'source') {
      setSourceAsset(payload as AssetKey);
    } else {
      setTargetAsset(payload as PairedAssetKey);
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
          <Label>{t(`swap-section.zap.prompt`)}</Label>
          <div className="AwiSwapPanel-aside Awi-row">
            <LoadingButton color="primary" onClick={handleExecute} disabled={!canExecute} loading={executing}>
              {hasEnoughAllowance ? t('swap-section.zap.execute') : t('swap-section.zap.approve')}
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
                    <>{sourceAsset ? source.label : t('swap-section.zap.choose-token')}</>
                  </Button>
                  <FormControl variant="standard" fullWidth disabled={loading || executing || !sourceAsset}>
                    <FormLabel htmlFor="sourceValue" className="AwiSwapPanel-sourceAmountLabel">
                      <span>{t('swap-section.zap.you-pay')}</span>
                      {sourceAsset && (
                        <span>
                          <LoadingText
                            loading={sourceMaxValue === null}
                            text={t('swap-section.zap.max-of-asset', {
                              value: sourceMaxValue && formatAmount(sourceMaxValue),
                              asset: source.label,
                            })}
                          />
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
                  <div className="AwiSwapPanel-percentage">
                    <ToggleButtonGroup
                      size="small"
                      exclusive
                      onChange={handlePercentClick}
                      aria-label={t(`swap-section.zap.trading-type-hint`)}
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
                <div className={clsx('AwiSwapPanel-target', { 'Awi-active': canExecute })}>
                  <IconButton color="primary" size="small" className="AwiZapPanel-switch" onClick={handleSwitch}>
                    <ZapIcon />
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
                    <>{targetAsset ? target.label : t('swap-section.zap.choose-lp-token')}</>
                  </Button>
                  <FormControl variant="standard" fullWidth disabled={true /* loading || !targetAsset */}>
                    <FormLabel htmlFor="targetValue" className="AwiSwapPanel-targetAmountLabel">
                      <span>{t(`swap-section.zap.${canExecute ? 'you-receive-estimated' : 'you-receive'}`)}</span>
                      {targetAsset && (
                        <span>
                          <LoadingText
                            loading={targetMaxValue === null}
                            text={t('swap-section.zap.max-of-asset', {
                              value: targetMaxValue && formatAmount(targetMaxValue),
                              asset: target.label,
                            })}
                          />
                        </span>
                      )}
                    </FormLabel>
                    <NumberInput id="targetValue" name="targetValue" value={targetValue} />
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
          i18nKey="asset-zap-modal"
        />
      )}
    </>
  );
};

export default ZapPanel;
