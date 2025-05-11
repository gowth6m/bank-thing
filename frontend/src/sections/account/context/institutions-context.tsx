import type { InstitutionDto } from 'src/services/types';

import { useContext, createContext } from 'react';

// ------------------------------------------------

interface InstitutionsContextProps {
  institutions: InstitutionDto[];
  isLoading: boolean;
  isError: boolean;
}

export const InstitutionsContext = createContext<InstitutionsContextProps | null>(null);

export const useInstitutionsContext = () => {
  const context = useContext(InstitutionsContext);

  if (!context) throw new Error('useInstitutionsContext must be use inside InstitutionsProvider');

  return context;
};
