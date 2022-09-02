import { Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import ConnectButton from '@/components/buttons/ConnectButton';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';

const Root = styled(Section)(({ theme }) => ({
  '> .MuiContainer-root': {
    position: 'relative',
  },
  '.AwiJoinSection-image': {
    position: 'absolute',
    maxWidth: '100%',
    width: 240,
    top: -180,
    left: 0,
    transition: 'width linear 500ms',
    img: {
      maxWidth: '100%',
    },
  },
  '.AwiJoinSection-card': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    padding: theme.spacing(11, 6, 10),
    borderRadius: +theme.shape.borderRadius * 5,
    backgroundColor: theme.palette.background.transparent,
    p: {
      textAlign: 'end',
    },
  },
  h2: {
    background: [
      '#FFE4B2',
      '-webkit-linear-gradient(to right, #FFE4B2 0%, #AD7101 100%)',
      '-moz-linear-gradient(to right, #FFE4B2 0%, #AD7101 100%)',
      'linear-gradient(to right, #FFE4B2 0%, #AD7101 100%)',
    ],
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  [theme.breakpoints.up('md')]: {
    '.AwiJoinSection-image': {
      width: 460,
      top: -300,
      left: 60,
    },
    '.AwiJoinSection-card': {
      padding: theme.spacing(26, 22.5, 25),
    },
  },
  [theme.breakpoints.up('lg')]: {
    '.AwiJoinSection-image': {
      width: 500,
      top: -185,
      left: 60,
    },
  },
}));

export default function JoinSection() {
  const t = usePageTranslation();
  return (
    <Root size="large-medium">
      <div className="AwiJoinSection-image">
        <img src="/images/pages/landing/join.svg" alt="" />
      </div>
      <Container maxWidth="md">
        <div className="AwiJoinSection-card">
          <Typography variant="h1" component="h2" mb={12} fontWeight={400}>
            {t('join-section.title')}
          </Typography>
          <Typography color="text.primary" mb={12}>
            {t('join-section.description')}
          </Typography>
          <ConnectButton />
        </div>
      </Container>
    </Root>
  );
}
