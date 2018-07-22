import { Reducer } from "redux";

import { types } from '../actions/types';
import { plainAction } from './index';
import { Canvas } from "../store";

export const canvasReducer: Reducer = (state: Canvas | any = {}, action: plainAction) => {
    switch (action.type) {
        case types.SET_DRAWING_POINT: {
            const drawingPoints = state.drawingPoints ? state.drawingPoints.slice() : [];
            drawingPoints[drawingPoints.length - 1].push(action.payload);

            return { ...state, drawingPoints };
        }
        case types.SET_BROADCASTED_DRAWING_POINT: {
            const { userId, data } = action.payload;

            const keys = Object.keys(state.broadcastedDrawingPoints);
            const broadcastedDrawingPoints = keys.length ? keys
                .reduce((acc: any, key: string) => {
                    acc[key] = state.broadcastedDrawingPoints[key].slice();
                    return acc;
                }, {}) : {};

            broadcastedDrawingPoints[userId] = state.broadcastedDrawingPoints[userId] ?
                state.broadcastedDrawingPoints[userId] : [];

            broadcastedDrawingPoints[userId][broadcastedDrawingPoints[userId].length - 1].push(data);

            return { ...state, broadcastedDrawingPoints };
        }
        case types.SET_NEW_DRAWING_POINTS_GROUP: {
            const drawingPoints = state.drawingPoints.length ?
                state.drawingPoints.map((itm: object[]) => itm.slice()) : [];

            drawingPoints.push([]);

            return { ...state, drawingPoints };
        }
        case types.SET_NEW_BROADCASTED_DRAWING_POINTS_GROUP: {
            const userId = action.payload;

            const userIdPoints = state.broadcastedDrawingPoints[userId] ?
                state.broadcastedDrawingPoints[userId].map((itm: object[]) => itm.slice()) :
                [];

            userIdPoints.push([]);

            const broadcastedDrawingPoints = {
                ...state.broadcastedDrawingPoints,
                [userId]: userIdPoints
            }

            return { ...state, broadcastedDrawingPoints };
        }
        case types.CLEAR_DRAWING_POINTS: {
            return { ...state, drawingPoints: [], broadcastedDrawingPoints: {} };
        }
        default: return state;
    }
};
