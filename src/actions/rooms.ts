import { ActionType } from './index';
import { types } from './types';

export const initRoomEnter: ActionType = () => ({
  type: types.ROOMS_INIT_ENTER,
});

export const initRoomLeave: ActionType = () => ({
  type: types.ROOMS_INIT_LEAVE,
});

export const initRoomAdminLeave: ActionType = () => ({
  type: types.ROOMS_INIT_ADMIN_LEAVE,
});

export const setRooms: ActionType = (data: object) => ({
  type: types.ROOMS_SET,
  payload: data,
});

export const setCurrentRoom: ActionType = (id: string) => ({
  type: types.ROOMS_SET_CURRENT,
  payload: id,
});

export const initRoomCreate: ActionType = (data: any) => ({
  type: types.ROOMS_INIT_CREATE,
  payload: data,
});

export const initHandleRoomCreate: ActionType = (id: string) => ({
  type: types.ROOMS_HANDLE_CREATE,
  payload: id,
});

export const initRoomAdminChange: ActionType = (data: any) => ({
  type: types.ROOMS_INIT_ADMIN_CHANGE,
  payload: data,
});

export const initInRoomDrawingSelect: ActionType = (id: number) => ({
  type: types.CANVAS_INIT_IN_ROOM_DRAWING_SELECT,
  payload: id,
});

export const initCheckRoomPassword: ActionType = (data: any) => ({
  type: types.ROOMS_CHECK_PASSWORD,
  payload: data,
});

export const initCheckRoomPasswordFailure: ActionType = (status: number) => ({
  type: types.ROOMS_CHECK_PASSWORD_FAILURE,
  payload: status,
});

export const initRoomEnterSuccess: ActionType = (id: string) => ({
  type: types.ROOMS_INIT_ENTER_SUCCESS,
  payload: id,
});
