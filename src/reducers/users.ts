import { Reducer } from 'redux';
import { types } from '../actions/types';

import { PlainAction } from './index';

export const usersReducer: Reducer = (
  state: object = {},
  action: PlainAction,
) => {
  switch (action.type) {
    case types.GLOBAL_SET_USERS:
      return { ...state, general: action.payload };
    case types.ROOMS_SET_ACTIVE_USERS:
      return { ...state, selectedRoom: action.payload };
    default:
      return state;
  }
};
