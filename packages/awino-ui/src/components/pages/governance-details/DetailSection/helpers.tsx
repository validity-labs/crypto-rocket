import { isAddress } from 'web3-utils';

import { Link } from '@mui/material';

import dateIO from '@/app/dateIO';
import { buildEtherscanAddressLink, buildEtherscanTxLink } from '@/lib/etherscan';
import { ProposalDetail } from '@/types/app';

export const linkIfAddress = (content: string) => {
  if (isAddress(content)) {
    return (
      <Link href={buildEtherscanAddressLink(content)} target="_blank" rel="noreferrer">
        {content}
      </Link>
    );
  }
  return <span>{content}</span>;
};

export const transactionLink = (content: string) => {
  return (
    <Link href={buildEtherscanTxLink(content)} target="_blank" rel="noreferrer">
      {content.substring(0, 7)}
    </Link>
  );
};

export const formatFunction = (fn: ProposalDetail) => {
  const { functionSig, callData } = fn;
  const params = callData.split(',');
  const ln = params.length;
  return (
    <>
      {`${functionSig} (`}
      {params.map((param, paramIndex) => {
        return (
          <span key={paramIndex}>
            {linkIfAddress(param)}
            {ln - 1 !== paramIndex && ','}
          </span>
        );
      })}
      {`)`}
    </>
  );
};

export const formatDate = (date: Date) => dateIO.formatByString(date, 'MMMM d, yyyy h:mm aa z');
