import { createStore, applyMiddleware, Store, DeepPartial } from 'redux';
import { connectRouter, routerMiddleware, RouterState } from "connected-react-router";
import { createEpicMiddleware } from "redux-observable";
import { composeWithDevTools } from 'redux-devtools-extension';

import { history } from "./history";
import { rootReducer } from './reducers';
import { rootEpic } from "./epics";

export interface UserData {
    username: string;
    email: string;
    id: number;
}

export interface User {
    userData: UserData
    drawings: DrawingObject[] | null;
}

export interface DrawingObject {
    id: number;
    name: String;
    creatorId: number;
}

export interface SelectedRoom {
    [key: string]: string;
}

export interface Users {
    general: object,
    selectedRoom: SelectedRoom;
}

export interface ChatsGeneral {
    username: string;
    message: string;
}

export interface RoomMessages {
    author: string;
    message: string;
}

export interface Chats {
    general: ChatsGeneral[];
    selectedRoom: RoomMessages[];
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
}

export interface State {
    global: Global;
    user: User;
    users: object;
    rooms: Rooms;
    chats: Chats;
    canvas: Canvas;
    router: RouterState
}

export const initialState: DeepPartial<{}> = {
    global: {
        isLoading: true,
        isUserLoggedIn: false,
        isSocketConnected: false
    },
    users: {
        general: {},
        selectedRoom: {}
    },
    rooms: {
        active: null,
        list: {}
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
        drawings: null
    },
};

const epicMiddleWare = createEpicMiddleware();

export const store: Store<State> = createStore(
    connectRouter(history)(rootReducer),
    initialState,
    composeWithDevTools(applyMiddleware(routerMiddleware(history), epicMiddleWare))
);

epicMiddleWare.run(rootEpic);

store.subscribe(() => console.log(store.getState()))
