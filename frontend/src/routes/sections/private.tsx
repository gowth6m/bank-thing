import { lazy, Suspense } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

import DashboardLayout from 'src/layout/dashboard/layout';
import ContentWrapper from 'src/layout/dashboard/content-wrapper';

import { LoadingScreen } from 'src/components/loading';

import PrivateGuard from '../guards/private-guard';

const AccountsPage = lazy(() => import('src/pages/accounts'));

export const privateRoutes = [
  {
    path: '/',
    element: (
      <PrivateGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </PrivateGuard>
    ),
    children: [
      // NON FULLWIDTH
      {
        element: (
          <ContentWrapper>
            <Outlet />
          </ContentWrapper>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/accounts" replace />,
          },
          {
            path: 'accounts',
            element: <AccountsPage />,
          },
        ],
      },
    ],
  },
];
