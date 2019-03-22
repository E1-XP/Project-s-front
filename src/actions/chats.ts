import { ActionType } from './index';
import { types } from './types';

export const setMessages: ActionType = (data: object) => ({
  type: types.MESSAGES_SET,
  payload: data,
});

export const writeMessage: ActionType = (data: object) => ({
  type: types.MESSAGES_WRITE,
  payload: data,
});

export const handleWriteMessageBroadcast: ActionType = (
  writerId: string | null,
  channel: string | null,
) => ({
  type: types.MESSAGES_WRITE_BROADCAST,
  writerId,
  channel,
});

export const handleWriteMessageBroadcastClear: ActionType = (
  writerId: string,
) => ({
  type: types.MESSAGES_WRITE_BROADCAST_CLEAR,
  writerId,
});

export const initSendGeneralMesssage: ActionType = (data: object) => ({
  type: types.MESSAGES_SEND_GENERAL,
  payload: data,
});

export const initSendRoomMesssage: ActionType = (data: object) => ({
  type: types.ROOMS_SEND_MESSAGE,
  payload: data,
});
