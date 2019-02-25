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

import { types } from '../actions/types';
import { actions } from '../actions';

import config from './../config';

export const drawingBroadcastEpic: Epic = (action$, state$) =>
  action$.ofType(types.SET_DRAWING_POINT).pipe(
    pluck('payload'),
    map(data => {
      const drawingId = state$.value.canvas.currentDrawing;

      return { ...data, drawingId };
    }),
    mergeMap(data =>
      of(actions.socket.emitRoomDraw(data), actions.canvas.setDrawCount()),
    ),
  );

export const createNewDrawingEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_CREATE_NEW_DRAWING).pipe(
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
  action$.ofType(types.INIT_DRAWING_SELECT).pipe(
    pluck('payload'),
    tap(v => {
      console.log('SELECTED DRAWING');
    }),
    map(id => actions.canvas.setCurrentDrawing(id)),
  );

export const selectDrawingInRoom: Epic = (action$, state$) =>
  action$.ofType(types.INIT_IN_ROOM_DRAWING_SELECT).pipe(
    pluck('payload'),
    map(drawingId => {
      const roomId = state$.value.rooms.active;

      store.dispatch(actions.canvas.clearDrawingPoints());
      store.dispatch(actions.canvas.setCurrentDrawing(drawingId));

      return actions.socket.emitRoomDrawChange({ drawingId, roomId });
    }),
  );

// export const drawingTakeIntoOwnershipOnMouseDownEpic: Epic = (action$, state$) => action$
//     .ofType(types.SET_DRAWING_POINT)
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

export const drawingBroadcastNewPointsGroupEpic: Epic = (action$, state$) =>
  action$.ofType(types.SET_NEW_DRAWING_POINTS_GROUP).pipe(
    tap(v => {
      const userId = state$.value.user.userData.id;
      return actions.socket.emitRoomDrawNewGroup(userId);
    }),
  );

export const drawingBroadcastMouseUpEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_MOUSE_UP_BROADCAST).pipe(
    mergeMap(v => {
      const drawCount = state$.value.canvas.drawCount;

      return of(
        actions.socket.emitRoomDrawMouseup(drawCount),
        actions.canvas.setDrawCount(0),
      );
    }),
  );

export const canvasImageSaveEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_CANVAS_TO_IMAGE).pipe(
    debounceTime(1500),
    mergeMap(action =>
      fetchStream(
        `${config.API_URL}/rooms/${state$.value.rooms.active}/drawing/save/`,
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
  action$.ofType(types.INIT_CLEAR_DRAWING_POINTS).pipe(
    map(v => {
      const roomId = state$.value.rooms.active;
      const userId = state$.value.user.userData.id;
      const drawingId = state$.value.canvas.currentDrawing;

      return actions.socket.emitRoomDrawReset({ userId, drawingId });
    }),
  );
