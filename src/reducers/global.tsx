import { Reducer } from 'redux';
import { types } from '../actions/types';

import { plainAction } from './index';

import { Global } from '../store'

export const globalReducer: Reducer = (state: Global | any = {}, action: plainAction) => {
    switch (action.type) {
        case types.SET_IS_LOADING:
            return { ...state, isLoading: action.payload };
        case types.SET_IS_USER_LOGGED_IN:
            return { ...state, isUserLoggedIn: action.payload };
        case types.SET_INBOX_COUNT: {
            const { payload } = action;

            const isValueProvided = payload !== undefined;
            const isValueEqualZero = payload === 0;

            const inboxCount = isValueEqualZero ? 0 :
                state.inboxCount + (isValueProvided ? payload : 1);

            return { ...state, inboxCount };
        }
        case types.SET_SOCKET_CONNECTION_STATUS:
            return { ...state, isSocketConnected: action.payload };
        case types.NETWORK_ERROR: {
            console.log('ERROR: ', action.payload);

            return state;
        };
        default: return state;
    }
};
