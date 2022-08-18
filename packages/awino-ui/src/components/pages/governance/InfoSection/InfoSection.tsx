import { Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import LabelValue from '@/components/general/LabelValue/LabelValue';
import Panel from '@/components/general/Panel/Panel';
import InfoIcon from '@/components/icons/InfoIcon';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatAmount, formatUSD } from '@/lib/formatters';
import { GovernanceInfo } from '@/types/app';

const Root = styled(Section)(({ theme }) => ({
  '.AwiInfoSection-statsWrapper': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(8),
  },
  '.AwiInfoSection-stats': {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(10),
    padding: theme.spacing(7.5, 11),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: +theme.shape.borderRadius * 2,
    '.AwiLabelValue-root': {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    '.AwiLabelValue-label': {
      order: 1,
      margin: 0,
      ...theme.typography.body,
      fontWeight: 500,
      textTransform: 'uppercase',
    },
    '.AwiLabelValue-value': {
      ...theme.typography.h4,
      fontWeight: 600,
      color: '#C49132',
    },
  },
  [theme.breakpoints.up('sm')]: {
    '.AwiInfoSection-statsWrapper': {
      justifyContent: 'flex-start',
    },
  },
}));

interface Props {
  info: GovernanceInfo;
  loading: boolean;
}

export default function InfoSection({ info, loading }: Props) {
  const t = usePageTranslation({ keyPrefix: 'info-section' });

  return (
    <Root>
      <Panel className="AwiInfoSection-panel">
        <Typography variant="h3" component="h1" mb={7} className="Awi-golden">
          {t('title')}
        </Typography>
        <Typography variant="body" color="text.primary" mb={18}>
          {t('description')}
        </Typography>
        <div className="AwiInfoSection-statsWrapper">
          <div className="AwiInfoSection-stats">
            <LabelValue
              id="infoSectionTreasury"
              value={formatAmount(info.treasuryAmount)}
              labelProps={{ children: t('treasury') }}
            />
            <LabelValue
              id="infoSectionValueInUSD"
              value={formatUSD(info.treasuryAmountUSD)}
              labelProps={{ children: t('value-in-usd') }}
            />
          </div>
          <Tooltip title={t('treasury-hint')} placement="right">
            <span>
              <InfoIcon color="primary" fontSize="small" />
            </span>
          </Tooltip>
        </div>
      </Panel>
    </Root>
  );
}
