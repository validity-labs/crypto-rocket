import { Trans } from 'next-i18next';

import { /* Box, Button, */ Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// import { useAppSelector } from '@/app/hooks';
// import Link from '@/components/general/Link/Link';
import { useAppSelector } from '@/app/hooks';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';
import { StatsData, StatsFormatter } from '@/types/app';

import StatsItems from '../../shared/StatsItems/StatsItems';

const Root = styled(Section, {
  shouldForwardProp: (prop) => prop !== 'decorated',
})<{ decorated: boolean }>(({ theme, decorated }) => ({
  textAlign: 'center',
  ...(decorated && {
    paddingTop: 0,
    '> .MuiContainer-root': {
      position: 'relative',
      paddingTop: theme.spacing(20),
    },
  }),
  h1: {
    marginBottom: theme.spacing(21),
    fontFamily: '"Baloo Bhai 2", cursive',
    fontWeight: 400,
    '.Awi-small': {
      textTransform: 'uppercase',
    },
    '.Awi-highlight': {
      background: [
        '#FFE4B2',
        '-webkit-linear-gradient(to right, #FFE4B2 0%, #AD7101 100%)',
        '-moz-linear-gradient(to right, #FFE4B2 0%, #AD7101 100%)',
        'linear-gradient(to right, #FFE4B2 0%, #AD7101 100%)',
      ],
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
  },
  '.AwiInfoSection-image': {
    pointerEvents: 'none',
    position: 'absolute',
    top: -100,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: 220,
    img: {
      maxWidth: '100%',
    },
  },
  // '.badges': {
  //   display: 'flex',
  //   flexDirection: 'row',
  //   flexWrap: 'wrap',
  //   justifyContent: 'center',
  //   margin: theme.spacing(0, 'auto', 3.5),
  //   li: {
  //     margin: theme.spacing(1.5),
  //   },
  //   img: {
  //     width: 52,
  //     height: 52,
  //     padding: theme.spacing(2),
  //     borderRadius: +theme.shape.borderRadius * 2,
  //     backgroundColor: theme.palette.background.transparent,
  //   },
  // },
  [theme.breakpoints.up('md')]: {
    ...(decorated && {
      '> .MuiContainer-root': {
        padding: theme.spacing(30, 30, 0),
      },
    }),
    '.AwiInfoSection-image': {
      top: -180,
      right: 40,
      left: 'unset',
      maxWidth: 440,
      transform: 'none',
    },
    h1: {
      fontSize: '5rem' /* 80px */,
      lineHeight: '7rem' /* 112px */,
      '.Awi-small': {
        fontSize: '3.75rem' /* 60px */,
        lineHeight: '6.125rem' /* 98px */,
      },
    },
  },
  [theme.breakpoints.up('lg')]: {
    ...(decorated && {
      '> .MuiContainer-root': {
        padding: theme.spacing(30, 30, 0),
      },
    }),
    '.AwiInfoSection-image': {
      top: -260,
      maxWidth: 540,
    },
  },
}));

// const badgeList = ['analytics.jpg', 'ethereum-blue.svg', 'swap.svg', 'ethereum-yellow.svg'];

interface Props {
  items: StatsData;
}

export const statsFormatters: StatsFormatter[] = [
  { value: 'amount', subValues: ['usd'] },
  { value: 'amount', subValues: ['usd'] },
  { value: 'usd' },
  { value: 'amount', subValues: ['percent'] },
];

export default function StatsSection({ items }: Props) {
  const t = usePageTranslation();
  const { connected } = useAppSelector((state) => ({
    connected: state.account.connected,
  }));
  return (
    <>
      <Root decorated={!connected}>
        {/* {!connected && (
          <ul className="badges">
            {badgeList.map((filename, index) => (
              <li key={index}>
                <img src={`images/icons/${filename}`} alt="" title={t(`stats-section.badges.${index}`)} />
              </li>
            ))}
          </ul>
        )} */}
        {!connected && (
          <div className="AwiInfoSection-image">
            <img src="/images/pages/landing/eagle.svg" alt="" />
          </div>
        )}
        <Typography variant="h1">
          <Trans
            i18nKey={'stats-section.title'}
            t={t}
            components={[<span key="span1" className="Awi-small" />, <span key="span2" className="Awi-highlight" />]}
          />
        </Typography>
        {/* {connected && (
          <Box mb={20}>
            <Typography mx="auto" mb={10}>
              {t('stats-section.description')}
            </Typography>
            <Button component={Link} href="/market">
              {t('stats-section.cta')}
            </Button>
          </Box>
        )} */}
        <StatsItems items={items} formatters={statsFormatters} maxWidth="lg" />
      </Root>
    </>
  );
}
