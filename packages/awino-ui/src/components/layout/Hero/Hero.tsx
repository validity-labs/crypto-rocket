import React, { ReactElement } from 'react';

import { Box, BoxProps, Container, ContainerProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const Root = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing('180px', 0, 30),
}));

interface Props extends BoxProps {
  children?: React.ReactNode;
  containerProps?: ContainerProps;
  hasContainer?: boolean;
}

export default function Hero({ children, hasContainer = true, containerProps = {}, ...props }: Props): ReactElement {
  return (
    // @ts-ignore: types do not work as expected with component prop
    <Root component="section" {...props}>
      {hasContainer ? <Container {...containerProps}>{children}</Container> : children}
    </Root>
  );
}
