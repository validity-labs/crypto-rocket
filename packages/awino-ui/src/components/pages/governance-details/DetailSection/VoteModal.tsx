import { useTranslation } from 'react-i18next';

import { Button, CircularProgress, Typography } from '@mui/material';

import Modal from '@/components/general/Modal/Modal';
import usePageTranslation from '@/hooks/usePageTranslation';

import { Vote } from './VoteCard';

interface VoteModalProps {
  show: boolean;
  onHide: () => void;
  onVote: () => void;
  isLoading: boolean;
  proposalId: string | undefined;
  availableVotes: number | undefined;
  vote: Vote | undefined;
}

const VoteModal = ({ show, onHide, onVote, proposalId, availableVotes, vote, isLoading }: VoteModalProps) => {
  const t = usePageTranslation({ keyPrefix: 'vote-modal' });
  const title = t(`vote.${vote}`, { id: proposalId });
  return (
    <Modal
      id="voteModal"
      open={show}
      close={onHide}
      title={title}
      sx={{
        '.AwiModal-content': {
          alignItems: 'center',
        },
      }}
    >
      <Typography variant="h3" sx={{ mb: 6 }}>
        {t(`available-votes`, { count: availableVotes })}
      </Typography>
      <Button color="primary" onClick={onVote}>
        {isLoading ? <CircularProgress size="1.5rem" color="inherit" /> : title}
      </Button>
    </Modal>
  );
};
export default VoteModal;
