import { Box, Typography } from '@mui/material';

interface Props {
  title: string;
  description?: string;
  dense?: boolean;
}
const Header = ({ title, description, dense = false }: Props) => {
  return (
    <Box mb={dense ? 11 : 31}>
      <Typography variant="h2" mb={12.5} textAlign="center">
        {title}
      </Typography>
      {description && (
        <Typography textAlign="center" mx="auto">
          {description}
        </Typography>
      )}
    </Box>
  );
};

export default Header;
