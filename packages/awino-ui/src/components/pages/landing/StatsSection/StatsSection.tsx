import { useCallback, useState } from 'react';

import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor';

import { Container, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import trimEnd from 'lodash/trimEnd';

import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';

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
  '.card': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '300px',
    height: '100%',
    padding: theme.spacing(12, 7, 11),
    margin: '0 auto',
    borderRadius: +theme.shape.borderRadius * 5,
    backgroundColor: theme.palette.background.transparent,
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
  items: any;
}
export default function StatsSection({ items }: Props) {
  const t = usePageTranslation();
  const [glanced, setGlanced] = useState(false);

  const handleVisibilityChange = useCallback(
    (isVisible: boolean) => {
      if (!glanced && isVisible) {
        setGlanced(true);
      }
    },
    [glanced, setGlanced]
  );

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
        <VisibilitySensor
          active={!glanced}
          partialVisibility
          offset={{ bottom: 100 }}
          onChange={handleVisibilityChange}
        >
          <Container maxWidth="lg">
            <Grid container spacing={8}>
              {items.map(({ value, subvalue }, index) => {
                const formatter = (value: number) => {
                  return t(`stats-section.items.${index}.value`, { v: trimEnd(`${value}`, '0') });
                };
                return (
                  <Grid key={index} item xs={12} sm={6} lg={3}>
                    <div className="card">
                      <h2>
                        <Typography
                          variant="h3"
                          fontWeight={600}
                          component="span"
                          sx={{
                            display: 'block',
                            mb: 3,
                          }}
                        >
                          {glanced ? (
                            <CountUp delay={0} end={value} duration={2} decimals={2} formattingFn={formatter}>
                              {({ countUpRef }) => <span ref={countUpRef} />}
                            </CountUp>
                          ) : (
                            <span>&nbsp;</span>
                          )}
                        </Typography>
                        <Typography
                          variant="body-md"
                          fontWeight={500}
                          component="span"
                          color="text.primary"
                          sx={{ display: 'block', mb: 1.5 }}
                        >
                          {t(`stats-section.items.${index}.title`)}
                        </Typography>
                      </h2>
                      {subvalue && (
                        <Typography variant="body-sm" fontWeight={500}>
                          {t(`stats-section.items.${index}.subvalue`, { v: subvalue })}
                        </Typography>
                      )}
                    </div>
                  </Grid>
                );
              })}
            </Grid>
          </Container>
        </VisibilitySensor>
      </Root>
    </>
  );
}
