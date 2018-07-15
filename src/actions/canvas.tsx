import { ActionType } from "./index";
import { types } from "./types";

export const setDrawingPoints: ActionType = (data: object) => ({
    type: types.SET_DRAWING_POINTS,
    payload: data
});

export const setNewDrawingPointsGroup: ActionType = () => ({
    type: types.SET_NEW_DRAWING_POINTS_GROUP
});

export const clearDrawingPoints: ActionType = () => ({
    type: types.CLEAR_DRAWING_POINTS
});
