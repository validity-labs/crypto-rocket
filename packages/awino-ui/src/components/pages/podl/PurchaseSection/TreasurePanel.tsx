import { useState } from 'react';

import { ButtonBase, Collapse, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import AssetAmount from '@/components/general/AssetAmount/AssetAmount';
import Label from '@/components/general/Label/Label';
import Link from '@/components/general/Link/Link';
import SwappingImage from '@/components/general/SwappingImage/SwappingImage';
import ExpandIcon from '@/components/icons/ExpandIcon';
import LinkIcon from '@/components/icons/LinkIcon';
import TreasureIcon from '@/components/icons/TreasureIcon';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatAmount, formatPercent } from '@/lib/formatters';

import Panel from '../../../general/Panel/Panel';

import { PodlPurchaseData } from './PurchaseSection';

const Root = styled(Panel)(({ theme }) => ({
  '.content': {
    padding: theme.spacing(0),
  },
  '.subcontent': {
    padding: theme.spacing(8, 5, 12),
  },
  '.summary': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: '100%',
    padding: theme.spacing(10, 5, 7.5),
    borderRadius: +theme.shape.borderRadius * 5,
    cursor: 'pointer',
    '.left': {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
  },
  '.summary-title': {
    color: theme.palette.text.active,
    textTransform: 'uppercase',
    svg: {
      position: 'relative',
      top: -2,
      margin: theme.spacing(0, 5, 0, 1),
      color: 'inherit',
    },
  },
  '.summary-amount': {
    textTransform: 'uppercase',
  },
  '.summary-images': {
    margin: theme.spacing(0, 4),
  },
  '.with-border': {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  '.link': {
    display: 'flex',
    flexDirection: 'row',
    svg: {
      marginLeft: theme.spacing(2),
    },
  },
  '.asset-amount': {
    '.icon': {
      margin: theme.spacing(1, 2, 0),
    },
    '.value': {
      lineHeight: '1.125rem',
    },
    '.alt': {
      color: theme.palette.text.secondary,
    },
  },
  '.subcontent-title': {
    marginBottom: theme.spacing(2),
    fontWeight: 600,
  },
  '& .MuiTableCell-root': {
    verticalAlign: 'top',
    padding: theme.spacing(5, 4, 6),
  },
  [theme.breakpoints.up('md')]: {
    '.subcontent': {
      padding: theme.spacing(8, 5, 12, 10.5),
    },
    '.summary': {
      padding: theme.spacing(10, 5, 7.5, 10.5),
    },
  },
}));

interface Props {
  data: PodlPurchaseData;
  treasury: any;
}

export default function TreasurePanel({ data, treasury }: Props) {
  const t = usePageTranslation();
  const { source, target } = data;
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded((prev) => !prev);
  };
  return (
    <Root>
      <div className="content">
        <ButtonBase className="summary" onClick={handleExpand}>
          <div className="left">
            <Label component="h2" variant="body-xl" className="summary-title">
              {t(`purchase-section.treasury.title`)} <TreasureIcon />
            </Label>
            <Typography variant="body-md" color="text.primary" className="summary-amount">
              {formatAmount(treasury.amount)}
            </Typography>
            <SwappingImage source={source} target={target} className="summary-images" />
            <Typography variant="body-md" color="text.primary">
              {t(`common.${target}`, { ns: 'common' })}
            </Typography>
          </div>
          {<ExpandIcon sx={{ fontSize: '32px', transform: `rotate(${expanded ? 180 : 0}deg)` }} />}
        </ButtonBase>
        <Collapse in={expanded}>
          <div className="subcontent">
            <Typography variant="h5" component="h3" className="subcontent-title">
              {t(`purchase-section.treasury.info`)}
            </Typography>
            <Typography
              variant="body-md"
              className="link"
              color="text.active"
              component={Link}
              href={`https://todo`}
              mb={11.5}
            >
              {t(`purchase-section.treasury.view-contract`)}
              <LinkIcon />
            </Typography>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow className="with-border">
                    <TableCell>
                      <Label tooltip={t('purchase-section.treasury.total-share-hint')}>
                        {t('purchase-section.treasury.total-share')}
                      </Label>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body-md" color="text.primary">
                        {formatPercent(treasury.totalShare)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow className="with-border">
                    <TableCell>
                      <Typography variant="body-md" color="text.primary">
                        {t('purchase-section.treasury.in-treasure')}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <AssetAmount
                        asset={treasury.inTreasury.asset}
                        match={treasury.inTreasury.match}
                        value={treasury.inTreasury.value}
                        altAsset="usd"
                        altValue={treasury.inTreasury.assetInUSD}
                        size="small"
                        className="asset-amount"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className="with-border">
                    <TableCell>
                      <Typography variant="body-md" color="text.primary">
                        {t('purchase-section.treasury.breakdown')}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <AssetAmount
                        asset={treasury.breakdown[0].asset}
                        value={treasury.breakdown[0].value}
                        altAsset="usd"
                        altValue={treasury.breakdown[0].assetInUSD}
                        size="small"
                        className="asset-amount"
                        sx={{ mb: 5 }}
                      />
                      <AssetAmount
                        asset={treasury.breakdown[1].asset}
                        value={treasury.breakdown[1].value}
                        altAsset="usd"
                        altValue={treasury.breakdown[1].assetInUSD}
                        size="small"
                        className="asset-amount"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body-md" color="text.primary">
                        {t('purchase-section.treasury.total-source-sold', { from: treasury.totalSold.asset })}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <AssetAmount
                        asset={treasury.totalSold.asset}
                        value={treasury.totalSold.value}
                        altAsset="usd"
                        altValue={treasury.totalSold.assetInUSD}
                        size="small"
                        className="asset-amount"
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Collapse>
      </div>
    </Root>
  );
}
