import clsx from 'clsx';

import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import Loader from '@/components/general/Loader/Loader';
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
    margin: theme.spacing(18.5, 0, 6, 10),
    ...theme.typography.body,
    fontWeight: 500,
    color: theme.palette.text.secondary,
    '&.Awi-first': {
      margin: theme.spacing(0, 0, 6, 10),
    },
  },
  '.AwiContractSection-panel > .AwiPanel-content': {
    padding: theme.spacing(12.5, 6.5, 10),
  },
  '.AwiContractSection-subPanel': {
    '.AwiPanel-content': { padding: theme.spacing(4, 6.5, 5) },
  },
  [theme.breakpoints.up('md')]: {
    '.AwiContractSection-panel > .AwiPanel-content': {
      padding: theme.spacing(12.5, 20, 20),
    },
    '.AwiBalanceSection-subPanel': {
      '.AwiPanel-content': { padding: theme.spacing(4, 12, 5, 15) },
    },
  },
}));

interface Props {
  items: ContractsGrouped;
  loading: boolean;
}

export default function ContractSection({ items, loading }: Props) {
  const t = usePageTranslation();
  const { tokens, stableCoins } = items;

  return (
    <Root>
      <Panel className="AwiContractSection-panel">
        <Typography variant="h1" color="text.active" className="AwiContractSection-title">
          {t('contract-section.title')}
        </Typography>
        {loading ? (
          <Loader />
        ) : (
          <>
            <Typography variant="h2" className="AwiContractSection-groupTitle Awi-first">
              {t('contract-section.group-tokens')}
            </Typography>
            <Panel className="AwiContractSection-subPanel">
              <Grid container>
                {tokens.map((item, itemIndex) => (
                  <Grid
                    key={item.key}
                    item
                    xs={12}
                    className={clsx({ 'Awi-divider': itemIndex !== tokens.length - 1 })}
                  >
                    <ContractCard item={item} />
                  </Grid>
                ))}
              </Grid>
            </Panel>
            <Typography variant="h2" className="AwiContractSection-groupTitle">
              {t('contract-section.group-stable-coins')}
            </Typography>
            <Panel className="AwiContractSection-subPanel">
              <Grid container>
                {stableCoins.map((item, itemIndex) => (
                  <Grid
                    key={item.key}
                    item
                    xs={12}
                    className={clsx({ 'Awi-divider': itemIndex !== stableCoins.length - 1 })}
                  >
                    <ContractCard item={item} />
                  </Grid>
                ))}
              </Grid>
            </Panel>
          </>
        )}
      </Panel>
    </Root>
  );
}
