import { useState, useCallback } from 'react';

import { Box, Button, Collapse, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GridRow as MuiGridRow, GridRowProps } from '@mui/x-data-grid';
// import { useGridApiContext } from '@mui/x-data-grid';

import { useAppSelector } from '@/app/hooks';
import ConnectButton from '@/components/buttons/ConnectButton';
import LabelValue from '@/components/general/LabelValue/LabelValue';
import Link from '@/components/general/Link/Link';
import LinkIcon from '@/components/icons/LinkIcon';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatLPPair, formatNumber, formatPercent, formatUSD } from '@/lib/formatters';
import { AssetKeyPair } from '@/types/app';

const Root = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  overflow: 'auto',
  backgroundColor: theme.palette.background.transparent,
  borderRadius: +theme.shape.borderRadius * 6,
  margin: theme.spacing(0, 0, 3),
  '.AwiResultTable-details': {
    padding: theme.spacing(8.5, 8, 7),
  },
  '.AwiLabelValue-root': {
    padding: theme.spacing(4.5, 0),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  '.AwiLabelValue-label': {
    margin: theme.spacing(0, 4, 0, 0),
    fontWeight: 500,
    color: theme.palette.text.primary,
  },
  '.AwiLabelValue-value': {
    flex: 'auto',
    ...theme.typography.body,
    fontWeight: 500,
    textAlign: 'right',
  },
  '.AwiResultTable-valueHighlighted': {
    display: 'inline-block',
    padding: theme.spacing(1, 5, 0),
    borderRadius: +theme.shape.borderRadius,
    backgroundColor: '#092937',
    color: theme.palette.text.active,
  },
  '.AwiResultTable-harvest': {
    border: 0,
    margin: theme.spacing(0, 0, 4.5, 0),
    '.AwiLabelValue-label': {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  '.AwiResultCard-tooltip svg': {
    fontSize: '14px',
  },

  [theme.breakpoints.up('sm')]: {
    '.AwiLabelValue-root': {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  },
}));

interface Props {
  onHarvest: (pair: AssetKeyPair) => void;
  onApprove: (pair: AssetKeyPair) => void;
}
export default function GridRow(props: React.HTMLAttributes<HTMLDivElement> & GridRowProps & Props) {
  const t = usePageTranslation({ keyPrefix: 'result-section' });
  // const apiRef = useGridApiContext();
  // const { setEditCellValue, commitCellChange, setCellMode } = apiRef.current;
  // console.log(props);
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);
  const handleDetailsToggle = useCallback(
    () => {
      // const id = props.rowId;
      // const field = 'details';
      // const col = { id, field };
      setIsDetailExpanded((prevIsDetailExpanded) => {
        // setEditCellValue({ ...col, value: !prevIsDetailExpanded });
        // commitCellChange(col);
        // setCellMode(id, field, 'view');
        return !prevIsDetailExpanded;
      });
    },
    [
      /* props, setEditCellValue, commitCellChange, setCellMode */
    ]
  );

  const { onHarvest, onApprove, row } = props;

  const handleHarvest = useCallback(() => {
    onHarvest(row.pair);
  }, [row, onHarvest]);

  const handleApprove = useCallback(() => {
    onApprove(row.pair);
  }, [row, onApprove]);

  const { connected } = useAppSelector((state) => state.account);

  return (
    <Root>
      <MuiGridRow component="div" onClick={handleDetailsToggle} {...props} />
      <Collapse in={isDetailExpanded} appear>
        <Container maxWidth="sm">
          <div className="AwiResultTable-details">
            <LabelValue
              id="boostFactor"
              value={
                <Typography component="span" className="AwiResultTable-valueHighlighted">
                  {formatPercent(row.boostFactor)}
                </Typography>
              }
              labelProps={{
                children: t('your-boost-factor'),
                tooltip: t('your-boost-factor-hint'),
                variant: 'body',
              }}
              valueProps={{ color: 'text.secondary' }}
            />
            <LabelValue
              id="earned"
              className="AwiResultTable-harvest"
              value={
                <Button onClick={handleHarvest} disabled>
                  {t('harvest')}
                </Button>
              }
              labelProps={{
                children: (
                  <>
                    <Typography variant="body" component="span" color="text.primary" sx={{ display: 'block' }}>
                      {t('earned')}
                    </Typography>
                    <Typography variant="body-lg" component="span">
                      {formatNumber(row.earned)}
                    </Typography>
                  </>
                ),
                variant: 'body',
              }}
            />
            {connected ? <Button onClick={handleApprove}>{t('approve')}</Button> : <ConnectButton />}
            <LabelValue
              id="stake"
              value={
                <Box component="span" display="flex" justifyContent="flex-end" alignItems="center">
                  <Typography component="span" color="inherit">
                    {formatLPPair(row.pair)}
                  </Typography>
                  <Link href="/todo" ml={2}>
                    <LinkIcon />
                  </Link>
                </Box>
              }
              labelProps={{ children: t('stake'), variant: 'body', color: 'text.secondary' }}
              valueProps={{ color: 'text.primary' }}
            />
            <LabelValue
              id="lpPrice"
              mb={4.5}
              value={`~${formatUSD(row.lpPrice)}`}
              labelProps={{ children: t('lp-price'), variant: 'body', color: 'text.secondary' }}
              valueProps={{ color: 'text.primary' }}
            />
            <Link href="/todo">{t('view-on-scan')}</Link>
          </div>
        </Container>
      </Collapse>
    </Root>
  );
}
