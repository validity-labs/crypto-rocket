import { LinearProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import LabelValue from '@/components/general/LabelValue/LabelValue';
import Panel from '@/components/general/Panel/Panel';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatPercent, formatUSD } from '@/lib/formatters';
import { StatsData, StatsFormatter } from '@/types/app';

import StatsItems from '../../shared/StatsItems/StatsItems';

const Root = styled(Section)(({ theme }) => ({
  '.AwiInfoSection-title': {
    marginBottom: theme.spacing(10),
  },
  '.AwiInfoSection-panel > .AwiPanel-content': {
    padding: theme.spacing(12.5, 6.5, 10),
  },
  '.AwiInfoSection-stats': {
    marginBottom: theme.spacing(15),
    '> .MuiGrid-container': {
      '> .MuiGrid-item': {
        textAlign: 'center',
        '&:nth-of-type(2) .AwiStatsCard-root': {
          minWidth: 160,
          border: `2px solid ${theme.palette.text.active}`,
          ...theme.mixins.radius(2),
          boxShadow: 'inset 10px 10px 6px #00000029',
        },
      },
    },
    '.AwiStatsCard-root': {
      display: 'inline-block',
      background: 'transparent',
    },
    '.AwiStatsItem-title': {
      ...theme.typography['body-sm'],
    },
    '.AwiStatsItem-value': {
      color: theme.palette.text.primary,
    },
  },
  '.AwiInfoSection-progress': {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(8),
  },
  '.MuiLinearProgress-root': {
    width: '100%',
    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
  },
  '.MuiLinearProgress-bar': {
    borderRadius: 4,
  },
  '.AwiInfoSection-progressAmount': {
    alignSelf: 'flex-end',
  },

  [theme.breakpoints.up('md')]: {
    '.AwiInfoSection-panel > .AwiPanel-content': {
      padding: theme.spacing(12.5, 20, 20),
    },
    '.AwiInfoSection-progress': {
      flexDirection: 'row',
      alignItems: 'center',
    },
    '.MuiLinearProgress-root': {
      flex: 1,
    },
  },
}));

export interface DashboardInfoData {
  borrowLimit: {
    percent: number;
    amount: number;
  };
  stats: StatsData;
}

interface Props {
  info: DashboardInfoData;
  loading: boolean;
}

export const statsFormatters: StatsFormatter[] = [{ value: 'usd' }, { value: 'percent' }, { value: 'usd' }];

export default function InfoSection({ info, loading }: Props) {
  const t = usePageTranslation({ keyPrefix: 'info-section' });

  return (
    <Root>
      <Panel className="AwiInfoSection-panel">
        <Typography variant="h1" color="text.active" className="AwiInfoSection-title Awi-golden">
          {t('title')}
        </Typography>
        <StatsItems
          items={info.stats}
          maxWidth="md"
          className="AwiInfoSection-stats"
          formatters={statsFormatters}
          i18nKey="info-section"
        />
        <div className="AwiInfoSection-progress">
          <LabelValue
            id="infoSectionBorrowLimit"
            value={formatPercent(info.borrowLimit.percent)}
            labelProps={{ variant: 'body-sm', children: t('borrow-limit') }}
            valueProps={{ variant: 'body-sm', color: 'text.primary', fontWeight: 600 }}
          />
          <LinearProgress value={info.borrowLimit.percent} variant={loading ? 'indeterminate' : 'determinate'} />
          <Typography variant="body-sm" color="text.primary" className="AwiInfoSection-progressAmount">
            {formatUSD(info.borrowLimit.amount)}
          </Typography>
        </div>
      </Panel>
    </Root>
  );
}
