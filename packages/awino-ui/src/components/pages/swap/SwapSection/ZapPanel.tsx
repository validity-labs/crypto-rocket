import React, { useCallback, useEffect, useState } from 'react';

import clsx from 'clsx';

import { Button, FormControl, FormHelperText, FormLabel, Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { styled } from '@mui/material/styles';

import Label from '@/components/general/Label/Label';
import LabelValue from '@/components/general/LabelValue/LabelValue';
import LoadingButton from '@/components/general/LoadingButton/LoadingButton';
import Select from '@/components/general/Select/Select';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatAmount } from '@/lib/formatters';
import { ID } from '@/types/app';

import NumberInput from './NumberInput';

const Root = styled('div')(({ theme }) => ({
  '.AwiZapPanel-header': {
    '.AwiZapPanel-aside': {
      flex: 1,
      textAlign: 'end',
    },
  },
  '.AwiZapPanel-content': {
    '.info': {
      width: '100%',
      padding: theme.spacing(0, 10),
      '.label-value': {
        display: 'flex',
        justifyContent: 'space-between',
        margin: theme.spacing(0, 0, 3),
        '.value': {
          textAlign: 'end',
        },
        '.label, .value': {
          fontSize: '0.875rem' /* 14px */,
          fontWeight: 400,
          color: theme.palette.text.secondary,
        },
      },
    },
    '.source__amount-label, .target__amount-label': {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      margin: theme.spacing(0, 0, 3),
      ...theme.typography.body,
    },
    '.source__amount-max': {
      padding: theme.spacing(1, 3),
      border: `1px solid ${theme.palette.text.secondary}`,
      ...theme.typography['body-sm'],
      color: theme.palette.text.secondary,
      '&:hover': {
        color: theme.palette.text.primary,
      },
      '.help-text': {
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
    '.source, .target': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing(11, 8, 12),
    },
    '.source': {
      paddingRight: theme.spacing(22),
    },
    '.target': {
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
      '&.active': {
        backgroundColor: theme.palette.background.transparent,
        // 'rgba(98,98,98,0.04)',
      },
    },
  },

  [theme.breakpoints.up('md')]: {
    '.AwiZapPanel-content': {
      '.target': {
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
  assets: Map<string, { id: string; label: string }>;
}

const ZapPanel = (props: TabPanelProps) => {
  const t = usePageTranslation();
  const { id, value, index, assets, loading, ...other } = props;

  const [type, setType] = useState<TypeKeys>('market');
  const [executing, setExecuting] = useState(false);
  const [sourceAsset, setSourceAsset] = useState('');
  const [sourceValue, setSourceValue] = useState(null);
  const [targetAsset, setTargetAsset] = useState('');
  const [targetValue, setTargetValue] = useState(null);
  const [canExecute, setCanExecute] = useState(false);
  const [info, setInfo] = useState(null);
  const [sourceMaxValue, setSourceMaxValue] = useState(0);

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
    if (sourceAsset && targetAsset && sourceValue && targetValue) {
      setCanExecute(true);
    }
  }, [sourceAsset, targetAsset, sourceValue, targetValue]);

  const handleExecute = useCallback(() => {
    if (sourceAsset && targetAsset && sourceValue && targetValue) {
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

  return (
    <Root
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${id}-${index}`}
      aria-labelledby={`tab-${id}-${index}`}
      {...other}
    >
      <div className="AwiZapPanel-header">
        <Label>{t(`swap-section.zap.prompt`)}</Label>
        <ToggleButtonGroup
          value={type}
          exclusive
          onChange={handleType}
          aria-label={t(`swap-section.swap.trading-type-hint`)}
        >
          <ToggleButton value="market">{t(`swap-section.swap.market`)}</ToggleButton>
          <ToggleButton value="limit">{t(`swap-section.swap.limit`)}</ToggleButton>
        </ToggleButtonGroup>
        <div className="AwiZapPanel-aside">
          <LoadingButton color="primary" onClick={handleExecute} disabled={!canExecute} loading={executing}>
            {t('swap-section.swap.execute')}
          </LoadingButton>
        </div>
      </div>
      <div className="AwiZapPanel-content">
        <div className="sub-panel">
          <Grid container>
            <Grid item xs={12} md={6}>
              <div className="source">
                <Select
                  id="assetSource"
                  mb={3}
                  value={sourceAsset}
                  setValue={setSourceAsset}
                  items={assets}
                  disabled={executing}
                  loading={loading}
                />
                <FormControl variant="standard" fullWidth disabled={loading || executing || !sourceAsset}>
                  <FormLabel htmlFor="sourceValue" className="source__amount-label">
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
                      <Button variant="outlined" onClick={handleSourceMax} className="source__amount-max">
                        {t('swap-section.swap.max')}
                      </Button>
                    }
                  />
                  <FormHelperText className="helper-text" variant="standard" />
                </FormControl>
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className={clsx('target', { active: canExecute })}>
                <Select
                  id="assetTarget"
                  mb={3}
                  value={targetAsset}
                  setValue={setTargetAsset}
                  items={assets}
                  disabled={executing}
                  loading={loading}
                />
                <FormControl variant="standard" fullWidth disabled={true /* loading || !targetAsset */}>
                  <FormLabel htmlFor="targetValue" className="target__amount-label">
                    <span>{t(`swap-section.swap.${canExecute ? 'you-receive-estimated' : 'you-receive'}`)}</span>
                  </FormLabel>
                  <NumberInput
                    id="targetValue"
                    name="targetValue"
                    value={targetValue} /* onChange={handleTargetChange} */
                  />
                  <FormHelperText className="help-text">
                    <span>{t('swap-section.swap.price')}</span>
                    {canExecute && (
                      <span>
                        {t('swap-section.swap.ratio-per', {
                          value: targetValue,
                          target: assets.get(targetAsset).label,
                          source: assets.get(sourceAsset).label,
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
              <div className="info">
                <LabelValue
                  id="minimumReceived"
                  className="label-value"
                  value={formatAmount(info.liquidityProviderFee, { postfix: assets.get(sourceAsset).label })}
                  labelProps={{
                    children: t('swap-section.swap.minimum-received.title'),
                    tooltip: t('swap-section.swap.minimum-received.hint'),
                  }}
                />
                <LabelValue
                  id="priceImpact"
                  className="label-value"
                  sx={{ '&.label-value .value': { color: 'success.main' } }}
                  value={info.priceImpact}
                  labelProps={{
                    children: t('swap-section.swap.price-impact.title'),
                    tooltip: t('swap-section.swap.price-impact.hint'),
                  }}
                />
                <LabelValue
                  id="liquidityProviderFee"
                  className="label-value"
                  value={formatAmount(info.liquidityProviderFee, { postfix: assets.get(targetAsset).label })}
                  labelProps={{
                    children: t('swap-section.swap.liquidity-provider-fee.title'),
                    tooltip: t('swap-section.swap.liquidity-provider-fee.hint'),
                  }}
                />
                <LabelValue
                  id="route"
                  className="label-value"
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
  );
};

export default ZapPanel;
