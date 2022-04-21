import { Trans } from 'next-i18next';

import { /* Box, Button, */ Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// import { useAppSelector } from '@/app/hooks';
// import Link from '@/components/general/Link/Link';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';
import { StatsData } from '@/types/app';

import StatsItems from '../../shared/StatsItems/StatsItems';

const Root = styled(Section)(({ theme }) => ({
  textAlign: 'center',
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
    h1: {
      fontSize: '5rem' /* 80px */,
      lineHeight: '8rem' /* 128px */,
      '.Awi-small': {
        fontSize: '3.75rem' /* 60px */,
        lineHeight: '6.125rem' /* 98px */,
      },
    },
  },
}));

// const badgeList = ['analytics.jpg', 'ethereum-blue.svg', 'swap.svg', 'ethereum-yellow.svg'];

interface Props {
  items: StatsData;
}
export default function StatsSection({ items }: Props) {
  const t = usePageTranslation();
  // const { connected } = useAppSelector((state) => ({
  //   connected: state.account.connected,
  // }));
  return (
    <>
      <Root>
        {/* {!connected && (
          <ul className="badges">
            {badgeList.map((filename, index) => (
              <li key={index}>
                <img src={`images/icons/${filename}`} alt="" title={t(`stats-section.badges.${index}`)} />
              </li>
            ))}
          </ul>
        )} */}
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
        <StatsItems items={items} maxWidth="lg" />
      </Root>
    </>
  );
}
