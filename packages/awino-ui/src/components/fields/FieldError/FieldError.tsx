import React from 'react';

import { Box, FormHelperText } from '@mui/material';

interface Props {
  id: string;
  message?: string;
  // field?: string;
}

const FieldError = ({ id, message }: Props) => {
  return (
    <Box component={FormHelperText} id={`${id}Helper`} title={message} error={true} mb={2}>
      <Box display="block" component="span" ml={1} textAlign="left">
        {message}
      </Box>
    </Box>
  );
};

export default FieldError;
