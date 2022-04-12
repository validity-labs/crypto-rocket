import { useState } from 'react';

import clsx from 'clsx';

import { ButtonBase, Collapse, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import LabelValue from '@/components/general/LabelValue/LabelValue';
import LoadingText from '@/components/general/LoadingText/LoadingText';
import ExpandIcon from '@/components/icons/ExpandIcon';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatUSD } from '@/lib/formatters';

const Root = styled(Section)(({ theme }) => ({
  paddingTop: 0,
  '.AwiDetailsSection-panel': {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: +theme.shape.borderRadius * 5,
    backgroundColor: theme.palette.background.transparent,
    overflow: 'hidden',
  },
  '.AwiDetailsSection-toggle': {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    padding: theme.spacing(5.5, 6.5, 5),
  },
  '.AwiDetailsSection-content': {
    padding: theme.spacing(5, 6.5, 5.5),
  },
  '.Awi-expanded': {
    '.AwiDetailsSection-toggle': {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  },

  '.AwiLabelValue-label': {
    margin: theme.spacing(0, 4, 0, 0),
    fontWeight: 400,
    color: theme.palette.text.secondary,
  },
  '.AwiLabelValue-value': {
    flex: 'auto',
    ...theme.typography['body-md'],
    fontWeight: 400,
    textAlign: 'right',
  },
  [theme.breakpoints.up('sm')]: {
    '.AwiLabelValue-root': {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  },
  [theme.breakpoints.up('md')]: {
    '.AwiDetailsSection-toggle': {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(18),
      padding: theme.spacing(8.5, 12, 6),
    },
    '.AwiDetailsSection-content': {
      padding: theme.spacing(6, 12, 8.5),
    },
  },
}));

const items = [
  {
    i18nKey: 'staking-apr',
    prop: 'stakingAPR',
  },
  {
    i18nKey: 'lp-token-price',
    prop: 'lpTokenPrice',
  },
  {
    i18nKey: 'total-lp-tokens-staked',
    prop: 'totalLPTokensStaked',
  },
  {
    i18nKey: 'total-rewards-per-day',
    prop: 'totalRewardsPerDay',
  },
  {
    i18nKey: 'total-rewards-per-week',
    prop: 'totalRewardsPerWeek',
  },
];

export interface LiquidityStakingDetailsData {
  stakingAPR: number;
  totalRewardsPerDay: number;
  lpTokenPrice: number;
  totalRewardsPerWeek: number;
  totalLPTokensStaked: number;
}

interface Props {
  data: LiquidityStakingDetailsData;
  loading: boolean;
}

export default function DetailsSection({ data, loading }: Props) {
  const t = usePageTranslation();
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded((prev) => !prev);
  };
  return (
    <Root>
      <div className={clsx('AwiDetailsSection-panel', { 'Awi-expanded': expanded })}>
        <ButtonBase className="AwiDetailsSection-toggle" onClick={handleExpand}>
          <Typography variant="h7" component="h2" color="text.active">
            {t(`details-section.title`)}
          </Typography>
          {<ExpandIcon sx={{ fontSize: '32px', transform: `rotate(${expanded ? 180 : 0}deg)` }} />}
        </ButtonBase>
        <Collapse in={expanded}>
          <Grid container className="AwiDetailsSection-content" rowSpacing={6} columnSpacing={23}>
            {items.map(({ i18nKey, prop }) => (
              <Grid key={prop} item xs={12} md={6} lg={4}>
                <LabelValue
                  id={prop}
                  className="AwiLabelValue-root"
                  value={<LoadingText loading={loading} text={formatUSD(data[prop])} />}
                  labelProps={{
                    /* @ts-ignore */
                    component: 'h3',
                    children: t(`details-section.${i18nKey}`),
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Collapse>
      </div>
    </Root>
  );
}
