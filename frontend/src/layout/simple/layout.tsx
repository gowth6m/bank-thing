import { Box, alpha, Stack } from '@mui/material';

import { APPBAR_HEIGHT } from '../config';
import SimpleAppbar from './simple-appbar';

interface SimpleLayoutProps {
  children: React.ReactNode;
}

const SimpleLayout = ({ children }: SimpleLayoutProps) => (
  <Box sx={{ display: 'flex' }}>
    <SimpleAppbar />
    {/* Main content */}
    <Box
      component="main"
      sx={(theme) => ({
        flexGrow: 1,
        backgroundColor: theme.vars
          ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
          : alpha(theme.palette.background.default, 1),
        overflow: 'auto',
      })}
    >
      <Stack
        spacing={2}
        sx={{
          alignItems: 'center',
          mx: { xs: 1, md: 2 },
          mt: APPBAR_HEIGHT,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>{children}</Box>
      </Stack>
    </Box>
  </Box>
);

export default SimpleLayout;
