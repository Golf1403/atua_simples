import { lazy } from 'react';
import Route from '@interfaces/Route';

export const Routes: Route[] = [
  {
    path: '/admin/users',
    exact: true,
    auth: true,
    groups: ['owner', 'admin'],
    component: lazy(() => import('../../pages/admin/UserManagement')),
  },
  {
    path: '/admin/cost-center',
    exact: true,
    auth: true,
    groups: ['owner', 'admin'],
    component: lazy(() => import('../../pages/admin/CostCenter')),
  },
  {
    path: '/admin/nomenclature',
    exact: true,
    auth: true,
    groups: ['owner', 'admin'],
    component: lazy(() => import('../../pages/admin/Nomenclature')),
  },
];
export default Routes;
