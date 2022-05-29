import { ProposalState } from '@/app/constants';
import type { GovernanceInfo, ProposalItem } from '@/types/app';

export const governanceInfo: GovernanceInfo = {
  treasuryAmount: 24.335,
  treasuryAmountUSD: 43889881,
};

export const governanceProposals: ProposalItem[] = [
  {
    id: 1,
    title: '1. Nostrud dolor eiusmod',
    description: 'Aute labore incididunt __minim__ consectetur _aute_ anim et ullamco.',
    startBlock: 110,
    endBlock: 131,
    status: ProposalState.PENDING,
    quorumVotes: 10,
    forCount: 1,
    againstCount: 2,
    abstainCount: 3,
    createdBlock: 123456,
    // eta?: Date,
    details: [
      {
        target: '0xc2b3520b8915ee1e0f94c219f1f047f320e84871',
        functionSig: 'transfer',
        callData: '0.02 ETH',
      },
    ],
    proposer: '0x0b712FAA597C4e092288E6552B360DdD1B40407A',
    transactionHash: '0xeaca9648635bd65b5220de25a153b42f1017ea130b6f71da15497964cc10da0f',
  },
  {
    id: 2,
    title: '2. Nostrud dolor eiusmod',
    description: 'Aute labore incididunt minim consectetur aute anim et ullamco.',
    startBlock: 110,
    endBlock: 120,
    status: ProposalState.SUCCEEDED,
    quorumVotes: 10,
    forCount: 1,
    againstCount: 2,
    abstainCount: 3,
    createdBlock: 123456,
    details: [
      {
        target: '0xc2b3520b8915ee1e0f94c219f1f047f320e84871',
        functionSig: 'transfer',
        callData: '0.02 ETH',
      },
    ],
    proposer: '0x0b712FAA597C4e092288E6552B360DdD1B40407A',
    transactionHash: '0xeaca9648635bd65b5220de25a153b42f1017ea130b6f71da15497964cc10da0f',
  },
  {
    id: 3,
    title: '3. Nostrud dolor eiusmod',
    description: 'Aute labore incididunt minim consectetur aute anim et ullamco.',
    startBlock: 110,
    endBlock: undefined,
    status: ProposalState.QUEUED,
    quorumVotes: 10,
    forCount: 1,
    againstCount: 2,
    abstainCount: 3,
    createdBlock: 123456,
    details: [
      {
        target: '0xc2b3520b8915ee1e0f94c219f1f047f320e84871',
        functionSig: 'transfer',
        callData: '0.02 ETH',
      },
    ],
    proposer: '0x0b712FAA597C4e092288E6552B360DdD1B40407A',
    transactionHash: '0xeaca9648635bd65b5220de25a153b42f1017ea130b6f71da15497964cc10da0f',
  },
];
