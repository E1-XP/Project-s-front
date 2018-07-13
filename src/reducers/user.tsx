import { Reducer } from "redux";
import { types } from '../actions/types';

import { plainAction } from './index';

export const userReducer: Reducer = (state: object = {}, action: plainAction) => {
    switch (action.type) {
        case types.SET_USER_DATA:
            return { ...state, userData: action.payload };
        default: return state;
    }
};
