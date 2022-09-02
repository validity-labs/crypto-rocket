import { memo, useMemo } from 'react';

import { formatLPPair } from '@/lib/formatters';
import { AssetKeyPair } from '@/types/app';

interface Props {
  pair: AssetKeyPair;
}

const LP = ({ pair }: Props) => {
  const text = useMemo(() => {
    return formatLPPair(pair);
  }, [pair]);

  return <>{text}</>;
};

export default memo(LP);
