import { combineReducers, Reducer, Action } from "redux";
import { userReducer } from "./user";
import { usersReducer } from "./users";
import { chatsReducer } from "./chats";
import { globalReducer } from "./global";
import { roomsReducer } from "./rooms";
import { canvasReducer } from "./canvas";

export interface plainAction extends Action {
  payload?: any;
}

export const rootReducer: Reducer = combineReducers({
  global: globalReducer,
  user: userReducer,
  users: usersReducer,
  rooms: roomsReducer,
  chats: chatsReducer,
  canvas: canvasReducer
});
