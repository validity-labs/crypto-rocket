import { ethers, BigNumber } from 'ethers';

import MasterChefV2 from '@/lib/blockchain/farm-pools/abis/MasterChefV2.json';

export const getStakedBalance = async (
  pid: string,
  masterchefAddress: string,
  owner: string,
  provider: any
): Promise<BigNumber> => {
  const contract = new ethers.Contract(masterchefAddress, MasterChefV2, provider);
  return (await contract.userInfo(pid, owner)).amount;
};
