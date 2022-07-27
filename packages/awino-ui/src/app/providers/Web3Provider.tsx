import { ReactNode, useMemo } from 'react';
import { useEffect, useState } from 'react';

import { Web3Provider as EthersProjectWeb3Provider } from '@ethersproject/providers';
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';

import { AWINO_MASTER_CHEF_ADDRESS_MAP, AWINO_ROUTER_MAP, FACTORY_ADDRESS_MAP } from '@/lib/blockchain';
import { Address } from '@/types/app';

import { useAppDispatch } from '../hooks';
import { setAccount } from '../state/slices/account';
import { completeAppInitialization } from '../state/slices/app';
import { useEagerConnect, useInactiveListener } from '../web3/hooks';

const ActivateAccount = () => {
  const context = useWeb3React<EthersProjectWeb3Provider>();
  const { account, connector } = context;
  const dispatch = useAppDispatch();

  const [activatingConnector, setActivatingConnector] = useState<any>();
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  useEffect(() => {
    dispatch(setAccount(account));
  }, [account, dispatch]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  useEffect(() => {
    if (triedEager) {
      dispatch(completeAppInitialization());
    }
  }, [triedEager, dispatch]);

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  return null;
};

function getLibrary(provider: any): EthersProjectWeb3Provider {
  const library = new EthersProjectWeb3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

interface Props {
  children: ReactNode;
}

export const useWeb3 = () => {
  const { account: originalAccount, chainId, ...restOfWeb3 } = useWeb3React<EthersProjectWeb3Provider>();
  const addressOf = useMemo<Record<'router' | 'factory' | 'masterchef', Address>>(() => {
    return {
      router: AWINO_ROUTER_MAP[chainId],
      factory: FACTORY_ADDRESS_MAP[chainId],
      masterchef: AWINO_MASTER_CHEF_ADDRESS_MAP[chainId],
    };
  }, [chainId]);

  const account = useMemo(() => (originalAccount || '').toLowerCase(), [originalAccount]);

  return { account, chainId, ...restOfWeb3, addressOf };
};

const Web3Provider = ({ children }: Props) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ActivateAccount />
      {children}
    </Web3ReactProvider>
  );
};

export default Web3Provider;
