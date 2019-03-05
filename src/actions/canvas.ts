import { ActionType } from './index';
import { types } from './types';
import { DrawingPoint } from '../store/interfaces';

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

export const setIsMouseDown = (v: boolean) => ({
  type: types.CANVAS_SET_IS_MOUSE_DOWN,
  payload: v,
});

export const setGroupCount = (v: number) => ({
  type: types.CANVAS_SET_GROUP_COUNT,
  payload: v,
});

export const setBroadcastedDrawingPointsBulk: ActionType = (data: object) => ({
  type: types.CANVAS_SET_BROADCASTED_DRAWING_POINTS_BULK,
  payload: data,
});

export const createDrawingPoint = (
  event: MouseEvent,
  boardRef: HTMLCanvasElement,
  onMouseDownMode = false,
) => ({
  type: types.CANVAS_CREATE_DRAWING_POINT,
  event,
  boardRef,
  onMouseDownMode,
});

export const setDrawingPoint: ActionType = (data: DrawingPoint) => ({
  type: types.CANVAS_SET_DRAWING_POINT,
  payload: data,
});

export const clearCanvas: ActionType = (ctx, ref) => ({
  type: types.CANVAS_CLEAR,
  ctx,
  ref,
});

export const drawCanvas: ActionType = ctx => ({
  type: types.CANVAS_DRAW,
  payload: ctx,
});

export const setWeight: ActionType = data => ({
  type: types.CANVAS_SET_WEIGHT,
  payload: data,
});

export const setFill: ActionType = data => ({
  type: types.CANVAS_SET_FILL,
  payload: data,
});
