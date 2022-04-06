import React from 'react';

import { ID } from '@/types/app';

export function tabA11yProps(id: ID, index: number) {
  return {
    id: `tab-${id}-${index}`,
    'aria-controls': `tabpanel-${id}-${index}`,
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
