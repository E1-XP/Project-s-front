import { Reducer } from 'redux';
import { types } from '../actions/types';

import { PlainAction } from './index';

const initialRooms = {
  active: undefined,
  list: undefined,
};

export const roomsReducer: Reducer = (
  state = initialRooms,
  action: PlainAction,
) => {
  switch (action.type) {
    case types.ROOMS_SET:
      return { ...state, list: action.payload };
    case types.ROOMS_SET_CURRENT:
      return { ...state, active: action.payload };
    default:
      return state;
  }
};
