import React, { useCallback, useEffect, useState } from 'react';

import clsx from 'clsx';

import {
  Button,
  ButtonBase,
  CircularProgress,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { useAppDispatch } from '@/app/hooks';
import { showMessage } from '@/app/state/slices/app';
import Label from '@/components/general/Label/Label';
import LabelValue from '@/components/general/LabelValue/LabelValue';
import Loader from '@/components/general/Loader/Loader';
import LoadingButton from '@/components/general/LoadingButton/LoadingButton';
import Select from '@/components/general/Select/Select';
import ExpandIcon from '@/components/icons/ExpandIcon';
import GearIcon from '@/components/icons/GearIcon';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatAmount } from '@/lib/formatters';
import { AssetKey, ID } from '@/types/app';

import AssetModal, { AssetModalData, AssetModalUpdateCallback } from './AssetModal';
import NumberInput from './NumberInput';
import SettingsModal, { SettingsModalData, SettingsModalUpdateCallback } from './SettingsModal';
import { AssetInfoMap } from './SwapSection';

const Root = styled('div')(({ theme }) => ({
  '.AwiSwapPanel-content': {
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
      },
    },
    '.AwiSwapPanel-source, .AwiSwapPanel-target': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing(11, 8, 12),
    },
    '.AwiSwapPanel-source': {
      paddingRight: theme.spacing(22),
    },
    '.AwiSwapPanel-target': {
      position: 'relative',
      borderRadius: +theme.shape.borderRadius * 6,
      paddingLeft: theme.spacing(22),
      // padding: theme.spacing(0, 10),
      '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 64,
        height: 64,
        background: 'url(/images/icons/swap-icon.svg) no-repeat',
      },
      '&.Awi-active': {
        backgroundColor: theme.palette.background.transparent,
        // 'rgba(98,98,98,0.04)',
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
  },
  '.AwiSwapPanel-assetToggle': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    minHeight: 58,
    minWidth: 240,
    padding: theme.spacing(1, 6, 1),
    margin: theme.spacing(0, 0, 3),
    ...theme.typography['body-md'],
    color: theme.palette.text.primary,
    img: {
      width: 50,
      height: 50,
      marginRight: theme.spacing(4),
    },
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
    '.AwiSwapPanel-content': {
      '.AwiSwapPanel-target': {
        '&:before': {
          position: 'absolute',
          top: '50%',
          left: 0,
        },
      },
    },
  },
}));

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
  const dispatch = useAppDispatch();
  const { id, value, index, assets, loading, ...other } = props;

  const [type, setType] = useState<TypeKeys>('market');
  const [executing, setExecuting] = useState(false);
  const [sourceAsset, setSourceAsset] = useState<AssetKey | ''>('');
  const [sourceValue, setSourceValue] = useState(null);
  const [targetAsset, setTargetAsset] = useState<AssetKey | ''>('');
  const [targetValue, setTargetValue] = useState(null);
  const [canExecute, setCanExecute] = useState(false);
  const [info, setInfo] = useState(null);
  const [sourceMaxValue, setSourceMaxValue] = useState(0);
  const [settingsModal, setSettingsModal] = useState<SettingsModalData | null>(null);
  const [assetModal, setAssetModal] = useState<AssetModalData | null>(null);

  const handleType = (event: React.MouseEvent<HTMLElement>, newType: TypeKeys) => {
    setType(newType);
    // setCanExecute((prev) => !prev);
  };
  useEffect(() => {
    if (targetAsset) setTargetValue(sourceValue || 0 * 2);
  }, [sourceValue, targetAsset]);

  useEffect(() => {
    setSourceMaxValue(null);
    if (sourceAsset) {
      setTimeout(() => {
        setSourceMaxValue(100.99);
      }, 400);
    }
  }, [sourceAsset]);

  useEffect(() => {
    if (sourceAsset && targetAsset) {
      setInfo(null);
      setTimeout(() => {
        setInfo({
          minimumReceived: 0.9907,
          priceImpact: '<0.01%',
          liquidityProviderFee: 0.005991,
          route: `${sourceAsset} CRE USDC ${targetAsset}`,
        });
      }, 400);
    }
  }, [sourceAsset, targetAsset]);

  useEffect(() => {
    setCanExecute(sourceAsset && targetAsset && sourceValue && targetValue && sourceAsset !== targetAsset);
  }, [sourceAsset, targetAsset, sourceValue, targetValue]);

  const handleExecute = useCallback(() => {
    if (sourceAsset && targetAsset && sourceValue && targetValue && sourceAsset !== targetAsset) {
      setExecuting(true);
      setTimeout(() => {
        setExecuting(false);
      }, 1000);
    }
  }, [sourceAsset, targetAsset, sourceValue, targetValue]);

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

  // const handleTargetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setTargetValue(event.target.value);
  // };

  const handleSettingsModalToggle = () => {
    setSettingsModal({
      slippageTolerance: 0.5,
      transactionDeadline: 20,
    });
  };

  const handleSettingsUpdate: SettingsModalUpdateCallback<Promise<void>> = (type, payload) => {
    return new Promise((res) => {
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
    console.log(type, payload);
    if (type === 'source') {
      setSourceAsset(payload);
    } else {
      setTargetAsset(payload);
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
              {t('swap-section.swap.execute')}
            </LoadingButton>
          </div>
        </div>
        <div className="AwiSwapPanel-content">
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
                        sourceAsset && <img src={`/images/assets/${sourceAsset}.svg`} alt="" width="24" />
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
                        : t('common:common.select-token')}
                    </>
                  </Button>
                  <FormControl variant="standard" fullWidth disabled={loading || executing || !sourceAsset}>
                    <FormLabel htmlFor="sourceValue" className="AwiSwapPanel-sourceAmountLabel">
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
                      endAdornment={
                        <Button variant="outlined" onClick={handleSourceMax} className="AwiSwapPanel-sourceAmountMax">
                          {t('swap-section.swap.max')}
                        </Button>
                      }
                    />
                    <FormHelperText className="AwiSwapPanel-help" variant="standard" />
                  </FormControl>
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div className={clsx('AwiSwapPanel-target', { 'Awi-active': canExecute })}>
                  <Button
                    variant="text"
                    className="AwiSwapPanel-assetToggle"
                    startIcon={
                      loading ? (
                        <Loader progressProps={{ size: 20 }} />
                      ) : (
                        targetAsset && <img src={`/images/assets/${targetAsset}.svg`} alt="" width="50" height="50" />
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
                    </FormLabel>
                    <NumberInput
                      id="targetValue"
                      name="targetValue"
                      value={targetValue} /* onChange={handleTargetChange} */
                    />
                    <FormHelperText className="AwiSwapPanel-help">
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
                    </FormHelperText>
                  </FormControl>
                </div>
              </Grid>
            </Grid>
          </div>
          {canExecute && info && (
            <Grid container>
              <Grid item xs={false} md={6}></Grid>
              <Grid item xs={12} md={6}>
                <div className="AwiSwapPanel-info">
                  <LabelValue
                    id="minimumReceived"
                    className="AwiSwapPanel-infoLabelValue"
                    value={formatAmount(info.liquidityProviderFee, {
                      postfix: assets.get(sourceAsset as AssetKey).label,
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
                    value={info.priceImpact}
                    labelProps={{
                      children: t('swap-section.swap.price-impact.title'),
                      tooltip: t('swap-section.swap.price-impact.hint'),
                    }}
                  />
                  <LabelValue
                    id="liquidityProviderFee"
                    className="AwiSwapPanel-infoLabelValue"
                    value={formatAmount(info.liquidityProviderFee, {
                      postfix: assets.get(targetAsset as AssetKey).label,
                    })}
                    labelProps={{
                      children: t('swap-section.swap.liquidity-provider-fee.title'),
                      tooltip: t('swap-section.swap.liquidity-provider-fee.hint'),
                    }}
                  />
                  <LabelValue
                    id="route"
                    className="AwiSwapPanel-infoLabelValue"
                    value={info.route}
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
