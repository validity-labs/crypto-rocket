import { useMemo, useState, useCallback, useEffect } from 'react';

import { useTranslation } from 'next-i18next';

import { createSelector } from '@reduxjs/toolkit';

import { TableRowsRounded, ViewColumnRounded } from '@mui/icons-material';
import { Box, FormControlLabel, Grid, Slide, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useWeb3 } from '@/app/providers/Web3Provider';
import { fetchEarnFarmsPoolPairs } from '@/app/state/actions/pages/earn-farms';
import { AppState } from '@/app/store';
import Label from '@/components/general/Label/Label';
import LoadingButton from '@/components/general/LoadingButton/LoadingButton';
import Panel from '@/components/general/Panel/Panel';
import Search from '@/components/general/Search/Search';
import Select, { SelectValueAndOptionDefault } from '@/components/general/Select/Select';
import Switch from '@/components/general/Switch/Switch';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';
import { AWINO_DAI_PAIR_ADDRESS_MAP, AWINO_WETH_PAIR_ADDRESS_MAP, ChainId } from '@/lib/blockchain';
import { AssetKeyPair } from '@/types/app';

import ResultCard from './ResultCard';
import ResultTable from './ResultTable';
import StakeModal, { StakeModalData } from './StakeModal';

const Root = styled(Section)(({ theme }) => ({
  '.AwiSearch-root': {
    width: 'auto',
  },
  '.AwiResultSection-filters': {
    margin: theme.spacing(0, 0, 8.5),
    '.AwiPanel-content': {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
  },
  '.AwiPanel-headerAside': {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: theme.spacing(10),
    '.MuiFormControlLabel-root': {
      alignItems: 'flex-start',
      margin: 0,
    },
    '.MuiFormControlLabel-label': {
      margin: theme.spacing(0, 0, 2),
      fontWeight: 500,
      textTransform: 'uppercase',
    },
  },
  '.AwiPanel-content': {
    gap: theme.spacing(10),
  },
  '.AwiResultSection-toggle': {
    '.MuiFormControlLabel-label': {
      fontWeight: 500,
    },
  },
  '.MuiTableContainer-root': {
    maxHeight: 400,
    margin: theme.spacing(0, 0, 11),
  },
  '.MuiTableHead-root .MuiTableCell-root': {
    backgroundColor: 'unset',
  },
  '.MuiTableBody-root .MuiTableRow-root': {
    borderTop: `1px solid ${theme.palette.divider} !important`,
  },
  '.AwiResultSection-typeGroup': {
    overflow: 'auto',
    margin: theme.spacing(0, 0, 10),
  },
  '.AwiResultSection-sort': {
    label: {
      textTransform: 'uppercase',
    },
    '.MuiInput-root': {
      // padding: '0 !important',
      // margin: '0 !important',
      // borderRadius: +theme.shape.borderRadius * 2,
      // backgroundColor: theme.palette.background.transparent,
      // padding: `${theme.spacing(2, 10, 2.25, 2)} !important`,
      // border: '1px solid #546367',
    },
  },
  [theme.breakpoints.up('sm')]: {
    '.AwiResultSection-typeGroup': {
      margin: 0,
    },
    '.AwiPanel-headerAside': {
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
    },
  },
}));

export interface CollateralInfo {
  borrowLimit: [number, number];
  borrowLimitUsed: [number, number];
}

type FarmTypeKey = 'all' | 'standard' | 'boosted' | 'winawi';
type SortByKey = 'emissions' | 'apr' | 'earned' | 'liquidity' | 'fees';
const SORT_BY_ITEMS: SortByKey[] = ['emissions', 'apr', 'earned', 'liquidity', 'fees'];
type LayoutKey = 'grid' | 'table';

interface Filters {
  type: FarmTypeKey;
  sort: SortByKey;
  stakedOnly: boolean;
  inactiveFarms: boolean;
  search: null | string;
}

export interface FarmDataItem {
  id: string;
  pair: AssetKeyPair;
  proportion: number;
  type: Exclude<FarmTypeKey, 'all'>;
  staked: boolean;
  active: boolean;
  emissions: string;
  apr: string;
  aprFarm: string;
  aprLP: string;
  earned: string;
  liquidity: string;
  fees: string;
  aprRange: [string, string];
  depositFee: string;
  boostFactor: string;
  lpPrice: string;
  stakedAmount: string;
  walletAmount: string;
  walletAmountUSD: string;
  contract: string;
}

const pools = {
  'awi-dai': {
    address: AWINO_DAI_PAIR_ADDRESS_MAP[ChainId.TESTNET],
    pid: 1,
  },
  'awi-weth': {
    address: AWINO_WETH_PAIR_ADDRESS_MAP[ChainId.TESTNET],
    pid: 2,
  },
};

const itemsSelector = createSelector(
  (state: AppState) => state.exchange.liquidityPairs.entities,
  (state: AppState) => state.masterchef.farmPairs,
  (state: AppState) => state.pageEarnFarms.poolPairs.ids,
  (liquidityPairs, { pairIdToFarmId, entities: farmPairs }, pairIds) => {
    return pairIds.map((id) => {
      const pair = liquidityPairs[id];
      const farmId = pairIdToFarmId[id];
      const { id: _farmId, pairId: _pairId, isRegular = false, computations } = farmPairs[farmId] || {};
      return {
        ...pair,
        pair: [pair.token0.symbol, pair.token1.symbol],
        farmId,
        ...computations,
        isRegular,
        depositFee: '0',
        proportion: 12.3,
        type: 'boosted',
        staked: false,
        active: false,
        emissions: '234.56',
        apr: '1.23',
        aprFarm: '1.23',
        aprLP: '1.23',
        earned: '456.78',
        liquidity: '567.89',
        fees: '678.9',
        aprRange: ['1.23', '7.89'],
        boostFactor: '1.0',
        lpPrice: '123.45',
        stakedAmount: '123',
        walletAmount: '234',
        walletAmountUSD: '345',
        contract: '0x00',
        // contract: AWINO_WETH_PAIR_ADD,
      };
    });
  }
);

export default function ResultSection() {
  const t = usePageTranslation({ keyPrefix: 'result-section' });
  const { t: tRaw } = useTranslation();

  const { account, library } = useWeb3();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      fetchEarnFarmsPoolPairs({
        variables: { account },
        provider: library,
        options: { more: false },
      })
    );
  }, [account, dispatch, library]);

  const {
    ids: poolPairIds,
    loading: isPoolPairLoading,
    more: hasMorePoolPairs,
  } = useAppSelector((state) => state.pageEarnFarms.poolPairs);
  /* TODO update selector return type */
  const records = useAppSelector(itemsSelector) as unknown as FarmDataItem[];
  const handlePoolPairsLoadMore = () => {
    dispatch(fetchEarnFarmsPoolPairs({ variables: { account }, provider: library }));
  };
  const [filters, setFilters] = useState<Filters>({
    type: 'all',
    sort: 'emissions',
    stakedOnly: false,
    inactiveFarms: false,
    search: null,
  });

  const [layout, setLayout] = useState<LayoutKey>('grid');
  const [stakeModal, setStakeModal] = useState<StakeModalData | null>(null);

  // useEffect(() => {
  //   (async () => {
  //     await sleep(0.1);
  //     const farmsRecords = await new Promise<any>((res) => {
  //       return res(earnFarmsData);
  //     });
  //     setRecords(farmsRecords);
  //     setLoading(false);
  //   })();
  // }, []);

  const sortByItems = useMemo(() => {
    return SORT_BY_ITEMS.reduce((ar, r) => {
      ar.set(r, { id: r, label: t(`sort-by.value.${r}`) });
      return ar;
    }, new Map());
  }, [t]);

  const handleTypeChange = (event: React.MouseEvent<HTMLElement>, newValue: FarmTypeKey) => {
    setFilters((prevFilters) => ({ ...prevFilters, type: newValue as FarmTypeKey }));
  };

  const handleSearchChange = useCallback((newValue: string) => {
    setFilters((prevFilters) => {
      if (prevFilters.search !== newValue) {
        return { ...prevFilters, search: newValue };
      }
      return prevFilters;
    });
  }, []);

  const handleSortChange = useCallback((newValue: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, sort: newValue as SortByKey }));
  }, []);

  const handleStackedOnlyChange = useCallback((newValue: boolean) => {
    setFilters((prevFilters) => ({ ...prevFilters, stakedOnly: newValue }));
  }, []);

  const handleInactiveFarmsChange = useCallback((newValue: boolean) => {
    setFilters((prevFilters) => ({ ...prevFilters, inactiveFarms: newValue }));
  }, []);

  const handleLayoutChange = (event: React.MouseEvent<HTMLElement>, newValue: LayoutKey) => {
    setLayout(newValue);
  };

  const filteredRecords = useMemo(() => {
    const { type, inactiveFarms, stakedOnly, sort, search } = filters;
    const searchTerm = search ? search.toLowerCase() : '';
    return records
      .filter((record) => {
        // filtering

        if (type !== 'all' && record.type !== type) {
          return false;
        }

        if (stakedOnly && !record.staked) {
          return false;
        }

        if (inactiveFarms && record.active) {
          return false;
        }

        if (search && record.id.indexOf(searchTerm) === -1) {
          return false;
        }

        return true;
      })
      .sort((a, b) => +a[sort] - +b[sort]);
  }, [filters, records]);

  const handleHarvest = useCallback((pair: any) => {
    // TODO implement harvest logic
    console.log('handleHarvest', pair);
  }, []);

  const handleStake = useCallback((stakeData: StakeModalData) => {
    setStakeModal(stakeData);
    // TODO implement approve logic
    console.log('handleStake', stakeData);
  }, []);

  const handleUnstake = useCallback((pair: any) => {
    console.log('handleUnstake', pair);
  }, []);
  const gridProps = useMemo(() => {
    return layout === 'grid' ? { md: 6, lg: 4 } : {};
  }, [layout]);

  return (
    <>
      <Root>
        <Panel
          className="AwiResultSection-filters"
          header={
            <>
              <div>
                <Label id="earnFarmsTitle" tooltip={t(`title-hint`)} variant="h4" component="h2" color="text.active">
                  {t('title')}
                </Label>
                <Typography>{t('description')}</Typography>
              </div>
              <div className="AwiPanel-headerAside">
                <Select
                  label={t('sort-by.title') as string}
                  items={sortByItems}
                  value={filters.sort}
                  setValue={handleSortChange}
                  ValueComponent={SelectValueAndOptionDefault}
                  OptionComponent={SelectValueAndOptionDefault}
                  formControlProps={{
                    fullWidth: false,
                    className: 'AwiResultSection-sort',
                  }}
                  size="small"
                />
                <FormControlLabel
                  labelPlacement="top"
                  label={t('search.title') as string}
                  control={<Search onSearch={handleSearchChange} placeholder={t('search.placeholder')} size="small" />}
                />
              </div>
            </>
          }
        >
          <ToggleButtonGroup
            value={filters.type}
            exclusive
            onChange={handleTypeChange}
            aria-label={t(`type.title`)}
            className="AwiResultSection-typeGroup"
          >
            <ToggleButton value="all">{t('type.value.all')}</ToggleButton>
            <ToggleButton value="standard">{t('type.value.standard')}</ToggleButton>
            <ToggleButton value="boosted">{t('type.value.boosted')}</ToggleButton>
            <ToggleButton value="winawi">{t('type.value.winawi')}</ToggleButton>
          </ToggleButtonGroup>
          <div className="AwiResultSection-toggle">
            <FormControlLabel
              control={<Switch checked={filters.stakedOnly} setChecked={handleStackedOnlyChange} sx={{ ml: 4.5 }} />}
              labelPlacement="start"
              label={t(`staked-only`) as string}
            />
          </div>
          <div className="AwiResultSection-toggle">
            <FormControlLabel
              control={
                <Switch checked={filters.inactiveFarms} setChecked={handleInactiveFarmsChange} sx={{ ml: 4.5 }} />
              }
              labelPlacement="start"
              label={t(`inactive-farms`) as string}
            />
          </div>
          <ToggleButtonGroup
            value={layout}
            exclusive
            size="small"
            onChange={handleLayoutChange}
            aria-label={t(`layout.title`)}
          >
            <ToggleButton value="grid" size="small" title={t('layout.value.grid')}>
              <ViewColumnRounded />
            </ToggleButton>
            <ToggleButton value="list" title={t('layout.value.list')}>
              <TableRowsRounded />
            </ToggleButton>
          </ToggleButtonGroup>
        </Panel>

        {poolPairIds.length > 0 ? (
          <>
            {filteredRecords.length > 0 &&
              (layout === 'grid' ? (
                <Grid container spacing={8}>
                  {filteredRecords.map((record) => (
                    <Grid key={record.id} item xs={12} {...gridProps}>
                      <Slide in appear direction="up">
                        <div>
                          <ResultCard
                            item={record}
                            onHarvest={handleHarvest}
                            onStake={handleStake}
                            onUnstake={handleUnstake}
                          />
                        </div>
                      </Slide>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <ResultTable
                  items={filteredRecords}
                  loading={isPoolPairLoading}
                  onHarvest={handleHarvest}
                  onStake={handleStake}
                  onUnstake={handleUnstake}
                />
              ))}
          </>
        ) : (
          <>
            {!isPoolPairLoading && (
              <Panel>
                <Typography mx="auto" textAlign="center">
                  {tRaw('common.no-records')}
                </Typography>
              </Panel>
            )}
          </>
        )}
        {hasMorePoolPairs && (
          <Box className="Awi-row" sx={{ justifyContent: 'center', my: 10 }}>
            <LoadingButton
              variant="outlined"
              color="primary"
              loading={isPoolPairLoading}
              onClick={handlePoolPairsLoadMore}
            >
              {tRaw('common.load-more')}
            </LoadingButton>
          </Box>
        )}

        {/* {loading && <Loader />}
        {!loading && filteredRecords.length === 0 && (
          <Typography variant="body-lg" textAlign="center" py={10}>
            {tRaw('common.no-records')}
          </Typography>
        )} */}
      </Root>
      {!!stakeModal && (
        <StakeModal
          open={!!stakeModal}
          close={() => setStakeModal(null)}
          data={stakeModal}
          callback={() => {}}
          poolAddress={pools[stakeModal.pair.join('-')].address}
          pid={pools[stakeModal.pair.join('-')].pid}
        />
      )}
    </>
  );
}
