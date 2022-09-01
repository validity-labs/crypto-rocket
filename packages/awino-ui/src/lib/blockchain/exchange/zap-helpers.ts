import { useEffect, useState } from 'react';

import { Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Contract, ethers } from 'ethers';


import { CHAIN_ID } from '@/app/constants';
import { Address } from '@/types/app';

import AWINO_ZAP_ABI from './abis/AwinoZap.json';
import ERC20_ABI from './abis/ERC20.json';
import AWINO_PAIR_ABI from './abis/IAwinoPair.json';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

// @TODO cleanup this file. Add types.

async function getDecimals(token: Contract) {
  const decimals = await token
    .decimals()
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.log('No tokenDecimals function for this token, set to 0');
      return 0;
    });
  return decimals;
}

export async function zapTokens(
  tokenAddress: string,
  lpAddress: string,
  tokenAmount: string,
  lpAmount: string,
  isIn: boolean, // true => in, false => out
  zapContractAddress: string,
  accountAddress: string,
  signer: ethers.Signer
) {
  const lp = new Contract(lpAddress, AWINO_PAIR_ABI, signer);
  const lpDecimals = await getDecimals(lp);

  const zapContract = new Contract(zapContractAddress, AWINO_ZAP_ABI, signer);

  const _lpAmount = ethers.utils.parseUnits(lpAmount, lpDecimals);
  let tx: any;

  if (tokenAddress === ZERO_ADDRESS) { // in case of the token is native token
    const _tokenAmount = ethers.utils.parseUnits(tokenAmount, 18);

    if (isIn) {// function zapInCRO(address _lpToken, uint256 _tokenAmountOutMin)
      tx = await zapContract.zapInCRO(lpAddress, _lpAmount, {
        value: _tokenAmount
      });
    }
    else {// function zapOutCRO(address _lpToken, uint256 _lpTokenAmount, uint256 _tokenAmountOutMin)
      tx = await zapContract.zapOutCRO(lpAddress, _lpAmount, _tokenAmount);
    }
  }
  else {
    const token = new Contract(tokenAddress, ERC20_ABI, signer);
    const tokenDecimals = await getDecimals(token);
    
    const _tokenAmount = ethers.utils.parseUnits(tokenAmount, tokenDecimals);
    if (isIn) {// function zapInToken(address _tokenToZap, uint256 _tokenAmountIn, address _lpToken, uint256 _tokenAmountOutMin)
      tx = await zapContract.zapInToken(tokenAddress, _tokenAmount, lpAddress, _lpAmount);
    }
    else {// function zapOutToken(address _lpToken, address _tokenToReceive, uint256 _lpTokenAmount, uint256 _tokenAmountOutMin)
      tx = await zapContract.zapOutToken(lpAddress, tokenAddress, _lpAmount, _tokenAmount);
    }
  }
}

export const getZapAmountIn = async (
  tokenAddress: string,
  lpAddress: string,
  tokenAmount: string,
  zapContractAddress: string
): Promise<string> => {
  console.log({tokenAddress, lpAddress, tokenAmount, zapContractAddress});
  const token = new Contract(tokenAddress, ERC20_ABI);
  console.log({token});
  const tokenDecimals = await token.decimals();
  console.log({tokenDecimals});

  const lp = new Contract(lpAddress, ERC20_ABI);
  console.log({lp});
  const lpDecimals = await lp.decimals();
  console.log({lpDecimals});

  console.log({
    tokenAddress,
    lpAddress,
    tokenAmount,
    zapContractAddress,
    tokenDecimals,
    lpDecimals,
  });
  const zapContract = new Contract(zapContractAddress, AWINO_ZAP_ABI);
  const values_out = await zapContract.estimateZapInSwap(
    tokenAddress,
    ethers.utils.parseUnits(String(tokenAmount), tokenDecimals),
    lpAddress
  );

  const _AmountOut = values_out[1] * 10 ** -lpDecimals;

  console.log('amount out: ', _AmountOut);
  return String(_AmountOut);
};


export const getZapAmountOut = async (
  tokenAddress: string,
  lpAddress: string,
  lpAmount: string,
  zapContractAddress: string
): Promise<string> => {
  const token = new Contract(tokenAddress, ERC20_ABI);
  const tokenDecimals = await token.decimals();

  const lp = new Contract(lpAddress, ERC20_ABI);
  const lpDecimals = await lp.decimals();

  console.log({
    tokenAddress,
    lpAddress,
    lpAmount,
    zapContractAddress,
    tokenDecimals,
    lpDecimals,
  });
  const zapContract = new Contract(zapContractAddress, AWINO_ZAP_ABI);
  const values_out = await zapContract.estimateZapOutSwap(
    lpAddress,
    ethers.utils.parseUnits(String(lpAmount), lpDecimals),
    tokenAddress,
  );
  const _AmountOut = values_out[1] * 10 ** -tokenDecimals;

  console.log('amount out: ', _AmountOut);
  return String(_AmountOut);
};
  