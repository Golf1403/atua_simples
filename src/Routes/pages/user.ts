import { lazy } from 'react';

import Route from '@interfaces/Route';

export const Routes: Route[] = [
  {
    path: '/user/licenses',
    exact: true,
    auth: true,
    groups: ['owner'],
    component: lazy(() => import('../../pages/user/Licenses')),
  },
  {
    path: '/user/signature',
    exact: true,
    auth: true,
    groups: ['owner'],
    component: lazy(() => import('../../pages/user/Signature')),
  },
  {
    path: '/user/profile',
    exact: true,
    auth: true,
    groups: ['owner', 'admin', 'user'],
    component: lazy(() => import('../../pages/user/Profile')),
  },
];
export default Routes;
