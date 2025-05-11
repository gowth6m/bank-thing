import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import ListItem from '@mui/material/ListItem';
import GitHubIcon from '@mui/icons-material/GitHub';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ListItemButton from '@mui/material/ListItemButton';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import DonutSmallRoundedIcon from '@mui/icons-material/DonutSmallRounded';
import BusinessCenterRoundedIcon from '@mui/icons-material/BusinessCenterRounded';

import { PATHS } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

const mainListItems = [
  { text: 'Home', icon: <HomeRoundedIcon />, href: PATHS.INDEX, disabled: true },
  { text: 'Accounts', icon: <BusinessCenterRoundedIcon />, href: PATHS.ACCOUNTS },
  { text: 'Portfolio', icon: <DonutSmallRoundedIcon />, href: PATHS.PORTFOLIO, disabled: true },
];

const secondaryListItems = [
  { text: 'gowtham.io', icon: <RocketLaunchIcon />, href: PATHS.TERMS, external: true },
  {
    text: 'LinkedIn',
    icon: <LinkedInIcon />,
    href: 'https://www.linkedin.com/in/gowth6m',
    external: true,
  },
  {
    text: 'GitHub',
    icon: <GitHubIcon />,
    href: 'https://github.com/gowth6m',
    external: true,
  },
];

export default function MenuContent() {
  const pathname = usePathname();

  const renderList = (
    items: {
      text: string;
      icon: React.ReactNode;
      href: string;
      external?: boolean;
      disabled?: boolean;
    }[]
  ) =>
    items.map((item, index) => (
      <ListItem key={index} disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          LinkComponent={RouterLink}
          href={item.href}
          selected={!item.external && pathname === item.href}
          target={item.external ? '_blank' : undefined}
          disabled={item?.disabled}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
          {item.external && (
            <ListItemIcon>
              <LaunchRoundedIcon fontSize="small" />
            </ListItemIcon>
          )}
        </ListItemButton>
      </ListItem>
    ));

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>{renderList(mainListItems)}</List>
      <List dense>{renderList(secondaryListItems)}</List>
    </Stack>
  );
}
