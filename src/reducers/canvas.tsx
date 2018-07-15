import { Reducer } from "redux";

import { types } from '../actions/types';
import { plainAction } from './index';
import { Canvas } from "../store";

export const canvasReducer: Reducer = (state: Canvas | any = {}, action: plainAction) => {
    switch (action.type) {
        case types.SET_DRAWING_POINTS: {
            const drawingPoints = state.drawingPoints ? state.drawingPoints.slice() : [];
            drawingPoints[drawingPoints.length - 1].push(action.payload);

            return { ...state, drawingPoints };
        }
        case types.SET_NEW_DRAWING_POINTS_GROUP: {
            const drawingPoints = state.drawingPoints.length ?
                state.drawingPoints.map((itm: object[]) => itm.slice()) : [[]];

            state.drawingPoints.length && drawingPoints.push([]);

            return { ...state, drawingPoints };
        }
        case types.CLEAR_DRAWING_POINTS:
            return { ...state, drawingPoints: [] };
        default: return state;
    }
};
