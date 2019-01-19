import * as React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { compose, lifecycle } from 'recompose';

import CssBaseline from '@material-ui/core/CssBaseline';
import './style.scss';

import { actions } from './actions';
import { store } from './store';
import { routes } from './routes';
import { history } from './history';

export const App = compose(
  lifecycle<{}, {}>({
    componentDidMount() {
      store.dispatch(actions.global.initApp());
    },
  }),
)(() => (
  <>
    <CssBaseline />
    <Provider store={store}>
      <ConnectedRouter history={history}>{routes}</ConnectedRouter>
    </Provider>
  </>
));
