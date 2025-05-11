import { CardHeader } from '@mui/material';

// ----------------------------------------------------------------------

export default function HomeView() {
  return (
    <>
      <CardHeader
        title="Home"
        subheader={'Welcome to Bank Thing!'}
        sx={{
          marginY: 3,
        }}
      />
    </>
  );
}
