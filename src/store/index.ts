import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension';

import { history } from './../routes/history';
import { createRootReducer } from './../reducers';
import { rootEpic } from './../epics';

import { actionSanitizer } from './actionSanitizer';

import { State } from './interfaces';

const epicMiddleWare = createEpicMiddleware();

const middlewares = [routerMiddleware(history), epicMiddleWare];

const composeEnhancers = composeWithDevTools({
  actionSanitizer,
});

export const store = createStore<State, any, {}, {}>(
  createRootReducer(history),
  composeEnhancers(applyMiddleware(...middlewares)),
);

epicMiddleWare.run(rootEpic);
