import Image from 'next/image';

import { Container, Divider, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';

const Root = styled(Section)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(15, 0),
  overflow: 'hidden',
  '.image': {
    position: 'absolute',
    top: '10%',
    right: 0,
    maxWidth: '50%',
  },
  '.card': {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(11, 6, 10),
    borderRadius: +theme.shape.borderRadius * 5,
    backgroundColor: theme.palette.background.transparent,
    p: {
      maxWidth: 420,
    },
  },
  '.divider': {
    width: '90%',
    margin: theme.spacing(7, 'auto', 28),
  },
  [theme.breakpoints.up('md')]: {
    '.image': {
      top: 0,
    },
    '.card': {
      padding: theme.spacing(26, 22.5, 25),
    },
    '.divider': {
      margin: theme.spacing(7, 'auto', 48),
    },
  },
}));

export default function StatsSection() {
  const t = usePageTranslation();
  return (
    <>
      <Root>
        <div className="image">
          <Image src="/images/pages/landing/info.png" width={686} height={582} alt="" />
        </div>
        <Container maxWidth="lg">
          <Divider className="divider" />
          <div className="card">
            <Typography variant="h3" component="h2" mb={9.5} fontWeight={400}>
              {t('info-section.title')}
            </Typography>
            <Typography variant="body-sm">{t('info-section.description')}</Typography>
          </div>
        </Container>
      </Root>
    </>
  );
}
