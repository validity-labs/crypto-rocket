import React from 'react';

import BigNumberJS from 'bignumber.js';
import { BigNumber as EthersBigNumber, BigNumberish, constants } from 'ethers';

import { BLOCKCHAIN_EXPLORER_URL } from '@/app/constants';
import { Address, ID } from '@/types/app';

export function tabA11yProps(id: ID, index: number) {
  return {
    id: `tab-${id}-${index}`,
    'aria-controls': `tabpanel-${id}-${index}`,
  };
}

export function simpleTabA11yProps(id: ID) {
  return {
    id: `tab-${id}`,
    'aria-controls': `tabpanel-${id}`,
  };
}
export function simpleTabPanelA11yProps(id: ID) {
  return {
    id: `tabpanel-${id}`,
    'aria-labelledby': `tab-${id}`,
  };
}

/**
 * Wrap callback method, with event stop propagation
 */
export const stopPropagation =
  (callback: () => void) =>
  (event: React.SyntheticEvent): void => {
    event.stopPropagation();
    callback();
  };

export const etherscan = (address) => `https://etherscan.io/address/${address}`;

/**
 * Create blockchain explorer url for provided address. The url is defined as environment variable.
 */
export const blockchainExplorerUrl = (address: Address) => BLOCKCHAIN_EXPLORER_URL.replace('__ADDRESS__', address);

export const sleep = (s: number) => {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
};

export const percentageFor = (value: EthersBigNumber, total: EthersBigNumber) => value.mul(100).div(total);

export const percentOf = (value: string | number | BigNumberJS, percent: number): BigNumberJS =>
  toBigNum(value).times(percent).div(100);

// // const { WeiPerEther: Exa } = constants;
// export const convertFloatingToEthersBigNumber = (value: string, decimals: BigNumberish): EthersBigNumber =>
//   EthersBigNumber.from(
//     new BigNumberJS(value, 10).times(EthersBigNumber.from(10).pow(decimals).toString()).toString(10)
//   );

export const toBigNum = (value: string | number | BigNumberJS) => new BigNumberJS(value);
