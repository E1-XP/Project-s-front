import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension';

import { history } from './../routes/history';
import { createRootReducer } from './../reducers';
import { rootEpic } from './../epics';

import { State } from './interfaces';
import { types } from './../actions/types';

const epicMiddleWare = createEpicMiddleware();

const middlewares = [routerMiddleware(history), epicMiddleWare];

const composeEnhancers = composeWithDevTools({
  actionSanitizer: action => {
    switch (action.type) {
      case types.CANVAS_INIT_CANVAS_TO_IMAGE: {
        return {
          ...action,
          boardRef: 'CANVAS_REF',
          backBoardRef: 'CANVAS_REF',
        };
      }
      case types.CANVAS_CREATE_DRAWING_POINT: {
        return { ...action, boardRef: 'CANVAS_REF' };
      }
      case types.CANVAS_DRAW:
      case types.CANVAS_CLEAR: {
        return { ...action, ctx: 'CTX' };
      }
      default:
        return action;
    }
  },
});

export const store = createStore<State, any, {}, {}>(
  createRootReducer(history),
  composeEnhancers(applyMiddleware(...middlewares)),
);

epicMiddleWare.run(rootEpic);

// store.subscribe(() => console.log('STATE UDATED:', store.getState()));
