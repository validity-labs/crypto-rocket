import { Container, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';

const Root = styled(Section)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(15, 0),
  overflow: 'hidden',
  '.AwiInfoSection-image': {
    position: 'absolute',
    top: '5%',
    right: 0,
    width: 240,
    img: {
      maxWidth: '100%',
    },
  },
  '.AwiInfoSection-card': {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(11, 6, 10),
    borderRadius: +theme.shape.borderRadius * 5,
    backgroundColor: theme.palette.background.transparent,
    p: {
      maxWidth: 420,
    },
  },
  '.AwiInfoSection-divider': {
    width: '90%',
    margin: theme.spacing(7, 'auto', 28),
    ...theme.mixins.divider,
  },

  [theme.breakpoints.up('md')]: {
    '.AwiInfoSection-image': {
      top: 0,
      // maxWidth: '50%',
      width: 540,
    },
    '.AwiInfoSection-card': {
      padding: theme.spacing(26, 22.5, 25),
    },
    '.AwiInfoSection-divider': {
      margin: theme.spacing(7, 'auto', 48),
    },
  },
  [theme.breakpoints.up('lg')]: {
    '.AwiInfoSection-image': {
      right: '10%',
    },
  },
}));

export default function InfoSection() {
  const t = usePageTranslation();
  return (
    <Root>
      <div className="AwiInfoSection-image">
        <img src="/images/pages/landing/info.svg" alt="" />
      </div>
      <Container maxWidth="lg">
        <div className="AwiInfoSection-divider" />
        <div className="AwiInfoSection-card">
          <Typography variant="h3" component="h2" mb={10} fontWeight={400}>
            {t('info-section.title')}
          </Typography>
          <Grid container columnSpacing={37} rowSpacing={6}>
            <Grid item xs={12} md={6}>
              <Typography>{t('info-section.description.0')}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography>{t('info-section.description.1')}</Typography>
            </Grid>
          </Grid>
        </div>
      </Container>
    </Root>
  );
}
