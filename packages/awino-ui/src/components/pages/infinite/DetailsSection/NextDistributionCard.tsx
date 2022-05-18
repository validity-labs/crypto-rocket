import React, { useMemo, useState, useEffect, memo } from 'react';

import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import Card from '@/components/general/Card/Card';
import Label from '@/components/general/Label/Label';
import usePageTranslation from '@/hooks/usePageTranslation';

import { DateToNowDiff, DateToNowDiffKeys, getDateToNowDiff } from './helpers/getDateToNowDiff';

const Root = styled(Card)(({ theme }) => ({
  '.AwiTimeLeft-root': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
    width: '100%',
    color: theme.palette.text.primary,
  },
  '.AwiTimeLeft-item': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  '.AwiTimeLeft-top': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2.5),
    '& > p': {
      minWidth: '52px',
      padding: theme.spacing(4.5, 5),
      borderRadius: +theme.shape.borderRadius * 2,
      color: 'inherit',
      textAlign: 'center',
      transform: 'scale3d(1, 1, 1)',
      backgroundColor: theme.palette.background.transparent,
      '&.pulse': {
        animation: 'pulse 200ms ease alternate',
      },
      '&.pulseAlt': {
        animation: 'pulseAlt 200ms ease alternate',
      },
      '@media (prefers-reduced-motion)': {
        animation: 'none !important',
      },
      '@keyframes pulse': {
        to: {
          transform: 'scale3d(1.05, 1.05, 1.05)',
          backgroundColor: 'rgba(255,255,255,0.06)',
        },
      },
      '@keyframes pulseAlt': {
        to: {
          transform: 'scale3d(1.05, 1.05, 1.05)',
          backgroundColor: 'rgba(255,255,255,0.06)',
        },
      },
    },
  },
}));

interface TimeLeftProps {
  endDate: Date;
}

const pulseStates = ['pulse', 'pulseAlt'];

const TimeLeft = memo(function TimeLeft({ endDate }: TimeLeftProps) {
  const t = usePageTranslation({ keyPrefix: 'details-section.next-distribution-card' });
  // return method with endDate in closure
  const getCurrentDateDiff = useMemo(() => getDateToNowDiff(endDate), [endDate]);

  const [{ values: diff }, setDiff] = useState<DateToNowDiff>(() => getCurrentDateDiff());

  // update diff values every second, until/unless getCurrentDateDiff tick value is set to false
  useEffect(() => {
    let timeoutId;
    (function loop() {
      timeoutId = setTimeout(function () {
        const newDiff = getCurrentDateDiff();
        if (!newDiff.tick) {
          if (timeoutId) {
            clearInterval(timeoutId);
          }
          return;
        }
        setDiff(newDiff);
        loop();
      }, 1000);
    })();

    return () => {
      if (timeoutId) {
        clearInterval(timeoutId);
      }
    };
  }, [endDate, setDiff, getCurrentDateDiff]);

  return (
    <div className="AwiTimeLeft-root">
      {(['days', 'hours', 'minutes', 'seconds'] as DateToNowDiffKeys[]).map((item, itemIndex) => (
        <div key={itemIndex} className="AwiTimeLeft-item">
          <div className="AwiTimeLeft-top">
            <Typography variant="body-md" className={pulseStates[diff[item].changed[0]]}>
              {diff[item].value[0]}
            </Typography>
            <Typography variant="body-md" className={pulseStates[diff[item].changed[1]]}>
              {diff[item].value[1]}
            </Typography>
          </div>
          <Typography variant="body-md" color="inherit" textAlign="center" textTransform="uppercase">
            {t(item)}
          </Typography>
        </div>
      ))}
    </div>
  );
});

interface Props {
  endDate: Date;
}

export default function NextDistributionCard({ endDate }: Props) {
  const t = usePageTranslation({ keyPrefix: 'details-section.next-distribution-card' });
  return (
    <Root>
      <Label className="AwiDetailsSection-cardTitle">{t('title')}</Label>
      <TimeLeft endDate={endDate} />
    </Root>
  );
}
