import { Button, Card, CardContent, LinearProgress, Typography } from '@mui/material';

import usePageTranslation from '@/hooks/usePageTranslation';

export enum Vote {
  AGAINST = 0,
  FOR = 1,
  ABSTAIN = 2,
}

export interface VoteCardProps {
  type: Vote;
  value: number;
  percent: number;
  i18nKey: string;
  color: 'success' | 'error' | 'info';
  votable: boolean;
  onVote: (type: Vote) => void;
}

const VoteCard = ({ value, percent, type, i18nKey, color, votable, onVote }: VoteCardProps) => {
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

export default VoteCard;
