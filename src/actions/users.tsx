import { ActionType } from "./index";
import { types } from "./types";

export const setUsers: ActionType = (data: object) => ({
    type: types.SET_USERS,
    payload: data
});

export const setRoomUsers: ActionType = (data: object) => ({
    type: types.SET_ACTIVE_ROOM_USERS,
    payload: data
});
