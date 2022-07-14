import React from 'react';

import { ethers } from 'ethers';

import { ID } from '@/types/app';

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

export const sleep = (s: number) => {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
};

export const percentageFor = (value: ethers.BigNumber, total: ethers.BigNumber) => value.mul(100).div(total);

export const percentOf = (value: ethers.BigNumber, percent: number) => value.mul(percent).div(100);
