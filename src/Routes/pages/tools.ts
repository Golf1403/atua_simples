import { lazy } from 'react';
import Route from '@interfaces/Route';

export const Routes: Route[] = [
  {
    path: '/converter',
    exact: true,
    auth: true,
    groups: ['owner', 'admin', 'user'],
    component: lazy(() => import('../../pages/tools/Converter')),
  },
  {
    path: '/calculator/financial',
    exact: true,
    auth: true,
    groups: ['owner', 'admin', 'user'],
    component: lazy(() => import('../../pages/tools/FinancialCalculator')),
  },
  {
    path: '/retroactor',
    exact: true,
    auth: true,
    groups: ['owner', 'admin', 'user'],
    component: lazy(() => import('../../pages/tools/Retroactor')),
  },
  {
    path: '/indicators',
    exact: true,
    auth: true,
    groups: ['owner', 'admin', 'user'],
    component: lazy(() => import('../../pages/tools/Indicators')),
  },
];
export default Routes;
