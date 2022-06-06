import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Step, StepProgress, StepProgressBar, useStepProgress, withStepProgress } from 'react-stepz';

import BigNumber from 'bignumber.js';
import { isAddress } from 'web3-utils';

import { Box, Button, CircularProgress, Typography } from '@mui/material';

import Modal from '@/components/general/Modal/Modal';
import usePageTranslation from '@/hooks/usePageTranslation';

import { ProposalTransaction } from './CreateProposalSection';
import ProposalTransactionForm from './ProposalTransactionForm';
// import StepProgress from './StepProgress';
// import { Vote } from './VoteCard';

// interface VoteModalProps {
//   show: boolean;
//   onHide: () => void;
//   onVote: () => void;
//   isLoading: boolean;
//   proposalId: string | undefined;
//   availableVotes: number | undefined;
//   vote: Vote | undefined;
// }

interface ProposalTransactionModalProps {
  show: boolean;
  onHide: () => void;
  onProposalTransactionAdded: (transaction: ProposalTransaction) => void;
}

const ProposalTransactionModal = ({ show, onHide, onProposalTransactionAdded }: ProposalTransactionModalProps) => {
  const t = usePageTranslation({ keyPrefix: 'proposal-transaction-form' });

  // // const { t } = useTranslation();
  // const [address, setAddress] = useState('');
  // const [abi, setABI] = useState(); /* Interface */
  // const [value, setValue] = useState('');
  // const [func, setFunction] = useState('');
  // const [args, setArguments] = useState<string[]>([]);

  // const [isABIUploadValid, setABIUploadValid] = useState<boolean>();
  // const [abiFileName, setABIFileName] = useState<string | undefined>('');

  // const addressValidator = (s: string) => {
  //   if (!isAddress(s)) {
  //     return false;
  //   }
  //   // To avoid blocking stepper progress, do not `await`
  //   populateABIIfExists(s);
  //   return true;
  // };

  // const valueValidator = (v: string) => !v || !new BigNumber(v).isNaN();

  // const argumentsValidator = (a: string[]) => {
  //   if (!func) {
  //     return true;
  //   }

  //   try {
  //     return true;
  //     // return !!abi?._encodeParams(abi?.functions[func]?.inputs, args);
  //   } catch {
  //     return false;
  //   }
  // };

  // // const setArgument = (index: number, value: string) => {
  // //   const values = [...args];
  // //   values[index] = value;
  // //   setArguments(values);
  // // };

  // let abiErrorTimeout: NodeJS.Timeout;
  // // const setABIInvalid = () => {
  // //   setABIUploadValid(false);
  // //   setABIFileName(undefined);
  // //   abiErrorTimeout = setTimeout(() => {
  // //     setABIUploadValid(undefined);
  // //   }, 5_000);
  // // };

  // // const validateAndSetABI = (file: File | undefined) => {
  // //   if (abiErrorTimeout) {
  // //     clearTimeout(abiErrorTimeout);
  // //   }
  // //   if (!file) {
  // //     return;
  // //   }

  // //   const reader = new FileReader();
  // //   reader.onload = async (e) => {
  // //     try {
  // //       const abi = e?.target?.result?.toString() ?? '';
  // //       setABI(new Interface(JSON.parse(abi)));
  // //       setABIUploadValid(true);
  // //       setABIFileName(file.name);
  // //     } catch {
  // //       setABIInvalid();
  // //     }
  // //   };
  // //   reader.readAsText(file);
  // // };

  // // const getContractInformation = async (address: string) => {
  // //   const response = await fetch(buildEtherscanApiQuery(address));
  // //   const json = await response.json();
  // //   return json?.result?.[0];
  // // };

  // // const getABI = async (address: string) => {
  // //   let info = await getContractInformation(address);
  // //   if (info?.Proxy === '1' && utils.isAddress(info?.Implementation)) {
  // //     info = await getContractInformation(info.Implementation);
  // //   }
  // //   return info.ABI;
  // // };

  // const populateABIIfExists = async (address: string) => {
  //   if (abiErrorTimeout) {
  //     clearTimeout(abiErrorTimeout);
  //   }

  //   // try {
  //   //   const result = await getABI(address);
  //   //   setABI(new Interface(JSON.parse(result)));
  //   //   setABIUploadValid(true);
  //   //   setABIFileName('etherscan-abi-download.json');
  //   // } catch {
  //   //   setABIUploadValid(undefined);
  //   //   setABIFileName(undefined);
  //   // }
  // };

  // // const stepForwardOrCallback = () => {
  // //   if (currentStep !== steps.length - 1) {
  // //     return stepForward();
  // //   }
  // //   onProposalTransactionAdded({
  // //     address,
  // //     value: value ? utils.parseEther(value).toString() : '0',
  // //     signature: func,
  // //     calldata: (func && abi?._encodeParams(abi?.functions[func]?.inputs, args)) || '0x',
  // //   });
  // //   clearState();
  // // };

  // const steps = [
  //   {
  //     label: t('step.address'),
  //     name: 'address',
  //     // validator: () => addressValidator(address),
  //   },
  //   {
  //     label: t('step.value'),
  //     name: 'value',
  //     // validator: () => valueValidator(value),
  //   },
  //   {
  //     label: t('step.function'),
  //     name: 'function',
  //   },
  //   {
  //     label: t('step.arguments'),
  //     name: 'arguments',
  //     // validator: () => argumentsValidator(args),
  //   },
  //   {
  //     label: t('step.summary'),
  //     name: 'summary',
  //   },
  // ];

  // const { stepForward, stepBackwards, currentStep } = useStepProgress({
  //   steps,
  //   startingStep: 0,
  // });

  // // const clearState = () => {
  // //   setAddress('');
  // //   setABI(undefined);
  // //   setValue('');
  // //   setFunction('');
  // //   setArguments([]);
  // //   setABIUploadValid(undefined);
  // //   setABIFileName(undefined);

  // //   for (let i = currentStep; i > 0; i--) {
  // //     stepBackwards();
  // //   }
  // // };

  // // const handleClose = () => {
  // //   onHide();
  // //   clearState();
  // // };

  // // const none = t('common.none');

  // // const title = t(`vote.${vote}`, { id: proposalId });
  return (
    <Modal
      id="voteModal"
      open={show}
      close={onHide}
      title={t('title')}
      maxWidth="md"
      sx={{
        '.AwiModal-content': {
          // alignItems: 'center',
        },
      }}
    >
      <StepProgress>
        <ProposalTransactionForm />
      </StepProgress>
    </Modal>
  );
};

export default ProposalTransactionModal;
