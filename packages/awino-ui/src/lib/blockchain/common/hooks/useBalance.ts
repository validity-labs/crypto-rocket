import { useEffect, useState } from 'react';

import { useWeb3React } from '@web3-react/core';

export function useBalance(account: string) {
  const { library } = useWeb3React();
  const [balance, setBalance] = useState(0);

  console.log(`account`);
  console.log({ account });

  useEffect(() => {
    const fetchBalance = async () => {
      const balance = await library?.getBalance(account);
      setBalance(balance.toString());
    };

    fetchBalance();
  }, [account, library]);

  return balance;
}
