import { Reducer } from 'redux';
import { types } from '../actions/types';

import { PlainAction } from './index';

export const roomsReducer: Reducer = (
  state: object = {},
  action: PlainAction,
) => {
  switch (action.type) {
    case types.SET_ROOMS:
      return { ...state, list: action.payload };
    case types.SET_CURRENT_ROOM:
      return { ...state, active: action.payload };
    default:
      return state;
  }
};
