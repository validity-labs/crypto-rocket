import React, { useCallback, useState } from 'react';

import { StringIterator } from 'lodash';

import {
  Alert,
  FormControlLabel,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { CHART_COLORS } from '@/app/constants';
import Card from '@/components/general/Card/Card';
import Label from '@/components/general/Label/Label';
import LoadingButton from '@/components/general/LoadingButton/LoadingButton';
import Search from '@/components/general/Search/Search';
import Switch from '@/components/general/Switch/Switch';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatLPPair, formatNumber, formatPercent } from '@/lib/formatters';

import AssetIcons from '../../swap/SwapSection/AssetIcons';

import { GlobalVoteItem } from './DetailsSection';
import DoughnutChart from './DoughnutChart';

const Root = styled(Card)(({ theme }) => ({
  height: '100%',
  backgroundColor: theme.palette.background.light, //'#082938',
  '&:before': {
    content: 'none',
  },
  '.AwiBoastFarmCard-header': {
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
  '.AwiBoastFarmCard-note': {
    display: 'inline-block',
    padding: theme.spacing(4, 5),
    borderRadius: +theme.shape.borderRadius * 2,
    backgroundColor: theme.palette.background.main,
  },
  '.AwiBoastFarmCard-distributionHelper': {
    margin: theme.spacing(4.5, 0, 7.5),
    '.MuiFormControlLabel-label': {
      fontWeight: 500,
    },
  },
  '.Awi-divider': {
    margin: theme.spacing(8.5, 0),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  '.MuiTableContainer-root': {
    maxHeight: 400,
    margin: theme.spacing(0, 0, 11),
  },
  '.MuiTableBody-root .MuiTableRow-root': {
    borderTop: `1px solid ${theme.palette.divider} !important`,
  },
  [theme.breakpoints.up('md')]: {
    '.AwiBoastFarmCard-header': {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  },
}));

interface Props {
  items: GlobalVoteItem[];
}

export default function BoastFarmCard({ items }: Props) {
  const t = usePageTranslation({ keyPrefix: 'details-section.boast-farm-card' });
  const [term, setTerm] = useState<string>('');
  const [toggle, setToggle] = useState(false);

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
          <div className="AwiBoastFarmCard-header">
            <Label className="AwiDetailsSection-cardTitle" tooltip={t(`title-hint`)}>
              {t(`title`)}
            </Label>
            <Search onSearch={handleSearch} size="small" />
          </div>
          <Typography variant="body-xs" color="text.active" className="AwiBoastFarmCard-note">
            {t(`note`)}
          </Typography>
          <div className="AwiBoastFarmCard-distributionHelper">
            <FormControlLabel
              sx={{ ml: 0 }}
              control={<Switch checked={toggle} setChecked={setToggle} sx={{ ml: 4.5 }} />}
              labelPlacement="start"
              label={t(`distribution-helper`) as string}
            />
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
          <LoadingButton
            type="submit"
            fullWidth
            disabled
            // disabled={isSubmitting}
            // loading={isSubmitting}
            // done={isCompleted}
          >
            {t('vote-weight-total')}
          </LoadingButton>
          <Typography variant="body-xs" fontWeight="medium" mt={5}>
            {t('new-vote-weighting')}&nbsp;{formatPercent(0)}
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Label className="AwiDetailsSection-cardTitle">{t(`current-weighting`)}</Label>
          <DoughnutChart data={items} colors={CHART_COLORS} i18nKey="global-votes-card" />
        </Grid>
      </Grid>

      {/* <div className="Awi-divider" /> */}
    </Root>
  );
}
