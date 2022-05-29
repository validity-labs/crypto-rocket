import { useEffect, useState } from 'react';

import { ChainId } from '../constants';

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

const tokens: TokenInfo[] = [
  // {
  //   name: 'Wrapped CRO',
  //   symbol: 'WCRO',
  //   id: 'WCRO',
  //   decimals: 18,
  //   address: '0xC1f1B3Dd918D9505730C9CDdd3a52ac37d592d41',
  //   label: 'WCRO',
  //   value: 10,
  //   common: true,
  // },
  {
    name: 'Wrapped Ether',
    symbol: 'WETH',
    id: 'WETH',
    decimals: 18,
    address: '0x6A58e0938694F26e9E14a31D74F042eBc0D5344f',
    label: 'WETH',
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
    name: 'DAI Stablecoin',
    symbol: 'DAI',
    id: 'DAI',
    decimals: 18,
    address: '0xF26483b12A65c9d502618314968F364a260d4469',
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

export const useAllTokens = (chainId: ChainId): TokenInfo[] => {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchTokens = async () => {
      // @TODO fetch tokens from external source
      setTokens(tokens);
    };

    fetchTokens();
  }, [chainId, tokens]);

  return tokens;
};
