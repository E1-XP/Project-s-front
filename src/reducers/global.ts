import { Reducer } from 'redux';
import { types } from '../actions/types';

import { PlainAction } from './index';

import { Global } from '../store/interfaces';

const initialGlobal = {
  isLoading: true,
  isFetching: false,
  isUserLoggedIn: false,
  isSocketConnected: false,
  formMessage: '',
};

export const globalReducer: Reducer = (
  state = initialGlobal,
  action: PlainAction,
) => {
  switch (action.type) {
    case types.GLOBAL_SET_IS_LOADING:
      return { ...state, isLoading: action.payload };
    case types.GLOBAL_SET_IS_FETCHING:
      return { ...state, isFetching: action.payload };
    case types.GLOBAL_SET_IS_USER_LOGGED_IN:
      return { ...state, isUserLoggedIn: action.payload };
    case types.GLOBAL_SET_FORM_MESSAGE:
      return { ...state, formMessage: action.payload };
    case types.SOCKET_SET_CONNECTION_STATUS:
      return { ...state, isSocketConnected: action.payload };
    case types.GLOBAL_NETWORK_ERROR: {
      console.log('ERROR: ', action.payload);

      return state;
    }
    default:
      return state;
  }
};
