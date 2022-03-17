import React from 'react';

import { useWeb3React } from '@web3-react/core';

import LabelValue from '../general/LabelValue/LabelValue';

const Status = () => {
  const { active, error } = useWeb3React();

  const value = active ? '🟢' : error ? '🔴' : '🟠';
  return <LabelValue id="status" value={value} labelProps={{ children: 'Status' }} />;
};

export default Status;
