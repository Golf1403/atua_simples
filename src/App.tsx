import React from 'react';
import Provider from './hooks';
import Routes from './Routes';

const App = (): JSX.Element => {
  return (
    <Provider>
      <Routes />
    </Provider>
  );
};

export default App;
