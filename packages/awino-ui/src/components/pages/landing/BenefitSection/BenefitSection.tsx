import { Container, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import Header from '@/components/general/Header/Header';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';

const Root = styled(Section)(({ theme }) => ({
  paddingTop: theme.spacing(88),
  '.card': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    maxWidth: '420px',
    height: '100%',
    padding: theme.spacing(13, 7),
    margin: '0 auto',
    borderRadius: +theme.shape.borderRadius * 5,
    backgroundColor: theme.palette.background.transparent,
    h3: {
      marginBottom: theme.spacing(7),
    },
  },
  [theme.breakpoints.up('md')]: {
    '.card': {
      padding: theme.spacing(38, 10.5, 13),
    },
  },
}));

const items = [0, 1, 2];

export default function BenefitSection() {
  const t = usePageTranslation();

  return (
    <Root>
      <Header title={t('benefit-section.title')} description={t('benefit-section.description')} />
      <Container maxWidth="lg">
        <Grid container columnSpacing={17} rowSpacing={18}>
          {items.map((_, index) => (
            <Grid key={index} item xs={12} sm={6}>
              <div className="card">
                <Typography variant="h5" component="h3">
                  {t(`benefit-section.items.${index}.title`)}
                </Typography>
                <Typography>{t(`benefit-section.items.${index}.description`)}</Typography>
              </div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Root>
  );
}
