import React, { useEffect } from 'react';

import { useAuthStore } from 'src/stores/auth-store';

import { LoadingScreen } from 'src/components/loading';

import { PATHS } from '../paths';
import { useRouter } from '../hooks';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

const PublicGuard: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && user) {
      router.push(PATHS.ACCOUNTS);
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

export default PublicGuard;
