import { Reducer } from 'redux';

import { types } from '../actions/types';
import { PlainAction } from './index';
import { Canvas } from '../store/interfaces';

export const canvasReducer: Reducer = (
  state: Canvas | any = {},
  action: PlainAction,
) => {
  switch (action.type) {
    case types.CANVAS_SET_DRAWING_POINT: {
      const drawingPoints = state.drawingPoints
        ? state.drawingPoints.slice()
        : [];
      drawingPoints[drawingPoints.length - 1].push(action.payload);

      return { ...state, drawingPoints };
    }
    case types.CANVAS_SET_BROADCASTED_DRAWING_POINT: {
      const { userId } = action.payload;
      const data = action.payload;

      const keys = Object.keys(state.broadcastedDrawingPoints);
      const broadcastedDrawingPoints = keys.length
        ? keys.reduce((acc: any, key: string) => {
            acc[key] = state.broadcastedDrawingPoints[key].slice();
            return acc;
          }, {})
        : {};

      broadcastedDrawingPoints[userId] = state.broadcastedDrawingPoints[userId]
        ? state.broadcastedDrawingPoints[userId]
        : [];

      broadcastedDrawingPoints[userId][
        broadcastedDrawingPoints[userId].length - 1
      ].push(data);

      return { ...state, broadcastedDrawingPoints };
    }
    case types.CANVAS_SET_BROADCASTED_DRAWING_POINTS_BULK: {
      const groupByUserId = (acc: any, itm: any) => {
        if (!acc[itm.userId]) acc[itm.userId] = [];
        acc[itm.userId].push(itm);

        return acc;
      };

      const groupByGroupId = (acc: any, key: string) => {
        acc[key] = reducedByUserId[key].reduce((acc: any, itm: any) => {
          if (!acc[itm.arrayGroup]) acc[itm.arrayGroup] = [];
          acc[itm.arrayGroup].push(itm);

          return acc;
        }, {});

        return acc;
      };

      const reducedByUserId = action.payload.reduce(groupByUserId, {});
      console.log('s1', reducedByUserId);
      const reducedByArrayGroup = Object.keys(reducedByUserId).reduce(
        groupByGroupId,
        {},
      );
      console.log('s2', reducedByArrayGroup);

      const broadcastedDrawingPoints = Object.keys(reducedByArrayGroup).reduce(
        (acc: any, key: string) => {
          const intoArray = (acc: any, itm: string) =>
            acc.concat([reducedByArrayGroup[key][itm]]);

          acc[key] = Object.keys(reducedByArrayGroup[key]).reduce(
            intoArray,
            [],
          );
          return acc;
        },
        {},
      );
      console.log('s3', broadcastedDrawingPoints);

      return { ...state, broadcastedDrawingPoints };
    }
    case types.CANVAS_SET_NEW_DRAWING_POINTS_GROUP: {
      const drawingPoints = state.drawingPoints.length
        ? state.drawingPoints.map((itm: object[]) => itm.slice())
        : [];

      drawingPoints.push([]);

      return { ...state, drawingPoints };
    }
    case types.CANVAS_SET_NEW_BROADCASTED_DRAWING_POINTS_GROUP: {
      const userId = action.payload;

      const userIdPoints = state.broadcastedDrawingPoints[userId]
        ? state.broadcastedDrawingPoints[userId].map((itm: object[]) =>
            itm.slice(),
          )
        : [];

      userIdPoints.push([]);

      const broadcastedDrawingPoints = {
        ...state.broadcastedDrawingPoints,
        [userId]: userIdPoints,
      };

      return { ...state, broadcastedDrawingPoints };
    }
    case types.CANVAS_CLEAR_DRAWING_POINTS: {
      return { ...state, drawingPoints: [], broadcastedDrawingPoints: {} };
    }
    case types.CANVAS_SET_DRAW_COUNT: {
      const payloadExist = action.payload !== undefined;
      return {
        ...state,
        drawCount: payloadExist ? action.payload : state.drawCount + 1,
      };
    }
    case types.CANVAS_SET_CURRENT_DRAWING: {
      return { ...state, currentDrawing: action.payload };
    }
    default:
      return state;
  }
};
