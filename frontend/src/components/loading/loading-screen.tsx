import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';

import LoadingTopbar from 'src/components/loading/loading-topbar';

// ----------------------------------------------------------------------

export default function LoadingScreen({ sx, ...other }: BoxProps) {
  return (
    <Box
      sx={{
        px: 5,
        width: 1,
        flexGrow: 1,
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      }}
      {...other}
    >
      <LoadingTopbar />
      {/* <LinearProgress color="inherit" sx={{ width: 1, maxWidth: 360 }} /> */}
    </Box>
  );
}
