import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { Web3Provider as EthersProjectWeb3Provider } from '@ethersproject/providers';
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';

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

const Web3Provider = ({ children }: Props) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ActivateAccount />
      {children}
    </Web3ReactProvider>
  );
};

export default Web3Provider;
