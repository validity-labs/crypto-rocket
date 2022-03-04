import { SvgIcon, SvgIconProps } from '@mui/material';

export default function ExpandIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <defs>
        <linearGradient id="expandIconGradient1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(0,255,235,1)" />
          <stop offset="50%" stopColor="rgba(0,230,62,1)" />
        </linearGradient>
      </defs>
      <path
        d="M15.88 9.29 12 13.17 8.12 9.29a.9959.9959 0 0 0-1.41 0c-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41-.39-.38-1.03-.39-1.42 0z"
        fill="url(#expandIconGradient1)"
      />
    </SvgIcon>
  );
}
