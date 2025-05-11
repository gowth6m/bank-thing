import 'src/theme/globals.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Routes from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { ThemeProvider } from 'src/theme/theme-provider';

import { SnackbarProvider } from 'src/components/snackbar';
import { MotionLazy } from 'src/components/animate/motion-lazy';

import AuthLayout from './layout/core/auth-layout';
import { InstitutionsProvider } from './sections/account/context/institutions-provider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  useScrollToTop();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MotionLazy>
          <SnackbarProvider>
            <AuthLayout>
              <InstitutionsProvider>
                <Routes />
              </InstitutionsProvider>
            </AuthLayout>
          </SnackbarProvider>
        </MotionLazy>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
