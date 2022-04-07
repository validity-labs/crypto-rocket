// TODO PROROTYPE - all numbers/calculations are only for presentation purpose; proper business logic should be created;
import React, { useCallback, useEffect, useState } from 'react';

import clsx from 'clsx';
import { isEmpty } from 'lodash';

import CloseIcon from '@mui/icons-material/CloseRounded';
import { Modal, Typography, Container, IconButton, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useAppDispatch } from '@/app/hooks';
import { showMessage } from '@/app/state/slices/app';
import ExternalLink from '@/components/general/Link/ExternalLink';
import LoadingButton from '@/components/general/LoadingButton/LoadingButton';
import LoadingText from '@/components/general/LoadingText/LoadingText';
import NumberInput from '@/components/inputs/NumberInput/NumberInput';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatPercent, formatUSD } from '@/lib/formatters';
import { etherscan, sleep } from '@/lib/helpers';
import { AssetKey } from '@/types/app';

const Root = styled(Modal)(({ theme }) => ({
  padding: theme.spacing(10),
  '.MuiTypography-root': {
    fontWeight: 500,
    overflow: 'visible',
  },
  '.AwiOperationModal-container': {
    pointerEvents: 'none',
    position: 'relative',
    height: '100%',
    maxHeight: '100%',
    overflow: 'hidden',
  },
  '.AwiOperationModal-paper': {
    pointerEvents: 'all',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
    // height: '100%',
    maxHeight: '100%',
    // paddingBottom: theme.spacing(5),
    border: `1px solid ${theme.palette.text.active}`,
    borderRadius: +theme.shape.borderRadius,
    backgroundColor: theme.palette.background.light,
    overflow: 'hidden',
  },
  '.AwiOperationModal-header': {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(6, 14, 5, 11),
    borderBottom: `1px solid ${theme.palette.divider}`,
    // margin: theme.spacing(0, 0, 11),
    h2: {
      color: theme.palette.text.secondary,
    },
  },
  '.AwiOperationModal-close': {
    position: 'absolute',
    top: 20,
    right: 17,
  },
  '.AwiOperationModal-content': {
    display: 'flex',
    flexDirection: 'column',
    // gap: theme.spacing(4),
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(10, 14, 10, 11),
    margin: theme.spacing(1, 0, 1),
    '&::-webkit-scrollbar': {
      borderRadius: +theme.shape.borderRadius * 2,
    },
  },

  '.AwiOperationModal-rates': {
    margin: theme.spacing(0, 0, 11),
    '.AwiOperationModal-row': {
      '>div': {
        img: {
          margin: theme.spacing(0, 2, 0, 0),
        },
      },
    },
  },
  '.AwiOperationModal-borrow': {
    margin: theme.spacing(0, 0, 11),
    '.AwiOperationModal-row': {
      '>div': {
        img: {
          margin: theme.spacing(0, 4),
        },
      },
    },
  },
  '.AwiOperationModal-submit': {
    margin: theme.spacing(0, 0, 5),
  },
  '.AwiOperationModal-status': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  '.AwiOperationModal-row': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: theme.spacing(0, 0, 5),
    margin: theme.spacing(0, 0, 5),
    borderBottom: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
    // borderRadius: +theme.shape.borderRadius * 6,
    // backgroundColor: theme.palette.background.transparent,
    '>div': {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    '&.Mui-last': {
      padding: 0,
      margin: 0,
      // marginBottom: theme.spacing(10),
      borderBottom: 'none',
    },
  },
  '.AwiOperationModal-operationTypes': {
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '100%',
    backgroundColor: 'transparent',
    margin: theme.spacing(11, 0, 8),
    '.MuiButton-root': {
      flex: 1,
      borderBottom: `2px solid ${theme.palette.divider}`,
      color: theme.palette.text.secondary,
      '&.Mui-selected': {
        borderBottom: `2px solid ${theme.palette.text.active}`,
        color: theme.palette.text.active,
      },
    },
  },
  '.AwiOperationModal-top': {
    minHeight: 160,
  },
  '.AwiOperationModal-enablePrompt': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    margin: theme.spacing(3, 0, 0),
    img: {
      marginBottom: theme.spacing(6),
    },
  },
  '.AwiOperationModal-operationAmount': {
    padding: theme.spacing(11, 7, 9, 23),
    borderRadius: theme.spacing(7),
    input: {
      fontSize: '3.125rem' /* 50px */,
      lineHeight: '3.125rem' /* 50px */,
      fontWeight: 700,
      textAlign: 'center',
      '&::placeholder': {
        color: theme.palette.text.secondary,
      },
    },
    button: {
      borderRadius: theme.spacing(2),
      ...theme.typography['body-sm'],
      fontWeight: 500,
      color: theme.palette.text.secondary,
      '&:hover': {
        color: theme.palette.text.active,
      },
    },
  },
}));

export interface OperationModalData {
  asset: AssetKey;
  enabled: boolean;
}

interface Props {
  open: boolean;
  close: () => void;
  data: OperationModalData;
}

type OperationType = 'supply' | 'withdraw';

interface AssetBalance {
  walletBalance: number;
  supplyBalance: number;
}

// TODO PROROTYPE
let resError = 0;

export default function OperationModal({ open, close, data /* , info, callback  */ }: Props) {
  const t = usePageTranslation();
  const dispatch = useAppDispatch();
  const [transactionAddress, setTransactionAddress] = useState<string | null>(null);

  const [operationType, setOperationType] = useState<OperationType>('supply');
  const [operationAmount, setOperationAmount] = useState<number | undefined>();

  const [operationBorrow, setOperationBorrow] = useState<{
    borrowLimit: [number, number | undefined];
    borrowLimitUsed: [number, number | undefined];
  }>({
    borrowLimit: [0, undefined],
    borrowLimitUsed: [0, undefined],
  });

  const [balance, setBalance] = useState<AssetBalance>({
    walletBalance: null,
    supplyBalance: null,
  });

  const [apy, setAPY] = useState({
    supply: 0,
    distribution: undefined,
  });

  const [step, setStep] = useState<{
    supply: 'initial' | 'enable' | 'no-balance' | 'insufficient' | 'ready' | 'confirmation' | 'complete' | 'error';
    withdraw: 'initial' | 'no-balance' | 'insufficient' | 'ready' | 'confirmation' | 'complete' | 'error';
  }>({
    supply: 'initial',
    withdraw: 'initial',
  });

  const { asset, enabled: isEnabled } = data;

  useEffect(() => {
    (async () => {
      await sleep(2);
      const newBalance = await new Promise<AssetBalance>((res) => {
        return res({
          walletBalance: 3.44,
          supplyBalance: 0.98,
        });
      });

      setAPY({
        supply: 25.2,
        distribution: undefined,
      });
      setBalance(newBalance);
    })();
  }, [asset]);

  useEffect(() => {
    const validateSupply = () => {
      if (!data.enabled) {
        return 'enable';
      }
      const walletBalance = balance.walletBalance;

      if (walletBalance <= 0) {
        return 'no-balance';
      }

      if (operationAmount > walletBalance) {
        return 'insufficient';
      }

      return 'ready';
    };

    const validateWithdraw = () => {
      const supplyBalance = balance.supplyBalance;

      if (supplyBalance <= 0) {
        return 'no-balance';
      }

      if (operationAmount > supplyBalance) {
        return 'insufficient';
      }

      return 'ready';
    };

    setStep({
      supply: validateSupply(),
      withdraw: validateWithdraw(),
    });
  }, [operationAmount, balance, data]);

  useEffect(() => {
    // const { current, unit, ratio } = borrowInfo[operationType];
    setOperationBorrow({
      borrowLimit: [1.03, operationAmount ? 1.03 * operationAmount : undefined],
      borrowLimitUsed: [0, operationType === 'supply' ? undefined : operationAmount ? 13 : undefined],
    });
  }, [operationType, operationAmount]);

  const handleSubmit = useCallback(async () => {
    setStep((prevStep) => ({ ...prevStep, [operationType]: 'confirmation' }));
    dispatch(
      showMessage({
        message: t('operation-modal.confirm-transaction'),
        alertProps: {
          severity: 'info',
        },
      })
    );
    const res = await new Promise<{ error: boolean; msg: string }>((res) =>
      // TODO PROTOTYPE
      setTimeout(() => {
        console.log(asset);
        res({ error: !resError++, msg: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' });
      }, 4000)
    );
    if (res.error) {
      setStep((prevStep) => ({ ...prevStep, [operationType]: 'error' }));
      dispatch(
        showMessage({
          message: t('operation-modal.confirm-error'),
          alertProps: {
            severity: 'error',
          },
        })
      );
    } else {
      setTransactionAddress(res.msg);
      setStep((prevStep) => ({ ...prevStep, [operationType]: 'complete' }));
      setOperationAmount(0);
      // callback(asset);
      dispatch(
        showMessage({
          message: t('operation-modal.confirm-success'),
          alertProps: {
            severity: 'success',
          },
        })
      );
    }
  }, [asset, t, dispatch, operationType /* , callback */]);

  const handleOperationTypeChange = (event: React.MouseEvent<HTMLElement>) => {
    // @ts-ignore
    setOperationType(event.target.value);
  };

  const [isSupplying, isWithdrawing] = [operationType === 'supply', operationType === 'withdraw'];
  const handleOperationAmountMaxClick = () => {
    setOperationAmount(isSupplying ? balance.walletBalance : balance.supplyBalance);
  };

  const handleOperationAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = +event.target.value;
    setOperationAmount(newValue);
  };

  const { walletBalance, supplyBalance } = balance;
  const operationBalance = isSupplying ? walletBalance : supplyBalance;
  const assetLabel = asset.toUpperCase();
  const isOperational =
    ['initial', 'no-balance', 'insufficient'].indexOf(step[operationType]) === -1 &&
    (operationAmount > 0 || step[operationType] === 'enable');

  const isError = step[operationType] === 'error';
  const isProcessing = step[operationType] === 'confirmation';
  const isCompleted = step[operationType] === 'complete';
  return (
    <Root
      open={open}
      onClose={close}
      aria-labelledby="operationModalTitle"
      aria-describedby="operationModalDescription"
    >
      <Container maxWidth="sm" className="AwiOperationModal-container">
        <div className="AwiOperationModal-paper">
          <div className="AwiOperationModal-header">
            <Typography component="h2" color="text.active" id="operationModalTitle">
              {t(`operation-modal.${operationType}.title`, { asset: assetLabel })}
            </Typography>
            <IconButton
              size="small"
              title={t('common:common.close-modal')}
              aria-label={t('common:common.close-modal')}
              className="AwiOperationModal-close"
              onClick={close}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <div className="AwiOperationModal-content">
            <div className="AwiOperationModal-top">
              {isSupplying && !isEnabled && (
                <div className="AwiOperationModal-enablePrompt">
                  <img src={`/images/assets/${asset}.svg`} alt="" width="60" height="60" />
                  <Typography variant="body-md" color="text.primary">
                    {t(`operation-modal.supply.enable-prompt`)}
                  </Typography>
                </div>
              )}
              {(isEnabled || isWithdrawing) && (
                <NumberInput
                  id="operationAmount"
                  name="operationAmount"
                  className="AwiOperationModal-operationAmount"
                  disabled={isProcessing}
                  inputProps={
                    {
                      // isAllowed: (value) => validateOperationAmount(value.floatValue),
                    }
                  }
                  placeholder="0"
                  value={operationAmount}
                  onChange={handleOperationAmountChange}
                  endAdornment={
                    <Button variant="text" size="small" onClick={handleOperationAmountMaxClick}>
                      {t('operation-modal.max')}
                    </Button>
                  }
                />
              )}
            </div>
            <div className="AwiOperationModal-operationTypes" aria-label={t(`operation-modal.operation-switch-hint`)}>
              <Button
                variant="text"
                disabled={isProcessing}
                value="supply"
                className={clsx({ 'Mui-selected': isSupplying })}
                onClick={handleOperationTypeChange}
              >
                {t(`operation-modal.supply.cta`)}
              </Button>
              <Button
                variant="text"
                disabled={isProcessing}
                value="withdraw"
                className={clsx({ 'Mui-selected': isWithdrawing })}
                onClick={handleOperationTypeChange}
              >
                {t(`operation-modal.withdraw.cta`)}
              </Button>
            </div>
            <div className="AwiOperationModal-rates">
              <ExternalLink
                href={'https://todo'}
                text={t(`operation-modal.supply-rates`)}
                variant="body-sm"
                fontWeight={500}
                mb={5}
              />
              <div className="AwiOperationModal-row">
                <div className="Awi-row">
                  <img src={`/images/assets/${asset}.svg`} alt="" width="32" height="32" />
                  <Typography color="inherit">{t(`operation-modal.supply-apy`)}</Typography>
                </div>
                <Typography color="inherit">{formatPercent(apy.supply)}</Typography>
              </div>
              <div className="AwiOperationModal-row Mui-last">
                <div className="Awi-row">
                  <img src={`/images/assets/compound.svg`} alt="" width="32" height="32" />
                  <Typography color="inherit">{t(`operation-modal.distribution-apy`)}</Typography>
                </div>
                <Typography color="inherit">{formatPercent(apy.distribution)}</Typography>
              </div>
            </div>
            {(isEnabled || isWithdrawing) && (
              <div className="AwiOperationModal-borrow">
                <Typography variant="body-sm" fontWeight={500} mb={5}>
                  {t(`operation-modal.borrow-limit-title`)}
                </Typography>
                <div className="AwiOperationModal-row">
                  <Typography color="inherit">{t(`operation-modal.borrow-limit`)}</Typography>
                  <div>
                    <Typography color="inherit">{formatUSD(operationBorrow.borrowLimit[0])}</Typography>
                    {operationBorrow.borrowLimit[1] && (
                      <>
                        <img src="/images/icons/arrow-right.svg" alt="" width="20" height="20" />
                        <Typography color="inherit">{formatUSD(operationBorrow.borrowLimit[1])}</Typography>
                      </>
                    )}
                  </div>
                </div>
                <div className="AwiOperationModal-row Mui-last">
                  <Typography color="inherit">{t(`operation-modal.borrow-limit-used`)}</Typography>
                  <div>
                    <Typography color="inherit">{formatPercent(operationBorrow.borrowLimitUsed[0])}</Typography>
                    {operationBorrow.borrowLimitUsed[1] && (
                      <>
                        <img src="/images/icons/arrow-right.svg" alt="" width="20" height="20" />
                        <Typography color="inherit">{formatPercent(operationBorrow.borrowLimitUsed[1])}</Typography>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
            <LoadingButton
              className="AwiOperationModal-submit"
              once
              disabled={!isOperational}
              loading={isProcessing}
              done={isCompleted}
              variant="outlined"
              color="primary"
              onClick={handleSubmit}
            >
              {t(`operation-modal.${operationType}.step.${step[operationType]}`)}
            </LoadingButton>
            {isCompleted && (
              <ExternalLink
                variant="body-sm"
                href={etherscan(transactionAddress)}
                text={t(`operation-modal.view-on-etherscan`)}
                mb={5}
                justifyContent="center"
              />
            )}
            {isError && (
              <Typography color="error" textAlign="center" mb={5}>
                {t(`operation-modal.confirm-error-prompt`)}
              </Typography>
            )}
            <div className="AwiOperationModal-status">
              <Typography variant="body-sm" fontWeight={500}>
                {t(`operation-modal.${operationType === 'supply' ? 'wallet-balance' : 'currently-supplying'}`)}
              </Typography>
              <Typography variant="body-sm" fontWeight={500} color="text.primary">
                <LoadingText loading={operationBalance === null} text={operationBalance} />
                {` ${assetLabel}`}
              </Typography>
            </div>
          </div>
        </div>
      </Container>
    </Root>
  );
}
