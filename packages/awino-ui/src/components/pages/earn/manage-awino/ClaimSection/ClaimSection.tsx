import { useState } from 'react';

import { Button, Typography, Box, Grid, Tab } from '@mui/material';
import { styled } from '@mui/material/styles';

import Section from '@/components/layout/Section/Section';
import { Tabs } from '@/components/pages/swap/SwapSection/SwapSection';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatAmount } from '@/lib/formatters';
import { simpleTabA11yProps, simpleTabPanelA11yProps } from '@/lib/helpers';
import { AssetKey } from '@/types/app';

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
  '.AwiClaimSection-awi': {
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

interface ClaimableFee {
  token: AssetKey;
  amount: number;
}

interface ClaimedFee {
  token: AssetKey;
  amount: number;
  timestamp: number;
}

export default function ClaimSection() {
  const t = usePageTranslation({ keyPrefix: 'claim-section' });
  const [feeType, setFeeType] = useState<number>(0);

  const handleFeeTypeChange = (_event: React.SyntheticEvent, newValue: number) => {
    setFeeType(newValue);
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
    <Root>
      <Box sx={{ pt: 20 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Tabs value={feeType} onChange={handleFeeTypeChange} aria-label={t('fee-type-hint')} variant="scrollable">
              <Tab label={t('fee-type.claimable')} {...simpleTabA11yProps('awiClaimSectionFeeTypeClaimable')} />
              <Tab label={t('fee-type.claimed')} {...simpleTabA11yProps('awiClaimSectionFeeTypeClaimed')} />
            </Tabs>
          </Grid>
          <Grid item xs={12}>
            <div role="tabpanel" hidden={feeType !== 0} {...simpleTabPanelA11yProps('awiClaimSectionFeeTypeClaimable')}>
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
  );
}
