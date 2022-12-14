import React from 'react';

import { useTranslation } from 'next-i18next';

import { styled } from '@mui/material/styles';

import Card from '@/components/general/Card/Card';
import Label from '@/components/general/Label/Label';
import LabelValue from '@/components/general/LabelValue/LabelValue';
import LoadingButton from '@/components/general/LoadingButton/LoadingButton';
import usePageTranslation from '@/hooks/usePageTranslation';
import useSnack from '@/hooks/useSnack';
import { formatAmount, formatAWI, formatDatePretty, formatNumber, formatPercent, formatUSD } from '@/lib/formatters';

const Root = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  '.Awi-expand': {
    flex: 1,
  },
  '.AwiStatsCard-labelValueHighlighted': {
    borderRadius: +theme.shape.borderRadius * 2,
    backgroundColor: theme.palette.background.main,
  },

  // '.AwiGenerateCard-balance': {
  //   display: 'flex',
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   width: '100%',
  //   padding: theme.spacing(0, 2, 0),
  //   margin: theme.spacing(2, 0, 11),
  // },
  '.Awi-divider': {
    margin: theme.spacing(8.5, 0, 12.5),
  },
}));

interface Values {
  amount: number;
  lockUntil: number;
}

interface Props {
  data: any;
}

let resError = 0;

export default function StatsCard({ data }: Props) {
  const t = usePageTranslation({ keyPrefix: 'details-section.stats-card' });
  const {
    t: tRaw,
    i18n: { language },
  } = useTranslation();

  const snack = useSnack();

  // const [loading, setLoading] = useState(false);
  // const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    // setLoading(true);
    // setDone(false);

    try {
      const res = await new Promise<{ error: boolean; result: Record<string, any> }>((res) =>
        // TODO PROTOTYPE
        setTimeout(() => {
          res({ error: !resError++, result: {} });
        }, 4000)
      );
      if (res.error) {
        snack(t('message.submit-failed'), 'error');
      } else {
        snack(t('message.submit-succeeded'));
        // setDone(true);
      }
    } catch (error) {
      snack(t('message.submit-failed'), 'error');
    } finally {
      // setLoading(false);
    }
  };
  return (
    <Root>
      <Label className="AwiDetailsSection-cardTitle">{t(`title`)}</Label>
      <LabelValue
        id="totalAwiLocked"
        className="AwiStatsCard-labelValueHighlighted"
        value={formatAWI(data.totalAWILocked)}
        labelProps={{ children: t('total-awi-locked') }}
      />
      <LabelValue
        id="totalAwiLockedValue"
        value={formatUSD(data.totalAWILockedValue)}
        labelProps={{ children: t('total-awi-locked-value') }}
      />
      <LabelValue
        id="averageUnlockTime"
        value={formatNumber(data.averageUnlockTime)}
        labelProps={{ children: t('average-unlock-time') }}
      />
      <LabelValue
        id="nextDistribution"
        value={formatDatePretty(data.nextDistribution)}
        labelProps={{ children: t('next-distribution') }}
      />
      <div className="Awi-divider" />
      <Label className="AwiDetailsSection-cardTitle">{t(`last-week-stats`)}</Label>
      <LabelValue id="distribution" value={formatAWI(data.distribution)} labelProps={{ children: t('distribution') }} />
      <LabelValue
        id="distributionValue"
        value={formatUSD(data.distributionValue)}
        labelProps={{ children: t('distribution-value') }}
      />
      <LabelValue
        id="awiPerInfinity"
        value={formatAmount(data.awiPerInfinity)}
        labelProps={{ children: t('awi-per-infinity') }}
      />
      <LabelValue id="apr" value={formatPercent(data.apr)} labelProps={{ children: t('apr') }} sx={{ mb: 4.5 }} />
      <div className="Awi-expand" />
      <LoadingButton
        type="submit"
        fullWidth
        // disabled={isSubmitting}
        // loading={isSubmitting}
        // done={isCompleted}
      >
        {t('claim')}&nbsp;
        {formatAWI(data.claimAmount)}&nbsp;
        <img src={`/images/assets/awi.svg`} alt="" width={30} height={30} />
      </LoadingButton>
    </Root>
  );
}
