import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';
import { StatsData } from '@/types/pages/landing';

import StatsItems from '../../shared/StatsItems/StatsItems';

const Root = styled(Section)(({ theme }) => ({
  textAlign: 'center',
  h1: {
    marginBottom: theme.spacing(7.5),
    fontFamily: 'MuseoModerno, cursive',
    fontWeight: 400,
  },
  '.badges': {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    margin: theme.spacing(0, 'auto', 3.5),
    li: {
      margin: theme.spacing(1.5),
    },
    img: {
      width: 52,
      height: 52,
      padding: theme.spacing(2),
      borderRadius: +theme.shape.borderRadius * 2,
      backgroundColor: theme.palette.background.transparent,
    },
  },
  [theme.breakpoints.up('md')]: {
    h1: {
      fontSize: '5rem' /* 80px */,
      lineHeight: '8rem' /* 128px */,
    },
  },
}));

const badgeList = ['analytics.jpg', 'ethereum-blue.svg', 'swap.svg', 'ethereum-yellow.svg'];

interface Props {
  items: StatsData;
}
export default function StatsSection({ items }: Props) {
  const t = usePageTranslation();

  return (
    <>
      <Root>
        <ul className="badges">
          {badgeList.map((filename, index) => (
            <li key={index}>
              <img src={`images/icons/${filename}`} alt="" title={t(`stats-section.badges.${index}`)} />
            </li>
          ))}
        </ul>
        <Typography variant="h1">{t('stats-section.title')}</Typography>
        <StatsItems items={items} maxWidth="lg" />
      </Root>
    </>
  );
}
