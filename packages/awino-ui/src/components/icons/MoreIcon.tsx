import { SvgIcon, SvgIconProps } from '@mui/material';

export default function MoreIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <defs>
        <linearGradient id="moreIconGradient1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(0,255,235,1)" />
          <stop offset="50%" stopColor="rgba(0,230,62,1)" />
        </linearGradient>
      </defs>
      <path
        d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
        fill="url(#moreIconGradient1) !important"
      />
    </SvgIcon>
  );
}
