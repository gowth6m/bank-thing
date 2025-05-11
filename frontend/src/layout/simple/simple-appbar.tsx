import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import MuiToolbar from '@mui/material/Toolbar';
import { tabsClasses } from '@mui/material/Tabs';

import Logo from 'src/components/logo/logo';

const Toolbar = styled(MuiToolbar)({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'center',
  gap: '12px',
  flexShrink: 0,
  backgroundImage: 'none',
  [`& ${tabsClasses.list}`]: {
    gap: '8px',
    pb: 0,
  },
});

export default function SimpleAppbar() {
  return (
    <AppBar
      elevation={0}
      position="fixed"
      sx={{
        backgroundColor: {
          xs: 'background.default',
          md: 'transparent',
        },
      }}
    >
      <Toolbar variant="regular">
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            flexGrow: 1,
            width: '100%',
            gap: 1,
          }}
        >
          <Logo />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
