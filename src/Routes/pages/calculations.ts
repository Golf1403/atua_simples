import { lazy } from 'react';
import Route from '@interfaces/Route';
import { pathEnum } from '@/enums/pathEnum';

export const newSimpleUpdatePage: Route = {
  path: `/calculation/${pathEnum.SIMPLE_UPDATE}/new`,
  exact: true,
  auth: true,
  groups: ['owner', 'admin', 'user'],
  component: lazy(() => import('../../pages/calculations/Simple/AccountForm')),
};
export const listSimpleUpdatePage: Route = {
  path: `/calculation/${pathEnum.SIMPLE_UPDATE}`,
  exact: true,
  auth: true,
  groups: ['owner', 'admin', 'user'],
  component: lazy(() => import('../../pages/calculations/Simple/AccountList')),
};
export const editSimpleUpdatePage: Route = {
  path: `/calculation/${pathEnum.SIMPLE_UPDATE}/edit/:accountId`,
  exact: true,
  auth: true,
  groups: ['owner', 'admin', 'user'],
  component: lazy(() => import('../../pages/calculations/Simple/AccountForm')),
};
// financing
export const financingPage: Route = {
  path: `/calculation/${pathEnum.FINANCING}`,
  exact: true,
  auth: true,
  groups: ['owner', 'admin', 'user'],
  component: lazy(() => import('../../pages/calculations/Financing')),
};
// current account
export const newCurrentAccountPage: Route = {
  path: `/calculation/${pathEnum.CURRENT_ACCOUNT}/new`,
  exact: true,
  auth: true,
  groups: ['owner', 'admin', 'user'],
  component: lazy(() => import('../../pages/calculations/Current/AccountForm')),
};
export const listCurrentAccountPage: Route = {
  path: `/calculation/${pathEnum.CURRENT_ACCOUNT}`,
  exact: true,
  auth: true,
  groups: ['owner', 'admin', 'user'],
  component: lazy(() => import('../../pages/calculations/Current/AccountList')),
};
export const editCurrentAccountPage: Route = {
  path: `/calculation/${pathEnum.CURRENT_ACCOUNT}/edit/:accountId`,
  exact: true,
  auth: true,
  groups: ['owner', 'admin', 'user'],
  component: lazy(() => import('../../pages/calculations/Current/AccountForm')),
};

export const Routes: Route[] = [
  listSimpleUpdatePage,
  newSimpleUpdatePage,
  editSimpleUpdatePage,
  listCurrentAccountPage,
  newCurrentAccountPage,
  editCurrentAccountPage,
  {
    path: '/calculation/automated-update',
    exact: true,
    auth: true,
    groups: ['owner', 'admin', 'user'],
    component: lazy(() => import('../../pages/calculations/AutomatedUpdate')),
  },
  financingPage,
];

export default Routes;
