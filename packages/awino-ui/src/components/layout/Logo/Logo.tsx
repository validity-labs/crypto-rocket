import React, { ReactElement } from 'react';

import Image from 'next/image';

import { Badge, Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

import { CHAIN_ID } from '@/app/constants';
// import { useAppSelector } from '@/app/hooks';
import Link from '@/components/general/Link/Link';
// import logoLightImage from '@/public/images/logo-light.svg';
import logoDarkImage from '@/public/images/logo.svg';

const Root = styled(Box)({
  display: 'block',
  marginRight: 20,
  overflow: 'visible',
  '.MuiBadge-root': {
    width: '100%',
  },
  '& img': {
    width: '100% !important',
    maxWidth: '205px !important',
  },
});

export default function Logo({ ...restOfProps }: BoxProps): ReactElement {
  // const isDark = useAppSelector((state) => state.app.isDark);
  const logo = <Image src={/* isDark ? logoLightImage : */ logoDarkImage} alt="" placeholder="empty" />;
  return (
    /* @ts-ignore */
    <Root component={Link} href="/" {...restOfProps}>
      {CHAIN_ID !== 1 ? (
        <Badge badgeContent={'Testnet'} color="error">
          {logo}
        </Badge>
      ) : (
        <>{logo}</>
      )}
    </Root>
  );
}
