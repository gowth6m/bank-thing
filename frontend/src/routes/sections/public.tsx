import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import SimpleLayout from 'src/layout/simple/layout';

import PublicGuard from '../guards/public-guard';

const LoginPage = lazy(() => import('src/pages/login'));
const RegisterPage = lazy(() => import('src/pages/register'));

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export const publicRoutes = [
  {
    path: '/',
    element: (
      <PublicGuard>
        <SimpleLayout>
          <Suspense fallback={<></>}>
            <Outlet />
          </Suspense>
        </SimpleLayout>
      </PublicGuard>
    ),
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ],
  },
];
