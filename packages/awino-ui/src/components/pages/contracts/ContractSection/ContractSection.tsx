import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import Panel from '@/components/general/Panel/Panel';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';
import { ContractsGrouped } from '@/types/app';

import ContractCard from './ContractCard';

const Root = styled(Section)(({ theme }) => ({
  '.AwiContractSection-title': {
    marginBottom: theme.spacing(10),
  },
  '.AwiContractSection-groupTitle': {
    ...theme.typography.body,
    fontWeight: 500,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(6),
  },
  '.AwiPanel-root': {
    '.content': {
      padding: theme.spacing(5.5, 6.5, 10),
    },
    '&.AwiPanel-wrapper': {
      '.content': {
        padding: theme.spacing(12.5, 6.5, 10),
      },
    },
  },
  [theme.breakpoints.up('md')]: {
    '.AwiPanel-root': {
      '.content': {
        padding: theme.spacing(5.5, 12.5, 10),
      },
      '&.AwiPanel-wrapper': {
        '.content': {
          padding: theme.spacing(12.5, 12.5, 10),
        },
      },
    },
  },
}));

interface Props {
  items: ContractsGrouped;
}

export default function ContractSection({ items }: Props) {
  const t = usePageTranslation();
  const { tokens, stableCoins } = items;

  return (
    <Root>
      <Panel className="AwiPanel-wrapper">
        <Typography variant="h1" color="text.active" className="AwiContractSection-title">
          {t('contract-section.title')}
        </Typography>
        <Typography variant="h2" className="AwiContractSection-groupTitle">
          {t('contract-section.group-tokens')}
        </Typography>
        <Grid container spacing={6.5} mb={25}>
          {tokens.map((item) => (
            <Grid key={item.key} item xs={12}>
              <ContractCard item={item} />
            </Grid>
          ))}
        </Grid>
        <Typography variant="h2" className="AwiContractSection-groupTitle">
          {t('contract-section.group-stable-coins')}
        </Typography>
        <Panel sx={{ p: 0 }}>
          <Grid container sx={{ '.MuiGrid-item:last-child .AwiContactCard-root': { border: 0 } }}>
            {stableCoins.map((item) => (
              <Grid key={item.key} item xs={12}>
                <ContractCard item={item} mode="row" />
              </Grid>
            ))}
          </Grid>
        </Panel>
      </Panel>
    </Root>
  );
}
