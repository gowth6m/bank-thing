import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';

import { useAuthStore } from 'src/stores/auth-store';

import Logo from 'src/components/logo/logo';

import MenuContent from './menu-content';
import OptionsMenu from './options-menu';
import { DRAWER_WIDTH } from '../config';

const Drawer = styled(MuiDrawer)({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: DRAWER_WIDTH,
    boxSizing: 'border-box',
  },
});

export const SideMenuUserInfo = () => {
  const { user } = useAuthStore();

  return (
    <>
      <Avatar sizes="small" alt={user?.firstName ?? 'avatar'} sx={{ width: 36, height: 36 }} />
      <Box sx={{ mr: 'auto', overflow: 'hidden' }}>
        <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }} noWrap>
          {user?.firstName} {user?.lastName}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {user?.email}
        </Typography>
      </Box>
      <OptionsMenu />
    </>
  );
};

export default function SideMenu() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          p: 1.5,
        }}
      >
        <Logo sx={{ ml: 4 }} />
      </Box>
      <Divider />
      <Box
        sx={{
          overflow: 'auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <MenuContent />
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <SideMenuUserInfo />
      </Stack>
    </Drawer>
  );
}
