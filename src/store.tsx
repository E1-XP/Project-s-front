import { createStore, applyMiddleware, Store, DeepPartial } from "redux";
import { routerMiddleware, RouterState } from "connected-react-router";
import { createEpicMiddleware } from "redux-observable";
import { composeWithDevTools } from "redux-devtools-extension";

import { history } from "./history";
import { createRootReducer } from "./reducers";
import { rootEpic } from "./epics";

interface DBItem {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserData {
  username: string;
  email: string;
  id: number;
}

export interface User {
  userData: UserData;
  drawings: DrawingObject[] | null;
  inboxMessages: InboxMessage[];
}

export interface InboxMessage extends DBItem {
  roomId: number;
  senderId: number;
  senderName: string;
  receiverId: number;
}

export interface DrawingObject {
  id: number;
  name: String;
  creatorId: number;
}

export interface SelectedRoom {
  [key: string]: string;
}

export interface AllUsers {
  [key: string]: string;
}

export interface Users {
  general: AllUsers;
  selectedRoom: SelectedRoom;
}

export interface ChatMessage {
  author: string;
  message: string;
}

export interface Chats {
  general: ChatMessage[];
  selectedRoom: ChatMessage[];
}

export interface Room {
  name: string;
  roomid: number;
  adminId: string;
  isPrivate: boolean;
}

export interface RoomsList {
  [key: string]: Room;
}

export interface BroadcastedDrawingPoints {
  [key: string]: object[];
}

export interface Rooms {
  active: string;
  list: RoomsList;
}

export interface Canvas {
  drawCount: number;
  currentDrawing: number | null;
  drawingPoints: object[];
  broadcastedDrawingPoints: BroadcastedDrawingPoints;
}

export interface Global {
  isLoading: boolean;
  isUserLoggedIn: boolean;
  isSocketConnected: boolean;
  inboxCount: number;
}

export interface State {
  global: Global;
  user: User;
  users: object;
  rooms: Rooms;
  chats: Chats;
  canvas: Canvas;
  router: RouterState;
}

export const initialState: DeepPartial<{}> = {
  global: {
    isLoading: true,
    isUserLoggedIn: false,
    isSocketConnected: false,
    inboxCount: 0
  },
  users: {
    general: {},
    selectedRoom: {}
  },
  rooms: {
    active: null,
    list: undefined
  },
  chats: {
    general: [],
    selectedRoom: []
  },
  canvas: {
    drawCount: 0,
    currentDrawing: null,
    drawingPoints: [],
    broadcastedDrawingPoints: {}
  },
  user: {
    userData: {
      username: "",
      email: "",
      id: null
    },
    drawings: null,
    inboxMessages: null
  }
};

const epicMiddleWare = createEpicMiddleware();

export const store = createStore(
  createRootReducer(history),
  initialState,
  composeWithDevTools(
    applyMiddleware(routerMiddleware(history), epicMiddleWare)
  )
);

epicMiddleWare.run(rootEpic);

store.subscribe(() => console.log(store.getState()));
