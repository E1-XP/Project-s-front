import { createStore, applyMiddleware, DeepPartial } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension';

import { history } from './../history';
import { createRootReducer } from './../reducers';
import { rootEpic } from './../epics';

import { State } from './interfaces';

export const initialState: DeepPartial<State> = {
  global: {
    isLoading: true,
    isUserLoggedIn: false,
    isSocketConnected: false,
    inboxCount: 0,
    formMessage: '',
  },
  users: {
    general: {},
    selectedRoom: {},
  },
  rooms: {
    active: undefined,
    list: undefined,
  },
  chats: {
    general: [],
    selectedRoom: [],
  },
  canvas: {
    isMouseDown: false,
    groupCount: 0,
    currentDrawing: null,
    drawingPoints: [],
    broadcastedDrawingPoints: {},
    drawingPointsCache: [],
  },
  user: {
    userData: {
      username: '',
      email: '',
      id: null,
    },
    drawings: null,
    inboxMessages: [],
  },
};

const epicMiddleWare = createEpicMiddleware();

const middlewares = [routerMiddleware(history), epicMiddleWare];

export const store = createStore(
  createRootReducer(history),
  initialState,
  composeWithDevTools(applyMiddleware(...middlewares)),
);

epicMiddleWare.run(rootEpic);

store.subscribe(() => console.log('STATE UDATED:', store.getState()));
