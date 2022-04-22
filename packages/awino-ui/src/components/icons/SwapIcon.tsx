import { SvgIcon, SvgIconProps } from '@mui/material';

export default function SwapIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path
        d="M 3.1085634,12 A 8.8914366,8.8914366 0 1 0 12,3.1085634 8.8949078,8.8949078 0 0 0 3.1085634,12 Z m 6.2239667,4.890233 -3.112176,-3.112176 3.112176,-3.112177 v 2.223149 h 3.5564989 v 1.778442 H 9.3325301 Z m 5.3349409,-9.7804655 3.112176,3.1121765 -3.112176,3.109863 V 11.109044 H 11.110972 V 9.3306017 h 3.556499 z"
        style={{ strokeWidth: '0.385696' }}
      />
    </SvgIcon>
  );
}
