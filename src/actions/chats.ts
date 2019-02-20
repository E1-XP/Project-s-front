import { ActionType } from './index';
import { types } from './types';

export const setMessages: ActionType = (data: object) => ({
  type: types.SET_MESSAGES,
  payload: data,
});

export const initSendGeneralMesssage: ActionType = (data: object) => ({
  type: types.INIT_SEND_GENERAL_MESSAGE,
  payload: data,
});

export const initSendRoomMesssage: ActionType = (data: object) => ({
  type: types.INIT_SEND_ROOM_MESSAGE,
  payload: data,
});
