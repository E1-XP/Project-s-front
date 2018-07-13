import { Reducer } from 'redux';
import { types } from '../actions/types';

import { plainAction } from './index';

export const globalReducer: Reducer = (state: object = {}, action: plainAction) => {
    switch (action.type) {
        case types.SET_IS_LOADING:
            return { ...state, isLoading: action.payload };
        case types.SET_IS_USER_LOGGED_IN:
            return { ...state, isUserLoggedIn: action.payload };
        case types.SET_USER_DATA:
            return { ...state, ...action.payload };
        case types.SAVE_FORM_DATA_INTO_STORE:
            return { ...state, formState: action.payload };
        case types.SET_SOCKET_CONNECTION_STATUS:
            return { ...state, isSocketConnected: action.payload };
        case types.NETWORK_ERROR: {
            console.log('ERROR: ', action.payload);
            return state;
        };
        default: return state;
    }
};
