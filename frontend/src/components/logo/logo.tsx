import type { SxProps } from '@mui/material';

import { forwardRef } from 'react';

import { Box, Chip, Typography } from '@mui/material';

import { RouterLink } from 'src/routes/components';

interface LogoProps {
  disabledLink?: boolean;
  squareLogo?: boolean;
  sx?: SxProps;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, squareLogo = false, sx, ...other }, ref) => {
    const logo = (
      <Box
        ref={ref}
        component="div"
        sx={{
          width: 'fit-content',
          height: 50,
          display: 'flex',
          flexDirection: squareLogo ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          ...sx,
        }}
        {...other}
      >
        <Typography
          variant="h5"
          color="primary.main"
          sx={{
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Bank
        </Typography>
        <Chip
          label="Thing"
          color={'secondary'}
          size="small"
          variant={'filled'}
          sx={{
            border: 'none',
            marginLeft: 0.45,
          }}
        />
      </Box>
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <RouterLink
        href="https://gowtham.io"
        target="_blank"
        style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {logo}
      </RouterLink>
    );
  }
);

Logo.displayName = 'Logo';
export default Logo;
