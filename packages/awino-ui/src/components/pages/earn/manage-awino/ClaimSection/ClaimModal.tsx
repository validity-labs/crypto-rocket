import React, { useCallback, useReducer, useState } from 'react';

import CloseIcon from '@mui/icons-material/CloseRounded';
import { Modal, Typography, Container, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useAppDispatch } from '@/app/hooks';
import { showMessage } from '@/app/state/slices/app';
import ExternalLink from '@/components/general/Link/ExternalLink';
import LoadingButton from '@/components/general/LoadingButton/LoadingButton';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatPercent, formatUSD } from '@/lib/formatters';
import { etherscan } from '@/lib/helpers';
import { AssetKey } from '@/types/app';

const Root = styled(Modal)(({ theme }) => ({
  padding: theme.spacing(10),
  '.MuiTypography-root': {
    overflow: 'visible',
  },
  '.AwiClaimModal-container': {
    pointerEvents: 'none',
    position: 'relative',
    height: '100%',
    maxHeight: '100%',
    overflow: 'hidden',
  },
  '.AwiClaimModal-paper': {
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
    paddingBottom: theme.spacing(5),
    border: `1px solid ${theme.palette.text.active}`,
    borderRadius: +theme.shape.borderRadius,
    backgroundColor: theme.palette.background.light,
    overflow: 'hidden',
  },
  '.AwiClaimModal-header': {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(8, 14, 5, 11),
  },
  '.AwiClaimModal-close': {
    position: 'absolute',
    top: 20,
    right: 17,
  },
  '.AwiClaimModal-content': {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(5, 14, 11, 11),
    '&::-webkit-scrollbar': {
      borderRadius: +theme.shape.borderRadius * 2,
    },
  },

  '.AwiExternalLink-root': {
    justifyContent: 'center',
  },
}));

export interface ClaimModalData {
  asset: AssetKey;
  stage: 'enable' | 'disable';
}

interface Props {
  open: boolean;
  close: () => void;
  data: ClaimModalData;
  // info: CollateralInfo;
  callback: (asset: AssetKey) => void;
}

// TODO PROROTYPE
let resError = 0;

type Step = 'initial' | 'confirmation' | 'complete' | 'error';

interface StepState {
  step: Step;
  isProcessing: boolean;
  isCompleted: boolean;
  isError: boolean;
}

const defaultStepState: StepState = {
  step: 'initial',
  isProcessing: false,
  isCompleted: false,
  isError: false,
};

function reducer(_state: StepState, actionType: Step) {
  const newState = {
    ...defaultStepState,
    step: actionType,
  };
  switch (actionType) {
    case 'confirmation':
      return {
        ...newState,
        isProcessing: true,
      };
    case 'complete':
      return {
        ...newState,
        isCompleted: true,
      };
    case 'error':
      return {
        ...newState,
        isError: true,
      };
    default:
      throw new Error('ClaimModal step reducer');
  }
}

export default function ClaimModal({ open, close, data, callback }: Props) {
  const t = usePageTranslation();
  const dispatch = useAppDispatch();
  const [transactionAddress, setTransactionAddress] = useState<string | null>(null);
  const [{ /* step, */ isProcessing, isCompleted, isError }, setStep] = useReducer(reducer, defaultStepState);
  const { asset } = data;

  const handleSubmit = useCallback(async () => {
    setStep('confirmation');
    dispatch(
      showMessage({
        message: t('claim-modal.confirm-transaction'),
        alertProps: {
          severity: 'info',
        },
      })
    );
    const res = await new Promise<{ error: boolean; msg: string }>((res) =>
      // TODO PROTOTYPE
      setTimeout(() => {
        res({ error: !resError++, msg: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' });
      }, 4000)
    );

    if (res.error) {
      setStep('error');
      dispatch(
        showMessage({
          message: t('claim-modal.confirm-error'),
          alertProps: {
            severity: 'error',
          },
        })
      );
    } else {
      setTransactionAddress(res.msg);

      setStep('complete');
      callback(asset);
      dispatch(
        showMessage({
          message: t('claim-modal.confirm-success'),
          alertProps: {
            severity: 'success',
          },
        })
      );
    }
  }, [asset, t, dispatch, callback]);

  return (
    <Root
      open={open}
      onClose={close}
      aria-labelledby="collateralModalTitle"
      aria-describedby="collateralModalDescription"
    >
      <Container maxWidth="sm" className="AwiClaimModal-container">
        <div className="AwiClaimModal-paper">
          <div className="AwiClaimModal-header">
            <Typography variant="h3" component="h2" color="text.active" id="collateralModalTitle">
              {t(`claim-modal.title`)}
            </Typography>
            <IconButton
              size="small"
              title={t('common:common.close-modal')}
              aria-label={t('common:common.close-modal')}
              className="AwiClaimModal-close"
              onClick={close}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <div className="AwiClaimModal-content">
            <Typography color="text.primary" mb={4} id="collateralModalDescription">
              {t(`claim-modal.description`)}
            </Typography>
            <LoadingButton
              once
              loading={isProcessing}
              done={isCompleted}
              variant="outlined"
              color="primary"
              onClick={handleSubmit}
            >
              {t(`claim-modal.cta${isCompleted ? '-done' : ''}`, { asset: asset.toUpperCase() })}
            </LoadingButton>
            {isCompleted && (
              <ExternalLink
                variant="body-sm"
                href={etherscan(transactionAddress)}
                text={t('common:common.view-on-etherscan')}
              />
            )}
            {isError && (
              <Typography color="error" textAlign="center">
                {t(`claim-modal.confirm-error-prompt`)}
              </Typography>
            )}
          </div>
        </div>
      </Container>
    </Root>
  );
}
