import React, { useCallback, useEffect, useState } from 'react';

import clsx from 'clsx';

import { Button, FormControl, FormLabel, Grid, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import Label from '@/components/general/Label/Label';
import Loader from '@/components/general/Loader/Loader';
import LoadingButton from '@/components/general/LoadingButton/LoadingButton';
import Panel from '@/components/general/Panel/Panel';
import ExpandIcon from '@/components/icons/ExpandIcon';
// import { swapLiquidityData } from '@/fixtures/earn';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatPercent } from '@/lib/formatters';
import { AssetKey, AssetKeyPair, ID } from '@/types/app';

import AssetIcons from './AssetIcons';
import AssetModal, { AssetModalData, AssetModalUpdateCallback } from './AssetModal';
import ImportPoolModal, { ImportPoolModalData, ImportPoolModalUpdateCallback } from './ImportPoolModal';
import LiquidityCard from './LiquidityCard';
import NumberInput from './NumberInput';
import RemoveLiquidityModal, { RemoveLiquidityModalUpdateCallback } from './RemoveLiquidityModal';
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
  '.AwiLiquidityPanel-liquidity': {
    margin: theme.spacing(18, 0),
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

export interface LiquidityItem {
  id: string;
  pair: AssetKeyPair;
  tokens: number;
  pool: [number, number];
  share: number;
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
  const [importPoolModal, setImportPoolModal] = useState<ImportPoolModalData | null>(null);
  const [removeLiquidityModal, setRemoveLiquidityModal] = useState<LiquidityItem | null>(null);
  const [allLiquidity, setAllLiquidity] = useState<LiquidityItem[]>([]); // TODO create fetcher, for testing use swapLiquidityData

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

  const handleImportPoolModalToggle = () => {
    setImportPoolModal({
      assets,
    });
  };

  const handleImportPoolModalUpdate: ImportPoolModalUpdateCallback = (payload) => {
    setAllLiquidity((prevAllLiquidity) => [payload, ...prevAllLiquidity]);
  };

  const handleRemoveLiquidityModalToggle = (item: LiquidityItem) => {
    setRemoveLiquidityModal(item);
  };

  const handleRemoveLiquidityModalUpdate: RemoveLiquidityModalUpdateCallback = (payload) => {
    /* TODO */
    setAllLiquidity((prevAllLiquidity) => prevAllLiquidity.filter((f) => f.id !== payload));
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
          <div className="AwiLiquidityPanel-liquidity">
            <Grid container spacing={10}>
              <Grid item xs={12}>
                <div className="Awi-row Awi-between">
                  <Label
                    variant="body-md"
                    component="h2"
                    color="text.active"
                    id="awiLiquidity"
                    tooltip={t('swap-section.liquidity.your-liquidity-help')}
                  >
                    {t('swap-section.liquidity.your-liquidity')}
                  </Label>
                  <Button variant="outlined" onClick={handleImportPoolModalToggle}>
                    {t('swap-section.liquidity.import-pool')}
                  </Button>
                </div>
              </Grid>
              <Grid item xs={12}>
                {allLiquidity.length > 0 ? (
                  <>
                    <Typography variant="body-ms" sx={{ fontWeight: 500, ml: 8, mb: 7 }}>
                      {t('swap-section.liquidity.pool-pair')}
                    </Typography>
                    {allLiquidity.map((liquidity) => (
                      <LiquidityCard key={liquidity.id} item={liquidity} onRemove={handleRemoveLiquidityModalToggle} />
                    ))}
                  </>
                ) : (
                  <Panel>
                    <Typography mx="auto" textAlign="center">
                      {t('swap-section.liquidity.no-liquidity-found')}
                    </Typography>
                  </Panel>
                )}
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
      {!!importPoolModal && (
        <ImportPoolModal
          open={!!importPoolModal}
          close={() => setImportPoolModal(null)}
          data={importPoolModal}
          callback={handleImportPoolModalUpdate}
          i18nKey="import-pool-modal"
        />
      )}
      {!!removeLiquidityModal && (
        <RemoveLiquidityModal
          open={!!removeLiquidityModal}
          close={() => setRemoveLiquidityModal(null)}
          data={removeLiquidityModal}
          callback={handleRemoveLiquidityModalUpdate}
          i18nKey="remove-liquidity-modal"
        />
      )}
    </>
  );
};

export default LiquidityPanel;
