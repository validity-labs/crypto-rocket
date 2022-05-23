import { string } from 'yup';

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
      name: 'Wrapped CRO',
      symbol: 'WCRO',
      id: 'CRO',
      decimals: 18,
      address: '0xEDc0B1d201c5d012F291A159A58BAA430c9a29e3',
      label: 'WCRO',
      value: 10,
      common: true,
    },

    {
      name: 'USD Coin',
      symbol: 'USDC',
      id: 'USDC',
      decimals: 6,
      address: '0x5a15259B0F448596f503978D14143fA643356552',
      label: 'USDC',
      value: 10,
      common: true,
    },
    {
      name: 'Tether',
      symbol: 'USDT',
      id: 'USDT',
      decimals: 6,
      address: '0x5279F10c5A63B05cf2C893F36ef3De26f3e42a77',
      label: 'USDT',
      value: 10,
      common: true,
    },

    {
      name: 'Ether',
      symbol: 'WETH',
      id: 'ETH',
      decimals: 18,
      address: '0x5Dd4D42f279751DBf87002cae4c8853D4EA7C7A5',
      label: 'WETH',
      value: 10,
      common: true,
    },
    // {
    //   name: 'AWINO',
    //   symbol: 'AW',
    //   id: 'AW',
    //   decimals: 18,
    //   address: '',
    //   label: 'AW',
    //   value: 10,
    //   common: true,
    // },
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
