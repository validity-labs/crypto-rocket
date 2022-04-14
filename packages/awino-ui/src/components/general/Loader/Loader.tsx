import { CircularProgress, CircularProgressProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface Props {
  progressProps?: CircularProgressProps;
}

const Loader = styled(({ progressProps, ...props }: Props) => (
  <div {...props}>
    <CircularProgress {...progressProps} />
  </div>
))({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
});

export default Loader;
