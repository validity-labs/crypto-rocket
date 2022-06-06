import { Button, Typography } from '@mui/material';

import Modal from '@/components/general/Modal/Modal';
import SuccessBadge from '@/components/general/SuccessBadge/SuccessBadge';
import usePageTranslation from '@/hooks/usePageTranslation';

interface ProposalTransactionModalProps {
  open: boolean;
  close: () => void;
}

const TransactionSuccessModal = ({ open, close }: ProposalTransactionModalProps) => {
  const t = usePageTranslation({ keyPrefix: 'transaction-success-modal' });
  return (
    <Modal
      id="voteModal"
      open={open}
      close={close}
      sx={{
        '.AwiModal-content': {
          alignItems: 'center',
        },
      }}
    >
      <SuccessBadge />
      <Typography variant="h4" component="h2" mb={16}>
        {t('title')}
      </Typography>
      <Button variant="outlined" size="small" onClick={close}>
        {t('view-proposals')}
      </Button>
    </Modal>
  );
};
export default TransactionSuccessModal;
