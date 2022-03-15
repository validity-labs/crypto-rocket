import { useTranslation } from 'next-i18next';

import { Box, BoxProps, BoxTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { styled } from '@mui/material/styles';

export interface SwappingImageProps extends Partial<BoxProps> {
  source: string;
  target: string;
}

const SwappingImage = styled(({ source, target, ...restOfProps }: SwappingImageProps) => {
  const { t } = useTranslation();
  return (
    <Box
      {...restOfProps}
      title={t('common.convertion-from-to', { from: source.toUpperCase(), to: target.toUpperCase() })}
    >
      <img src={`/images/icons/${source}.svg`} alt="" className="source" />
      <img src={`/images/icons/${target}.svg`} alt="" className="target" />
    </Box>
  );
})(() => ({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  img: {
    width: 42,
    height: 42,
    transition: 'transform 600ms ease-in-out',
    '&.source': {
      zIndex: 1,
      transform: 'translateX(12px)',
    },
    '&.target': {
      transform: 'translateX(-12px)',
    },
  },
  '&:hover': {
    '.source': {
      transform: 'translateX(4px)',
    },
    '.target': {
      transform: 'translateX(-4px)',
    },
  },
}));

export default SwappingImage as OverridableComponent<BoxTypeMap<SwappingImageProps, 'div'>>;
