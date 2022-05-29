import { useEffect, useMemo, useState } from 'react';

import BigNumber from 'bignumber.js';
import AnnotationPlugin from 'chartjs-plugin-annotation';
import { isAddress } from 'web3-utils';

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  LinearProgress,
  Link,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

import { AVERAGE_BLOCK_TIME_IN_SECS, TEXT_PLACEHOLDER, TEXT_PLACEHOLDER_HALF } from '@/app/constants';
import dateIO from '@/app/dateIO';
import LoadingText from '@/components/general/LoadingText/LoadingText';
import Panel from '@/components/general/Panel/Panel';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';
import { useBlockNumber } from '@/hooks/web3/useBlockNumber';
import { buildEtherscanAddressLink, buildEtherscanTxLink } from '@/lib/etherscan';
import { formatAmount, formatPercent, formatUSD } from '@/lib/formatters';
import { AssetKey, MarketInfo, ProposalDetail, ProposalItem } from '@/types/app';

import useProposalDates from './useProposalDates';

export enum Vote {
  AGAINST = 0,
  FOR = 1,
  ABSTAIN = 2,
}

const Root = styled(Section)(({ theme }) => ({
  paddingTop: 0,
  '.AwiDetailSection-actions': {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
    // margin: theme.spacing(0, 0, 10, 0),
  },
  '.AwiDetailSection-votes': {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: theme.spacing(4),
  },
  '.AwiDetailSection-vote': {
    backgroundColor: theme.palette.background.transparent,
    width: '100%',
  },
  '.AwiDetailSection-voteTitle': {
    display: 'flex',
    justifyContent: 'space-between',
    margin: theme.spacing(0, 0, 4),
    color: theme.palette.text.primary,
  },
  '.AwiDetailSection-voteProgress': {
    margin: theme.spacing(0, 0, 5),
    minWidth: 160,
  },
  '.AwiDetailSection-results': {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(6),
  },
  '.AwiDetailSection-result': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    color: theme.palette.text.primary,
    padding: theme.spacing(4, 0),
    gap: theme.spacing(6),
    '&:not(:last-of-type)': {
      borderBottom: `1px solid ${theme.palette.divider} !important`,
    },
  },
  [theme.breakpoints.up('md')]: {
    '.AwiDetailSection-actions': {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    '.AwiDetailSection-vote': {
      width: 'auto',
    },
  },
  // '.MuiTableRow-root': {
  //   borderBottom: `1px solid ${theme.palette.divider} !important`,
  //   '&:last-of-type': {
  //     border: 'none !important',
  //   },
  // },
}));

interface VoteCardProps {
  type: Vote;
  value: number;
  percent: number;
  i18nKey: string;
  color: 'success' | 'error' | 'info';
  votable: boolean;
  onVote: (type: Vote) => void;
}

const linkIfAddress = (content: string) => {
  if (isAddress(content)) {
    return (
      <Link href={buildEtherscanAddressLink(content)} target="_blank" rel="noreferrer">
        {content}
      </Link>
    );
  }
  return <span>{content}</span>;
};

const transactionLink = (content: string) => {
  return (
    <Link href={buildEtherscanTxLink(content)} target="_blank" rel="noreferrer">
      {content.substring(0, 7)}
    </Link>
  );
};

const formatFunction = (fn: ProposalDetail) => {
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

const VoteCard = ({ value, percent, type, i18nKey, color, votable, onVote }) => {
  const t = usePageTranslation({ keyPrefix: 'detail-section' });
  const handleVote = () => {
    onVote(type);
  };
  return (
    <Card variant="outlined" className="AwiDetailSection-vote">
      <CardContent>
        <Typography className="AwiDetailSection-voteTitle">
          {t(i18nKey)}
          <strong>{value}</strong>
        </Typography>
        <LinearProgress variant="determinate" value={percent} color={color} className="AwiDetailSection-voteProgress" />
        {votable && (
          <Button variant="outlined" fullWidth onClick={handleVote}>
            {t(`vote-${i18nKey}`)}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

interface Props {
  proposal: ProposalItem;
  loading: boolean;
}

export default function DetailSection({ proposal, loading }: Props) {
  const t = usePageTranslation({ keyPrefix: 'detail-section' });
  // Get and format date from data
  const { startDate, endDate, isReady } = useProposalDates(proposal);

  // console.log('DetailSection', proposal, startDate, endDate, isStarted, isEnded);

  const { title, description } = useMemo(() => {
    if (isReady && proposal) {
      const now = new Date();
      const isStarted = !!startDate && dateIO.isBefore(startDate, now);
      const isEnded = !!endDate && dateIO.isBefore(endDate, now);

      if (!isStarted) {
        return {
          title: t('voting-starts-at', {
            date: dateIO.formatByString(startDate, 'MMMM d, yyyy h:mm aa z'),
          }),
          description: null,
        };
      }
      if (isEnded) {
        const { forCount = 0, againstCount = 0, quorumVotes = 0 } = proposal || {};
        const quorumReached = forCount > againstCount && forCount >= quorumVotes;

        return {
          title: t('voting-ended-at', {
            date: dateIO.formatByString(endDate, 'MMMM d, yyyy h:mm aa z'),
          }),
          description: `${t(`quorum-${quorumReached ? 'reached' : 'failed-to-reach'}`)}${
            proposal?.quorumVotes !== undefined &&
            ` (${t('vote-section.quorum-votes', {
              n: proposal.quorumVotes,
            })})`
          }`,
        };
      }

      return {
        title: t('voting-ends-at', {
          date: dateIO.formatByString(endDate, 'MMMM d, yyyy h:mm aa z'),
        }),
        description:
          proposal?.quorumVotes !== undefined
            ? t('votes-required', {
                n: proposal.quorumVotes,
              })
            : null,
      };
    }

    return {
      title: TEXT_PLACEHOLDER_HALF,
      description: TEXT_PLACEHOLDER,
    };
  }, [isReady, proposal, startDate, endDate, t]);

  const votesByType = useMemo<Record<Vote, Omit<VoteCardProps, 'votable' | 'onVote'>>>(() => {
    // Get total votes and format percentages for UI
    const { forCount = 0, againstCount = 0, abstainCount = 0 } = proposal || {};
    const totalVotes = proposal ? forCount + againstCount + abstainCount : undefined;
    const forPercentage = proposal && totalVotes ? (forCount * 100) / totalVotes : 0;
    const againstPercentage = proposal && totalVotes ? (againstCount * 100) / totalVotes : 0;
    const abstainPercentage = proposal && totalVotes ? (abstainCount * 100) / totalVotes : 0;

    return {
      [Vote.FOR]: {
        type: Vote.FOR,
        value: forCount,
        percent: forPercentage,
        i18nKey: 'for',
        color: 'success',
      },
      [Vote.AGAINST]: {
        type: Vote.AGAINST,
        value: againstCount,
        percent: againstPercentage,
        i18nKey: 'against',
        color: 'error',
      },
      [Vote.ABSTAIN]: {
        type: Vote.ABSTAIN,
        value: abstainCount,
        percent: abstainPercentage,
        i18nKey: 'abstain',
        color: 'info',
      },
    };
  }, [proposal]);

  const handleVote = (type: Vote) => {
    console.log(type);
    // setVote(Vote.FOR);
    // setShowVoteModal(true);
  };
  console.log(votesByType, Object.values(Vote), Object.entries(Vote));
  return (
    <Root>
      <Grid container spacing={10}>
        <Grid item xs={12}>
          <Panel
            className="AwiDetailSection-votePanel"
            header={
              <div className="Awi-column">
                <Typography variant="h3" component="h2" mb={2}>
                  <LoadingText loading={loading || !isReady} text={title} />
                </Typography>
                {description && (
                  <Typography>
                    <LoadingText loading={loading || !isReady} text={description} />
                  </Typography>
                )}
              </div>
            }
          >
            <div className="AwiDetailSection-actions">
              <div className="AwiDetailSection-votes">
                {[Vote.FOR, Vote.AGAINST, Vote.ABSTAIN].map((key) => (
                  <VoteCard key={key} {...votesByType[key]} votable={true} onVote={handleVote} />
                ))}
              </div>
            </div>
          </Panel>
        </Grid>
        <Grid item xs={12} md={6}>
          <Panel
            header={
              <Typography variant="h4" component="h2">
                {t('proposed-transactions')}
              </Typography>
            }
            sx={{
              '.AwiPanel-header h2': {
                color: 'text.primary',
              },
            }}
          >
            <div className="AwiDetailSection-results">
              {proposal?.details?.map((detail, detailIndex) => {
                return (
                  <div key={detailIndex} className="AwiDetailSection-result">
                    <Typography>
                      {`${detailIndex + 1}. `}
                      {linkIfAddress(detail.target)}
                    </Typography>
                    <Typography color="inherit">{formatFunction(detail)}</Typography>
                  </div>
                );
              })}
            </div>
          </Panel>
        </Grid>
        <Grid item xs={12} md={6}>
          <Panel
            header={
              <Typography variant="h4" component="h3">
                {t('proposer')}
              </Typography>
            }
            sx={{
              '.AwiPanel-header h2': {
                color: 'text.primary',
              },
            }}
          >
            {proposal?.proposer && proposal?.transactionHash && (
              <div className="AwiDetailSection-result" /* sx={{ justifyContent: 'flex-start' }} */>
                <Typography color="inherit">{linkIfAddress(proposal.proposer)}</Typography>
                <Typography color="inherit">
                  {t('at')}&nbsp;
                  {transactionLink(proposal.transactionHash)}
                </Typography>
              </div>
            )}
          </Panel>
        </Grid>
      </Grid>
    </Root>
  );
}
