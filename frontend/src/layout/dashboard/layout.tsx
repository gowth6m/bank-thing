import { Box, alpha, Stack } from '@mui/material';

import SideMenu from './side-menu';
import AppNavbar from './app-navbar';
import { APPBAR_HEIGHT } from '../config';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => (
  <Box sx={{ display: 'flex' }}>
    <SideMenu />
    <AppNavbar />

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
          mt: {
            xs: APPBAR_HEIGHT.xs,
            sm: APPBAR_HEIGHT.sm,
            md: 0,
          },
        }}
      >
        {children}
      </Stack>
    </Box>
  </Box>
);

export default DashboardLayout;
