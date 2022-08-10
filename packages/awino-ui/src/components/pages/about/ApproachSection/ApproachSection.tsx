import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';

const Root = styled(Section)(({ theme }) => ({
  '.AwiApproachSection-title': {
    marginBottom: theme.spacing(8),
    fontWeight: 400,
  },
  '.AwiApproachSection-card': {
    padding: theme.spacing(11, 6, 10),
    borderRadius: +theme.shape.borderRadius * 5,
    backgroundColor: theme.palette.background.transparent,
  },
  '.AwiApproachSection-subtitle': {
    marginBottom: theme.spacing(5.5),
    fontWeight: 700,
  },
  [theme.breakpoints.up('md')]: {
    '.AwiApproachSection-card': {
      padding: theme.spacing(26, 22.5, 25),
    },
  },
}));

const items = [1, 2, 3, 4];
export default function ApproachSection() {
  const t = usePageTranslation({ keyPrefix: 'approach-section' });
  return (
    <Root containerProps={{ maxWidth: 'lg' }}>
      <div className="AwiApproachSection-card">
        <Typography variant="h3" component="h2" className="AwiApproachSection-title">
          {t('title')}
        </Typography>
        <Typography mb={19}>{t('description')}</Typography>
        <Grid container spacing={13}>
          {items.map((itemId, itemIndex) => (
            <Grid key={itemId} item xs={12} md={6}>
              <Typography variant="h6" component="h3" className="AwiApproachSection-subtitle">
                {t(`items.${itemIndex}.title`)}
              </Typography>
              <Typography maxWidth={380}>{t(`items.${itemIndex}.description`)}</Typography>
            </Grid>
          ))}
        </Grid>
      </div>
    </Root>
  );
}
