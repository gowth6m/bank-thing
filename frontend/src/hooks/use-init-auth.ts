import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import ApiClient from 'src/services/api-client';
import { useAuthStore } from 'src/stores/auth-store';

export function useInitAuth() {
  const { token, setUser, setToken, setIsLoading, resetAuth } = useAuthStore();

  const enabled = !!token?.access;

  const qUserCurrent = useQuery({
    queryKey: ['user.current'],
    queryFn: () => ApiClient.user.current(),
    enabled,
  });

  useEffect(() => {
    setIsLoading(qUserCurrent.isLoading);
  }, [qUserCurrent.isLoading, setIsLoading]);

  useEffect(() => {
    if (qUserCurrent.isSuccess && qUserCurrent.data) {
      setUser(qUserCurrent?.data?.data);
    }

    if (qUserCurrent.isError) {
      resetAuth();
    }
  }, [
    qUserCurrent.isSuccess,
    qUserCurrent.isError,
    qUserCurrent.data,
    setUser,
    setToken,
    resetAuth,
  ]);
}
