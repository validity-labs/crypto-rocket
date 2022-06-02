// import ReactMarkdown from 'react-markdown';

// import remarkBreaks from 'remark-breaks';
// import EmptyResult from '@/components/general/EmptyResult/EmptyResult';
// import Loader from '@/components/general/Loader/Loader';
// import { ProposalItem } from '@/types/app';
import { useCallback, useEffect, useState } from 'react';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import { ArrowBackRounded } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { ProposalState } from '@/app/constants';
import { useAppSelector } from '@/app/hooks';
import Link from '@/components/general/Link/Link';
import Panel from '@/components/general/Panel/Panel';
import PromptModal, { PromptModalData } from '@/components/general/PromptModal/PromptModal';
import Section from '@/components/layout/Section/Section';
import { governanceProposals } from '@/fixtures/governance';
import usePageTranslation from '@/hooks/usePageTranslation';
import useSnack from '@/hooks/useSnack';

import ProposalEditor, { ProposalData } from './ProposalEditor';
import ProposalTransactionModal from './ProposalTransactionModal';
import ProposalTransactions from './ProposalTransactions';
import TransactionSuccessModal from './TransactionSuccessModal';

const Root = styled(Section)(({ theme }) => ({
  '.AwiPanel-header': {
    flexDirection: 'column',
    justifyContent: 'flex-start !important',
    alignItems: 'flex-start !important',
    gap: '0 !important',
    h2: {
      marginBottom: theme.spacing(7),
      fontWeight: 500,
      color: theme.palette.text.secondary,
    },
  },
  [theme.breakpoints.up('md')]: {},
}));
// import ProposalStatus from '../../governance/ProposalSection/ProposalStatus';

export interface ProposalTransaction {
  address: string;
  value: string;
  signature: string;
  calldata: string;
}

interface Props {
  // proposal: ProposalItem;
  // loading: boolean;
}

const proposalTransactionsItems = [
  {
    address: '0xc2b3520b8915ee1e0f94c219f1f047f320e84871',
    calldata: 'test',
    signature: 'Signature',
    value: '',
  },
  {
    address: '0xc2b3520b8915ee1e0f94c219f1f047f320e84871',
    calldata: 'test',
    signature: 'Signature',
    value: '',
  },
];

export default function CreateProposalSection(/* { proposal, loading }: Props */) {
  const t = usePageTranslation({ keyPrefix: 'create-proposal-section' });
  const {
    i18n: { language },
  } = useTranslation();
  const router = useRouter();

  const { walletAddress: account } = useAppSelector((state) => state.account);
  const [promptModal, setPromptModal] = useState<null | PromptModalData>(null);
  // const latestProposalId = useProposalCount();
  const latestProposal = governanceProposals[0]; // useProposal(latestProposalId ?? 0);
  const availableVotes = 2; // useUserVotes();
  const proposalThreshold = 10; //useProposalThreshold();

  // const { propose, proposeState } = usePropose();
  const [proposeState, setProposeState] = useState({
    status: 'None',
    errorMessage: 'Error Message',
  });

  const snack = useSnack();
  const [proposalTransactions, setProposalTransactions] = useState<ProposalTransaction[]>([]);
  const [showTransactionSuccessModal, setShowTransactionSuccessModal] = useState(false);

  const handleAddProposalAction = useCallback(
    (transaction: ProposalTransaction) => {
      // if (!transaction.address.startsWith('0x')) {
      //   transaction.address = `0x${transaction.address}`;
      // }
      // if (!transaction.calldata.startsWith('0x')) {
      //   transaction.calldata = `0x${transaction.calldata}`;
      // }
      // setProposalTransactions([...proposalTransactions, transaction]);

      setShowTransactionFormModal(false);
      setShowTransactionSuccessModal(true);
    },
    [proposalTransactions]
  );

  const handleRemoveProposalAction = useCallback(
    (index: number) => {
      setProposalTransactions(proposalTransactions.filter((_, i) => i !== index));
    },
    [proposalTransactions]
  );

  const handleProposalCreate = async (data: ProposalData) => {
    if (!proposalTransactions?.length) return;
    const { title, description } = data;
    // await propose(
    //   proposalTransactions.map(({ address }) => address), // Targets
    //   proposalTransactions.map(({ value }) => value ?? '0'), // Values
    //   proposalTransactions.map(({ signature }) => signature), // Signatures
    //   proposalTransactions.map(({ calldata }) => calldata), // Calldatas
    //   `# ${title}\n\n${description}` // Description
    // );

    return true;
  };

  const [showTransactionFormModal, setShowTransactionFormModal] = useState(false);
  const [isProposePending, setProposePending] = useState(false);

  useEffect(() => {
    switch (proposeState.status) {
      case 'None':
        setProposePending(false);
        break;
      case 'Mining':
        setProposePending(true);
        break;
      case 'Success':
        setPromptModal({
          title: t('message.success.title'),
          message: t('message.success.description'),
          button: t('message.success.button'),
          onClose: () => {
            router.push('/governance');
          },
        });
        setProposePending(false);
        break;
      case 'Fail':
        snack(
          `${t('message.transaction-failed.title')} -
            ${proposeState?.errorMessage || t('message.transaction-failed.description')}`,
          'error'
        );
        setProposePending(false);
        break;
      case 'Exception':
        snack(`${t('message.error.title')} - ${proposeState?.errorMessage || t('message.error.description')}`, 'error');
        setProposePending(false);
        break;
    }
  }, [proposeState, snack, t, language, router]);

  const handleTransactionSuccessModalClose = () => {
    setShowTransactionSuccessModal(false);
  };

  return (
    <>
      <Root>
        <Button component={Link} href="/governance" variant="text" startIcon={<ArrowBackRounded />} sx={{ mb: 6 }}>
          {t('back')}
        </Button>
        <Panel
          header={
            <>
              <Typography variant="h3" component="h1" mb={11.5}>
                {t('title')}
              </Typography>
              <Typography component="h2">{t('tip-title')}</Typography>
              <Typography variant="body" color="text.primary">
                {t('tip-description')}
              </Typography>
            </>
          }
        >
          <ProposalTransactions
            proposalTransactions={proposalTransactionsItems}
            onRemoveProposalTransaction={handleRemoveProposalAction}
            onAdd={() => setShowTransactionFormModal(true)}
          />
          <div className="Awi-divider" />
          <ProposalEditor
            loading={isProposePending}
            proposalThreshold={proposalThreshold}
            has={{
              activeOrPendingProposal:
                (latestProposal?.status === ProposalState.ACTIVE || latestProposal?.status === ProposalState.PENDING) &&
                latestProposal.proposer === account,
              enoughVote: Boolean(
                availableVotes && proposalThreshold !== undefined && availableVotes > proposalThreshold
              ),
            }}
            onCreate={handleProposalCreate}
            canCreate={proposalTransactions.length > 0}
          />
        </Panel>
      </Root>
      <ProposalTransactionModal
        show={showTransactionFormModal}
        onHide={() => setShowTransactionFormModal(false)}
        onProposalTransactionAdded={handleAddProposalAction}
      />
      <TransactionSuccessModal open={showTransactionSuccessModal} close={handleTransactionSuccessModalClose} />
      {promptModal && <PromptModal open={true} data={promptModal} close={() => setPromptModal(null)} />}
    </>
  );
}
