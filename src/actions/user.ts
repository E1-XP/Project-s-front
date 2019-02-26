import { ActionType } from './index';
import { types } from './types';

export const setUserData: ActionType = (data: object) => ({
  type: types.USER_SET_USER_DATA,
  payload: data,
});

export const setUserDrawings: ActionType = (data: string[]) => ({
  type: types.CANVAS_SET_USER_DRAWINGS,
  payload: data,
});

export const initCreateNewDrawing: ActionType = (data: any) => ({
  type: types.CANVAS_INIT_CREATE_NEW_DRAWING,
  payload: data,
});

export const initDrawingSelect: ActionType = (id: number) => ({
  type: types.CANVAS_INIT_DRAWING_SELECT,
  payload: id,
});

export const initCheckInbox: ActionType = () => ({
  type: types.USER_CHECK_INBOX,
});

export const setInboxMessages: ActionType = (data: any) => ({
  type: types.USER_SET_INBOX_MESSAGES,
  payload: data,
});

export const setInboxCount: ActionType = (v?: number) => ({
  type: types.USER_SET_INBOX_COUNT,
  payload: v,
});

export const initSendRoomInvitation: ActionType = (data: any) => ({
  type: types.USER_SEND_INBOX_MESSAGE,
  payload: data,
});

export const initReceiveInboxMessage: ActionType = (data: any) => ({
  type: types.USER_RECEIVE_INBOX_MESSAGE,
});
