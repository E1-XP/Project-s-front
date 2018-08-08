import { ActionType } from "./index";
import { types } from "./types";

export const setUserData: ActionType = (data: object) => ({
    type: types.SET_USER_DATA,
    payload: data
});

export const setUserDrawings: ActionType = (data: string[]) => ({
    type: types.SET_USER_DRAWINGS,
    payload: data
});

export const initCreateNewDrawing: ActionType = (data: any) => ({
    type: types.INIT_CREATE_NEW_DRAWING,
    payload: data
});

export const initDrawingSelect: ActionType = (id: number) => ({
    type: types.INIT_DRAWING_SELECT,
    payload: id
});
