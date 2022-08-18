import { useMemo, useState, useCallback, useEffect, useRef } from 'react';

import { useTranslation } from 'next-i18next';

import { createSelector } from '@reduxjs/toolkit';
import BigNumberJS from 'bignumber.js';
import { formatUnits } from 'ethers/lib/utils';
import { pick } from 'lodash';

import { TableRowsRounded, ViewColumnRounded } from '@mui/icons-material';
import { Box, Button, FormControlLabel, Grid, Slide, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useWeb3 } from '@/app/providers/Web3Provider';
import { fetchEarnFarms, refetchCurrentFarms, refetchFarm } from '@/app/state/actions/pages/earn-farms';
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
import { formatLPPair } from '@/lib/formatters';
import { Address, AssetKeyPair } from '@/types/app';

import HarvestModal from './HarvestModal';
import ResultCard from './ResultCard';
import ResultPanel from './ResultPanel';
import ResultTable from './ResultTable';
import StakeModal from './StakeModal';
import UnstakeModal from './UnstakeModal';

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

export interface FarmItem {
  // custom fields
  label: string;
  // liquidity pair data
  id: string; // pairId
  // ...liquidity-pair
  pair: AssetKeyPair;
  pairBalanceFormatted: string;
  // pair processed
  pairBalance: BigNumberJS;
  // farm pair data
  farmId: string;
  isRegular: boolean;
  apr: string;
  multiplier: string;
  totalValueOfLiquidityPoolUSD: string;
  lpTokenValueUSD: string;

  // user farm
  boostFactor: string;
  stakedFormatted: string;
  rewardFormatted: string;
  // user farm processed
  reward: BigNumberJS;
  staked: BigNumberJS;

  // proportion: number;
  type: Exclude<FarmTypeKey, 'all'>;
  // staked: boolean;
  active: boolean;
  emissions: string;
  aprFarm: string;
  aprLP: string;
  earned: string;
  liquidity: string;
  fees: string;
  aprRange: [string, string];
  // depositFee: string;
  walletAmount: string;
  walletAmountUSD: string;
  contract: string;
  // can
  can: {
    stake: boolean;
    unstake: boolean;
    harvest: boolean;
  };
}

const itemsSelector = createSelector(
  (state: AppState) => state.exchange.liquidityPairs.entities,
  (state: AppState) => state.exchange.userLiquidityPairs.entities,
  (state: AppState) => state.masterchef.farms,
  (state: AppState) => state.masterchef.userFarms.entities,
  (state: AppState) => state.pageEarnFarms.farms.ids,
  (pairsMap, userPairsMap, { farmIdToPairId: farmIdToPairIdMap, entities: farmsMap }, userFarmsMap, farmIds) => {
    // console.log(pairsMap, userPairsMap, farmIdToPairIdMap, farmsMap, userFarmsMap, farmIds);
    return farmIds.map((farmId) => {
      const pairId = farmIdToPairIdMap[farmId];
      const pair = pairsMap[pairId];

      const {
        // staked = '0',
        stakedFormatted = '0.0',
        rewardFormatted = '0.0',
        boostMultiplier = 0,
        // reward = '0',
      } = userFarmsMap[farmId] || {};

      const {
        // id: Address;
        // balance: string;
        balanceFormatted = '0.0',
        // share: string;
      } = userPairsMap[pairId] || {};

      const {
        id: _farmId,
        pairId: _pairId,
        isRegular = false,
        /*  accCakePerShare,  */ computations,
      } = farmsMap[farmId] || {};

      const symbols = [pair.token0.symbol, pair.token1.symbol] as AssetKeyPair;

      const pairBalance = new BigNumberJS(balanceFormatted);
      const reward = new BigNumberJS(rewardFormatted);
      const staked = new BigNumberJS(stakedFormatted);
      return {
        ...pair,
        pair: symbols,
        label: formatLPPair(symbols),

        // user pair
        pairBalanceFormatted: balanceFormatted,
        pairBalance,
        // farm related
        farmId,
        isRegular,
        // accCakePerShare,
        // computations
        ...pick(computations, [
          'apr',
          'multiplier',
          'lpTokenValueUSD',
          'totalValueOfLiquidityPoolUSD' /* , 'lpBalanceMC' */,
        ]),

        // user farm related
        boostFactor: formatUnits(boostMultiplier, 10),
        // staked,
        stakedFormatted,
        rewardFormatted,
        // staked processed
        reward,
        staked,

        pendingReward: 0,
        // TODO REMOVE UNUSED FAKE DATA
        // MOCKED DATA
        // depositFee: '0',
        // proportion: 12.3,
        type: 'boosted',
        active: false,
        emissions: '0',
        // apr: '1.23',
        aprFarm: '0',
        aprLP: '0',
        // earned: '456.78',
        // liquidity: '567.89',
        fees: '0',
        aprRange: ['0', '0'],
        walletAmount: '0',
        walletAmountUSD: '0',
        contract: '0x00',
        // contract: AWINO_WETH_PAIR_ADD,
        can: {
          stake: pairBalance.gt(0),
          unstake: staked.gt(0),
          harvest: staked.gt(0),
        },
      };
    });
  }
);

export default function ResultSection() {
  const t = usePageTranslation({ keyPrefix: 'result-section' });
  const { t: tRaw } = useTranslation();

  const { account, library } = useWeb3();
  const dispatch = useAppDispatch();
  const isInitialFetch = useRef(true);
  useEffect(() => {
    if (isInitialFetch.current) {
      dispatch(
        fetchEarnFarms({
          variables: { account },
          provider: library,
          options: { more: false },
        })
      );
      isInitialFetch.current = false;
    } else {
      if (account) {
        dispatch(
          refetchCurrentFarms({
            variables: { account },
            provider: library,
          })
        );
      }
    }
  }, [account, dispatch, library]);

  const {
    ids: farmIds,
    loading: farmsLoading,
    more: hasMoreFarms,
  } = useAppSelector((state) => state.pageEarnFarms.farms);
  /* TODO update selector return type */
  const records = useAppSelector(itemsSelector) as unknown as FarmItem[];

  const handleFarmsLoadMore = () => {
    dispatch(fetchEarnFarms({ variables: { account }, provider: library }));
  };

  const [filters, setFilters] = useState<Filters>({
    type: 'all',
    sort: 'emissions',
    stakedOnly: false,
    inactiveFarms: false,
    search: null,
  });

  const [layout, setLayout] = useState<LayoutKey>('grid');
  const [stakeModal, setStakeModal] = useState<FarmItem | null>(null);
  const [unstakeModal, setUnstakeModal] = useState<FarmItem | null>(null);
  const [harvestModal, setHarvestModal] = useState<FarmItem | null>(null);

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

  const handleStakedOnlyChange = useCallback((newValue: boolean) => {
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

  const handleStake = useCallback((stakeData: FarmItem) => {
    setStakeModal(stakeData);
  }, []);

  const handleUnstake = useCallback((stakeData: FarmItem) => {
    setUnstakeModal(stakeData);
  }, []);

  const handleHarvest = useCallback((stakeData: FarmItem) => {
    setHarvestModal(stakeData);
  }, []);

  const gridProps = useMemo(() => {
    return layout === 'grid' ? { md: 6, lg: 4 } : {};
  }, [layout]);

  const handleStakeCallback = (id: Address) => {
    // id is farmId
    dispatch(refetchFarm({ variables: { account, id }, provider: library }));
  };

  const handleUnstakeCallback = (id: Address) => {
    // id is farmId
    dispatch(refetchFarm({ variables: { account, id }, provider: library }));
  };

  const handleHarvestCallback = (id: Address) => {
    // id is farmId
    dispatch(refetchFarm({ variables: { account, id }, provider: library }));
  };

  return (
    <>
      <Root>
        <Panel
          className="AwiResultSection-filters"
          header={
            <>
              <div>
                <Label id="earnFarmsTitle" variant="h4" component="h2" color="text.active" className="Awi-golden">
                  {t('title')}
                </Label>
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
              control={<Switch checked={filters.stakedOnly} setChecked={handleStakedOnlyChange} sx={{ ml: 4.5 }} />}
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

        {farmIds.length > 0 ? (
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
                  loading={farmsLoading}
                  onHarvest={handleHarvest}
                  onStake={handleStake}
                  onUnstake={handleUnstake}
                />
              ))}
          </>
        ) : (
          <>
            {!farmsLoading && (
              <Panel>
                <Typography mx="auto" textAlign="center">
                  {tRaw('common.no-records')}
                </Typography>
              </Panel>
            )}
          </>
        )}
        {hasMoreFarms && (
          <Box className="Awi-row" sx={{ justifyContent: 'center', my: 10 }}>
            <LoadingButton variant="outlined" color="primary" loading={farmsLoading} onClick={handleFarmsLoadMore}>
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
          callback={handleStakeCallback}
        />
      )}
      {!!unstakeModal && (
        <UnstakeModal
          open={!!unstakeModal}
          close={() => setUnstakeModal(null)}
          data={unstakeModal}
          callback={handleUnstakeCallback}
        />
      )}
      {!!harvestModal && (
        <HarvestModal
          open={!!harvestModal}
          close={() => setHarvestModal(null)}
          data={harvestModal}
          callback={handleHarvestCallback}
        />
      )}
    </>
  );
}
