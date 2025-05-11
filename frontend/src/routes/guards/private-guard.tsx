import React, { useEffect } from 'react';
import { useRouter } from '@/routes/hooks';

import { useAuthStore } from 'src/stores/auth-store';

import { LoadingScreen } from 'src/components/loading';

import { PATHS } from '../paths';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

const PrivateGuard: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const { token, isLoading } = useAuthStore();

  useEffect(() => {
    if (!token.access && !isLoading) {
      router.push(PATHS.LOGIN);
    }
  }, [token.access, isLoading, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <>{token.access ? children : null}</>;
};

export default PrivateGuard;
