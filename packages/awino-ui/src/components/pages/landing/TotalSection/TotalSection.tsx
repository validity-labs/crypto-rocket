import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatUSD } from '@/lib/formatters';
import { StatsData, StatsFormatter } from '@/types/app';

import StatsItems from '../../shared/FormattedStatsItems/StatsItems';

const Root = styled(Section)(({ theme }) => ({
  '.AwiStatsItem-title': {
    color: theme.palette.text.secondary,
    ...theme.typography['body-sm'],
    textAlign: 'start',
  },
  '.AwiTotalSection-items > .MuiGrid-container': {
    '> .MuiGrid-item:nth-of-type(1) .AwiStatsItem-value': {
      color: '#00EB5D',
    },
    '> .MuiGrid-item:nth-of-type(2) .AwiStatsItem-value': {
      color: '#00FFEB',
    },
    '> .MuiGrid-item:nth-of-type(3) .AwiStatsItem-value': {
      color: '#00F7B0',
    },
  },
}));

interface Props {
  items: StatsData;
}

export const statsFormatters: StatsFormatter[] = [{ value: formatUSD }, { value: formatUSD }, { value: formatUSD }];

export default function TotalSection({ items }: Props) {
  const t = usePageTranslation();

  return (
    <Root containerProps={{ maxWidth: 'lg' }}>
      <Grid container alignItems="center" spacing={10}>
        <Grid item xs={12} md={4}>
          <Typography variant="h3" component="h1" color="text.active" fontWeight={700}>
            {t('total-section.title')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <StatsItems
            items={items}
            maxWidth="lg"
            className="AwiTotalSection-items"
            formatters={statsFormatters}
            i18nKey="total-section"
          />
        </Grid>
      </Grid>
    </Root>
  );
}
