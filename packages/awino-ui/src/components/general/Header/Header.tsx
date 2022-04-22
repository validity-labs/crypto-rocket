import { Typography } from '@mui/material';

interface Props {
  title: string;
  description: string;
  dense?: boolean;
}
const Header = ({ title, description, dense = false }: Props) => {
  return (
    <>
      <Typography variant="h2" mb={12.5} textAlign="center">
        {title}
      </Typography>
      <Typography color="text.primary" textAlign="center" mb={dense ? 11 : 31} mx="auto">
        {description}
      </Typography>
    </>
  );
};

export default Header;
