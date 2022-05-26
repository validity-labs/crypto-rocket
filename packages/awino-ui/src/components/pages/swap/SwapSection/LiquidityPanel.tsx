import React, { useCallback, useEffect, useState } from 'react';

import clsx from 'clsx';

import { Button, FormControl, FormLabel, Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { styled } from '@mui/material/styles';

import Label from '@/components/general/Label/Label';
import LabelValue from '@/components/general/LabelValue/LabelValue';
import Loader from '@/components/general/Loader/Loader';
import LoadingButton from '@/components/general/LoadingButton/LoadingButton';
import ExpandIcon from '@/components/icons/ExpandIcon';
import usePageTranslation from '@/hooks/usePageTranslation';
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
  const [sourceMaxValue, setSourceMaxValue] = useState(0);
  const [assetModal, setAssetModal] = useState<AssetModalData | null>(null);

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

  const handleSourceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSourceValue(event.target.value);
  };

  const handlePercentClick = (event: React.MouseEvent<HTMLElement>, newPercent: number) => {
    setSourceValue(`${(+newPercent / 100) * sourceMaxValue}`);
  };

  // const handleTargetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setTargetValue(event.target.value);
  // };

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
                  <FormControl variant="standard" fullWidth disabled={true /* loading || !targetAsset */}>
                    <FormLabel htmlFor="targetValue" className="AwiLiquidityPanel-targetAmountLabel">
                      <span>{t(`swap-section.swap.${canExecute ? 'you-receive-estimated' : 'you-receive'}`)}</span>
                    </FormLabel>
                    <NumberInput
                      id="targetValue"
                      name="targetValue"
                      value={targetValue} /* onChange={handleTargetChange} */
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
