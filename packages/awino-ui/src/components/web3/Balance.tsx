import React, { useEffect, useState } from 'react';

import { formatEther } from '@ethersproject/units';
import { useWeb3React } from '@web3-react/core';

import LabelValue from '../general/LabelValue/LabelValue';

const Balance = () => {
  const { account, library, chainId } = useWeb3React();

  const [balance, setBalance] = useState();
  useEffect((): any => {
    if (!!account && !!library) {
      let stale = false;

      library
        .getBalance(account)
        .then((balance: any) => {
          if (!stale) {
            setBalance(balance);
          }
        })
        .catch(() => {
          if (!stale) {
            setBalance(null);
          }
        });

      return () => {
        stale = true;
        setBalance(undefined);
      };
    }
  }, [account, library, chainId]); // ensures refresh if referential identity of library doesn't change across chainIds

  const value = balance === null ? 'Error' : balance ? formatEther(balance) : '';
  return <LabelValue id="balance" value={value} labelProps={{ children: 'Balance' }} />;
};

export default Balance;
