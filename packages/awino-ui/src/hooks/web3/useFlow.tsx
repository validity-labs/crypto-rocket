import { useEffect, useMemo, useReducer } from 'react';

import { Trans } from 'next-i18next';

import { AlertColor } from '@mui/material';

import { useAppDispatch } from '@/app/hooks';
import { blockchainTransactionExplorerUrl } from '@/lib/helpers';
import { Address } from '@/types/app';

import usePageTranslation from '../usePageTranslation';
import useSnack from '../useSnack';

type Step = 'initial' | 'validate' | 'approve' | 'send' | 'complete' | 'error';
type CompletePayload = { hash: Address };
type StepAction = { type: Step; payload?: CompletePayload };

interface StepState {
  step: Step;
  prevStep: null | Step;
  payload: null | CompletePayload;
  is: {
    validating: boolean;
    approving: boolean;
    sending: boolean;
    completed: boolean;
    error: boolean;
    processing: boolean;
  };
}

const defaultStepState: StepState = {
  step: 'initial',
  prevStep: null,
  payload: null,
  is: {
    validating: false,
    approving: false,
    sending: false,
    completed: false,
    error: false,
    processing: false,
  },
};

function reducer(state: StepState, action: StepAction) {
  const { type, payload = null } = action;

  const newState = {
    ...defaultStepState,
    step: type,
    prevStep: state.step,
    payload,
  };

  switch (type) {
    case 'validate':
      return {
        ...newState,
        is: {
          ...newState.is,
          validating: true,
          processing: true,
        },
      };
    case 'approve':
      return {
        ...newState,
        is: {
          ...newState.is,
          approving: true,
          processing: true,
        },
      };
    case 'send':
      return {
        ...newState,
        is: {
          ...newState.is,
          sending: true,
          processing: true,
        },
      };
    case 'complete':
      return {
        ...newState,
        is: {
          ...newState.is,
          completed: true,
          processing: false,
        },
      };
    case 'error':
      return {
        ...newState,
        is: {
          ...newState.is,
          processing: false,
          error: true,
        },
      };
    default:
      throw new Error(`useFlow: unknown action type "${type}"`);
  }
}

const snackColors: Partial<Record<Step, AlertColor>> = {
  error: 'error',
  complete: 'success',
};

export const useFlow = (i18nKey: string) => {
  const t = usePageTranslation({ keyPrefix: i18nKey });
  const snack = useSnack();

  const [{ prevStep, step, payload, is: flowState }, setStep] = useReducer(reducer, defaultStepState);

  useEffect(() => {
    let key: string = `flow.${step}`;

    const isError = step === 'error';
    // update key to include previous step on error
    if (isError) {
      key = `${key}-${prevStep}`;
    }

    // get translation text if exist
    let textOrNode: React.ReactNode = t(key, '');

    if (step === 'complete') {
      // custom jsx node on complete to show transaction link
      textOrNode = (
        <Trans
          i18nKey={key}
          t={t}
          components={[
            <a key="link" target="_blank" rel="noreferrer" href={blockchainTransactionExplorerUrl(payload.hash)} />,
          ]}
        />
      );
    }

    // show message if textOrNode exist
    if (textOrNode) {
      snack(textOrNode, snackColors[step] || 'info');
    }
  }, [step, prevStep, snack, t, payload]);

  const flow = useMemo(
    () => ({
      validate: () => setStep({ type: 'validate' }),
      approve: () => setStep({ type: 'approve' }),
      send: () => setStep({ type: 'send' }),
      complete: (payload: CompletePayload) => {
        setStep({ type: 'complete', payload });
      },
      error: (/* message?: string */) => {
        setStep({ type: 'error' });
      },
    }),
    [setStep]
  );

  return { flow, flowState };
};
