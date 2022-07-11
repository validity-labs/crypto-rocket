import { Interface } from '@ethersproject/abi';
import { CallOverrides } from '@ethersproject/contracts';
import { Contract } from '@ethersproject/contracts';
import { ethers } from 'ethers';

// import { getMulticallContract } from 'utils/contractHelpers';
import { CHAIN_ID } from '@/app/constants';
import { ChainId } from '@/lib/blockchain';

import { multicallAbiJson } from './abi/multicall';
import { MULTICALL_ADDRESS_MAP } from './constants';

export interface Call {
  address: string; // Address of the contract
  name: string; // Function name on the contract (example: balanceOf)
  params?: any[]; // Function params
}

export interface MulticallOptions extends CallOverrides {
  requireSuccess?: boolean;
}

const getMulticallContract = (provider: any) => {
  //   function getLibrary(provider: any): EthersProjectWeb3Provider {
  //     const library = new EthersProjectWeb3Provider(provider);
  //     library.pollingInterval = 12000;
  //     return library;
  //   }
  //   const contract = new ethers.Contract(pairId, multicallAbi, library);

  // import type { Signer } from '@ethersproject/abstract-signer';
  // import type { Provider } from '@ethersproject/providers';

  const address = MULTICALL_ADDRESS_MAP[CHAIN_ID];
  console.log('MULTICALL_ADDRESS_MAP', address);
  // const signerOrProvider = signer ?? simpleRpcProvider;
  return new Contract(address, multicallAbiJson, provider);

  // export const getContract = (abi: any, address: string, signer?: Signer | Provider) => {};

  // export const getMulticallContract = () => {
  //   return getContract(MultiCallAbi, getAddress(), provider);
  // };
};

const multicall = async <T = any>(abi: any[], calls: Call[], provider: any): Promise<T> => {
  const multi = getMulticallContract(provider);
  const itf = new Interface(abi);

  const calldata = calls.map((call) => ({
    target: call.address.toLowerCase(),
    callData: itf.encodeFunctionData(call.name, call.params),
  }));
  const { returnData } = await multi.aggregate(calldata);

  const res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call));

  return res as any;
};

/**
 * Multicall V2 uses the new "tryAggregate" function. It is different in 2 ways
 *
 * 1. If "requireSuccess" is false multicall will not bail out if one of the calls fails
 * 2. The return includes a boolean whether the call was successful e.g. [wasSuccessful, callResult]
 */
export const multicallv2 = async <T = any>(
  abi: any[],
  calls: Call[],
  provider: any,
  options?: MulticallOptions
): Promise<T> => {
  const { requireSuccess = true, ...overrides } = options || {};
  const multi = getMulticallContract(provider);
  const itf = new Interface(abi);

  const calldata = calls.map((call) => ({
    target: call.address.toLowerCase(),
    callData: itf.encodeFunctionData(call.name, call.params),
  }));

  const returnData = await multi.tryAggregate(requireSuccess, calldata, overrides);
  const res = returnData.map((call, i) => {
    const [result, data] = call;
    return result ? itf.decodeFunctionResult(calls[i].name, data) : null;
  });

  return res as any;
};

export default multicall;
