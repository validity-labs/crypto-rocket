import { useEffect, useState } from 'react';

/* TODO implement fetching current block number, with sync ability */
export const useBlockNumber = () => {
  const [block, setBlock] = useState(0);
  useEffect(() => {
    setBlock(123);
  }, [setBlock]);

  return block;
};
