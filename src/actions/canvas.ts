import { ActionType } from './index';
import { types } from './types';

export const setDrawingPoint: ActionType = (data: object) => ({
  type: types.CANVAS_SET_DRAWING_POINT,
  payload: data,
});

export const setBroadcastedDrawingPoint: ActionType = (data: object) => ({
  type: types.CANVAS_SET_BROADCASTED_DRAWING_POINT,
  payload: data,
});

export const setBroadcastedDrawingPointsBulk: ActionType = (data: object) => ({
  type: types.CANVAS_SET_BROADCASTED_DRAWING_POINTS_BULK,
  payload: data,
});

export const setNewDrawingPointsGroup: ActionType = () => ({
  type: types.CANVAS_SET_NEW_DRAWING_POINTS_GROUP,
});

export const setNewBroadcastedDrawingPointsGroup: ActionType = (
  userId: string,
) => ({
  type: types.CANVAS_SET_NEW_BROADCASTED_DRAWING_POINTS_GROUP,
  payload: userId,
});

export const initMouseUpBroadcast: ActionType = () => ({
  type: types.CANVAS_INIT_MOUSE_UP_BROADCAST,
});

export const setDrawCount: ActionType = (v?: number) => ({
  type: types.CANVAS_SET_DRAW_COUNT,
  payload: v,
});

export const initClearDrawingPoints: ActionType = () => ({
  type: types.CANVAS_INIT_CLEAR_DRAWING_POINTS,
});

export const clearDrawingPoints: ActionType = () => ({
  type: types.CANVAS_CLEAR_DRAWING_POINTS,
});

export const initCanvasToImage: ActionType = (imgData: any) => ({
  type: types.CANVAS_INIT_CANVAS_TO_IMAGE,
  payload: imgData,
});

export const initGetImagesFromServer: ActionType = () => ({
  type: types.CANVAS_GET_IMAGES_FROM_SERVER,
});

export const setCurrentDrawing: ActionType = (v: number) => ({
  type: types.CANVAS_SET_CURRENT_DRAWING,
  payload: v,
});
