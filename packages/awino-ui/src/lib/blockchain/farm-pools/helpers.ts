import { ethers, BigNumber, constants } from 'ethers';

import MasterChefV2 from '@/lib/blockchain/farm-pools/abis/MasterChefV2.json';

export const getStakedBalance = async (
  pid: string,
  masterchefAddress: string,
  owner: string,
  provider: any
): Promise<BigNumber> => {
  try {
    const contract = new ethers.Contract(masterchefAddress, MasterChefV2, provider);
    return (await contract.userInfo(pid, owner)).amount;
  } catch {
    return constants.Zero;
  }
};

export const getPendingRewards = async (
  pid: string,
  masterchefAddress: string,
  owner: string,
  provider: any
): Promise<BigNumber> => {
  try {
    const contract = new ethers.Contract(masterchefAddress, MasterChefV2, provider);
    return await contract.pendingCake(pid, owner);
  } catch {
    return constants.Zero;
  }
};
