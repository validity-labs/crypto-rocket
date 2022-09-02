import React, { useCallback, useState } from 'react';

import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { CHART_COLORS } from '@/app/constants';
import Card from '@/components/general/Card/Card';
import Label from '@/components/general/Label/Label';
import Search from '@/components/general/Search/Search';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatLPPair, formatNumber, formatPercent } from '@/lib/formatters';

import AssetIcons from '../../swap/SwapSection/AssetIcons';

import { GlobalVoteItem } from './DetailsSection';
import DoughnutChart from './DoughnutChart';

const Root = styled(Card)(({ theme }) => ({
  height: '100%',
  backgroundColor: theme.palette.background.panel,
  '&:before': {
    content: 'none',
  },
  '.AwiGlobalVotesCard-header': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(6),
    width: '100%',
    margin: theme.spacing(0, 0, 11),
    form: {
      flex: 1,
      textAlign: 'end',
      alignSelf: 'end',
      width: 'auto',
    },
    '.AwiDetailsSection-cardTitle': {
      margin: 0,
    },
  },
  '.MuiTableContainer-root': {
    maxHeight: 400,
  },
  '.MuiTableBody-root .MuiTableRow-root': {
    borderTop: `1px solid ${theme.palette.divider} !important`,
  },
  [theme.breakpoints.up('md')]: {
    '.AwiGlobalVotesCard-header': {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  },
}));

interface Props {
  items: GlobalVoteItem[];
}

export default function GlobalVotesCard({ items }: Props) {
  const t = usePageTranslation({ keyPrefix: 'details-section.global-votes-card' });
  const [term, setTerm] = useState<string>('');

  const handleSearch = useCallback(
    (newTerm: string) => {
      if (term !== newTerm) {
        setTerm(newTerm);
      }
    },
    [term]
  );

  return (
    <Root>
      <Grid container spacing={10}>
        <Grid item xs={12} md={8}>
          <div className="AwiGlobalVotesCard-header">
            <Label className="AwiDetailsSection-cardTitle">{t(`title`)}</Label>
            <Search onSearch={handleSearch} size="small" />
          </div>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell width="40%">{t('field.boosted')}</TableCell>
                  <TableCell width="30%">{t('field.votes')}</TableCell>
                  <TableCell width="30%">{t('field.percentage')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map(({ pair, votes, percent }, mdi) => (
                  <TableRow key={pair.join('-')}>
                    <TableCell>
                      <div className="Awi-row">
                        {/* @ts-expect-error */}
                        <AssetIcons component="div" ids={pair} size="medium" sx={{ display: 'inline-block' }} />
                        <Typography color="text.primary">{formatLPPair(pair)}</Typography>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Typography color="text.primary">{formatNumber(votes)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color="text.primary">{formatPercent(percent)}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} md={4}>
          <Label className="AwiDetailsSection-cardTitle">{t(`current-weighting`)}</Label>
          <DoughnutChart data={items} colors={CHART_COLORS} i18nKey="global-votes-card" />
        </Grid>
      </Grid>
    </Root>
  );
}
