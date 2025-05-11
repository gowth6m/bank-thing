import { Navigate, useRoutes } from 'react-router-dom';

import { mainRoutes } from './main';
import { publicRoutes } from './public';
import { privateRoutes } from './private';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // Public routes
    ...publicRoutes,

    // Private routes
    ...privateRoutes,

    // Main routes
    ...mainRoutes,

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
