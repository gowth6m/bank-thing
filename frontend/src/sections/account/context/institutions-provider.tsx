import { useQuery } from '@tanstack/react-query';

import ApiClient from 'src/services/api-client';
import { useAuthStore } from 'src/stores/auth-store';

import { InstitutionsContext } from './institutions-context';

export function InstitutionsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();

  const qInstitutions = useQuery({
    queryKey: ['bank.institutions'],
    queryFn: () => {
      return ApiClient.bank.institutions();
    },
    enabled: !!user,
  });

  return (
    <InstitutionsContext.Provider
      value={{
        institutions: qInstitutions.data?.data || [],
        isLoading: qInstitutions.isLoading,
        isError: qInstitutions.isError,
      }}
    >
      {children}
    </InstitutionsContext.Provider>
  );
}
