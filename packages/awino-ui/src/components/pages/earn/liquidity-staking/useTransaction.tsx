import { useReducer } from 'react';

import { Address } from '@/types/app';

type Step = 'initial' | 'confirmation' | 'complete' | 'invalid' | 'error';
type StepAction = { type: Step; payload?: any };
interface StepState {
  step: Step;
  isProcessing: boolean;
  isCompleted: boolean;
  isError: boolean;
  isValid: boolean;
  address: Address | null;
}

const defaultStepState: StepState = {
  step: 'initial',
  isProcessing: false,
  isCompleted: false,
  isError: false,
  isValid: true,
  address: null,
};

function reducer(_state: StepState, action: StepAction) {
  const { type, payload } = action;
  const newState = {
    ...defaultStepState,
    step: type,
  };
  switch (type) {
    case 'invalid':
      return {
        ...newState,
        isValid: false,
      };
    case 'confirmation':
      return {
        ...newState,
        isProcessing: true,
      };
    case 'complete':
      return {
        ...newState,
        isCompleted: true,
        address: payload.address,
      };
    case 'error':
      return {
        ...newState,
        isError: true,
      };
    default:
      throw new Error('OperationSection stake step reducer');
  }
}

export const useTransaction = (defaultState = defaultStepState) => {
  // const [transactionAddress, setTransactionAddress] = useState<string | null>(null);
  const [{ /* step, */ isProcessing, isCompleted, isValid, isError, address }, setStep] = useReducer(
    reducer,
    defaultState
  );

  return {
    isProcessing,
    isCompleted,
    isValid,
    isError,
    address,
    setStep,
  };
};
