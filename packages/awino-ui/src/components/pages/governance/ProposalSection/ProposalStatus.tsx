import { useTranslation } from 'react-i18next';

import { Chip } from '@mui/material';

import { ProposalState } from '@/app/constants';
import usePageTranslation from '@/hooks/usePageTranslation';

const statusVariant = (status: ProposalState | undefined) => {
  switch (status) {
    case ProposalState.ACTIVE:
      return '#FFD126';
    case ProposalState.PENDING:
      return '#8EDBDE';
    case ProposalState.SUCCEEDED:
      return '#9ADE8E';
    case ProposalState.EXECUTED:
      return '#32CD32';
    case ProposalState.DEFEATED:
    case ProposalState.VETOED:
      return '#FF578A';
    case ProposalState.QUEUED:
    case ProposalState.CANCELED:
    case ProposalState.EXPIRED:
    default:
      return '#C6C6C6';
  }
};

const statusText = (status: ProposalState | undefined) => {
  switch (status) {
    case ProposalState.PENDING:
      return 'pending';
    case ProposalState.ACTIVE:
      return 'active';
    case ProposalState.SUCCEEDED:
      return 'succeeded';
    case ProposalState.EXECUTED:
      return 'executed';
    case ProposalState.DEFEATED:
      return 'defeated';
    case ProposalState.QUEUED:
      return 'queued';
    case ProposalState.CANCELED:
      return 'canceled';
    case ProposalState.VETOED:
      return 'vetoed';
    case ProposalState.EXPIRED:
      return 'expired';
    default:
      return 'undetermined';
  }
};

const ProposalStatus = ({ status }: { status: ProposalState | undefined }) => {
  const t = usePageTranslation({ keyPrefix: 'proposal-status' });
  return (
    <Chip
      label={t(statusText(status))}
      size="small"
      sx={{
        backgroundColor: statusVariant(status),
        color: '#12171D',
        '.MuiChip-label': {
          color: 'inherit',
          textTransform: 'uppercase',
        },
      }}
    />
  );
};

export default ProposalStatus;
