import React from 'react';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';

import routes from './routes';

const { BrowserRouter, Redirect, Switch } = require('react-router-dom');

const Routes = (): JSX.Element => (
  <BrowserRouter>
    <Switch>
      {routes.map((route, i) => {
        if (route.auth) return <PrivateRoute key={i} {...route} />;
        return <PublicRoute key={i} {...route} />;
      })}
      <Redirect from="*" to="/" />
    </Switch>
  </BrowserRouter>
);

export default Routes;
