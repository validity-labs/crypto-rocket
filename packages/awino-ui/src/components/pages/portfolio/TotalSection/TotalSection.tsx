import { styled } from '@mui/material/styles';

import Section from '@/components/layout/Section/Section';
import { StatsData, StatsFormatter } from '@/types/app';

import StatsItems from '../../shared/StatsItems/StatsItems';

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
      color: '#00FFEB',
    },
  },
}));

interface Props {
  items: StatsData;
}

export const statsFormatters: StatsFormatter[] = [{ value: 'usd' }, { value: 'usd' }, { value: 'usd' }];

export default function TotalSection({ items }: Props) {
  return (
    <Root /* containerProps={{ maxWidth: 'lg' }} */>
      <StatsItems
        items={items}
        maxWidth="md"
        className="AwiTotalSection-items"
        formatters={statsFormatters}
        i18nKey="total-section"
      />
    </Root>
  );
}
