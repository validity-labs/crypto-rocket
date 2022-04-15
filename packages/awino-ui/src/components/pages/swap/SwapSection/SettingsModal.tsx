import React, { useMemo, useRef, useState } from 'react';

import { useUpdateEffect } from 'react-use';

import clsx from 'clsx';
import { debounce } from 'lodash';

import { FormControl, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useAppDispatch } from '@/app/hooks';
import { showMessage } from '@/app/state/slices/app';
import Label from '@/components/general/Label/Label';
import Modal from '@/components/general/Modal/Modal';
import NumberInput from '@/components/inputs/NumberInput/NumberInput';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatPercent } from '@/lib/formatters';

const Root = styled(Modal)(({ theme }) => ({
  '.MuiInputBase-root': {
    padding: theme.spacing(2.5, 3.5, 2, 7),
    ...theme.typography['body-sm'],
  },
  '.AwiSettingsModal-slippageTolerance': {
    '.Awi-row': {
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: theme.spacing(2.5),
    },
    '.MuiToggleButtonGroup-root': {
      flexWrap: 'wrap',
    },
    '.MuiToggleButton-root': {
      ...theme.typography['body-sm'],
      whiteSpace: 'nowrap',
      '&.Mui-selected': {
        outline: `2px solid ${theme.palette.success.light}`,
        outlineOffset: -2,
      },
    },
    '.Awi-active': {
      color: theme.palette.text.active,
      outline: `2px solid ${theme.palette.success.light}`,
      outlineOffset: -2,
    },
  },
  '.AwiSettingsModal-transactionDeadline': {
    margin: theme.spacing(6, 0, 0),
  },
}));

const slippageToleranceList = [0.1, 0.5, 1];

export interface SettingsModalData {
  slippageTolerance: number;
  transactionDeadline: number;
}

export type SettingsModalUpdateCallback<T = void> = (
  type: 'slippage-tolerance' | 'transaction-deadline',
  payload: number
) => T;

interface Props {
  open: boolean;
  close: () => void;
  data: SettingsModalData;
  updateCallback: SettingsModalUpdateCallback<Promise<void>>;
}

export default function SettingsModal({ open, close, data, updateCallback }: Props) {
  const t = usePageTranslation({ keyPrefix: 'settings-modal' });
  const dispatch = useAppDispatch();

  const [slippageTolerance, setSlippageTolerance] = useState(data.slippageTolerance);
  const [transactionDeadline, setTransactionDeadline] = useState(data.transactionDeadline);

  const handleUpdateCallback = useRef(
    debounce(async (type: 'slippage-tolerance' | 'transaction-deadline', payload: number) => {
      await updateCallback(type, payload);
      dispatch(
        showMessage({
          message: t(`${type}.updated`, { v: payload }),
        })
      );
    }, 500)
  ).current;

  useUpdateEffect(() => {
    handleUpdateCallback('slippage-tolerance', slippageTolerance);
  }, [slippageTolerance, handleUpdateCallback]);

  const handleSlippageToleranceChange = (event: React.MouseEvent<HTMLElement>, newValue: number) => {
    setSlippageTolerance(newValue);
  };

  const handleSlippageToleranceInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSlippageTolerance(+event.target.value);
  };

  const slippageToleranceMatched = useMemo(() => {
    return slippageToleranceList.indexOf(slippageTolerance) !== -1;
  }, [slippageTolerance]);

  useUpdateEffect(() => {
    handleUpdateCallback('transaction-deadline', transactionDeadline);
  }, [transactionDeadline, handleUpdateCallback]);

  const handleTransactionDeadlineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTransactionDeadline(+event.target.value);
  };

  return (
    <Root id="settings" title={t(`title`)} open={open} close={close}>
      <FormControl className="AwiSettingsModal-slippageTolerance">
        <Label component="label" htmlFor="slippageTolerance" tooltip={t('slippage-tolerance.title-hint')} mb={4}>
          {t('slippage-tolerance.title')}
        </Label>
        <div className="Awi-row">
          <ToggleButtonGroup
            exclusive
            value={slippageTolerance}
            onChange={handleSlippageToleranceChange}
            aria-label={t(`slippage-tolerance.value-hint`)}
          >
            {slippageToleranceList.map((item, itemIndex) => (
              <ToggleButton key={itemIndex} value={item}>
                {formatPercent(item)}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <NumberInput
            id="slippageTolerance"
            name="slippageTolerance"
            className={clsx({ 'Awi-active': !slippageToleranceMatched })}
            value={slippageTolerance}
            onChange={handleSlippageToleranceInputChange}
            endAdornment="%"
          />
        </div>
      </FormControl>
      <FormControl className="AwiSettingsModal-transactionDeadline">
        <Label component="label" htmlFor="transactionDeadline" tooltip={t('transaction-deadline.title-hint')} mb={4}>
          {t('transaction-deadline.title')}
        </Label>
        <NumberInput
          id="transactionDeadline"
          name="transactionDeadline"
          value={transactionDeadline}
          onChange={handleTransactionDeadlineChange}
          inputProps={{
            decimalScale: 0,
          }}
          endAdornment={t('transaction-deadline.minutes')}
        />
      </FormControl>
    </Root>
  );
}
