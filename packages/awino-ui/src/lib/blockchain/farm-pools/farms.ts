import { ChainId } from '../common';
import { FarmPool, farms } from './constants';

export const fetchFarms = async (chainId: ChainId): Promise<FarmPool[]> => {
  return Promise.resolve(farms[chainId]);
};

