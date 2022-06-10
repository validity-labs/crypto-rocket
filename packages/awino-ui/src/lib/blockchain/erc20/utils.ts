import { ethers, BigNumber } from 'ethers';

import { erc20AbiJson } from './abi/erc20';

export const allowance = async (
  contractAddress: string,
  ownerAddress: string,
  spenderAddress: string,
  provider: ethers.providers.Web3Provider
) => {
  const contract = new ethers.Contract(contractAddress, erc20AbiJson, provider);
  let result = await contract.allowance(ownerAddress, spenderAddress);
  console.log(`Allowance: ${result}`);
  return result;
};

export const approve = async (
  contractAddress: string,
  spenderAddress: string,
  amount: BigNumber,
  provider: ethers.providers.Web3Provider
) => {
  const contract = new ethers.Contract(contractAddress, erc20AbiJson, provider.getSigner());
  let tx = await contract.approve(spenderAddress, amount);
  await tx.wait(1);
  // @TODO wait for confirmation
  console.log(`Contract "Approve" operation successful.`);
};

export const getBalance = async (contractAddress: string, owner: string, provider: any): Promise<BigNumber> => {
  const contract = new ethers.Contract(contractAddress, erc20AbiJson, provider);
  return await contract.balanceOf(owner);
};

export const getBalanceFormatted = async (
  contractAddress: string,
  owner: string,
  provider: any,
  decimals: number
): Promise<string> => {
  const contract = new ethers.Contract(contractAddress, erc20AbiJson, provider);
  const balance = await contract.balanceOf(owner);
  return ethers.utils.formatUnits(balance, decimals);
};
