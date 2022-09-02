import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import Section from '@/components/layout/Section/Section';
import StatsItems from '@/components/pages/shared/StatsItems/StatsItems';
import usePageTranslation from '@/hooks/usePageTranslation';
import { StatsData, StatsFormatter } from '@/types/app';

const Root = styled(Section)(({ theme }) => ({
  '.LabBriefSection-panel': {
    ...theme.mixins.panel,
  },
  '.LabBriefSection-header': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.mixins.divider,
    padding: theme.spacing(8, 6, 6),
    marginBottom: theme.spacing(8, 6, 6),
    img: {
      marginRight: theme.spacing(3),
    },
  },
  '.AwiStatsCard-root': {
    padding: theme.spacing(8),
    margin: '0 auto',
    background: 'none',
  },
  [theme.breakpoints.up('md')]: {},
}));

interface Props {
  items: StatsData;
}

export const statsFormatters: StatsFormatter[] = [
  { value: 'amount' },
  { value: 'amount' },
  { value: 'amount' },
  { value: 'amount' },
];

export default function BriefSection({ items }: Props) {
  const t = usePageTranslation();
  return (
    <Root>
      <div className="LabBriefSection-panel">
        <div className="LabBriefSection-header">
          <img src={`/images/logo-small.svg`} alt="" width={44} height={38} />
          <Typography variant="h4" component="h1" color="text.active" className="Awi-golden">
            {t('brief-section.title')}
          </Typography>
        </div>
        <StatsItems items={items} formatters={statsFormatters} />
      </div>
    </Root>
  );
}
