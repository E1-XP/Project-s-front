import { ActionType } from './index';
import { types } from './types';

export const setUserData: ActionType = (data: object) => ({
  type: types.SET_USER_DATA,
  payload: data,
});

export const setUserDrawings: ActionType = (data: string[]) => ({
  type: types.SET_USER_DRAWINGS,
  payload: data,
});

export const initCreateNewDrawing: ActionType = (data: any) => ({
  type: types.INIT_CREATE_NEW_DRAWING,
  payload: data,
});

export const initDrawingSelect: ActionType = (id: number) => ({
  type: types.INIT_DRAWING_SELECT,
  payload: id,
});

export const initCheckInbox: ActionType = () => ({
  type: types.INIT_CHECK_INBOX,
});

export const setInboxMessages: ActionType = (data: any) => ({
  type: types.SET_INBOX_MESSAGES,
  payload: data,
});

export const initSendRoomInvitation: ActionType = (data: any) => ({
  type: types.INIT_SEND_INBOX_MESSAGE,
  payload: data,
});

export const initReceiveInboxMessage: ActionType = (data: any) => ({
  type: types.INIT_RECEIVE_INBOX_MESSAGE,
});
