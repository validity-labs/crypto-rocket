import { Fragment, useState } from 'react';

import { Trans } from 'next-i18next';

import {
  Button,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Grid,
  Tab,
  TableHead,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import Label from '@/components/general/Label/Label';
import LoadingButton from '@/components/general/LoadingButton/LoadingButton';
import Panel from '@/components/general/Panel/Panel';
import Trend from '@/components/general/Trend/Trend';
import Section from '@/components/layout/Section/Section';
import { Tabs } from '@/components/pages/swap/SwapSection/SwapSection';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatAmount, formatAWI, formatCurrency, formatUSD } from '@/lib/formatters';
import { simpleTabA11yProps, simpleTabPanelA11yProps } from '@/lib/helpers';
import { AssetKey } from '@/types/app';

import ClaimModal, { ClaimModalData } from './ClaimModal';

const Root = styled(Section)(({ theme }) => ({
  '.Awi-highlight': {
    color: '#C49949',
  },
  '.MuiTableRow-root': {
    borderTop: `1px solid ${theme.palette.divider}`,
    '&:first-of-type': {
      borderTopWidth: 0,
    },
  },
  '.AwiClaimSection-geist': {
    position: 'relative',
    top: -2,
  },
  '.AwiLoadingButton-root': {
    margin: '0 0 0 auto',
  },
  '.AwiClaimSection-panel': {
    padding: theme.spacing(6, 13),
    borderRadius: +theme.shape.borderRadius * 2,
    backgroundColor: theme.palette.background.transparent,
  },
}));

export type ClaimData = Record<string, { geist: number; awi?: number; claimable: boolean }>;

interface Props {
  data: ClaimData;
}

const items = [
  { i18nKey: 'unlocked-awi', prop: 'unlockedAWI' },
  { i18nKey: 'vesting-awi', prop: 'vestingAWI' },
  {
    i18nKey: 'claim-all',
    prop: 'claimAll',
    formatDescription: ({ awi = 0 }: { awi?: number }) => ({ v: formatAWI(awi) }),
  },
  { i18nKey: 'expired-locked-awi', prop: 'expiredLockedAWI' },
];

type FeeTypeKey = 'claimable' | 'claimed';

interface ClaimableFee {
  token: AssetKey;
  amount: number;
}

interface ClaimedFee {
  token: AssetKey;
  amount: number;
  timestamp: number;
}

export default function ClaimSection({ data }: Props) {
  const t = usePageTranslation({ keyPrefix: 'claim-section' });
  const [claimModal, setClaimModal] = useState<ClaimModalData | null>(null);
  const [feeType, setFeeType] = useState<number>(0);

  const handleFeeTypeChange = (_event: React.SyntheticEvent, newValue: number) => {
    setFeeType(newValue);
  };
  // const { source: from, target: to, oldRate: currentPrice, rate: offeredPrice } = data;

  const handleClaimSubmit = (prop) => {
    setClaimModal({ asset: 'awi', stage: 'enable' });
  };

  const handleClaimFeeClick = () => {
    console.log('handleClaimFeeClick');
  };

  const [claimableFee, setClaimableFee] = useState<ClaimableFee>({
    token: 'awi',
    amount: 100,
  });
  const [claimedFees, setClaimedFees] = useState<ClaimedFee[]>([
    {
      token: 'awi',
      amount: 100,
      timestamp: 123456,
    },
    {
      token: 'awi',
      amount: 100,
      timestamp: 123457,
    },
  ]);
  return (
    <>
      <Root>
        <Panel
        // header={
        //   <Label id="infoTitle" className="label" component="h2" tooltip={t(`purchase-section.info.title-hint`)}>
        //     {/* {t(`purchase-section.info.title`, { from: from.toUpperCase(), to: to.toUpperCase() })} */}
        //   </Label>
        // }
        >
          <TableContainer /* component={Paper} */>
            <Table width={100}>
              <TableBody>
                {items.map(({ i18nKey, prop, formatDescription }, itemIndex) => (
                  <TableRow key={itemIndex}>
                    <TableCell width="60%">
                      <Typography fontWeight={700} color="text.primary" mb={2.5}>
                        {t(`${i18nKey}.title`)}
                      </Typography>
                      <Typography variant="body-sm" color="text.primary">
                        <Trans
                          i18nKey={`${i18nKey}.description`}
                          t={t}
                          components={[<span key="span" className="Awi-highlight" />]}
                          {...(formatDescription ? { values: formatDescription(data[prop]) } : undefined)}
                        />
                      </Typography>
                    </TableCell>
                    <TableCell width="20%">
                      <div className="Awi-row">
                        <img
                          src={`/images/assets/geist.svg`}
                          alt=""
                          width="30"
                          height="30"
                          className="AwiClaimSection-geist"
                        />
                        <Typography fontWeight={500} ml={3} color="text.primary">
                          {formatCurrency(data[prop].geist, 'GEIST')}
                        </Typography>
                      </div>
                    </TableCell>
                    <TableCell width="20%">
                      {data[prop].claimable && (
                        <Button variant="outlined" size="small" onClick={() => handleClaimSubmit(prop)}>
                          {t('claim-awi')}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Panel>
        <Box sx={{ pt: 20 }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Tabs value={feeType} onChange={handleFeeTypeChange} aria-label={t('fee-type-hint')} variant="scrollable">
                <Tab label={t('fee-type.claimable')} {...simpleTabA11yProps('awiClaimSectionFeeTypeClaimable')} />
                <Tab label={t('fee-type.claimed')} {...simpleTabA11yProps('awiClaimSectionFeeTypeClaimed')} />
              </Tabs>
            </Grid>
            <Grid item xs={12}>
              <div
                role="tabpanel"
                hidden={feeType !== 0}
                {...simpleTabPanelA11yProps('awiClaimSectionFeeTypeClaimable')}
              >
                <Grid container mb={4}>
                  <Grid item xs={6}>
                    <Typography pl={10}>{t(`field.asset`)}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>{t(`field.amount`)}</Typography>
                  </Grid>
                  <Grid item xs={3} textAlign="end">
                    <Typography pr={10}>{t(`field.actions`)}</Typography>
                  </Grid>
                </Grid>
                <div className="AwiClaimSection-panel">
                  <Grid container alignItems="center">
                    <Grid item xs={6}>
                      <Typography>{claimableFee.token.toUpperCase()}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography>{formatAmount(claimableFee.amount)}</Typography>
                    </Grid>
                    <Grid item xs={3} textAlign="end">
                      <Button variant="outlined" size="small" onClick={() => handleClaimFeeClick()}>
                        {t('claim-all-button')}
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              </div>
              <div role="tabpanel" hidden={feeType !== 1} {...simpleTabPanelA11yProps('awiClaimSectionFeeTypeClaimed')}>
                <Grid container mb={4}>
                  <Grid item xs={6}>
                    <Typography pl={10}>{t(`field.asset`)}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>{t(`field.amount`)}</Typography>
                  </Grid>
                  <Grid item xs={3} textAlign="end">
                    <Typography>{t(`field.timestamp`)}</Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={6}>
                  {claimedFees.map((fee) => (
                    <Grid item xs={12} key={fee.timestamp}>
                      <div className="AwiClaimSection-panel">
                        <Grid container alignItems="center">
                          <Grid item xs={6}>
                            <Typography>{fee.token.toUpperCase()}</Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography>{formatAmount(fee.amount)}</Typography>
                          </Grid>
                          <Grid item xs={3} textAlign="end">
                            <Typography>{fee.timestamp}</Typography>
                          </Grid>
                        </Grid>
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </div>
            </Grid>
          </Grid>
        </Box>
      </Root>
      {!!claimModal && (
        <ClaimModal open={!!claimModal} close={() => setClaimModal(null)} data={claimModal} callback={() => {}} />
      )}
    </>
  );
}
