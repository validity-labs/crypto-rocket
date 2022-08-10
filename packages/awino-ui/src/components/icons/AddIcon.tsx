import { SvgIcon, SvgIconProps } from '@mui/material';

export default function AddIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <g transform="matrix(0,-0.3822469,0.3822469,0,2.4678556,21.520189)">
        <path
          d="M 46.843,24.921 A 21.921,21.921 0 1 1 24.921,3 21.921,21.921 0 0 1 46.843,24.921 Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
        <path
          d="M 18,12 V 29.537"
          transform="translate(6.921,4.153)"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
        <path
          d="M 12,18 H 29.537"
          transform="translate(4.153,6.921)"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
      </g>
    </SvgIcon>
  );
}
