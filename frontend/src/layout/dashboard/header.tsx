import Stack from '@mui/material/Stack';

import NavbarBreadcrumbs from './navbar-breadcrumbs';

export default function Header() {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'flex', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        pt: 1.5,
        pb: 1.5,
      }}
      spacing={2}
    >
      <NavbarBreadcrumbs />
    </Stack>
  );
}
