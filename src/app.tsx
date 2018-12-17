import * as React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import CssBaseline from '@material-ui/core/CssBaseline';
import './style.scss';

import { store } from './store';
import { routes } from './routes';
import { history } from './history';

export const App = (props: {}) => {
  return (
    <>
      <CssBaseline />
      <Provider store={store}>
        <ConnectedRouter history={history}>{routes}</ConnectedRouter>
      </Provider>
    </>
  );
};
