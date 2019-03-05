import { Reducer } from 'redux';
import { types } from '../actions/types';

import { PlainAction } from './index';

const initialChats = {
  general: [],
  selectedRoom: [],
};

export const chatsReducer: Reducer = (
  state = initialChats,
  action: PlainAction,
) => {
  switch (action.type) {
    case types.MESSAGES_SET: {
      const { channel } = action.payload;

      const newState = { ...state };
      newState[channel] = action.payload.data;

      return newState;
    }
    default:
      return state;
  }
};
