import { Reducer } from "redux";
import { types } from '../actions/types';

import { plainAction } from './index';

export const usersReducer: Reducer = (state: object = {}, action: plainAction) => {
    switch (action.type) {
        case types.SET_USERS:
            return { ...state, general: action.payload };
        case types.SET_ACTIVE_ROOM_USERS:
            return { ...state, selectedRoom: action.payload };
        default: return state;
    }
};
