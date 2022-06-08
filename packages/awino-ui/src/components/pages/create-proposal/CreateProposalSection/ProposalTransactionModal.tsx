import Modal from '@/components/general/Modal/Modal';
import usePageTranslation from '@/hooks/usePageTranslation';

import { ProposalTransaction } from './CreateProposalSection';
import ProposalTransactionForm from './ProposalTransactionForm';

interface ProposalTransactionModalProps {
  show: boolean;
  onHide: () => void;
  onProposalTransactionAdded: (transaction: ProposalTransaction) => void;
}

const ProposalTransactionModal = ({ show, onHide, onProposalTransactionAdded }: ProposalTransactionModalProps) => {
  const t = usePageTranslation({ keyPrefix: 'proposal-transaction-form' });

  return (
    <Modal id="proposalTransactionModal" open={show} close={onHide} title={t('title')} maxWidth="md">
      <ProposalTransactionForm onCreate={onProposalTransactionAdded} />
    </Modal>
  );
};

export default ProposalTransactionModal;
