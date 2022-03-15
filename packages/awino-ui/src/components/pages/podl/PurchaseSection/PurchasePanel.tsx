import React, { useCallback, useMemo, useState } from 'react';

import BigNumber from 'bignumber.js';

import { Button, FormControl, FormHelperText, FormLabel, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import Label from '@/components/general/Label/Label';
import SwappingImage from '@/components/general/SwappingImage/SwappingImage';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatAmount } from '@/lib/formatters';

import Panel from '../../../general/Panel/Panel';
import NumberInput from '../../swap/SwapSection/NumberInput';

import { PodlPurchaseData } from './PurchaseSection';

const Root = styled(Panel)(({ theme }) => ({
  '.minimum': {
    marginBottom: theme.spacing(9),
    fontSize: '0.875rem' /* 14px */,
    color: theme.palette.text.primary,
  },
  '.convertor': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(11.5),
    label: {
      marginBottom: theme.spacing(3),
    },
    '.equal': {
      padding: theme.spacing(0, 5),
      ...theme.typography.h7,
      lineHeight: '66px',
      overflow: 'hidden',
    },
  },
  '.adornment': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.typography.body,
    fontSize: '1.4375rem' /* 23px */,
    fontWeight: 500,
    img: {
      width: 42,
      height: 42,
      marginRight: theme.spacing(2),
    },
  },
  '.actions': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(5),
  },
  '.output': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(3, 3.5, 3, 7),
    borderRadius: +theme.shape.borderRadius * 2,
    backgroundColor: theme.palette.background.transparent,
  },
  [theme.breakpoints.up('md')]: {
    '.convertor': {
      display: 'flex',
      flexDirection: 'row',
      justifyzContent: 'center',
      alignItems: 'flex-end',
    },
  },
}));
interface Props {
  data: PodlPurchaseData;
}

export default function PurchasePanel({ data }: Props) {
  const t = usePageTranslation();
  const { source, sourceLabel, maxSource, target, targetLabel, rate } = data;

  const [sourceValue, setSourceValue] = useState('0');
  const [error, setError] = useState(false);
  const [can, setCan] = useState({
    approve: false,
    createContract: false,
  });

  const handleApprove = useCallback(() => {
    console.log('approve');
  }, []);

  const handleContractCreate = useCallback(() => {
    console.log('create contract');
  }, []);

  const handleSourceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSourceValue(event.target.value);
  };

  const targetValue = useMemo(() => {
    const newSourceValue = new BigNumber(sourceValue || 0);
    const newValue = rate.multipliedBy(newSourceValue);
    // TODO WIP When final logic is clear update all checks in this component
    const hasError = newSourceValue.gt(maxSource);

    setCan({
      approve: !hasError,
      createContract: !hasError,
    });

    setError(hasError);
    return newValue;
  }, [sourceValue, maxSource, rate]);

  return (
    <Root>
      <div className="header">
        <Label id="purchaseTitle" className="label" component="h2" tooltip={t(`purchase-section.purchase.title-hint`)}>
          {t(`purchase-section.purchase.title`, { from: sourceLabel, to: targetLabel })}
        </Label>
      </div>
      <div className="content">
        <Typography className="minimum">
          {t(`purchase-section.purchase.info`, { from: sourceLabel, to: targetLabel, price: rate })}
        </Typography>
        <div className="convertor">
          <FormControl variant="standard" fullWidth error={error} /* disabled={loading || executing || !sourceAsset} */>
            <FormLabel htmlFor="sourceValue">
              {t('purchase-section.purchase.source-label', { from: sourceLabel })}
            </FormLabel>
            <NumberInput
              id="sourceValue"
              name="sourceValue"
              inputProps={
                {
                  // isAllowed: (value) => validateSourceValue(value.floatValue),
                }
              }
              value={sourceValue}
              onChange={handleSourceChange}
              endAdornment={
                <div className="adornment">
                  <img src={`/images/icons/${source}.svg`} alt="" />
                  <span>{t(`common.${source}`, { ns: 'common' })}</span>
                </div>
              }
            />
            <FormHelperText className="helper-text" variant="standard" />
          </FormControl>
          <Typography className="equal">=</Typography>
          <div className="output">
            <Typography variant="body-md" color="text.primary">
              {formatAmount(targetValue)}
            </Typography>
            <SwappingImage source={source} target={target} />
            <Typography variant="body-md" color="text.primary">
              {t(`common.${target}`, { ns: 'common' })}
            </Typography>
          </div>
        </div>
        <div className="actions">
          <Button variant="outlined" onClick={handleApprove} disabled={error || !can.approve}>
            {t(`purchase-section.purchase.approve`)}
          </Button>
          <Button onClick={handleContractCreate} disabled={error || !can.createContract}>
            {t(`purchase-section.purchase.create-proposal`)}
          </Button>
        </div>
      </div>
    </Root>
  );
}
