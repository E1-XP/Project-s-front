import { ActionType } from "./index";
import { types } from "./types";

export const setDrawingPoint: ActionType = (data: object) => ({
    type: types.SET_DRAWING_POINT,
    payload: data
});

export const setBroadcastedDrawingPoint: ActionType = (data: object) => ({
    type: types.SET_BROADCASTED_DRAWING_POINT,
    payload: data
});

export const setBroadcastedDrawingPointsBulk: ActionType = (data: object) => ({
    type: types.SET_BROADCASTED_DRAWING_POINTS_BULK,
    payload: data
});

export const setNewDrawingPointsGroup: ActionType = () => ({
    type: types.SET_NEW_DRAWING_POINTS_GROUP
});

export const setNewBroadcastedDrawingPointsGroup: ActionType = (userId: string) => ({
    type: types.SET_NEW_BROADCASTED_DRAWING_POINTS_GROUP,
    payload: userId
});

export const initMouseUpBroadcast: ActionType = () => ({
    type: types.INIT_MOUSE_UP_BROADCAST
});

export const initClearDrawingPoints: ActionType = () => ({
    type: types.INIT_CLEAR_DRAWING_POINTS
});

export const clearDrawingPoints: ActionType = () => ({
    type: types.CLEAR_DRAWING_POINTS
});
