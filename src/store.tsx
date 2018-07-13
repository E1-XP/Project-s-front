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
}

export interface Chats {
    general: object[];
    selectedRoom: object[];
}

export interface Rooms {
    active: string;
    list: object;
}

export interface Global {
    isLoading: boolean;
    isUserLoggedIn: boolean;
    isSocketConnected: boolean;
    formState: object;
}

export interface State {
    global: Global;
    user: User;
    users: object;
    rooms: Rooms;
    chats: Chats;
    router: RouterState
}

const initialState: DeepPartial<{}> = {
    global: {
        isLoading: true,
        isUserLoggedIn: false,
        isSocketConnected: false,
        formState: {}
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
    user: {
        userData: {
            username: "",
            email: "",
            id: null
        }
    },
};

const epicMiddleWare = createEpicMiddleware();

export const store: Store<State> = createStore(
    connectRouter(history)(rootReducer),
    initialState,
    composeWithDevTools(applyMiddleware(routerMiddleware(history), epicMiddleWare))
);
store.subscribe(() => console.log(store.getState()))

epicMiddleWare.run(rootEpic);
