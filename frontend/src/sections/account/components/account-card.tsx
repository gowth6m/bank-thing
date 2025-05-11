import type { CardProps } from '@mui/material';
import type { InstitutionDto } from 'src/services/types';

import { useState } from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import {
  Box,
  Card,
  Menu,
  Stack,
  Avatar,
  MenuItem,
  Typography,
  IconButton,
  CardContent,
} from '@mui/material';

import { fToNow } from 'src/utils/format-time';
import { removeSnakeCase } from 'src/utils/change-case';

interface AccountCardProps extends CardProps {
  name: string;
  balance: number;
  currency: string;
  accountType: string;
  usageType: string;
  accountId: string;
  institutionId: string;
  institution?: InstitutionDto;
  updatedAt: string;
  onClick?: () => void;
}

export default function AccountCard({
  name,
  balance,
  currency,
  accountType,
  usageType,
  accountId,
  institution,
  institutionId,
  updatedAt,
  onClick,
  ...props
}: AccountCardProps) {
  const icon = institution?.media.find((m) => m.type === 'icon')?.source;

  return (
    <Card
      onClick={onClick}
      sx={{ cursor: onClick ? 'pointer' : undefined, height: '100%', width: '100%' }}
      {...props}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
          gap: 1,
        }}
      >
        <Stack direction="row" alignItems="center" gap={1} width={'100%'}>
          <Avatar
            src={icon}
            alt={name}
            sx={{
              width: 24,
              height: 24,
              bgcolor: 'background.default',
            }}
          />
          <Typography variant="subtitle2" fontWeight={700}>
            {institution?.name}
          </Typography>

          <Box marginLeft={'auto'}>
            <ActionsMenu />
          </Box>
        </Stack>

        <Typography variant="h5">
          {balance.toLocaleString(undefined, {
            style: 'currency',
            currency,
          })}
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent={'space-between'}
          gap={1}
          width={'100%'}
        >
          <Typography variant="body2" color="text.secondary">
            {name} ({removeSnakeCase(accountType.toLowerCase())})
          </Typography>

          <Stack direction="row" alignItems="center" gap={0.5}>
            <RefreshRoundedIcon
              color={'disabled'}
              sx={{
                width: 16,
                height: 16,
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {fToNow(updatedAt)}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function ActionsMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'actions-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        size="small"
        onClick={handleClick}
        sx={{
          border: 'none',
        }}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu id="actions-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleClose}>
          <RefreshRoundedIcon
            sx={{
              width: 16,
              height: 16,
              marginRight: 1,
            }}
          />
          <Typography variant="body2" color="text.secondary">
            Refresh
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
