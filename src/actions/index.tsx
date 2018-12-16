import { ActionCreator, Action } from "redux";

import * as global from "./global";
import * as user from "./user";
import * as users from "./users";
import * as chats from "./chats";
import * as rooms from "./rooms";
import * as canvas from "./canvas";

export type ActionType = ActionCreator<Action>;

export const actions = {
  global,
  user,
  users,
  rooms,
  chats,
  canvas
};
