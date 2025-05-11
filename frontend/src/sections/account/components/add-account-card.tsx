import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Card, Stack, Button, Typography } from '@mui/material';

interface AddAccountCardProps {
  onClick: () => void;
}

export default function AddAccountCard({ onClick }: AddAccountCardProps) {
  return (
    <Card
      component={Button}
      onClick={onClick}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        gap: 0,
        borderStyle: 'dashed',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent={'center'} spacing={1}>
        <AddRoundedIcon fontSize="small" />
        <Typography variant="subtitle2" fontWeight={700}>
          Link bank account
        </Typography>
      </Stack>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          textAlign: 'center',
        }}
      >
        Click to link another bank account
      </Typography>
    </Card>
  );
}
