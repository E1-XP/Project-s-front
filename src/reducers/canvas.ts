import { Reducer } from 'redux';

import { types } from '../actions/types';
import { PlainAction } from './index';
import { Canvas, DrawingPoint } from '../store/interfaces';

const initialCanvas = {
  isMouseDown: false,
  groupCount: 0,
  currentDrawing: null,
  fill: '#000000',
  weight: 2,
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
    case types.CANVAS_SET_BROADCASTED_DRAWING_POINTS_BULK: {
      const { userId: currUser, data } = action.payload;
      const userPoints: DrawingPoint[][] = [];

      const groupByUserIdAndGroupId = (acc: any, itm: DrawingPoint) => {
        const { userId, group } = itm;

        if (userId === currUser) {
          if (!userPoints[group]) userPoints[group] = [];
          userPoints[group].push(itm);
        } else {
          if (!acc[userId]) acc[userId] = [];
          if (!acc[userId][group]) {
            acc[userId][group] = [];
          }
          acc[userId][group].push(itm);
        }

        return acc;
      };

      const broadcastedDrawingPoints = data.reduce(groupByUserIdAndGroupId, {});
      const drawingPoints = userPoints.concat(state.drawingPoints);

      return { ...state, drawingPoints, broadcastedDrawingPoints };
    }
    case types.CANVAS_CLEAR_DRAWING_POINTS: {
      return {
        ...state,
        drawingPoints: [],
        broadcastedDrawingPoints: {},
        drawingPointsCache: [],
      };
    }
    case types.CANVAS_SET_DRAWING_POINTS_CACHE: {
      return { ...state, drawingPointsCache: action.payload };
    }
    case types.CANVAS_SET_FILL: {
      return { ...state, fill: action.payload };
    }
    case types.CANVAS_SET_WEIGHT: {
      return { ...state, weight: action.payload };
    }
    default:
      return state;
  }
};
