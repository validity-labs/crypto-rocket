import { useCallback, useState, memo } from 'react';

import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor';

import trimEnd from 'lodash/trimEnd';

import { Container, ContainerProps, Grid, GridProps, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import usePageTranslation from '@/hooks/usePageTranslation';
import { StatsData, StatsDataItem, StatsFormatter } from '@/types/app';

const StatsCard = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '280px',
  height: '100%',
  padding: theme.spacing(9.5, 7, 7),
  margin: '0 auto',
  borderRadius: +theme.shape.borderRadius * 5,
  backgroundColor: theme.palette.background.transparent,
  h2: {
    textAlign: 'center',
  },
}));

interface StatsItemProps {
  item: StatsDataItem;
  formatters: StatsFormatter;
  index: number;
  glanced: boolean;
  i18nKey?: string;
}

export const StatsItem = memo(function StatsItem({ item, formatters, index, glanced, i18nKey }: StatsItemProps) {
  const t = usePageTranslation({ keyPrefix: i18nKey });
  const { value, subValues } = item;

  const formatter = formatters.value;

  if (typeof formatter !== 'function') {
    throw new Error(`FormatterMethod is not defined for ${index} item`);
  }

  return (
    <StatsCard className="AwiStatsCard-root" data-test-id="AwiStatsItems-card">
      <h2>
        <Typography
          variant="h4"
          fontWeight={600}
          color="text.active"
          component="span"
          sx={{
            display: 'block',
            mb: 1,
          }}
          className="AwiStatsItem-value"
        >
          {glanced ? (
            <CountUp delay={0} end={value} duration={2} decimals={3} formattingFn={formatter}>
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
          sx={{ display: 'block' }}
          className="AwiStatsItem-title"
        >
          {t(`items.${index}.title`)}
        </Typography>
      </h2>
      {subValues?.map((subValue, subValueIndex) => {
        const subFormatter = formatters.subValues[subValueIndex];

        if (typeof subFormatter !== 'function') {
          throw new Error(`FormatterMethod is not defined for [${index}].subValues[${subValueIndex}] item`);
        }
        return (
          <Typography key={subValueIndex} variant="body-sm" fontWeight={500}>
            {t(`items.${index}.sub-values.${subValueIndex}`, { v: subFormatter(subValue) })}
          </Typography>
        );
      })}
    </StatsCard>
  );
});

interface Props extends ContainerProps {
  items: StatsData;
  formatters: StatsFormatter[];
  gridItemProps?: (index: number) => GridProps;
  i18nKey?: string;
}

function StatsItems({ items, formatters, gridItemProps, i18nKey = 'stats-section', ...containerProps }: Props) {
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
    <Container disableGutters {...containerProps}>
      <VisibilitySensor active={!glanced} partialVisibility offset={{ bottom: 100 }} onChange={handleVisibilityChange}>
        <Grid container spacing={8}>
          {items.map((item, index) => (
            <Grid
              key={index}
              item
              xs={12}
              sm={6}
              lg={gridItemLG}
              {...(typeof gridItemProps === 'function' && gridItemProps(index))}
            >
              <StatsItem glanced={glanced} item={item} index={index} formatters={formatters[index]} i18nKey={i18nKey} />
            </Grid>
          ))}
        </Grid>
      </VisibilitySensor>
    </Container>
  );
}

export default memo(StatsItems);
