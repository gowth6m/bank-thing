import { LinearProgress } from '@mui/material';

const LoadingTopbar = () => {
  return (
    <LinearProgress
      style={{ height: 4 }}
      sx={{
        borderRadius: 0,
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: (theme) => theme.zIndex.drawer + 100,
      }}
    />
  );
};

export default LoadingTopbar;
