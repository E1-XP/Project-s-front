import { Reducer } from 'redux';

import { types } from '../actions/types';
import { PlainAction } from './index';
import { Canvas } from '../store/interfaces';

const initialCanvas = {
  isMouseDown: false,
  groupCount: 0,
  currentDrawing: null,
  drawingPoints: [],
  broadcastedDrawingPoints: {},
  drawingPointsCache: [],
};

export const canvasReducer: Reducer = (
  state = initialCanvas,
  action: PlainAction,
) => {
  switch (action.type) {
    case types.CANVAS_SET_CURRENT_DRAWING: {
      return { ...state, currentDrawing: action.payload };
    }
    case types.CANVAS_SET_IS_MOUSE_DOWN: {
      return { ...state, isMouseDown: action.payload };
    }
    case types.CANVAS_SET_GROUP_COUNT: {
      return { ...state, groupCount: action.payload };
    }
    case types.CANVAS_SET_DRAWING_POINT: {
      const { group } = action.payload;

      const drawingPoints = state.drawingPoints.slice();
      if (!drawingPoints[group]) drawingPoints[group] = [];

      drawingPoints[group].push(action.payload);

      return { ...state, drawingPoints };
    }
    default:
      return state;
  }
};
