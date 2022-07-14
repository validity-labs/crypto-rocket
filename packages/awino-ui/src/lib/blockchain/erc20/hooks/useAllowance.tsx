import { useEffect, useState } from 'react';

import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';

import { erc20AbiJson } from '../abi/erc20';

/**
 * Returns the remaining number of tokens that spender will be allowed
 * to spend on behalf of owner through transferFrom. This is zero by default.
 *
 * @param contract Address of the ERC20 contract
 * @param owner Address of the owner.
 * @param spender Address of the spender.
 *
 * @returns Returns the remaining number of tokens that spender will be allowed
 * to spend on behalf of owner through transferFrom. This is zero by default.
 */
export function useAllowance(contract: string, owner: string, spender: string) {
  const { library } = useWeb3React();
  const [balance, setBalance] = useState('0');

  useEffect(() => {
    const fetchBalance = async () => {
      const erc20 = new ethers.Contract(contract, erc20AbiJson, library);
      const balance = await erc20.allowance(owner, spender);
      const decimals = await erc20.decimals();

      setBalance(ethers.utils.formatUnits(balance.toString(), decimals).toString());
    };

    if (contract) {
      fetchBalance();
    }
  }, [contract, owner, spender, library]);

  // console.debug(`Allowance(${contract}, ${owner}, ${spender} => ${balance})`);
  return balance;
}
