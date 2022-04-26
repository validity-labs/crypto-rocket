import React, { ReactElement } from 'react';

import { Box, BoxProps, Container, ContainerProps } from '@mui/material';
import { styled } from '@mui/material/styles';
// import getProp from 'lodash/get';

// export type SectionBackgroundType = 'neutral' | 'light' | 'lighter' | 'dark' | 'darker' | 'primaryDark' | 'gray';

// const backgroundMap: Record<SectionBackgroundType, string> = {
//   lighter: 'background.lighter',
//   light: 'background.light',
//   gray: 'background.gray',
//   neutral: 'common.white',
//   dark: 'background.dark',
//   darker: 'background.darker',
//   primaryDark: 'primary.dark',
// };

const Root = styled(
  Box /* {
  shouldForwardProp: (prop) => prop !== 'background',
} */
)(
  /* <RootProps> */ ({ /*  background,  */ theme }) => ({
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(15),
    // backgroundColor: getProp(theme.palette, backgroundMap[background], backgroundMap[background]),
    // '& .MuiDecoration-before, & .MuiDecoration-both': {
    //   position: 'relative',
    //   '&:before': {
    //     content: '""',
    //     position: 'absolute',
    //     display: 'inline-block',
    //     backgroundSize: 'contain',
    //     backgroundRepeat: 'no-repeat',
    //     pointerEvents: 'none',
    //   },
    // },
    // '& .MuiDecoration-after, & .MuiDecoration-both': {
    //   position: 'relative',
    //   '&:after': {
    //     content: '""',
    //     position: 'absolute',
    //     display: 'inline-block',
    //     backgroundSize: 'contain',
    //     backgroundRepeat: 'no-repeat',
    //     pointerEvents: 'none',
    //   },
    // },
  })
);

// interface RootProps {
//   background: SectionBackgroundType;
// }
export interface SectionProps extends Partial<BoxProps> {
  containerProps?: ContainerProps;
}

interface Props extends SectionProps {
  // background?: SectionBackgroundType;
  before?: React.ReactNode;
  children: React.ReactNode;
}

export default function Section({
  children,
  // background = 'neutral',
  before = null,
  containerProps,
  ...restOfProps
}: Props): ReactElement {
  return (
    // @ts-ignore: proper type configuration required so Box is used as section so sx props can be passed
    <Root /* background={background} */ component="section" {...restOfProps}>
      {before}
      <Container className="AwiSection-container" {...containerProps}>
        {children}
      </Container>
    </Root>
  );
}
