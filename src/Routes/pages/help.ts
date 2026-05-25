import { lazy } from 'react';
import Route from '@interfaces/Route';

export const helpPage = {
  path: '/help',
  exact: true,
  auth: true,
  groups: ['owner', 'admin', 'user'],
  component: lazy(() => import('../../pages/Help')),
};

export const Routes: Route[] = [helpPage];

export default Routes;
