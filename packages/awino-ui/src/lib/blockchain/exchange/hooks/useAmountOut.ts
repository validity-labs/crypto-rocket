import { useEffect, useState } from 'react';

import { useWeb3React } from '@web3-react/core';
import { Contract, ethers } from 'ethers';

import ERC20_ABI from '../abis/ERC20.json';
import AWINO_ROUTER_ABI from '../abis/IAwinoRouter.json';

export const useAmountOut = (
  tokenAAddress: string,
  tokenBAddress: string,
  amountIn: string,
  routerContractAddress: string
): string => {
  const [amountOut, setAmountOut] = useState('0');
  const { library } = useWeb3React();

  useEffect(() => {
    const getAmountOut = async () => {
      try {
        const signer = await library.getSigner();

        console.debug(tokenAAddress, tokenBAddress, amountIn, routerContractAddress);
        const token1 = new Contract(tokenAAddress, ERC20_ABI, signer);
        const token1Decimals = await token1.decimals();

        const token2 = new Contract(tokenBAddress, ERC20_ABI, signer);
        const token2Decimals = await token2.decimals();

        console.log({
          tokenAAddress,
          tokenBAddress,
          amountIn,
          routerContractAddress,
          token1Decimals,
          token2Decimals,
        });
        const routerContract = new Contract(routerContractAddress, AWINO_ROUTER_ABI, signer);
        const values_out = await routerContract.getAmountsOut(
          ethers.utils.parseUnits(String(amountIn), token1Decimals),
          [tokenAAddress, tokenBAddress]
        );
        const amount_out = values_out[1] * 10 ** -token2Decimals;

        console.log('amount out: ', amount_out);
        setAmountOut(String(amount_out));
      } catch (error) {
        console.error(error);
        return false;
      }
    };

    if (tokenAAddress && tokenBAddress && tokenAAddress !== tokenBAddress && amountIn && +amountIn > 0) {
      getAmountOut();
    }
  }, [tokenAAddress, tokenBAddress, amountIn, routerContractAddress, library]);
  return amountOut;
};
