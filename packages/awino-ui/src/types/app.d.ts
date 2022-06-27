import type React from 'react';

import { NextConfig } from 'next';

import BigNumber from 'bignumber.js';

import { PaletteMode, SvgIconProps } from '@mui/material';

import { ProposalState } from '@/app/constants';
export interface NextAppConfig extends NextConfig {
  serverRuntimeConfig?: {};
  publicRuntimeConfig: {
    baseDomain: string;
    etherscanApiKey: string;
  };
}

export type Language = 'en' | 'de';
export type I18nPageNamespace =
  | 'error'
  | 'landing'
  | 'market'
  | 'market-details'
  | 'earn-deposit'
  | 'earn-deposit-details'
  | 'earn-liquidity-staking'
  | 'earn-manage-awino'
  | 'earn-farms'
  | 'borrow'
  | 'borrow-details'
  | 'swap'
  | 'pol'
  | 'analytics'
  | 'contracts'
  | 'portfolio'
  | 'infinite'
  | 'governance'
  | 'governance-details'
  | 'create-proposal';

export interface Breadcrumb {
  key: string;
  url: string;
}
export type Breadcrumbs = Breadcrumb[];

export type SetState<A> = React.Dispatch<React.SetStateAction<A>>;

export type ThemeMode = PaletteMode;
export interface MenuItemLink {
  type: 'internal' | 'external';
  key: string;
  url: string;
  icon?: React.FC<SvgIconProps>;
}

export interface MenuItemGroup {
  type: 'group';
  key: string;
  items: MenuItemLink[];
}

export type MenuItemType = MenuItemLink | MenuItemGroup;

export interface RowsState {
  page: number;
  pageSize: number;
}

export type ID = string;

export type Address = string;
export type TokenAsset = string;
export type StableCoinAsset = strings;
export type PoolAsset = any;
export type AssetKey = string;
export type AssetKeyPair = [string, string];

// TODO make sure there is no item that has same asset key on both sides
export type PairedAssetKey = string;

export interface StaticImageData {
  src: string;
  height: number;
  width: number;
  blurDataURL?: string;
}

export interface ContractInfo {
  key: AssetKey;
  address: string;
  decimals: number;
  image?: string;
}
export interface ContractsGrouped {
  tokens: {
    key: TokenAsset;
    address: Address;
    decimals: number;
  }[];
  stableCoins: {
    key: StableCoinAsset;
    address: Address;
    decimals: number;
  }[];
  pools?: {
    key: StableCoinAsset;
    address: Address;
    decimals: number;
  }[];
}

export interface BalanceInfo<T = AssetKey> {
  key: T;
  total: number;
}
export interface BalancePoolInfo {
  key: PoolAsset;
  total: number;
  staked: number;
  assets: AssetKey[];
}
export interface BalanceGrouped {
  tokens: BalanceInfo<TokenAsset>[];
  stableCoins: BalanceInfo<StableCoinAsset>[];
  pool: BalancePoolInfo[];
}

export type MarketType = 'supply' | 'borrow';

export interface MarketInfo {
  price: BigNumber;
  marketLiquidity: BigNumber;
  nOfSuppliers: BigNumber;
  nOfBorrowers: BigNumber;
  borrowCap: BigNumber;
  interestPaidDay: BigNumber;
  reserves: BigNumber;
  reserveFactor: BigNumber;
  collateralFactor: BigNumber;
  cMinted: BigNumber;
  exchangeRate: BigNumber;
  utilization: BigNumber;
}

export type MarketTypeInfo = Record<
  MarketType,
  {
    netRate: number;
    apy: number;
    distributionApy: number;
    total: number;
  }
>;

export interface StatsDataItem {
  value: number;
  subvalue?: number;
  subValues?: number[];
}

export type StatsData = StatsDataItem[];

type FormatterMethod = (a: any) => string;
export type StatsFormatter = { value: FormatterMethod; subValues?: FormatterMethod[] };

export interface Option {
  label: string;
  value: string | number;
}

export interface GovernanceInfo {
  treasuryAmount: number;
  treasuryAmountUSD: number;
}
interface ProposalDetail {
  target: string;
  functionSig: string;
  callData: string;
}

export interface ProposalItem {
  id: number;
  title: string;
  description: string;
  startBlock: number;
  endBlock?: number;
  status: ProposalState;
  forCount: number;
  againstCount: number;
  abstainCount: number;
  createdBlock?: number;
  quorumVotes: number;
  eta?: Date;
  // id: string | undefined;
  // title: string;
  // status: ProposalState;
  // forCount: number;
  // againstCount: number;
  // abstainCount: number;
  // createdBlock: number;
  // startBlock: number;
  // endBlock: number;
  // eta: Date | undefined;
  proposer: string | undefined;
  // proposalThreshold: number;
  // quorumVotes: number;
  details: ProposalDetail[];
  transactionHash: string;
}
