import { Trans } from 'next-i18next';

import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';

const Root = styled(Section)(({ theme }) => ({
  '.AwiInfoSection-title': {
    marginBottom: theme.spacing(35),
    fontWeight: 400,
    textAlign: 'center',
  },
  '.AwiInfoSection-card': {
    position: 'relative',
    padding: theme.spacing(11, 6, 10),
    borderRadius: +theme.shape.borderRadius * 5,
    backgroundColor: theme.palette.background.transparent,
  },
  '.AwiInfoSection-image': {
    position: 'absolute',
    maxWidth: '100%',
    width: 200,
    top: 0,
    right: 0,
    transition: 'width linear 500ms',
    img: {
      maxWidth: '100%',
      transform: 'translateY(-72%)',
    },
  },
  '.AwiInfoSection-cardTitle': {
    marginBottom: theme.spacing(7.5),
    fontWeight: 400,
  },
  [theme.breakpoints.up('md')]: {
    '.AwiInfoSection-title': {
      fontSize: '3.125rem' /* 50px */,
      lineHeight: '3.75rem' /* 60px */,
    },
    '.AwiInfoSection-card': {
      padding: theme.spacing(26, 22.5, 25),
    },
    '.AwiInfoSection-image': {
      width: 290,
      img: {
        transform: 'translateY(-52%)',
      },
    },
  },
}));

const items = [1, 2];
export default function InfoSection() {
  const t = usePageTranslation({ keyPrefix: 'info-section' });
  return (
    <Root size="small" containerProps={{ maxWidth: 'lg' }}>
      <Typography variant="h1" className="AwiInfoSection-title">
        <Trans i18nKey={'title'} t={t} components={[<span key="span" className="Awi-golden" />]} />
      </Typography>
      <div className="AwiInfoSection-card">
        <div className="AwiInfoSection-image">
          <img src="/images/eagle.svg" alt="" />
        </div>
        <Grid container spacing={22}>
          {items.map((itemId, itemIndex) => (
            <Grid key={itemId} item xs={12} md={6}>
              <Typography variant="h3" component="h2" className="AwiInfoSection-cardTitle">
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
