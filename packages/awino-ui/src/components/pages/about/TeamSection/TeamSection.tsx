import Image from 'next/image';

import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';

const Root = styled(Section)(({ theme }) => ({
  '.AwiTeamSection-card': {
    textAlign: 'center',
  },
  '.AwiTeamSection-poster': {
    borderRadius: '100%',
    overflow: 'hidden',
  },
  '.AwiTeamSection-name': {
    margin: theme.spacing(10, 0, 3),
    fontWeight: 700,
  },
  '.AwiTeamSection-title': {
    marginBottom: theme.spacing(8),
    color: theme.palette.text.active,
  },
  [theme.breakpoints.up('md')]: {
    '.AwiTeamSection-card': {
      padding: theme.spacing(26, 22.5, 25),
    },
  },
}));

const items = ['steve', 'awino'];
export default function TeamSection() {
  const t = usePageTranslation({ keyPrefix: 'team-section' });
  return (
    <Root size="medium" containerProps={{ maxWidth: 'lg' }}>
      <Grid container spacing={24}>
        {items.map((itemId, itemIndex) => (
          <Grid key={itemId} item xs={12} md={6}>
            <div className="AwiTeamSection-card">
              <Image
                src={`/images/pages/about/team/${itemId}.jpg`}
                alt=""
                width={292}
                height={292}
                className="AwiTeamSection-poster"
                objectFit="cover"
                objectPosition="top"
              />
              <Typography variant="h5" component="h2" className="AwiTeamSection-name">
                {t(`items.${itemIndex}.name`)}
              </Typography>
              <Typography component="h3" className="AwiTeamSection-title Awi-golden">
                {t(`items.${itemIndex}.title`)}
              </Typography>
              <Typography maxWidth={380}>{t(`items.${itemIndex}.description`)}</Typography>
            </div>
          </Grid>
        ))}
      </Grid>
    </Root>
  );
}
