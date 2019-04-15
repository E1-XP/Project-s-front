import { Epic } from 'redux-observable';
import {
  map,
  mergeMap,
  tap,
  ignoreElements,
  debounceTime,
  take,
  takeWhile,
  mapTo,
  pluck,
  catchError,
} from 'rxjs/operators';
import { of } from 'rxjs';

import { fetchStream } from '../utils/fetchStream';

import { store } from '../store';
import { State } from '../store/interfaces';

import { types } from '../actions/types';
import { actions } from '../actions';

import config from './../config';

export const createNewDrawingEpic: Epic = (action$, state$) =>
  action$.ofType(types.CANVAS_INIT_CREATE_NEW_DRAWING).pipe(
    tap(v => {
      console.log('CREATED NEW DRAWING');
    }),
    mergeMap(action =>
      fetchStream(
        `${config.API_URL}/users/${state$.value.user.userData.id}/drawings/`,
        'POST',
        { name: action.payload.name, userId: state$.value.user.userData.id },
      ),
    ),
    mergeMap(resp =>
      of(
        actions.canvas.setCurrentDrawing(resp.data.currentId),
        actions.user.setUserDrawings(resp.data.drawings),
      ),
    ),
    catchError(err => of(actions.global.networkError(err))),
  );

export const selectDrawingEpic: Epic = (action$, state$) =>
  action$.ofType(types.CANVAS_INIT_DRAWING_SELECT).pipe(
    pluck('payload'),
    map(id => actions.canvas.setCurrentDrawing(id)),
  );

export const selectDrawingInRoomEpic: Epic = (action$, state$) =>
  action$.ofType(types.CANVAS_INIT_IN_ROOM_DRAWING_SELECT).pipe(
    pluck('payload'),
    map(drawingId => Number(drawingId)),
    map(drawingId => {
      const roomId = state$.value.rooms.active;

      store.dispatch(actions.canvas.clearDrawingPoints());
      store.dispatch(actions.canvas.setCurrentDrawing(drawingId));

      return actions.socket.emitRoomDrawChange({ drawingId, roomId });
    }),
  );

// export const drawingTakeIntoOwnershipOnMouseDownEpic: Epic = (action$, state$) => action$
//     .ofType(types.CANVAS_SET_DRAWING_POINT)
//     .pipe(
//         take(1),
//         takeWhile(() => true),
//         tap(v => {
//             console.log('ADDED TO MY PROFILE');
//         }),
//         mergeMap(action => from(fetchStream(
//             `${config.API_URL}/rooms/${state$.value.rooms.active}/drawing/add`,
//             'POST',
//             { userId: state$.value.user.userData.id }
//         ))),
//         ignoreElements()
//     );

export const canvasImageSaveEpic: Epic<any, any, State> = (action$, state$) =>
  action$.ofType(types.CANVAS_INIT_CANVAS_TO_IMAGE).pipe(
    debounceTime(700),
    mergeMap(action =>
      fetchStream(
        `${config.API_URL}/drawings/${
          state$.value.canvas.currentDrawing
        }/save/`,
        'POST',
        {
          image: action.payload,
          drawingId: state$.value.canvas.currentDrawing,
        },
      ),
    ),
    catchError(err => of(actions.global.networkError(err))),
    ignoreElements(),
  );

export const drawingResetEpic: Epic = (action$, state$) =>
  action$.ofType(types.CANVAS_RESET_DRAWING).pipe(
    map(v => {
      const userId = state$.value.user.userData.id;
      const drawingId = state$.value.canvas.currentDrawing;

      return actions.socket.emitRoomDrawReset({ userId, drawingId });
    }),
  );
