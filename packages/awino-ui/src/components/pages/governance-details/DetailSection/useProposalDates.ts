import { useEffect, useMemo, useState } from 'react';

import { AVERAGE_BLOCK_TIME_IN_SECS } from '@/app/constants';
import dateIO from '@/app/dateIO';
import { useBlockNumber } from '@/hooks/web3/useBlockNumber';

const useProposalDates = (proposal) => {
  const [dates, setDates] = useState({
    startDate: null,
    endDate: null,
    isReady: false,
  });

  const currentBlock = useBlockNumber();
  // console.log('useProposalDates', proposal);
  useEffect(() => {
    // const timestamp = Date.now();
    //  const startDate =
    //    proposal && timestamp && currentBlock
    //      ? dayjs(timestamp).add(
    //          AVERAGE_BLOCK_TIME_IN_SECS * (proposal.startBlock - currentBlock),
    //          'seconds',
    //        )
    //      : undefined;

    //  const endDate =
    //    proposal && timestamp && currentBlock
    //      ? dayjs(timestamp).add(
    //          AVERAGE_BLOCK_TIME_IN_SECS * (proposal.endBlock - currentBlock),
    //          'seconds',
    //        )
    //      : undefined;
    //  const now = dayjs();
    if (!proposal || !currentBlock) {
      console.log('proposal and currentBLock missing');
      return;
    }
    // console.log('not missing', proposal, currentBlock);
    const now = new Date();
    let startDate;
    let endDate;
    if (now && currentBlock) {
      // console.log('inside', proposal);
      startDate = dateIO.addSeconds(now, AVERAGE_BLOCK_TIME_IN_SECS * (proposal.startBlock - currentBlock));

      endDate =
        proposal.endBlock && dateIO.addSeconds(now, AVERAGE_BLOCK_TIME_IN_SECS * (proposal.endBlock - currentBlock));
    }

    //         let date = endDate;
    //         let i18nKey = 'voting-ends-at';
    //         console.log(startDate, endDate);
    //         if (startDate && !endDate) {
    //           date = startDate;
    //           i18nKey = 'voting-starts-at';
    //         } else if (endDate && dateIO.isBefore(endDate, now)) {
    //           i18nKey = 'voting-ended-at';
    //         }

    //         return t(i18nKey, { date: dateIO.formatByString(date, DEFAULT_DATE_TIME_PRETTY_FORMAT) });

    setDates({ startDate, endDate, isReady: true });
  }, [proposal, currentBlock]);

  return dates;
};

export default useProposalDates;
