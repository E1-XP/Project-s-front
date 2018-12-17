import { Reducer } from 'redux';
import { types } from '../actions/types';

import { PlainAction } from './index';

export const userReducer: Reducer = (
  state: object = {},
  action: PlainAction,
) => {
  switch (action.type) {
    case types.SET_USER_DATA: {
      return { ...state, userData: action.payload };
    }
    case types.SET_USER_DRAWINGS: {
      return { ...state, drawings: action.payload };
    }
    case types.SET_INBOX_MESSAGES: {
      return { ...state, inboxMessages: action.payload };
    }
    default:
      return state;
  }
};
