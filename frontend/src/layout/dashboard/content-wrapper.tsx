import React from 'react';

import { Container } from '@mui/material';

import { DASHBOARD } from '../config';

interface ContentWrapperProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

const ContentWrapper = ({ children, fullWidth = false }: ContentWrapperProps) => {
  return (
    <Container
      maxWidth={fullWidth ? false : 'lg'}
      disableGutters
      sx={{
        ...(!fullWidth && {
          px: DASHBOARD.CONTENT.PADDING,
          mx: 'auto',
          maxWidth: { sm: '100%', md: '1700px' },
        }),
      }}
    >
      {children}
    </Container>
  );
};

export default ContentWrapper;
