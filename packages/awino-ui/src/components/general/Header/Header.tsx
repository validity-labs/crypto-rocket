import { Typography } from '@mui/material';

interface Props {
  title: string;
  description: string;
}
const Header = ({ title, description }: Props) => {
  return (
    <>
      <Typography variant="h2" mb={12.5} textAlign="center">
        {title}
      </Typography>
      <Typography color="text.primary" textAlign="center" mb={31} mx="auto">
        {description}
      </Typography>
    </>
  );
};

export default Header;
