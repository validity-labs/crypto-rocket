import { string } from 'yup';

import { erc20AbiJson } from '../erc20/abi/erc20';

import multicall from './multicall';

export interface TokenInfo {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
  address: string;
  label: string;
  value: number;
  common: boolean;
}

/**
 * Fetches the tokens from an external source e.g subgraph or centralized API
 */
export const fetchTokens = (): Promise<TokenInfo[]> => {
  // @TODO should fetch the list of tokens from an external source
  const tokens: TokenInfo[] = [
    {
      name: 'CRO',
      symbol: 'CRO',
      id: 'CRO',
      decimals: 18,
      address: '0xEDc0B1d201c5d012F291A159A58BAA430c9a29e3',
      label: 'CRO',
      value: 10,
      common: true,
    },
    {
      name: 'Wrapped Ether',
      symbol: 'WETH',
      id: 'WETH',
      decimals: 18,
      address: '0x1E967ad1929579b0248CdB437E4628558282e910',
      label: 'WETH',
      value: 10,
      common: true,
    },
    // {
    //   name: 'USD Coin',
    //   symbol: 'USDC',
    //   id: 'USDC',
    //   decimals: 6,
    //   address: '0xd3eef5aace2b9915736F0f493cc47Ea53e90185e',
    //   label: 'USDC',
    //   value: 10,
    //   common: true,
    // },
    // {
    //   name: 'Tether',
    //   symbol: 'USDT',
    //   id: 'USDT',
    //   decimals: 6,
    //   address: '0xeb5b2B71b34B49bA88E18d37E58B26cD56D44870',
    //   label: 'USDT',
    //   value: 10,
    //   common: true,
    // },
    {
      name: 'DAI Stablecoin',
      symbol: 'DAI',
      id: 'DAI',
      decimals: 18,
      address: '0x8aBE5006Ac9f44f814621cB3BaE36E4b49393c69',
      label: 'DAI',
      value: 10,
      common: true,
    },

    // {
    //   name: 'Ether',
    //   symbol: 'WETH',
    //   id: 'ETH',
    //   decimals: 18,
    //   address: '0x5Dd4D42f279751DBf87002cae4c8853D4EA7C7A5',
    //   label: 'WETH',
    //   value: 10,
    //   common: true,
    // },
    {
      name: 'AWINO',
      symbol: 'AWI',
      id: 'AWI',
      decimals: 18,
      address: '0x02D1a756733F2C63DF89bCcB780C0C7A22D4E8a2',
      label: 'AWI',
      value: 10,
      common: true,
    },
    // {
    //   name: 'MM Finance',
    //   symbol: 'MMF',
    //   id: 'MMF',
    //   decimals: 18,
    //   address: '',
    //   label: 'MMF',
    //   value: 10,
    //   common: true,
    // },
    // {
    //   name: 'Savana Finance',
    //   symbol: 'SVN',
    //   id: 'SVN',
    //   decimals: 18,
    //   address: '',
    //   label: 'SVN',
    //   value: 10,
    //   common: true,
    // },
    // {
    //   name: 'MMO',
    //   symbol: 'MMO',
    //   id: 'MMO',
    //   decimals: 18,
    //   address: '',
    //   label: 'MMO',
    //   value: 10,
    //   common: true,
    // },
  ];

  return Promise.resolve(tokens);
};

/**
 * @param account Account address
 * @param tokens Array with token addresses
 */
export const fetchUserBalances = async (account: string, tokens: string[], provider: any) => {
  const calls = tokens.map((token) => ({
    address: token,
    name: 'balanceOf',
    params: [account],
  }));
  console.log('fetchUserBalances', calls, tokens);
  const tokenBalancesRaw = await multicall(erc20AbiJson, calls, provider);
  return tokenBalancesRaw;
  // TODO transform raw balances as needed
  // const tokenBalances = tokens.reduce((acc, token, index) => ({  [token]: tokenBalancesRaw[index] }), {})

  // return tokenBalancesRaw;
};
