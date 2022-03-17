import { useWeb3React } from '@web3-react/core';

import LabelValue from '../general/LabelValue/LabelValue';

const ChainId = () => {
  const { chainId } = useWeb3React();

  const value = chainId ?? '';
  return <LabelValue id="chainId" value={value} labelProps={{ children: 'Chain Id' }} />;
};

export default ChainId;
