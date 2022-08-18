import * as React from 'react';

import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Label from '@/components/general/Label/Label';
import Trend from '@/components/general/Trend/Trend';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatUSD } from '@/lib/formatters';

import Panel from '../../../general/Panel/Panel';

import { PolPurchaseData } from './PurchaseSection';

interface Props {
  data: PolPurchaseData;
}
export default function InfoPanel({ data }: Props) {
  const t = usePageTranslation();
  const { source: from, target: to, oldRate: currentPrice, rate: offeredPrice } = data;

  return (
    <Panel
      header={
        <Label id="infoTitle" className="label Awi-golden" component="h2">
          {t(`purchase-section.info.title`, { from, to })}
        </Label>
      }
    >
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="70%">{t('purchase-section.info.description')}</TableCell>
              <TableCell width="30%">{t('purchase-section.info.token-price')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{t('purchase-section.info.current-price')}</TableCell>
              <TableCell>{formatUSD(currentPrice)}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>{t('purchase-section.info.offered-price', { to })}</TableCell>
              <TableCell sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <Typography component="span" color="text.primary" fontWeight={500} mr={5}>
                  {formatUSD(offeredPrice)}
                </Typography>
                <Trend component="span" value={offeredPrice.minus(currentPrice)} formatter={formatUSD} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Panel>
  );
}
