import React, { FC, PropsWithChildren, useEffect } from 'react';
const { Route, useHistory } = require('react-router-dom');
import { RouteComponentProps } from 'react-router-dom';

import { updatePage } from './pages/auth';
import { useAuth } from '@/hooks/auth';
import { useLoading } from '@/hooks/loading';

export type FCC<P = {}> = FC<PropsWithChildren<P>>;
interface PropsImp {
  component: FCC<RouteComponentProps>;
}

const PublicRoute: FCC<PropsImp> = ({ component: Component, ...rest }: PropsImp) => {
  const history = useHistory();
  const { isAuth } = useAuth();
  const { isLoading } = useLoading();

  useEffect(() => {
    const isNewVersion = Boolean(Number(process.env.REACT_APP_IS_NEW_VERSION));
    if (isNewVersion) return history.push(updatePage.path);

    if (isLoading) return () => {};
    if (isAuth) history.push('/');
  }, [isAuth, isLoading]);

  return <Route {...rest} render={(props: RouteComponentProps) => <Component {...props} />} />;
};

export default PublicRoute;
