import { useState } from 'react';

import { Grid, Typography, Tab, Tabs as MuiTabs } from '@mui/material';
import { styled } from '@mui/material/styles';

import Panel from '@/components/general/Panel/Panel';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';
import { simpleTabA11yProps, simpleTabPanelA11yProps } from '@/lib/helpers';

const Tabs = styled(MuiTabs)(({ theme }) => ({
  position: 'relative',
  margin: theme.spacing(0, 0, 7),
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 5,
    borderRadius: 4,
    backgroundColor: theme.palette.text.secondary,
    zIndex: -1,
  },
  '& .MuiTabs-flexContainer': {
    justifyContent: 'space-between',
  },
  '& .MuiTabs-indicator': {
    height: 5,
    borderRadius: 4,
  },
  '& .MuiTab-root': {
    minWidth: 'auto',
    minHeight: 'auto',
    padding: theme.spacing(3, 4),
    ...theme.typography['body-sm'],
    fontWeight: 500,
    color: theme.palette.text.secondary,
    textTransform: 'none',
    '&.Mui-selected': {
      color: theme.palette.text.active,
    },
  },
  [theme.breakpoints.up('md')]: {
    '& .MuiTab-root': {
      flex: 1,
    },
  },
}));

const Root = styled(Section)(({ theme }) => ({
  // position: 'relative',
  // paddingTop: theme.spacing(40),
  // overflow: 'hidden',
  paddingTop: 0,
  '> .MuiContainer-root': {
    position: 'relative',
    paddingTop: theme.spacing(50),
  },
  '.AwiPanel-content': {
    padding: theme.spacing(11, 6, 10),
  },
  '.AwiInfoSection-image': {
    pointerEvents: 'none',
    position: 'absolute',
    top: -40,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: 240,
    img: {
      maxWidth: '100%',
    },
  },
  [theme.breakpoints.up('md')]: {
    '.AwiPanel-content': {
      padding: theme.spacing(26, 22.5, 25),
    },
    '> .MuiContainer-root': {
      padding: theme.spacing(80, 20, 0),
    },
    '.AwiInfoSection-image': {
      top: -40,
      right: 0,
      left: 'unset',
      maxWidth: 440,
      transform: 'none',
    },
  },
  [theme.breakpoints.up('lg')]: {
    '> .MuiContainer-root': {
      padding: theme.spacing(80, 30, 0),
    },
    '.AwiInfoSection-image': {
      top: -100,
      maxWidth: 540,
    },
  },
  [theme.breakpoints.up('xl')]: {
    '.AwiInfoSection-image': {
      top: -140,
      maxWidth: 606,
    },
  },
}));

const items = [1, 2, 3, 4, 5, 6];
const idPrefix = 'infoSectionTabN';

export default function InfoSection() {
  const t = usePageTranslation({ keyPrefix: 'info-section' });
  const [tab, setTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Root /* containerProps={{ maxWidth: 'lg' }} */>
      <div className="AwiInfoSection-image">
        <img src="/images/pages/landing/info.svg" alt="" />
      </div>
      <Panel>
        <Grid container rowSpacing={15} columnSpacing={26}>
          <Grid item xs={12} md={6}>
            <Typography variant="h3" component="h2" mb={10} fontWeight={400}>
              {t('title')}
            </Typography>
            <Tabs value={tab} onChange={handleTabChange} aria-label={t('tabs-aria')} variant="scrollable">
              {items.map((item, itemIndex) => (
                <Tab key={item} label={t(`items.${itemIndex}.title`)} {...simpleTabA11yProps(`${idPrefix}${item}`)} />
              ))}
            </Tabs>
            {items.map((item, itemIndex) => (
              <div
                key={item}
                role="tabpanel"
                hidden={tab !== itemIndex}
                {...simpleTabPanelA11yProps(`${idPrefix}${item}`)}
              >
                <Typography>{t(`items.${itemIndex}.description`)}</Typography>
              </div>
            ))}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography>{t('description')}</Typography>
          </Grid>
        </Grid>
      </Panel>
    </Root>
  );
}
