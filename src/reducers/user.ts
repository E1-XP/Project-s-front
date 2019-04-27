import { Reducer } from 'redux';
import { types } from '../actions/types';

import { PlainAction } from './index';
import { User } from './../store/interfaces';

const initialUser = {
  userData: {
    username: '',
    email: '',
    id: null,
  },
  drawings: null,
  inboxMessages: [],
  inboxCount: 0,
};

export const userReducer: Reducer = (
  state = initialUser,
  action: PlainAction,
) => {
  switch (action.type) {
    case types.USER_SET_USER_DATA: {
      return { ...state, userData: action.payload };
    }
    case types.CANVAS_SET_USER_DRAWINGS: {
      console.log(action);
      return { ...state, drawings: action.payload };
    }
    case types.USER_SET_INBOX_MESSAGES: {
      return { ...state, inboxMessages: action.payload };
    }
    case types.USER_SET_INBOX_COUNT: {
      const { payload } = action;

      const isValueProvided = payload !== undefined;
      const isValueEqualZero = payload === 0;

      const inboxCount = isValueEqualZero
        ? 0
        : state.inboxCount + (isValueProvided ? payload : 1);

      return { ...state, inboxCount };
    }
    default:
      return state;
  }
};
