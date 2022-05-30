import { useEffect, useState } from 'react';

import { AVERAGE_BLOCK_TIME_IN_SECS } from '@/app/constants';
import dateIO from '@/app/dateIO';
import { useBlockNumber } from '@/hooks/web3/useBlockNumber';

interface ProposalDatesValue {
  startDate: Date | null;
  endDate: Date | null;
  isReady: boolean;
}

const useProposalDates = (proposal) => {
  const [dates, setDates] = useState<ProposalDatesValue>({
    startDate: null,
    endDate: null,
    isReady: false,
  });

  const currentBlock = useBlockNumber();
  useEffect(() => {
    if (!proposal || !currentBlock) {
      return;
    }
    const now = new Date();
    let startDate;
    let endDate;
    if (now && currentBlock) {
      startDate = dateIO.addSeconds(now, AVERAGE_BLOCK_TIME_IN_SECS * (proposal.startBlock - currentBlock));
      endDate =
        proposal.endBlock && dateIO.addSeconds(now, AVERAGE_BLOCK_TIME_IN_SECS * (proposal.endBlock - currentBlock));
    }
    setDates({ startDate, endDate, isReady: true });
  }, [proposal, currentBlock]);

  return dates;
};

export default useProposalDates;
