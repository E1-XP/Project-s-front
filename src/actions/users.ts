import { ActionType } from './index';
import { types } from './types';

export const setUsers: ActionType = (data: object) => ({
  type: types.GLOBAL_SET_USERS,
  payload: data,
});

export const setRoomUsers: ActionType = (data: object) => ({
  type: types.ROOMS_SET_ACTIVE_USERS,
  payload: data,
});
