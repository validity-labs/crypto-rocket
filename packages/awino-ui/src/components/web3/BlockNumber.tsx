import React, { useEffect, useState } from 'react';

import { useWeb3React } from '@web3-react/core';

import LabelValue from '../general/LabelValue/LabelValue';
// import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from '@web3-react/frame-connector';

const BlockNumber = () => {
  const { chainId, library } = useWeb3React();

  const [blockNumber, setBlockNumber] = useState<number>();
  useEffect((): any => {
    if (library) {
      let stale = false;

      library
        .getBlockNumber()
        .then((blockNumber: number) => {
          if (!stale) {
            setBlockNumber(blockNumber);
          }
        })
        .catch(() => {
          if (!stale) {
            setBlockNumber(null);
          }
        });

      const updateBlockNumber = (blockNumber: number) => {
        setBlockNumber(blockNumber);
      };
      library.on('block', updateBlockNumber);

      return () => {
        stale = true;
        library.removeListener('block', updateBlockNumber);
        setBlockNumber(undefined);
      };
    }
  }, [library, chainId]); // ensures refresh if referential identity of library doesn't change across chainIds

  const value = blockNumber === null ? 'Error' : blockNumber ?? '';
  return <LabelValue id="blockNumber" value={value} labelProps={{ children: 'Block Number' }} />;
};

export default BlockNumber;
