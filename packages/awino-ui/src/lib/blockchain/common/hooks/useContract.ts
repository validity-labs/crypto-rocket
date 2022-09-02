import { useEffect, useState } from 'react';

import { useWeb3React } from '@web3-react/core';
import { ethers, Contract } from 'ethers';

export const useContract = (address: string, abi: any): Contract => {
  const [contract, setContract] = useState<Contract | null>(null);
  const { library } = useWeb3React();

  useEffect(() => {
    if (address) {
      const contract = new Contract(address, abi, library);
      setContract(contract);
    }
  }, [address, abi, library]);

  return contract;
};
