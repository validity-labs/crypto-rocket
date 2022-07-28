import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import usePageTranslation from '@/hooks/usePageTranslation';

import ResultPanel from './ResultPanel';
import { FarmItem } from './ResultSection';

const Root = styled('div')(({ theme }) => ({
  overflow: 'auto',
  minWidth: '100%',
  '.AwiResultTable-wrapper': {
    display: 'table',
    overflow: 'auto',
    width: '100%',
  },
  '.AwiResultTable-header': {
    display: 'flex',
    flexDirection: 'row',
    minWidth: '100%',
    padding: theme.spacing(0, 8, 0),
    marginBottom: theme.spacing(3),
    '>div:first-of-type': {
      minWidth: 80,
    },
    '>div:not(:first-of-type)': {
      flex: 1,
      minWidth: 180,
      p: {
        fontWeight: 500,
        whiteSpace: 'no-wrap',
      },
    },
  },
}));

interface Props {
  loading: boolean;
  items: FarmItem[];
  onHarvest: (item: FarmItem) => void;
  onStake: (item: FarmItem) => void;
  onUnstake: (item: FarmItem) => void;
}

export default function ResultTable({ onHarvest, onStake, onUnstake, items }: Props) {
  const t = usePageTranslation({ keyPrefix: 'result-section' });
  return (
    <Root>
      <div className="AwiResultTable-wrapper">
        <div className="AwiResultTable-header">
          <div>{/* <Typography>{t('fields.details')}</Typography> */}</div>
          <div>
            <Typography>{t('fields.asset')}</Typography>
          </div>
          <div>
            <Typography>{t('fields.earn')}</Typography>
          </div>
          <div>
            <Typography>{t('fields.emissions')}</Typography>
          </div>
          <div>
            <Typography>{t('fields.total-liquidity')}</Typography>
          </div>
          <div>
            <Typography>{t('fields.apr')}</Typography>
          </div>
          <div>
            <Typography>{t('fields.deposit-fee')}</Typography>
          </div>
        </div>
        {items.map((record) => (
          <ResultPanel key={record.id} item={record} onHarvest={onHarvest} onStake={onStake} onUnstake={onUnstake} />
          // {/*   <div key={record.id}>
          //     <Slide in appear direction="up">
          //       <div> */}
          //       {/* </div>
          //     </Slide>
          //   </div> */}
        ))}
      </div>
    </Root>
  );
}
