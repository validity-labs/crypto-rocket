import React from 'react';

import { useWeb3React } from '@web3-react/core';

import Address from '../general/Address/Address';
import LabelValue from '../general/LabelValue/LabelValue';

const Account = () => {
  const { account } = useWeb3React();
  return <LabelValue id="account" value={<Address address={account || ''} />} labelProps={{ children: 'Account' }} />;
};

export default Account;
