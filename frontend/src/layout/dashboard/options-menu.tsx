import * as React from 'react';

import Menu from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import { listClasses } from '@mui/material/List';
import { paperClasses } from '@mui/material/Paper';
import ListItemText from '@mui/material/ListItemText';
import { styled, useColorScheme } from '@mui/material/styles';
import DarkModeIcon from '@mui/icons-material/DarkModeRounded';
import Divider, { dividerClasses } from '@mui/material/Divider';
import LightModeIcon from '@mui/icons-material/LightModeRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import ListItemIcon, { listItemIconClasses } from '@mui/material/ListItemIcon';

import { useAuthStore } from 'src/stores/auth-store';

import MenuButton from './menu-button';

const MenuItem = styled(MuiMenuItem)({
  margin: '2px 0',
});

const ThemeModeToggleButton = ({ handleClose }: { handleClose: VoidFunction }) => {
  const { mode, systemMode, setMode } = useColorScheme();

  const handleToggle = () => {
    let modeToSet = systemMode ?? 'dark';

    if (mode === 'dark') {
      modeToSet = 'light';
    } else if (mode === 'light') {
      modeToSet = 'dark';
    }

    setMode(modeToSet);
    handleClose();
  };

  return (
    <MenuItem
      onClick={handleToggle}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <ListItemText>{mode === 'dark' ? 'Light mode' : 'Dark mode'}</ListItemText>
      <ListItemIcon
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
      </ListItemIcon>
    </MenuItem>
  );
};

export default function OptionsMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { resetAuth } = useAuthStore();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    resetAuth();
  };

  return (
    <React.Fragment>
      <MenuButton aria-label="Open menu" onClick={handleClick} sx={{ borderColor: 'transparent' }}>
        <MoreVertRoundedIcon />
      </MenuButton>
      <Menu
        anchorEl={anchorEl}
        id="menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          [`& .${listClasses.root}`]: {
            padding: '4px',
          },
          [`& .${paperClasses.root}`]: {
            padding: 0,
          },
          [`& .${dividerClasses.root}`]: {
            margin: '4px -4px',
          },
        }}
      >
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <ThemeModeToggleButton handleClose={handleClose} />
        <Divider />
        <MenuItem
          onClick={handleLogout}
          sx={{
            [`& .${listItemIconClasses.root}`]: {
              ml: 'auto',
              minWidth: 0,
            },
          }}
        >
          <ListItemText>Logout</ListItemText>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
