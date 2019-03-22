import { Reducer } from 'redux';

import { types } from '../actions/types';
import { Chats } from '../store/interfaces';

const initialChats: Chats = {
  general: [],
  selectedRoom: [],
  isWriting: false,
  writingIn: null,
  writersById: [],
};

export const chatsReducer: Reducer = (state = initialChats, action) => {
  switch (action.type) {
    case types.MESSAGES_SET: {
      const { channel } = action.payload;

      const newState = { ...state };
      newState[channel] = action.payload.data;

      return newState;
    }
    case types.MESSAGES_WRITE_BROADCAST: {
      const { writerId, channel: writingIn } = action;
      const isAuthorInWriters = state.writersById.includes(writerId);

      const writersById = isAuthorInWriters
        ? state.writersById
        : state.writersById.concat([writerId]);

      return { ...state, writersById, writingIn, isWriting: true };
    }
    case types.MESSAGES_WRITE_BROADCAST_CLEAR: {
      const { writerId } = action;

      const writersById = state.writersById.filter(
        (w: string) => w !== writerId,
      );
      const newState = {
        writersById,
        writingIn: !!writersById.length ? state.writingIn : null,
        isWriting: !!writersById.length,
      };

      return { ...state, ...newState };
    }
    default:
      return state;
  }
};
