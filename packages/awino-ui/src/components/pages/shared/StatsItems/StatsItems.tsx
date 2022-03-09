import { useCallback, useState } from 'react';

import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor';

import trimEnd from 'lodash/trimEnd';

import { Container, ContainerProps, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import usePageTranslation from '@/hooks/usePageTranslation';
import { StatsData } from '@/types/pages/landing';

const Root = styled(Container)(({ theme }) => ({
  '.card': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '280px',
    height: '100%',
    padding: theme.spacing(12, 7, 11),
    margin: '0 auto',
    borderRadius: +theme.shape.borderRadius * 5,
    backgroundColor: theme.palette.background.transparent,
  },
}));

interface Props extends ContainerProps {
  items: StatsData;
}

export default function StatsItems({ items, ...containerProps }: Props) {
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
  const gridItemLG = 12 / items.length;
  return (
    <Root {...containerProps}>
      <VisibilitySensor active={!glanced} partialVisibility offset={{ bottom: 100 }} onChange={handleVisibilityChange}>
        <Grid container spacing={8}>
          {items.map(({ value, subvalue }, index) => {
            const formatter = (value: number) => {
              return t(`stats-section.items.${index}.value`, { v: trimEnd(`${value}`, '0') });
            };
            return (
              <Grid key={index} item xs={12} sm={6} lg={gridItemLG}>
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
      </VisibilitySensor>
    </Root>
  );
}
