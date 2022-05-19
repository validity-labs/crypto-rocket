import { ethers, BigNumber } from 'ethers';

import { erc20AbiJson } from './abi/erc20';

export const approve = async (
  contractAddress: string,
  spenderAddress: string,
  amount: BigNumber,
  provider: ethers.providers.Web3Provider
) => {
  const contract = new ethers.Contract(contractAddress, erc20AbiJson, provider);
  let tx = await contract.approve(spenderAddress, amount);
  // @TODO wait for confirmation
  console.log(`Contract "Approve" operation successful.`);
};

export const getBalance = async (contractAddress: string, owner: string, provider): Promise<BigNumber> => {
  const contract = new ethers.Contract(contractAddress, erc20AbiJson, provider);
  return await contract.balanceOf(owner);
};
