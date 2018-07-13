import { ActionType } from "./index";
import { types } from "./types";

export const initRoomEnter: ActionType = () => ({
    type: types.INIT_ROOM_ENTER
});

export const initRoomLeave: ActionType = () => ({
    type: types.INIT_ROOM_LEAVE
});

export const setRooms: ActionType = (data: object) => ({
    type: types.SET_ROOMS,
    payload: data
});

export const setCurrentRoom: ActionType = (id: string) => ({
    type: types.SET_CURRENT_ROOM,
    payload: id
});
