import { combineReducers, Reducer, Action } from 'redux';
import { connectRouter } from 'connected-react-router';

import { userReducer } from './user';
import { usersReducer } from './users';
import { chatsReducer } from './chats';
import { globalReducer } from './global';
import { roomsReducer } from './rooms';
import { canvasReducer } from './canvas';

export interface PlainAction extends Action {
  payload?: any;
}

type CreateRootReducer = (h: any) => Reducer;

export const createRootReducer: CreateRootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    global: globalReducer,
    user: userReducer,
    users: usersReducer,
    rooms: roomsReducer,
    chats: chatsReducer,
    canvas: canvasReducer,
  });
