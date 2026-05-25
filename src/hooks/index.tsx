import configureStore from '@store/configureStore';
import ptBR from 'date-fns/locale/pt-BR';
import moment from 'moment';
import React, { Fragment, Suspense } from 'react';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
const { Provider } = require('react-redux');
import { AuthProvider } from './auth';
import { FactorsHookProvider } from './factors';
import { CurrentAccountHookProvider } from './currentAccount';
import { SimpleUpdateHookProvider } from './simpleUpdate';
import { NomenclaturesHookProvider } from './nomenclatures';
import { LoadingHookProvider } from './loading';
import Authentication from '../Routes/components/Authentication';
import { Buffer } from 'buffer';
import { CoreHookProvider } from './core';
import GlobalStyle from '@styles/global';
import { ToastProvider } from './toast';

import { AlertMessageProvider } from './alertMessages';
import OverlayLoading from '@/components/OverlayLoading';

import 'moment/locale/pt-br';
import 'react-datepicker/dist/react-datepicker.css';
import { ToolbarHookProvider } from './toolbar';
import SEILoading from '@/components/SEILoading';
import { ResourceHookProvider } from './resourses';
import { UserProvider } from './user';
import { WebSocketProvider } from './websocket';

registerLocale('pt-BR', ptBR);
setDefaultLocale('pt-BR');
moment.locale('pt-br');

// @ts-ignore
window.Buffer = Buffer;

const initialState = window.INITIAL_REDUX_STATE;
const store = configureStore(initialState);

const Root = ({ children: Children, isTest = false }: { children: JSX.Element; isTest?: boolean }) => {
  if (isTest)
    return (
      <>
        <GlobalStyle />
        <Suspense fallback={<SEILoading />}>
          <ToastProvider>
            <ResourceHookProvider>
              <Provider store={store}>
                <LoadingHookProvider>
                  <UserProvider>
                    <FactorsHookProvider>
                      <CurrentAccountHookProvider>
                        <SimpleUpdateHookProvider>
                          <CoreHookProvider>
                            <NomenclaturesHookProvider>
                              <Authentication>
                                <Fragment>
                                  <OverlayLoading />
                                  {Children}
                                </Fragment>
                              </Authentication>
                            </NomenclaturesHookProvider>
                          </CoreHookProvider>
                        </SimpleUpdateHookProvider>
                      </CurrentAccountHookProvider>
                    </FactorsHookProvider>
                  </UserProvider>
                </LoadingHookProvider>
              </Provider>
            </ResourceHookProvider>
          </ToastProvider>
        </Suspense>
      </>
    );

  return (
    <>
      <GlobalStyle />
      <Suspense fallback={<SEILoading />}>
        <WebSocketProvider>
          <ToastProvider>
            <AlertMessageProvider>
              <Provider store={store}>
                <ResourceHookProvider>
                  <LoadingHookProvider>
                    <UserProvider>
                      <AuthProvider>
                        <FactorsHookProvider>
                          <CurrentAccountHookProvider>
                            <SimpleUpdateHookProvider>
                              <CoreHookProvider>
                                <NomenclaturesHookProvider>
                                  <ToolbarHookProvider>
                                    <Authentication>
                                      <Fragment>
                                        <OverlayLoading />
                                        {Children}
                                      </Fragment>
                                    </Authentication>
                                  </ToolbarHookProvider>
                                </NomenclaturesHookProvider>
                              </CoreHookProvider>
                            </SimpleUpdateHookProvider>
                          </CurrentAccountHookProvider>
                        </FactorsHookProvider>
                      </AuthProvider>
                    </UserProvider>
                  </LoadingHookProvider>
                </ResourceHookProvider>
              </Provider>
            </AlertMessageProvider>
          </ToastProvider>
        </WebSocketProvider>
      </Suspense>
    </>
  );
};

export default Root;
