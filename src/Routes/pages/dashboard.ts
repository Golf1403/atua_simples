import { lazy } from 'react';
import Route from '@interfaces/Route';

export const Routes: Route[] = [
  {
    path: '/',
    exact: true,
    auth: true,
    groups: ['owner', 'admin', 'user'],
    component: lazy(() => import('../../pages/Dashboard')),
  },
];
export default Routes;
