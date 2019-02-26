import { ActionType } from './index';
import { types } from './types';

export const setMessages: ActionType = (data: object) => ({
  type: types.MESSAGES_SET,
  payload: data,
});

export const initSendGeneralMesssage: ActionType = (data: object) => ({
  type: types.MESSAGES_SEND_GENERAL,
  payload: data,
});

export const initSendRoomMesssage: ActionType = (data: object) => ({
  type: types.ROOMS_SEND_MESSAGE,
  payload: data,
});
