import React, { useCallback, useEffect, useState } from 'react';

import clsx from 'clsx';

import { Button, FormControl, FormLabel, Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { styled } from '@mui/material/styles';

import Label from '@/components/general/Label/Label';
import Loader from '@/components/general/Loader/Loader';
import LoadingButton from '@/components/general/LoadingButton/LoadingButton';
import ExpandIcon from '@/components/icons/ExpandIcon';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatPercent } from '@/lib/formatters';
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
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 64,
      height: 64,
      background: 'url(/images/icons/zap-icon.svg) no-repeat',
    },
    '&.Awi-active': {
      backgroundColor: 'rgba(0, 255, 186, 0.04)',
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
  sourceAssets: AssetInfoMap;
  targetAssets: AssetInfoMap;
}

const ZapPanel = (props: TabPanelProps) => {
  const t = usePageTranslation();
  const { id, value, index, sourceAssets, targetAssets, loading, ...other } = props;
  const sourceMaxValue = 9999.99;
  const [executing, setExecuting] = useState(false);
  const [sourceAsset, setSourceAsset] = useState<AssetKey | ''>('');
  const [sourceValue, setSourceValue] = useState(null);
  const [targetAsset, setTargetAsset] = useState<PairedAssetKey | ''>('');
  const [targetValue, setTargetValue] = useState(null);
  const [canExecute, setCanExecute] = useState(false);
  const [assetModal, setAssetModal] = useState<AssetModalData | null>(null);

  useEffect(() => {
    if (targetAsset) setTargetValue(sourceValue || 0 * 2);
  }, [sourceValue, targetAsset]);

  useEffect(() => {
    setCanExecute(sourceAsset && targetAsset && sourceValue && targetValue);
  }, [sourceAsset, targetAsset, sourceValue, targetValue]);

  const handleExecute = useCallback(() => {
    if (sourceAsset && targetAsset && sourceValue && targetValue) {
      setExecuting(true);
      setTimeout(() => {
        setExecuting(false);
      }, 1000);
    }
  }, [sourceAsset, targetAsset, sourceValue, targetValue]);

  const validateSourceValue = useCallback((newValue) => {
    return newValue >= 0;
  }, []);

  const handleSourceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSourceValue(event.target.value);
  };

  const handlePercentClick = (event: React.MouseEvent<HTMLElement>, newPercent: number) => {
    setSourceValue(`${(+newPercent / 100) * sourceMaxValue}`);
  };

  const handleSourceAssetModalToggle = () => {
    setAssetModal({
      currentAsset: sourceAsset as AssetKey,
      type: 'source',
      assets: sourceAssets, //: new Map(Array.from(assets).filter(([id]) => id !== targetAsset)),
    });
  };

  const handleTargetAssetModalToggle = () => {
    setAssetModal({
      currentAsset: targetAsset as AssetKey,
      type: 'target',
      assets: targetAssets, //: new Map(Array.from(assets).filter(([id]) => id !== sourceAsset)),
    });
  };

  const handleAssetModalUpdate: AssetModalUpdateCallback = (type, payload) => {
    if (type === 'source') {
      setSourceAsset(payload as AssetKey);
    } else {
      setTargetAsset(payload as PairedAssetKey);
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
          <Label>{t(`swap-section.zap.prompt`)}</Label>
          <div className="AwiSwapPanel-aside Awi-row">
            <LoadingButton color="primary" onClick={handleExecute} disabled={!canExecute} loading={executing}>
              {t('swap-section.zap.execute')}
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
                    <>{sourceAsset ? sourceAssets.get(sourceAsset).label : t('swap-section.zap.choose-token')}</>
                  </Button>
                  <FormControl variant="standard" fullWidth disabled={loading || executing || !sourceAsset}>
                    <FormLabel htmlFor="sourceValue" className="AwiSwapPanel-sourceAmountLabel">
                      {t('swap-section.zap.you-pay')}
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
                  <Button
                    variant="text"
                    className="AwiSwapPanel-assetToggle"
                    startIcon={
                      loading ? (
                        <Loader progressProps={{ size: 20 }} />
                      ) : (
                        targetAsset && (
                          <AssetIcons
                            ids={targetAsset.split('-').map((m) => m.toLowerCase()) as AssetKey[]}
                            size="large"
                          />
                        )
                      )
                    }
                    disabled={executing}
                    endIcon={<ExpandIcon className="AwiSwapPanel-assetToggleIcon" />}
                    onClick={handleTargetAssetModalToggle}
                  >
                    <>{targetAsset ? targetAssets.get(targetAsset).label : t('swap-section.zap.choose-lp-token')}</>
                  </Button>
                  <FormControl variant="standard" fullWidth disabled={true /* loading || !targetAsset */}>
                    <FormLabel htmlFor="targetValue" className="AwiSwapPanel-targetAmountLabel">
                      <span>{t(`swap-section.zap.${canExecute ? 'you-receive-estimated' : 'you-receive'}`)}</span>
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
