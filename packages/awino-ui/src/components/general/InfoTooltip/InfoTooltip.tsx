import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { IconButton, Tooltip, TooltipProps } from '@mui/material';

interface InfoTooltipProps extends Omit<TooltipProps, 'title' | 'children'> {
  text: string;
}
const InfoTooltip = ({ text, ...restOfProps }: InfoTooltipProps) => (
  <Tooltip title={text} arrow placement="right" {...restOfProps}>
    <IconButton size="small" color="info" sx={{ ml: 1 }}>
      <InfoOutlinedIcon />
    </IconButton>
  </Tooltip>
);

export default InfoTooltip;
