import { useEffect } from 'react';

import { useAuthStore } from 'src/stores/auth-store';

import { LoadingScreen } from 'src/components/loading';

import { useRouter } from '../hooks';

interface OnboardingGuardProps {
  children: React.ReactNode;
  preventCompletedUsers?: boolean;
}

const OnboardingGuard = ({ children, preventCompletedUsers = false }: OnboardingGuardProps) => {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && user) {
      if (!user.isActive) {
        router.push('/onboarding');
      } else if (preventCompletedUsers) {
        router.push('/');
      }
    }
  }, [user, isLoading, router, preventCompletedUsers]);

  if (isLoading || !user) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

export default OnboardingGuard;
