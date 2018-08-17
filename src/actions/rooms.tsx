import { ActionType } from "./index";
import { types } from "./types";

export const initRoomEnter: ActionType = () => ({
    type: types.INIT_ROOM_ENTER
});

export const initRoomLeave: ActionType = () => ({
    type: types.INIT_ROOM_LEAVE
});

export const initRoomAdminLeave: ActionType = () => ({
    type: types.INIT_ROOM_ADMIN_LEAVE
});

export const setRooms: ActionType = (data: object) => ({
    type: types.SET_ROOMS,
    payload: data
});

export const setCurrentRoom: ActionType = (id: string) => ({
    type: types.SET_CURRENT_ROOM,
    payload: id
});

export const initRoomCreate: ActionType = (data: any) => ({
    type: types.INIT_ROOM_CREATE,
    payload: data
});

export const initHandleRoomCreate: ActionType = (id: string) => ({
    type: types.INIT_HANDLE_ROOM_CREATE,
    payload: id
});

export const initRoomAdminChange: ActionType = (data: any) => ({
    type: types.INIT_ROOM_ADMIN_CHANGE,
    payload: data
});

export const initInRoomDrawingSelect: ActionType = (id: string) => ({
    type: types.INIT_IN_ROOM_DRAWING_SELECT,
    payload: id
});

export const initCheckRoomPassword: ActionType = (data: any) => ({
    type: types.INIT_CHECK_ROOM_PASSWORD,
    payload: data
});

export const initCheckRoomPasswordFailure: ActionType = () => ({
    type: types.INIT_CHECK_ROOM_PASSWORD_FAILURE
});

export const initRoomEnterSuccess: ActionType = (id: string) => ({
    type: types.INIT_ROOM_ENTER_SUCCESS,
    payload: id
});
