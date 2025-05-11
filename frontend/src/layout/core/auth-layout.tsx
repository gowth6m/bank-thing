import { useInitAuth } from 'src/hooks/use-init-auth';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  useInitAuth();
  return <>{children}</>;
};

export default AuthLayout;
