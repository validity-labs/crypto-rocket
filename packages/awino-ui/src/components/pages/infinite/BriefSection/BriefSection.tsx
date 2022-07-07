import { Grid, Typography } from '@mui/material';

import Section from '@/components/layout/Section/Section';
import StatsItems from '@/components/pages/shared/StatsItems/StatsItems';
import usePageTranslation from '@/hooks/usePageTranslation';
import { StatsData, StatsFormatter } from '@/types/app';

interface Props {
  items: StatsData;
}

export const statsFormatters: StatsFormatter[] = [
  { value: 'amount' },
  { value: 'amount' },
  { value: 'amount' },
  { value: 'amount' },
];

export default function BriefSection({ items }: Props) {
  const t = usePageTranslation();
  return (
    <Section>
      <Grid container spacing={21} alignItems="center">
        <Grid item xs={12} md={3}>
          <Typography variant="h4" component="h1" color="text.active">
            {t('brief-section.title')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={9}>
          <StatsItems items={items} formatters={statsFormatters} />
        </Grid>
      </Grid>
    </Section>
  );
}
