import PanelLayout from '@components/PanelLayout';
import React, { Fragment, useEffect, useState } from 'react';

import { RouteComponentProps } from 'react-router-dom';
const { Redirect, Route } = require('react-router-dom');

import ModalUseTerms from '@components/ModalUseTerms';
import { FC, PropsWithChildren } from 'react';
import { layout as onShortcuts } from '../utils/shortcuts';
import { useAuth } from '@/hooks/auth';
import { useLoading } from '@/hooks/loading';
import { useCore } from '@/hooks/core';
import { useUser } from '@/hooks/user';

export type FCC<P = {}> = FC<PropsWithChildren<P>>;

interface PropsImp {
  component: FCC<RouteComponentProps>;
  groups: string[];
  path: string;
}

const PrivateRoute = ({ component: Component, groups, ...rest }: PropsImp): JSX.Element => {
  const { user } = useUser();
  const { isLoading } = useLoading();
  const { isAuth } = useAuth();
  const { setSidebar } = useCore();
  const [isAccordingTerm, setIsAccordingTerm] = useState(false);

  useEffect(() => {
    const toggle = () => setSidebar(sidebar => ({ ...sidebar, visible: !sidebar.visible }));
    const handleShortcuts = (e: KeyboardEvent) => onShortcuts(e, toggle);

    document.addEventListener('keydown', handleShortcuts);
    return () => {
      document.removeEventListener('keydown', handleShortcuts);
    };
  }, [setSidebar]);

  return (
    <Route
      {...rest}
      render={(props: RouteComponentProps) => {
        if (isAuth) {
          if (props.location.pathname.includes('/user/signature')) return <Component {...props} />;

          if (user.redirectToPayment)
            return <Redirect to={{ pathname: '/user/signature', state: { from: props.location } }} />;

          return (
            <>
              {!isLoading && <ModalUseTerms setIsAccordingTerm={setIsAccordingTerm} />}
              {!isAccordingTerm ? (
                <PanelLayout>
                  <Component {...props} />
                </PanelLayout>
              ) : (
                <Fragment />
              )}
            </>
          );
        }

        return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
      }}
    />
  );
};

export default PrivateRoute;
