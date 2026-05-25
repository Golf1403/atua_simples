import { lazy } from 'react';
import Route from '@interfaces/Route';

export const loginPage = {
  path: '/login',
  exact: true,
  auth: false,
  groups: ['guest'],
  component: lazy(() => import('../../pages/auth/Login')),
};

export const updatePage = {
  path: '/update',
  exact: true,
  auth: false,
  groups: ['guest'],
  component: lazy(() => import('../../pages/UpdateVersion')),
};
export const forgotPasswordPage = {
  path: '/forgot-password',
  exact: true,
  auth: false,
  groups: ['guest'],
  component: lazy(() => import('../../pages/auth/ForgotPassword')),
};
export const emailConfirmationPage = {
  path: '/email-confirmation',
  exact: true,
  auth: true,
  groups: ['guest'],
  component: lazy(() => import('../../pages/auth/EmailConfirmation')),
};
export const forgotPasswordByTokenPage = {
  path: '/forgot-password/:token',
  exact: true,
  auth: false,
  groups: ['guest'],
  component: lazy(() => import('../../pages/auth/ForgotPassword')),
};

export const LogoutInfoModal = {
  path: '/logout',
  exact: true,
  auth: false,
  groups: ['guest'],
  component: lazy(() => import('../../components/LogoutInfoModal')),
};

export const PaymentInfo = {
  path: '/processing',
  exact: true,
  auth: false,
  groups: ['guest'],
  component: lazy(() => import('../../components/PaymentInfo')),
};

export const Routes: Route[] = [
  loginPage,
  updatePage,
  forgotPasswordPage,
  emailConfirmationPage,
  forgotPasswordByTokenPage,
  LogoutInfoModal,
  PaymentInfo,
];
export default Routes;
