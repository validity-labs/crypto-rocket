import { useEffect, useState } from 'react';

import { useWeb3React } from '@web3-react/core';
import { ethers, utils } from 'ethers';

import { erc20AbiJson } from '../abi/erc20';

export function useTokenBalance(contractAddress: string, decimals: number, account: string) {
  const { library } = useWeb3React();
  const [balance, setBalance] = useState('0');

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = new ethers.Contract(contractAddress, erc20AbiJson, library);
      const balance = await contract.balanceOf(account);

      setBalance(utils.formatUnits(balance.toString(), decimals).toString());
    };

    if (contractAddress) {
      fetchBalance();
    }
  }, [contractAddress, decimals, account, library]);
  return balance;
}

export function useTokenBalanceDynamic(
  contractAddress: string,
  decimals: number,
  account: string,
  defaultBalance: undefined | null | string = null
) {
  const { library } = useWeb3React();
  const [balance, setBalance] = useState(defaultBalance);

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = new ethers.Contract(contractAddress, erc20AbiJson, library);
      const balance = await contract.balanceOf(account);

      setBalance(utils.formatUnits(balance.toString(), decimals).toString());
    };

    if (contractAddress) {
      setBalance(defaultBalance);
      fetchBalance();
    }
  }, [contractAddress, decimals, account, library, setBalance, defaultBalance]);
  return balance;
}
