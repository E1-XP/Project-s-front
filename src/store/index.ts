import { createStore, applyMiddleware, DeepPartial } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension';

import { history } from './../routes/history';
import { createRootReducer } from './../reducers';
import { rootEpic } from './../epics';

import { State } from './interfaces';

const epicMiddleWare = createEpicMiddleware();

const middlewares = [routerMiddleware(history), epicMiddleWare];

export const store = createStore(
  createRootReducer(history),
  composeWithDevTools(applyMiddleware(...middlewares)),
);

epicMiddleWare.run(rootEpic);

// store.subscribe(() => console.log('STATE UDATED:', store.getState()));
