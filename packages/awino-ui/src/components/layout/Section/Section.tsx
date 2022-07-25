import React, { ReactElement } from 'react';

import { Box, BoxProps, Container, ContainerProps } from '@mui/material';
import { styled } from '@mui/material/styles';
// import getProp from 'lodash/get';

export type SectionSize =
  | 'small'
  // | 'small-large'
  | 'medium'
  // | 'void-medium'
  // | 'large'
  | 'large-medium';
// | 'medium-large' // top-bottom

const sizes = {
  small: 15,
  medium: 30,
  large: 45,
};

const paddingsMap = {
  small: [sizes.small, sizes.small],
  // 'small-large': [sizes.small, sizes.large],
  medium: [sizes.medium, sizes.medium],
  // 'void-medium': [0, sizes.medium],
  // large: [sizes.large, sizes.large],
  'large-medium': [sizes.large, sizes.medium],
  // 'medium-large': [sizes.medium, sizes.large],
};
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

const Root = styled(Box, {
  shouldForwardProp: (prop) => /* prop !== 'background' && */ prop !== 'size',
})<RootProps>(({ theme, /* background, */ size }) => ({
  paddingTop: theme.spacing(paddingsMap[size][0]),
  paddingBottom: theme.spacing(paddingsMap[size][1]),
}));

interface RootProps {
  // background: SectionBackgroundType;
  size: SectionSize;
}
export interface SectionProps extends Partial<BoxProps> {
  /**
   *  Possible values 'small' | 'small-large' | 'medium' | 'void-medium' | 'large' | 'large-medium' | 'medium-large'.
   *  Two values represent top-bottom padding.
   */
  size?: SectionSize;
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
  size = 'small',
  before = null,
  containerProps,
  ...restOfProps
}: Props): ReactElement {
  return (
    // @ts-ignore: proper type configuration required so Box is used as section so sx props can be passed
    <Root /* background={background} */ size={size} component="section" {...restOfProps}>
      {before}
      <Container className="AwiSection-container" {...containerProps}>
        {children}
      </Container>
    </Root>
  );
}
