import { useTranslation } from 'next-i18next';

import { Box, BoxProps, BoxTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { styled } from '@mui/material/styles';

type SwappingImageSize = 'small' | 'medium';
export interface SwappingImageProps extends Partial<BoxProps> {
  source: string;
  target: string;
  path?: string;
  size?: SwappingImageSize;
}

const SwappingImage = styled(
  ({ source, target, path = 'icons', ...restOfProps }: SwappingImageProps) => {
    const { t } = useTranslation();
    return (
      <Box
        {...restOfProps}
        title={t('common.convertion-from-to', { from: source.toUpperCase(), to: target.toUpperCase() })}
      >
        <img src={`/images/${path}/${source}.svg`} alt="" className="source AwiSwappingImage-source" />
        <img src={`/images/${path}/${target}.svg`} alt="" className="target AwiSwappingImage-target" />
      </Box>
    );
  },
  {
    shouldForwardProp: (prop) => prop !== 'size',
  }
)<{ size: SwappingImageSize }>(({ size = 'small' }) => {
  const translate = size === 'medium' ? [8, 4] : [8, 4];
  return {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    img: {
      ...(size === 'medium' ? { width: 42, height: 42 } : { width: 30, height: 30 }),

      transition: 'transform 600ms ease-in-out',
      '&.source, &.AwiSwappingImage-source': {
        zIndex: 1,
        transform: `translateX(${translate[0]}px)`,
      },
      '&.target, &.AwiSwappingImage-target': {
        transform: `translateX(-${translate[0]}px)`,
      },
    },
    '&:hover': {
      '.source, .AwiSwappingImage-source': {
        transform: `translateX(${translate[1]}px)`,
      },
      '.target, .AwiSwappingImage-target': {
        transform: `translateX(-${translate[1]}px)`,
      },
    },
  };
});

export default SwappingImage as OverridableComponent<BoxTypeMap<SwappingImageProps, 'div'>>;
