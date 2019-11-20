import { StoreEnhancer, AnyAction } from 'redux';

import { types } from './../actions/types';
import { State } from './interfaces';

export const actionSanitizer: any = (action: AnyAction) => {
  switch (action.type) {
    case types.CANVAS_INIT_CANVAS_TO_IMAGE: {
      return {
        ...action,
        boardRef: 'CANVAS_REF',
        backBoardRef: 'CANVAS_REF',
      };
    }
    case types.CANVAS_CREATE_DRAWING_POINT: {
      return { ...action, boardRef: 'CANVAS_REF' };
    }
    case types.CANVAS_DRAW:
    case types.CANVAS_CLEAR: {
      return { ...action, ctx: 'CTX' };
    }
    default:
      return action;
  }
};
