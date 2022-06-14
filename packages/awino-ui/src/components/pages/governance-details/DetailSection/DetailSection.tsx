import { useMemo, useState } from 'react';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Alert, Button, CircularProgress, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';

import { ProposalState, TEXT_PLACEHOLDER, TEXT_PLACEHOLDER_HALF } from '@/app/constants';
import dateIO from '@/app/dateIO';
import LoadingText from '@/components/general/LoadingText/LoadingText';
import Panel from '@/components/general/Panel/Panel';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';
import { ProposalItem } from '@/types/app';

import { formatDate, formatFunction, linkIfAddress, transactionLink } from './helpers';
import useProposalDates from './useProposalDates';
import VoteCard, { Vote, VoteCardProps } from './VoteCard';
import VoteModal from './VoteModal';

const Root = styled(Section)(({ theme }) => ({
  paddingTop: 0,
  '.AwiDetailSection-actions': {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
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
    padding: theme.spacing(3, 0),
    gap: theme.spacing(6),
    p: {
      color: theme.palette.text.primary,
      fontWeight: 500,
    },
    a: {
      color: theme.palette.text.active,
      fontWeight: 500,
    },
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
}));

interface Props {
  proposal: ProposalItem;
  loading: boolean;
}

const useUserVotesAsOfBlock = (block: number | undefined): number | undefined => 10;

export default function DetailSection({ proposal, loading }: Props) {
  const t = usePageTranslation({ keyPrefix: 'detail-section' });

  // const proposal = useProposal(id);

  const [vote, setVote] = useState<Vote>();

  const [showVoteModal, setShowVoteModal] = useState<boolean>(false);
  const [isVotePending, setVotePending] = useState<boolean>(false);

  const [isQueuePending, setQueuePending] = useState<boolean>(false);
  const [isExecutePending, setExecutePending] = useState<boolean>(false);

  // const dispatch = useAppDispatch();
  // const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);

  // const { castVote, castVoteState } = useCastVote();
  // const { queueProposal, queueProposalState } = useQueueProposal();
  // const { executeProposal, executeProposalState } = useExecuteProposal();

  // // Only count available votes as of the proposal created block
  const availableVotes = useUserVotesAsOfBlock(proposal?.createdBlock ?? undefined);

  // Only show voting if user has > 0 votes at proposal created block and proposal is active
  const showVotingButtons = availableVotes && proposal?.status === ProposalState.ACTIVE;

  const hasSucceeded = proposal?.status === ProposalState.SUCCEEDED;
  const isAwaitingStateChange = () => {
    return true;
    // if (hasSucceeded) {
    //   return true;
    // }
    // if (proposal?.status === ProposalState.QUEUED) {
    //   return new Date() >= (proposal?.eta ?? Number.MAX_SAFE_INTEGER);
    // }
    // return false;
  };

  const moveStateAction = (() => {
    if (hasSucceeded) {
      // return () => queueProposal(proposal?.id);
    }
    // return () => executeProposal(proposal?.id);
    return () => {};
  })();

  // const onTransactionStateChange = useCallback(
  //   (
  //     tx: TransactionStatus,
  //     successMessage?: string,
  //     setPending?: (isPending: boolean) => void,
  //     getErrorMessage?: (error?: string) => string | undefined,
  //     onFinalState?: () => void,
  //   ) => {
  //     switch (tx.status) {
  //       case 'None':
  //         setPending?.(false);
  //         break;
  //       case 'Mining':
  //         setPending?.(true);
  //         break;
  //       case 'Success':
  //         setModal({
  //           title: t('message.success', { ns: 'common' }),
  //           message: successMessage || t('message.transaction-success', { ns: 'common' }),
  //           show: true,
  //         });
  //         setPending?.(false);
  //         onFinalState?.();
  //         break;
  //       case 'Fail':
  //         setModal({
  //           title: t('message.transaction-failed', { ns: 'common' }),
  //           message: tx?.errorMessage || t('message.try-again', { ns: 'common' }),
  //           show: true,
  //         });
  //         setPending?.(false);
  //         onFinalState?.();
  //         break;
  //       case 'Exception':
  //         setModal({
  //           title: t('message.error', { ns: 'common' }),
  //           message:
  //             getErrorMessage?.(tx?.errorMessage) || t('message.try-again', { ns: 'common' }),
  //           show: true,
  //         });
  //         setPending?.(false);
  //         onFinalState?.();
  //         break;
  //     }
  //   },
  //   [setModal, t],
  // );

  // useEffect(() => {
  //   const getVoteErrorMessage = (error: string | undefined) => {
  //     if (error?.match(/voter already voted/)) {
  //       return t('vote-section.already-voted');
  //     }
  //     return error;
  //   };
  //   return onTransactionStateChange(
  //     castVoteState,
  //     t('vote-section.vote-success'),
  //     setVotePending,
  //     getVoteErrorMessage,
  //     () => setShowVoteModal(false),
  //   );
  // }, [castVoteState, onTransactionStateChange, setModal, t]);

  // useEffect(
  //   () =>
  //     onTransactionStateChange(
  //       queueProposalState,
  //       t('vote-section.proposal-queued'),
  //       setQueuePending,
  //     ),
  //   [queueProposalState, onTransactionStateChange, setModal, t],
  // );

  // useEffect(
  //   () =>
  //     onTransactionStateChange(
  //       executeProposalState,
  //       t('vote-section.proposal-executed'),
  //       setExecutePending,
  //     ),
  //   [executeProposalState, onTransactionStateChange, setModal, t],
  // );

  // Get and format date from data
  const { startDate, endDate, isReady: areDatesReady } = useProposalDates(proposal);

  const { title, description } = useMemo(() => {
    if (areDatesReady && proposal) {
      const now = new Date();
      const isStarted = !!startDate && dateIO.isBefore(startDate, now);
      const isEnded = !!endDate && dateIO.isBefore(endDate, now);

      if (!isStarted) {
        return {
          title: t('voting-starts-at', {
            date: formatDate(startDate),
          }),
          description: null,
        };
      }
      if (isEnded) {
        const { forCount = 0, againstCount = 0, quorumVotes = 0 } = proposal || {};
        const quorumReached = forCount > againstCount && forCount >= quorumVotes;

        return {
          title: t('voting-ended-at', {
            date: formatDate(endDate),
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
          date: formatDate(endDate),
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
  }, [areDatesReady, proposal, startDate, endDate, t]);

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
    setVote(type);
    setShowVoteModal(true);
  };
  // console.log(votesByType, Object.values(Vote), Object.entries(Vote));
  return (
    <>
      <Root>
        <Panel
          className="AwiDetailSection-votePanel"
          header={
            <div className="Awi-column">
              <Typography variant="h4" component="h2" mb={2}>
                <LoadingText loading={loading || !areDatesReady} text={title} />
              </Typography>
              {description && (
                <Typography>
                  <LoadingText loading={loading || !areDatesReady} text={description} />
                </Typography>
              )}
              {proposal && proposal.status === ProposalState.ACTIVE && !showVotingButtons && (
                <Alert severity="warning" sx={{ mt: 4 }}>
                  {t('ineligible-vote', {
                    block: proposal.createdBlock,
                  })}
                </Alert>
              )}
            </div>
          }
        >
          <Grid container spacing={20}>
            <Grid item xs={12}>
              <div className="AwiDetailSection-actions">
                <div className="AwiDetailSection-votes">
                  {[Vote.FOR, Vote.AGAINST, Vote.ABSTAIN].map((key) => (
                    <VoteCard key={key} {...votesByType[key]} votable={true} onVote={handleVote} />
                  ))}
                </div>
                {isAwaitingStateChange() && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                      variant="outlined"
                      onClick={moveStateAction}
                      disabled={isQueuePending || isExecutePending}
                      sx={{ mr: 2, whiteSpace: 'nowrap' }}
                    >
                      {isQueuePending || isExecutePending ? (
                        <CircularProgress size="1.5rem" />
                      ) : (
                        t(`${hasSucceeded ? 'queue' : 'execute'}-proposal`)
                      )}
                    </Button>
                    <Tooltip title={`${t('submit-proposal-help')}`} arrow>
                      <IconButton color="primary">
                        <InfoOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </div>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body" component="h3" mb={6}>
                {t('proposed-transactions')}
              </Typography>
              <div className="AwiDetailSection-results">
                {proposal?.details?.map((detail, detailIndex) => {
                  return (
                    <div key={detailIndex} className="AwiDetailSection-result">
                      <Typography>
                        {`${detailIndex + 1}. `}
                        {linkIfAddress(detail.target)}
                      </Typography>
                      <Typography>{formatFunction(detail)}</Typography>
                    </div>
                  );
                })}
              </div>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body" component="h3" mb={6}>
                {t('proposer')}
              </Typography>
              {proposal?.proposer && proposal?.transactionHash && (
                <div className="AwiDetailSection-result" /* sx={{ justifyContent: 'flex-start' }} */>
                  <Typography>{linkIfAddress(proposal.proposer)}</Typography>
                  <Typography>
                    {t('at')}&nbsp;
                    {transactionLink(proposal.transactionHash)}
                  </Typography>
                </div>
              )}
            </Grid>
          </Grid>
        </Panel>
      </Root>
      <VoteModal
        show={showVoteModal}
        onHide={() => setShowVoteModal(false)}
        onVote={() => {} /* () => castVote(proposal?.id, vote) */}
        isLoading={isVotePending}
        proposalId={`${proposal?.id}`}
        availableVotes={availableVotes}
        vote={vote}
      />
    </>
  );
}
