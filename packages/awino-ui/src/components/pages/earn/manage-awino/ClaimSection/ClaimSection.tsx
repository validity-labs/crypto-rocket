import { useState } from 'react';

import { Trans } from 'next-i18next';

import { Button, Typography, TableContainer, Table, TableBody, TableRow, TableCell } from '@mui/material';
import { styled } from '@mui/material/styles';

import Label from '@/components/general/Label/Label';
import LoadingButton from '@/components/general/LoadingButton/LoadingButton';
import Panel from '@/components/general/Panel/Panel';
import Trend from '@/components/general/Trend/Trend';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatAWI, formatCurrency, formatUSD } from '@/lib/formatters';

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
  '.AwiClaimSection-awi': {
    position: 'relative',
    top: -2,
  },
  '.AwiLoadingButton-root': {
    margin: '0 0 0 auto',
  },
}));

export type ClaimData = Record<string, { awi: number; claimable: boolean }>;

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

export default function ClaimSection({ data }: Props) {
  const t = usePageTranslation();
  const [claimModal, setClaimModal] = useState<ClaimModalData | null>(null);
  // const { source: from, target: to, oldRate: currentPrice, rate: offeredPrice } = data;

  const handleClaimSubmit = (prop) => {
    setClaimModal({ asset: 'awi', stage: 'enable' });
  };

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
                        {t(`claim-section.${i18nKey}.title`)}
                      </Typography>
                      <Typography variant="body-sm" color="text.primary">
                        <Trans
                          i18nKey={`claim-section.${i18nKey}.description`}
                          t={t}
                          components={[<span key="span" className="Awi-highlight" />]}
                          {...(formatDescription ? { values: formatDescription(data[prop]) } : undefined)}
                        />
                      </Typography>
                    </TableCell>
                    <TableCell width="20%">
                      <div className="Awi-row">
                        <img
                          src={`/images/assets/awi.svg`}
                          alt=""
                          width="30"
                          height="30"
                          className="AwiClaimSection-awi"
                        />
                        <Typography fontWeight={500} ml={3} color="text.primary">
                          {formatCurrency(data[prop].awi, 'AWI')}
                        </Typography>
                      </div>
                    </TableCell>
                    <TableCell width="20%">
                      {data[prop].claimable && (
                        <Button
                          variant="outlined"
                          size="small"
                          className="AwiClaimSection"
                          onClick={() => handleClaimSubmit(prop)}
                        >
                          {t('claim-section.claim-awi')}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Panel>
      </Root>
      {!!claimModal && (
        <ClaimModal open={!!claimModal} close={() => setClaimModal(null)} data={claimModal} callback={() => {}} />
      )}
    </>
  );
}
